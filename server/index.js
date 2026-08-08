import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import twilio from "twilio";
import { getTripState, deleteMoment, mediaDir } from "./store.js";
import { processInboundMessage } from "./inbound.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PORT || 8787);
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
const ALLOWED_FROM = String(process.env.ALLOWED_FROM || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const ALLOW_UNSIGNED_WEBHOOKS = String(process.env.ALLOW_UNSIGNED_WEBHOOKS || "true") === "true";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "12mb" }));
app.use("/media", express.static(mediaDir()));
app.use(express.static(ROOT));

function formatPhone(value) {
  return String(value || "").trim();
}

function isAllowedSender(from) {
  if (!ALLOWED_FROM.length) return true;
  return ALLOWED_FROM.includes(formatPhone(from));
}

function twilioConfigured() {
  return Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);
}

function validateTwilioRequest(req) {
  if (!twilioConfigured()) return ALLOW_UNSIGNED_WEBHOOKS;
  if (ALLOW_UNSIGNED_WEBHOOKS && !req.headers["x-twilio-signature"]) return true;

  const signature = req.headers["x-twilio-signature"];
  if (!signature) return false;

  const url = `${PUBLIC_BASE_URL}${req.originalUrl}`;
  return twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, url, req.body || {});
}

function extractTwilioMedia(body = {}) {
  const count = Number(body.NumMedia || 0);
  const media = [];
  for (let i = 0; i < count; i += 1) {
    const url = body[`MediaUrl${i}`];
    const contentType = body[`MediaContentType${i}`] || "";
    if (url) media.push({ url, contentType });
  }
  return media;
}

function twimlMessage(text) {
  const safe = String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safe}</Message></Response>`;
}

app.get("/api/status", async (_req, res) => {
  const state = await getTripState();
  res.json({
    ok: true,
    twilioConfigured: twilioConfigured(),
    phoneNumber: TWILIO_PHONE_NUMBER || null,
    publicBaseUrl: PUBLIC_BASE_URL,
    webhookUrl: `${PUBLIC_BASE_URL}/webhooks/twilio`,
    allowedFrom: ALLOWED_FROM,
    trip: state.trip,
    momentCount: state.moments.length,
    tips: [
      "Text photos or a voice memo to your Elsewhere number.",
      'Send "TRIP Lisbon" to start/rename the current trip.',
      'Send "PLACE Porto" to update where you are.',
      "iPhone: use SMS/MMS (green bubble), not iMessage.",
    ],
  });
});

app.get("/api/trip", async (_req, res) => {
  res.json(await getTripState());
});

app.delete("/api/moments/:id", async (req, res) => {
  const removed = await deleteMoment(req.params.id);
  if (!removed) return res.status(404).json({ error: "Moment not found" });
  res.json({ ok: true });
});

app.post("/webhooks/twilio", async (req, res) => {
  if (!validateTwilioRequest(req)) {
    return res.status(403).type("text/plain").send("Invalid Twilio signature");
  }

  const from = formatPhone(req.body.From);
  if (!isAllowedSender(from)) {
    res.type("text/xml").send(twimlMessage("This number isn’t allowed to add to Elsewhere yet."));
    return;
  }

  try {
    const result = await processInboundMessage({
      from,
      to: formatPhone(req.body.To),
      body: req.body.Body || "",
      media: extractTwilioMedia(req.body),
      messageSid: req.body.MessageSid || "",
      accountSid: TWILIO_ACCOUNT_SID,
      authToken: TWILIO_AUTH_TOKEN,
    });

    const count = result.moments.length;
    const reply = result.tripCommand
      ? `Got it — trip is now “${result.trip.name}”.`
      : count === 1
        ? "Saved to your trip."
        : `Saved ${count} moments to your trip.`;

    res.type("text/xml").send(twimlMessage(reply));
  } catch (error) {
    console.error("Twilio webhook failed", error);
    res.type("text/xml").send(twimlMessage("Couldn’t save that just now. Try once more?"));
  }
});

// Local/demo helper so you can try the flow without Twilio credentials.
app.post("/api/demo/inbound", async (req, res) => {
  try {
    const {
      from = "+15550001111",
      body = "",
      media = [],
    } = req.body || {};

    if (!isAllowedSender(from)) {
      return res.status(403).json({ error: "Sender not allowed" });
    }

    const normalizedMedia = [];
    for (const item of media) {
      if (item.dataUrl) {
        const match = String(item.dataUrl).match(/^data:([^;]+);base64,(.+)$/);
        if (!match) continue;
        normalizedMedia.push({
          contentType: item.contentType || match[1],
          buffer: Buffer.from(match[2], "base64"),
          filename: item.filename || "",
        });
      } else if (item.url) {
        normalizedMedia.push({
          url: item.url,
          contentType: item.contentType || "",
          filename: item.filename || "",
        });
      }
    }

    const result = await processInboundMessage({
      from,
      to: TWILIO_PHONE_NUMBER || "+15550000000",
      body,
      media: normalizedMedia,
      messageSid: `demo-${Date.now()}`,
      accountSid: TWILIO_ACCOUNT_SID,
      authToken: TWILIO_AUTH_TOKEN,
    });

    res.json({ ok: true, ...result, trip: (await getTripState()).trip });
  } catch (error) {
    console.error("Demo inbound failed", error);
    res.status(500).json({ error: error.message || "Demo inbound failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Elsewhere listening on http://localhost:${PORT}`);
  console.log(`Webhook URL: ${PUBLIC_BASE_URL}/webhooks/twilio`);
  if (!twilioConfigured()) {
    console.log("Twilio not configured yet — use /api/demo/inbound or fill server/.env");
  }
});

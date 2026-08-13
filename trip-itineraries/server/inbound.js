import { addMoment, renameTrip, startNewTrip, saveMediaBuffer } from "./store.js";

const TRIP_COMMAND = /^(?:trip|start(?:\s+trip)?)\s*[:\-]?\s*(.+)$/i;
const PLACE_COMMAND = /^(?:place|in)\s*[:\-]?\s*(.+)$/i;

export function classifyMedia(contentType = "") {
  const type = contentType.toLowerCase();
  if (type.startsWith("image/")) return "photo";
  if (type.startsWith("audio/")) return "voice";
  if (type.startsWith("video/")) return "video";
  return "file";
}

export async function downloadMedia(url, { accountSid, authToken } = {}) {
  const headers = {};
  if (accountSid && authToken) {
    const token = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    headers.Authorization = `Basic ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to download media (${response.status})`);
  }

  const contentType = response.headers.get("content-type") || "application/octet-stream";
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType };
}

export async function processInboundMessage({
  from = "",
  to = "",
  body = "",
  media = [],
  messageSid = "",
  accountSid = "",
  authToken = "",
}) {
  const text = String(body || "").trim();
  const created = [];

  const tripMatch = text.match(TRIP_COMMAND);
  if (tripMatch) {
    const name = tripMatch[1].trim();
    const trip = await startNewTrip({ name, place: name });
    const moment = await addMoment({
      kind: "note",
      text: `Started trip: ${trip.name}`,
      from,
      to,
      messageSid,
      source: "sms",
    });
    created.push(moment);
    return { tripCommand: "start", trip, moments: created };
  }

  const placeMatch = text.match(PLACE_COMMAND);
  if (placeMatch && media.length === 0) {
    const place = placeMatch[1].trim();
    const trip = await renameTrip({ name: place, place });
    const moment = await addMoment({
      kind: "note",
      text: `Now in ${place}`,
      from,
      to,
      messageSid,
      source: "sms",
    });
    created.push(moment);
    return { tripCommand: "place", trip, moments: created };
  }

  for (const item of media) {
    let buffer = item.buffer;
    let contentType = item.contentType || "application/octet-stream";

    if (!buffer && item.url) {
      const downloaded = await downloadMedia(item.url, { accountSid, authToken });
      buffer = downloaded.buffer;
      contentType = item.contentType || downloaded.contentType;
    }

    if (!buffer) continue;

    const saved = await saveMediaBuffer(buffer, {
      contentType,
      originalName: item.filename || "",
    });
    const kind = classifyMedia(contentType);
    const moment = await addMoment({
      kind,
      text: text || "",
      from,
      to,
      messageSid,
      source: "sms",
      mediaUrl: saved.url,
      contentType: saved.contentType,
      filename: saved.filename,
    });
    created.push(moment);
  }

  if (!media.length && text) {
    const moment = await addMoment({
      kind: "note",
      text,
      from,
      to,
      messageSid,
      source: "sms",
    });
    created.push(moment);
  }

  return { tripCommand: null, moments: created };
}

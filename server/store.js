import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const MEDIA_DIR = path.join(DATA_DIR, "media");
const DB_PATH = path.join(DATA_DIR, "trip.json");

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureDirs() {
  await fs.mkdir(MEDIA_DIR, { recursive: true });
}

async function readDb() {
  await ensureDirs();
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const fresh = {
      trip: {
        id: uid(),
        name: "Current trip",
        place: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      moments: [],
    };
    await writeDb(fresh);
    return fresh;
  }
}

async function writeDb(db) {
  await ensureDirs();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function getTripState() {
  const db = await readDb();
  return {
    trip: db.trip,
    moments: [...db.moments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ),
  };
}

export async function renameTrip({ name, place = "" }) {
  const db = await readDb();
  db.trip.name = name || db.trip.name;
  db.trip.place = place;
  db.trip.updatedAt = new Date().toISOString();
  await writeDb(db);
  return db.trip;
}

export async function startNewTrip({ name, place = "" }) {
  const db = await readDb();
  db.trip = {
    id: uid(),
    name: name || "Current trip",
    place,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.moments = [];
  await writeDb(db);
  return db.trip;
}

export async function addMoment(moment) {
  const db = await readDb();
  const record = {
    id: uid(),
    tripId: db.trip.id,
    createdAt: new Date().toISOString(),
    ...moment,
  };
  db.moments.push(record);
  db.trip.updatedAt = record.createdAt;
  await writeDb(db);
  return record;
}

export async function deleteMoment(id) {
  const db = await readDb();
  const before = db.moments.length;
  db.moments = db.moments.filter((item) => item.id !== id);
  if (db.moments.length === before) return false;
  await writeDb(db);
  return true;
}

export async function saveMediaBuffer(buffer, { contentType, originalName }) {
  await ensureDirs();
  const ext = extensionFor(contentType, originalName);
  const filename = `${uid()}${ext}`;
  const fullPath = path.join(MEDIA_DIR, filename);
  await fs.writeFile(fullPath, buffer);
  return {
    filename,
    url: `/media/${filename}`,
    contentType,
  };
}

function extensionFor(contentType = "", originalName = "") {
  const fromName = path.extname(originalName || "");
  if (fromName) return fromName.toLowerCase();

  const map = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "audio/mpeg": ".mp3",
    "audio/mp3": ".mp3",
    "audio/mp4": ".m4a",
    "audio/x-m4a": ".m4a",
    "audio/m4a": ".m4a",
    "audio/aac": ".aac",
    "audio/amr": ".amr",
    "audio/3gpp": ".3gp",
    "audio/ogg": ".ogg",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
  };

  return map[contentType.toLowerCase()] || ".bin";
}

export function mediaDir() {
  return MEDIA_DIR;
}

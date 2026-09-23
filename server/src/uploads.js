import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import multer from "multer";
import sharp from "sharp";
import { config } from "./config.js";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 } });

const isPdf = (buf) => buf.subarray(0, 5).toString("latin1") === "%PDF-";
const IMAGE_SIGNATURES = [
  (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff, // JPEG
  (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), // PNG
  (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP",
  (b) => ["GIF87a", "GIF89a"].includes(b.subarray(0, 6).toString("latin1")),
  (b) => b.subarray(4, 12).toString("latin1").startsWith("ftypavif"),
];
const isImage = (buf) => IMAGE_SIGNATURES.some((test) => test(buf));

export class UploadError extends Error {}

// Validates by file signature (never the declared type), then stores under a content hash.
export async function storeUpload(db, file, kind) {
  if (!file) throw new UploadError("Aucun fichier reçu.");
  let data;
  let ext;
  let mime;
  if (kind === "cv") {
    if (!isPdf(file.buffer)) throw new UploadError("Le CV doit être un fichier PDF.");
    [data, ext, mime] = [file.buffer, "pdf", "application/pdf"];
  } else if (kind === "image") {
    if (!isImage(file.buffer)) throw new UploadError("Formats acceptés : JPEG, PNG, WebP, GIF, AVIF.");
    data = await sharp(file.buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    [ext, mime] = ["webp", "image/webp"];
  } else {
    throw new UploadError("Type de fichier inconnu.");
  }

  const id = `${createHash("sha256").update(data).digest("hex").slice(0, 16)}.${ext}`;
  await fs.mkdir(config.uploadsDir, { recursive: true });
  await fs.writeFile(path.join(config.uploadsDir, id), data);
  db.prepare("INSERT OR IGNORE INTO files (id, kind, original_name, mime, size) VALUES (?, ?, ?, ?, ?)").run(
    id,
    kind,
    path.basename(file.originalname || id).slice(0, 200),
    mime,
    data.length
  );
  return { id, url: `/uploads/${id}`, kind, size: data.length };
}

export async function deleteUpload(db, id) {
  if (!/^[a-f0-9]{16}\.(pdf|webp)$/.test(id)) return false;
  const result = db.prepare("DELETE FROM files WHERE id = ?").run(id);
  await fs.rm(path.join(config.uploadsDir, id), { force: true });
  return result.changes > 0;
}

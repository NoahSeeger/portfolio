import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const formats = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".gif"]);
const policy = { version: 1, width: 144, height: 144, lossless: true };

export function localCoverFile(root, image) {
  if (!image?.startsWith("/") || image.startsWith("//")) return null;
  const publicRoot = path.resolve(root, "public");
  const file = path.resolve(publicRoot, "." + decodeURIComponent(image.split(/[?#]/)[0]));
  const relative = path.relative(publicRoot, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Note covers must stay inside public/.");
  return formats.has(path.extname(file).toLowerCase()) ? file : null;
}

export async function noteThumbnail(root, file) {
  const real = await fs.realpath(file);
  const publicRoot = await fs.realpath(path.join(root, "public"));
  const relative = path.relative(publicRoot, real);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Note covers must stay inside public/.");
  const input = await fs.readFile(real);
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  const key = createHash("sha256").update(input).update(JSON.stringify({ ...policy, versions: sharp.versions })).digest("hex");
  const directory = path.join(root, "node_modules/.cache/portfolio-note-thumbnails");
  const cached = path.join(directory, key + ".webp");
  try {
    const [bytes, digest] = await Promise.all([fs.readFile(cached), fs.readFile(cached + ".sha256", "utf8")]);
    if (hash(bytes) === digest) return bytes;
  } catch { /* Missing or damaged cache entries are regenerated. */ }
  // A static thumbnail is deliberately separate from the original cover.
  // Sharp strips embedded EXIF/XMP; the media plugin audits emitted copies too.
  const bytes = await sharp(input).autoOrient().resize(policy.width, policy.height, { fit: "cover" }).webp({ lossless: true, effort: 4 }).toBuffer();
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(cached, bytes);
  await fs.writeFile(cached + ".sha256", hash(bytes));
  return bytes;
}

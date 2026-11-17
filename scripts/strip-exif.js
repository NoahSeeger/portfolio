import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { exiftoolPath } from "exiftool-vendored";

export const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".avif", ".bmp", ".ico"]);
const harmlessGroups = new Set(["System", "Composite", "JFIF", "ICC_Profile", "Adobe"]);
const layoutTags = new Set([
  ...["FileName", "Directory", "FileSize", "FileModifyDate", "FileAccessDate", "FileInodeChangeDate", "FileCreateDate", "FilePermissions", "FileAttributes", "FileType", "FileTypeExtension", "MIMEType", "ExifByteOrder", "ImageWidth", "ImageHeight", "EncodingProcess", "BitsPerSample", "ColorComponents", "YCbCrSubSampling", "ImageCount", "NumColors", "ColorPlanes", "BitsPerPixel", "ImageLength"].map((tag) => `File:${tag}`),
  "ExifTool:ExifToolVersion", "EXIF:Orientation", "EXIF:YCbCrPositioning", "EXIF:XResolution", "EXIF:YResolution", "EXIF:ResolutionUnit",
  ...["ImageWidth", "ImageHeight", "BitDepth", "ColorType", "Compression", "Filter", "Interlace", "PixelsPerUnitX", "PixelsPerUnitY", "PixelUnits", "SRGBRendering", "Gamma", "WhitePointX", "WhitePointY", "RedX", "RedY", "GreenX", "GreenY", "BlueX", "BlueY", "Palette", "Transparency"].map((tag) => `PNG:${tag}`),
  ...["ImageWidth", "ImageHeight", "AlphaIsUsed", "VP8Version", "HorizontalScale", "VerticalScale", "AnimationBackgroundColor", "AnimationLoopCount", "Duration", "FrameCount"].map((tag) => `RIFF:${tag}`),
  ...["GIFVersion", "ImageWidth", "ImageHeight", "HasColorMap", "ColorResolutionDepth", "BitsPerPixel", "BackgroundColor", "PixelAspectRatio", "AnimationIterations", "TransparentColor", "Duration", "FrameCount"].map((tag) => `GIF:${tag}`),
]);

export function mediaFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Media directories must not contain symlinks: ${file}`);
    return entry.isDirectory() ? mediaFiles(file) : entry.isFile() && imageExtensions.has(path.extname(file).toLowerCase()) ? [file] : [];
  });
}

export async function createMetadataTool({ executable } = {}) {
  const binary = executable ?? await exiftoolPath();
  if (!binary) throw new Error("Required bundled ExifTool is missing. Run npm ci including development and optional dependencies.");
  const run = (args) => {
    try { return execFileSync(binary, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }); }
    catch (error) { throw new Error(`Required ExifTool failed: ${error.stderr?.trim() || error.message}`, { cause: error }); }
  };
  const version = run(["-ver"]).trim();
  function inspect(files) {
    const results = [];
    for (let offset = 0; offset < files.length; offset += 128) {
      const batch = files.slice(offset, offset + 128).map((file) => path.resolve(file));
      const records = JSON.parse(run(["-json", "-G0", "-all", ...batch]));
      const byFile = new Map(records.map((record) => [path.resolve(record.SourceFile), record]));
      for (const file of batch) {
        const record = byFile.get(file);
        if (!record) throw new Error(`No metadata result for ${file}`);
        const issue = Object.entries(record).find(([tag]) => /(?:^|:)(?:Error|Warning)$/.test(tag));
        if (issue) throw new Error(`${file}: ${issue[1]}`);
        const tags = Object.keys(record).filter((tag) => tag !== "SourceFile" && !harmlessGroups.has(tag.split(":")[0]) && !layoutTags.has(tag) && !(tag === "PNG:ProfileName" && record[tag] === "icc"));
        results.push({ file, tags });
      }
    }
    return results;
  }
  function assertClean(files) {
    const dirty = inspect(files).filter((result) => result.tags.length);
    if (dirty.length) throw new Error(`Unapproved embedded metadata: ${dirty.map(({ file, tags }) => `${file} (${tags.join(", ")})`).join("; ")}`);
  }
  function clean(files) {
    const dirty = inspect(files).filter((result) => result.tags.length).map((result) => result.file);
    for (let offset = 0; offset < dirty.length; offset += 128) {
      run(["-all=", "-tagsFromFile", "@", "-ICC_Profile", "-EXIF:Orientation", "-overwrite_original", ...dirty.slice(offset, offset + 128)]);
    }
    assertClean(dirty);
    return dirty.length;
  }
  return { version, inspect, clean, assertClean };
}

// Explicit maintenance command only. Production builds sanitize copies instead.
export async function stripMetadata(projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")) {
  const tool = await createMetadataTool();
  const files = ["src/assets", "public"].flatMap((folder) => mediaFiles(path.join(projectRoot, folder)));
  const cleaned = tool.clean(files);
  console.log(`Checked ${files.length} images: ${cleaned} cleaned, ${files.length - cleaned} already clean.`);
  return { total: files.length, cleaned, alreadyClean: files.length - cleaned };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await stripMetadata(); }
  catch (error) { console.error(`Metadata check failed: ${error.message}`); process.exitCode = 1; }
}

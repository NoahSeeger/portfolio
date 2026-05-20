import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dirs = [
  path.join(__dirname, "../src/assets"),
  path.join(__dirname, "../public"),
];

const mediaExtensions = {
  images: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff", ".tif", ".bmp"],
  videos: [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"],
  audio: [".mp3", ".wav", ".flac", ".aac", ".m4a", ".ogg"],
  all: function () {
    return [...this.images, ...this.videos, ...this.audio];
  },
};

function findMedia(dir) {
  const media = [];
  const exts = mediaExtensions.all();

  function walk(d) {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
          media.push(full);
        }
      }
    } catch (e) {
      // skip inaccessible dirs
    }
  }

  walk(dir);
  return media;
}

function hasMetadata(file) {
  try {
    const output = execSync(`exiftool -has< "${file}"`, { stdio: "pipe" }).toString().trim();
    return output === "1";
  } catch {
    return false;
  }
}

function stripExif(file) {
  const ext = path.extname(file).toLowerCase();
  const isVideo = mediaExtensions.videos.includes(ext);

  // Skip if no metadata
  if (!hasMetadata(file)) {
    return null; // indicates skipped
  }

  try {
    if (isVideo) {
      execSync(`exiftool -gps:all= -overwrite_original "${file}"`, { stdio: "pipe" });
    } else {
      execSync(`exiftool -all= -overwrite_original "${file}"`, { stdio: "pipe" });
    }
    return true;
  } catch (e) {
    return false;
  }
}

let total = 0;
let success = 0;
let skipped = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;

  const media = findMedia(dir);
  for (const item of media) {
    total++;
    const result = stripExif(item);
    if (result === true) {
      success++;
    } else if (result === null) {
      skipped++;
    }
  }
}

console.log(`Stripped EXIF from ${success}/${total} media files (${skipped} already clean)`);

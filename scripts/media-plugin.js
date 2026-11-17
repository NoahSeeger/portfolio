import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { URL } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { createMetadataTool, mediaFiles, imageExtensions } from "./strip-exif.js";

const policy = { version: 1, maxDimension: 1920, lossless: true, effort: 4 };
const convertExtensions = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff"]);
const portable = (file) => file.split(path.sep).join("/");
const publicUrl = (file) => "/" + portable(file).split("/").map(encodeURIComponent).join("/");

export function mediaPlugin({ metadataToolFactory = createMetadataTool } = {}) {
  let config;
  let tool;
  let temporary;
  let cache;
  let imageCount = 0;
  let cacheHits = 0;
  const publicFiles = [];
  const urls = new Map();
  const pending = new Map();
  const siteOrigin = new URL(process.env.SITE_URL || "https://noahseeger.de").origin;
  const rewrite = (source) => {
    for (const [encoded, to] of urls) {
      for (const from of new Set([encoded, decodeURI(encoded)])) {
        const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        source = source.replace(new RegExp(`${escaped}(?=[?#\\s\x22\x27)<>\\\\]|$)`, "g"), (match, offset) => {
          const before = source.slice(0, offset);
          // Do not rewrite another website's URL just because its path matches.
          if (/[\w.:/-]$/.test(before) && !before.endsWith(siteOrigin)) return match;
          return to;
        });
      }
    }
    return source;
  };
  const cleanup = async () => {
    if (temporary) { await fs.rm(temporary, { recursive: true, force: true }); temporary = undefined; }
  };
  async function prepare(file, mayConvert) {
    const input = await fs.readFile(file);
    const originalExt = path.extname(file).toLowerCase();
    const key = createHash("sha256").update(input).update(JSON.stringify({ ...policy, mayConvert, originalExt, sharp: sharp.versions, exiftool: tool.version })).digest("hex");
    if (pending.has(key)) return pending.get(key);
    const operation = (async () => {
      imageCount++;
      const manifest = path.join(cache, `${key}.json`);
      try {
        const entry = JSON.parse(await fs.readFile(manifest, "utf8"));
        if (!/^\.[a-z0-9]+$/.test(entry.extension)) throw new Error("Invalid cache extension");
        const data = await fs.readFile(path.join(cache, key + entry.extension));
        if (createHash("sha256").update(data).digest("hex") !== entry.digest) throw new Error("Invalid media cache digest");
        cacheHits++;
        return { data, extension: entry.extension, file: path.join(cache, key + entry.extension) };
      } catch { /* Missing or damaged cache entries are regenerated from the source. */ }
      const staged = path.join(temporary, key + originalExt);
      await fs.writeFile(staged, input);
      tool.clean([staged]);
      let data = await fs.readFile(staged);
      let extension = originalExt;
      if (mayConvert && convertExtensions.has(originalExt)) {
        const metadata = await sharp(data, { animated: true }).metadata();
        // Never flatten animation or multi-page media into a single still.
        if ((metadata.pages ?? 1) === 1 && metadata.depth === "uchar") {
          const candidate = await sharp(data).autoOrient().resize({ width: policy.maxDimension, height: policy.maxDimension, fit: "inside", withoutEnlargement: true }).keepIccProfile().webp({ lossless: policy.lossless, effort: policy.effort }).toBuffer();
          if (candidate.length < data.length) { data = candidate; extension = ".webp"; }
        }
      }
      // Audit newly encoded bytes before they enter the persistent cache.
      const resultFile = path.join(temporary, key + ".output" + extension);
      await fs.writeFile(resultFile, data);
      tool.assertClean([resultFile]);
      const cached = path.join(cache, key + extension);
      await fs.writeFile(cached, data);
      await fs.writeFile(manifest, JSON.stringify({ extension, digest: createHash("sha256").update(data).digest("hex") }));
      return { data, extension, file: cached };
    })();
    pending.set(key, operation);
    return operation;
  }
  async function readPublic(directory, relative = "") {
    let entries;
    try { entries = await fs.readdir(directory, { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") return; throw error; }
    for (const entry of entries) {
      if ([".DS_Store", ".gitkeep"].includes(entry.name)) continue;
      const file = path.join(directory, entry.name);
      const name = path.join(relative, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Public assets must not contain symlinks: ${file}`);
      if (entry.isDirectory()) { await readPublic(file, name); continue; }
      if (entry.name.startsWith(".env") || /(?:_original|\.bak|\.md|\.map)$/i.test(entry.name)) throw new Error(`Unexpected private/source file in public: ${file}`);
      if (imageExtensions.has(path.extname(file).toLowerCase())) {
        // Fixed icon URLs and formats stay stable. Content images can become WebP.
        const result = await prepare(file, portable(name).startsWith("img/"));
        const destination = name.slice(0, -path.extname(name).length) + result.extension;
        publicFiles.push({ fileName: portable(destination), source: result.data });
        if (destination !== name) urls.set(publicUrl(name), publicUrl(destination));
      } else publicFiles.push({ fileName: portable(name), source: await fs.readFile(file) });
    }
    const names = publicFiles.map((file) => file.fileName);
    if (new Set(names).size !== names.length) throw new Error("Public image filenames collide after conversion; use distinct source basenames.");
  }
  return {
    name: "portfolio-media",
    enforce: "pre",
    apply: "build",
    config() { return { publicDir: false, build: { assetsInlineLimit: 0 } }; },
    configResolved(resolved) { config = resolved; },
    async buildStart() {
      publicFiles.length = 0; urls.clear(); pending.clear(); imageCount = 0; cacheHits = 0;
      tool = await metadataToolFactory();
      temporary = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-media-"));
      cache = path.join(config.root, "node_modules/.cache/portfolio-media");
      await fs.mkdir(cache, { recursive: true });
      try { await readPublic(path.join(config.root, "public")); }
      catch (error) { await cleanup(); throw error; }
    },
    async load(id) {
      const [file, query = ""] = id.split("?");
      if (!imageExtensions.has(path.extname(file).toLowerCase()) || !path.isAbsolute(file)) return;
      if (query && query !== "url") throw new Error(`Unsupported image import query: ${id}`);
      const relative = path.relative(config.root, file);
      if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Image import outside project: ${file}`);
      const result = await prepare(file, true);
      const reference = this.emitFile({ type: "asset", name: path.basename(file, path.extname(file)) + result.extension, source: result.data });
      return `export default import.meta.ROLLUP_FILE_URL_${reference};`;
    },
    async transform(code, id) {
      if (/\.css(?:\?|$)/.test(id)) {
        const pattern = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/g;
        const matches = [...code.matchAll(pattern)];
        // Resolve CSS images to sanitized cache files before Vite hashes them.
        for (const match of matches.reverse()) {
          const url = match[1] ?? match[2] ?? match[3];
          if (/^(?:[a-z]+:|#|\/\/)/i.test(url)) continue;
          const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
          if (!imageExtensions.has(path.extname(pathname).toLowerCase())) continue;
          let file = pathname.startsWith("/") ? path.join(config.root, "public", pathname) : path.resolve(path.dirname(id.split("?")[0]), pathname);
          try { await fs.access(file); }
          catch { file = path.join(config.root, pathname); }
          const relative = path.relative(config.root, file);
          if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`CSS image outside project: ${file}`);
          const publicRelative = portable(path.relative(path.join(config.root, "public"), file));
          const result = await prepare(file, publicRelative.startsWith("../") || publicRelative.startsWith("img/"));
          const replacement = `url(${JSON.stringify(portable(result.file))})`;
          code = code.slice(0, match.index) + replacement + code.slice(match.index + match[0].length);
        }
        return { code: rewrite(code), map: null };
      }
      if (/\.(?:[cm]?[jt]sx?|css)(?:\?|$)/.test(id) || id.startsWith("\0virtual:blog/")) {
        const changed = rewrite(code);
        if (changed !== code) return { code: changed, map: null };
      }
    },
    transformIndexHtml: { order: "pre", handler(html) { return rewrite(html); } },
    generateBundle: { order: "post", handler(_options, bundle) {
      for (const file of publicFiles) this.emitFile({ type: "asset", ...file });
      // XML has stable filenames, so rewriting here cannot invalidate asset hashes.
      for (const item of Object.values(bundle)) {
        if (item.type === "asset" && /\.xml$/.test(item.fileName)) item.source = rewrite(String(item.source));
      }
      if (urls.size) {
        const existing = publicFiles.find((file) => file.fileName === "_redirects");
        const generated = [...urls].map(([from, to]) => `${from} ${to} 301`).join("\n") + "\n";
        if (existing) throw new Error("Move existing _redirects rules to netlify.toml before enabling generated media redirects.");
        this.emitFile({ type: "asset", fileName: "_redirects", source: generated });
      }
    } },
    async writeBundle(options) {
      try {
        const directory = options.dir || path.dirname(options.file);
        const files = mediaFiles(directory);
        tool.assertClean(files);
        this.info(`Media: ${imageCount} unique images, ${cacheHits} cache hits; ${files.length} emitted images verified.`);
      } finally { await cleanup(); }
    },
    async buildEnd(error) { if (error) await cleanup(); },
    closeBundle: cleanup,
  };
}

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { exiftoolPath } from "exiftool-vendored";
import { build, createServer } from "vite";
import { localCoverFile, noteThumbnail } from "../scripts/lib/note-thumbnail.js";
import { createMetadataTool } from "../scripts/strip-exif.js";
import { blogPlugin } from "../scripts/blog-plugin.js";
import { mediaPlugin } from "../scripts/media-plugin.js";

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-note-thumbnails-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "public/img"), { recursive: true });
  const file = path.join(root, "public/img/cover.jpg");
  await sharp({ create: { width: 400, height: 250, channels: 3, background: "#368cff" } }).jpeg().toFile(file);
  return { root, file };
}

test("note thumbnails stay local and refuse traversal or symlink escapes", async (t) => {
  const { root, file } = await fixture(t);
  assert.equal(localCoverFile(root, undefined), null);
  assert.equal(localCoverFile(root, "https://example.test/image.jpg"), null);
  assert.equal(localCoverFile(root, "/img/vector.svg"), null);
  assert.equal(localCoverFile(root, "/img/cover.jpg?version=1"), file);
  assert.throws(() => localCoverFile(root, "/../secret.jpg"), /inside public/);
  const outside = path.join(root, "private.jpg");
  await fs.copyFile(file, outside);
  const link = path.join(root, "public/img/link.jpg");
  await fs.symlink(outside, link);
  await assert.rejects(noteThumbnail(root, link), /inside public/);
});

test("thumbnails strip metadata, preserve originals and recover damaged cache entries", async (t) => {
  const { root, file } = await fixture(t);
  const tool = await createMetadataTool();
  execFileSync(await exiftoolPath(), ["-Artist=Private", "-GPSLatitude=48.7", "-overwrite_original", file]);
  const before = await fs.readFile(file);
  const bytes = await noteThumbnail(root, file);
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 144); assert.equal(metadata.height, 144);
  assert.equal(metadata.format, "webp"); assert.equal(metadata.exif, undefined);
  const output = path.join(root, "thumbnail.webp"); await fs.writeFile(output, bytes);
  tool.assertClean([output]);
  assert.deepEqual(await fs.readFile(file), before);
  const cached = path.join(root, "node_modules/.cache/portfolio-note-thumbnails");
  const payload = (await fs.readdir(cached)).find((name) => name.endsWith(".webp"));
  const cacheFile = path.join(cached, payload);
  const first = (await fs.stat(cacheFile)).mtimeMs;
  assert.deepEqual(await noteThumbnail(root, file), bytes);
  assert.equal((await fs.stat(cacheFile)).mtimeMs, first);
  await fs.writeFile(cacheFile, "damaged");
  assert.deepEqual(await noteThumbnail(root, file), bytes);
  await sharp({ create: { width: 400, height: 250, channels: 3, background: "#ffcc00" } }).jpeg().toFile(file);
  assert.notDeepEqual(await noteThumbnail(root, file), bytes);
});

test("production emits hashed thumbnails only for published notes; dev can preview drafts", async (t) => {
  const { root, file } = await fixture(t);
  for (const folder of ["published", "drafts"]) await fs.mkdir(path.join(root, "src/content/blog", folder), { recursive: true });
  const post = (title) => `---\ntitle: ${title}\ndescription: Summary\npubDatetime: 2000-01-01T00:00:00Z\nheroImage: /img/cover.jpg\n---\nBody`;
  await fs.writeFile(path.join(root, "src/content/blog/published/visible.md"), post("Visible"));
  await fs.writeFile(path.join(root, "src/content/blog/drafts/private.md"), post("PRIVATE_SENTINEL"));
  await fs.writeFile(path.join(root, "index.html"), '<script type="module" src="/entry.js"></script>');
  await fs.writeFile(path.join(root, "entry.js"), 'import posts from "virtual:blog/index"; console.log(posts.map(post=>post.thumbnail));');
  const result = await build({ root, configFile: false, logLevel: "silent", plugins: [mediaPlugin(), blogPlugin()] });
  const thumbs = result.output.filter((item) => item.fileName.includes("-thumbnail-") && item.fileName.endsWith(".webp"));
  assert.equal(thumbs.length, 1); assert.match(thumbs[0].fileName, /visible-thumbnail-/);
  assert.ok(!result.output.some((item) => item.fileName.includes("private-thumbnail")));
  assert.ok(!result.output.some((item) => String(item.code || item.source).includes("PRIVATE_SENTINEL")));
  assert.equal((await sharp(path.join(root, "dist", thumbs[0].fileName)).metadata()).width, 144);
  const server = await createServer({ root, configFile: false, logLevel: "silent", plugins: [blogPlugin()], server: { middlewareMode: true } });
  try {
    const { default: posts } = await server.environments.ssr.runner.import("virtual:blog/index");
    assert.equal(posts.length, 2);
    assert.ok(posts.every((post) => post.thumbnail.startsWith("data:image/webp;base64,")));
    const url = "virtual:blog/thumbnail/visible";
    const before = (await server.environments.client.transformRequest(url)).code;
    await sharp({ create: { width: 400, height: 250, channels: 3, background: "#ffcc00" } }).jpeg().toFile(file);
    server.watcher.emit("change", path.join(server.config.root, "public/img/cover.jpg"));
    await new Promise(setImmediate);
    const refreshed = await server.environments.client.transformRequest(url);
    assert.notEqual(refreshed.code, before, "editing a cover refreshes the dev thumbnail");
  } finally { await server.close(); }
});

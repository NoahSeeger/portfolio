import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { build } from "vite";
import { exiftoolPath } from "exiftool-vendored";
import { mediaPlugin } from "../scripts/media-plugin.js";
import { createMetadataTool, mediaFiles } from "../scripts/strip-exif.js";

const repository = fileURLToPath(new URL("../", import.meta.url));
const executable = await exiftoolPath();
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-media-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "public/img"), { recursive: true });
  const image = await sharp({ create: { width: 120, height: 60, channels: 4, background: "#368cff" } }).png({ compressionLevel: 0 }).toBuffer();
  await fs.writeFile(path.join(root, "original.png"), image);
  await fs.writeFile(path.join(root, "public/img/project.png"), image);
  await fs.writeFile(path.join(root, "public/favicon.png"), image);
  for (const file of ["original.png", "public/img/project.png", "public/favicon.png"]) execFileSync(executable, ["-Artist=Private", "-Comment=Private comment", "-GPSLatitude=48.7", "-Orientation#=6", "-overwrite_original", path.join(root, file)]);
  await fs.writeFile(path.join(root, "public/img", "with space.png"), image);
  await fs.writeFile(path.join(root, "index.html"), '<html><body><img src="/img/project.png"><img src="/img/with space.png"><link rel="icon" href="/favicon.png"><script type="module" src="/entry.js"></script></body></html>');
  await fs.writeFile(path.join(root, "style.css"), 'body{background-image:url("./original.png")} .public{background:url("/img/project.png")}');
  await fs.writeFile(path.join(root, "entry.js"), 'import "./style.css"; import photo from "./original.png"; console.log(photo,"/img/project.png?test=1#anchor", "/img/project.png-other", "https://external.example/img/project.png", "https://noahseeger.de/img/project.png");');
  return root;
}
const runBuild = (root, plugin = mediaPlugin()) => build({ configFile: false, root, plugins: [plugin], logLevel: "silent" });
const readOutput = async (root) => {
  const names = await fs.readdir(path.join(root, "dist/assets"));
  return { names, code: await fs.readFile(path.join(root, "dist/assets", names.find((name) => name.endsWith(".js"))), "utf8") };
};

test("build sanitizes copies, converts content, preserves icon URLs, and reuses stable cache", async (t) => {
  const root = await fixture(t);
  const before = await fs.readFile(path.join(root, "original.png"));
  const built = await runBuild(root);
  const modules = built.output.filter((item) => item.type === "chunk").flatMap((item) => Object.keys(item.modules));
  assert.ok(modules.every((id) => !/node_modules\/(?:sharp|exiftool-vendored)/.test(id)));
  const first = await readOutput(root);
  assert.ok(first.names.some((name) => /^original-.*\.webp$/.test(name)));
  assert.match(first.code, /\/img\/project.webp\?test=1#anchor/);
  assert.match(first.code, /\/img\/project.png-other/);
  assert.match(first.code, /https:\/\/external.example\/img\/project.png/);
  assert.match(first.code, /https:\/\/noahseeger.de\/img\/project.webp/);
  assert.match(await fs.readFile(path.join(root, "dist/index.html"), "utf8"), /\/img\/project.webp/);
  assert.match(await fs.readFile(path.join(root, "dist/_redirects"), "utf8"), /\/img\/project.png \/img\/project.webp 301/);
  assert.match(await fs.readFile(path.join(root, "dist/index.html"), "utf8"), /\/img\/with%20space.webp/);
  await fs.access(path.join(root, "dist/favicon.png"));
  await assert.rejects(fs.access(path.join(root, "dist/img/project.png")));
  assert.deepEqual(await fs.readFile(path.join(root, "original.png")), before);
  const tool = await createMetadataTool();
  tool.assertClean(mediaFiles(path.join(root, "dist")));
  const converted = await sharp(path.join(root, "dist/img/project.webp")).metadata();
  assert.equal(converted.width, 60);
  assert.equal(converted.height, 120);
  await runBuild(root);
  assert.deepEqual((await readOutput(root)).names, first.names);
  assert.equal((await readOutput(root)).code, first.code);
  // Mutating input must invalidate cache and its emitted content hash.
  await fs.writeFile(path.join(root, "original.png"), await sharp({ create: { width: 50, height: 50, channels: 4, background: "red" } }).png().toBuffer());
  await runBuild(root);
  assert.notDeepEqual((await readOutput(root)).names, first.names);
});

test("existing clean WebP is copied byte for byte; emitted cache is audited", async (t) => {
  const root = await fixture(t);
  const source = await sharp({ create: { width: 40, height: 40, channels: 4, background: "blue" } }).webp({ lossless: true }).toBuffer();
  await fs.writeFile(path.join(root, "existing.webp"), source);
  await fs.writeFile(path.join(root, "entry.js"), 'import photo from "./existing.webp"; console.log(photo);');
  await runBuild(root);
  const output = await readOutput(root);
  const filename = output.names.find((name) => name.startsWith("existing-") && name.endsWith(".webp"));
  assert.deepEqual(await fs.readFile(path.join(root, "dist/assets", filename)), source);
  // Corrupting a cache payload cannot silently bypass sanitization.
  const cache = path.join(root, "node_modules/.cache/portfolio-media");
  const cached = (await fs.readdir(cache)).find((name) => name.endsWith(".webp"));
  await fs.writeFile(path.join(cache, cached), "damaged");
  await runBuild(root);
  (await createMetadataTool()).assertClean(mediaFiles(path.join(root, "dist")));
});

test("missing tool and an injected dirty final asset both fail the production build", async (t) => {
  const root = await fixture(t);
  await assert.rejects(runBuild(root, mediaPlugin({ metadataToolFactory: async () => { throw new Error("Required bundled ExifTool is missing"); } })), /Required bundled ExifTool/);
  const dirty = await fs.readFile(path.join(root, "original.png"));
  await assert.rejects(build({ configFile: false, root, logLevel: "silent", plugins: [mediaPlugin(), { name: "inject-private-image", generateBundle() { this.emitFile({ type: "asset", fileName: "injected.png", source: dirty }); } }] }), /Unapproved embedded metadata/);
});

test("real project builds using bundled ExifTool without Homebrew/system exiftool", { skip: process.platform === "win32" }, async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-portable-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [path.join(repository, "node_modules/vite/bin/vite.js"), "build", "--outDir", path.join(root, "dist")], { cwd: repository, encoding: "utf8", env: { ...process.env, PATH: "/usr/bin:/bin" }, timeout: 30000 });
  assert.equal(result.status, 0, result.stderr);
});

test("animated GIF retains frames, timing, loop and pixels after comment removal", async (t) => {
  const root = await fixture(t);
  const image = path.join(root, "public/img/animated.gif");
  const raw = Buffer.from([255,0,0,255,255,0,0,255,0,0,255,255,0,0,255,255]);
  await sharp(raw, { raw: { width: 2, height: 2, channels: 4, pageHeight: 1 } }).gif({ loop: 3, delay: [100,200] }).toFile(image);
  execFileSync(executable, ["-Comment=Private", "-overwrite_original", image]);
  const before = await sharp(image, { animated: true }).metadata();
  const pixels = await sharp(image, { animated: true }).raw().toBuffer();
  await runBuild(root);
  const output = path.join(root, "dist/img/animated.gif");
  const after = await sharp(output, { animated: true }).metadata();
  assert.equal(after.pages, before.pages);
  assert.equal(after.loop, before.loop);
  assert.deepEqual(after.delay, before.delay);
  assert.deepEqual(await sharp(output, { animated: true }).raw().toBuffer(), pixels);
});

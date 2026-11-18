import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { exiftoolPath } from "exiftool-vendored";
import { createMetadataTool } from "../scripts/strip-exif.js";

export const binary = await exiftoolPath();
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-metadata-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test("missing executable fails closed; no unchecked success result", async (t) => {
  const root = fixture(t);
  await assert.rejects(createMetadataTool({ executable: path.join(root, "missing-exiftool") }), /Required ExifTool failed/);
});

test("metadata scan rejects errors, warnings and unknown embedded fields", async (t) => {
  const root = fixture(t);
  const executable = path.join(root, "fake-tool");
  const image = path.join(root, "photo.jpg");
  for (const [key, expected] of [["ExifTool:Error", /broken/], ["ExifTool:Warning", /broken/], ["XMP:Secret", /Unapproved embedded metadata/], ["PNG:CustomPrivateField", /Unapproved embedded metadata/]]) {
    fs.writeFileSync(executable, `#!${process.execPath}\nif(process.argv[2]==='-ver')console.log('test');else console.log(JSON.stringify([{SourceFile:${JSON.stringify(image)},${JSON.stringify(key)}:'broken'}]));`);
    fs.chmodSync(executable, 0o755);
    const tool = await createMetadataTool({ executable });
    assert.throws(() => tool.assertClean([image]), expected);
  }
});

test("real bundled ExifTool removes GPS, author and comment; keeps orientation", async (t) => {
  const root = fixture(t);
  const image = path.join(root, "photo with spaces.jpg");
  await sharp({ create: { width: 32, height: 24, channels: 3, background: "#368cff" } }).jpeg().toFile(image);
  execFileSync(binary, ["-Artist=Private Person", "-Comment=Private note", "-GPSLatitude=48.7", "-GPSLongitude=9.1", "-Orientation#=6", "-overwrite_original", image]);
  const tool = await createMetadataTool();
  assert.throws(() => tool.assertClean([image]), /Unapproved embedded metadata/);
  assert.equal(tool.clean([image]), 1);
  tool.assertClean([image]);
  assert.equal(execFileSync(binary, ["-s3", "-Artist", "-Comment", "-GPS:all", image], { encoding: "utf8" }).trim(), "");
  assert.equal(execFileSync(binary, ["-s3", "-Orientation#", image], { encoding: "utf8" }).trim(), "6");
  const before = fs.readFileSync(image);
  assert.equal(tool.clean([image]), 0);
  assert.deepEqual(fs.readFileSync(image), before);
});


test("a JPEG comment alone is embedded metadata, not filesystem information", async (t) => {
  const root = fixture(t);
  const image = path.join(root, "comment.jpg");
  await sharp({ create: { width: 32, height: 24, channels: 3, background: "#368cff" } }).jpeg().toFile(image);
  execFileSync(binary, ["-all=", "-Comment=Private comment", "-overwrite_original", image]);
  const tool = await createMetadataTool();
  assert.throws(() => tool.assertClean([image]), /Comment/);
  assert.equal(tool.clean([image]), 1);
  tool.assertClean([image]);
});

test("PNG cleanup preserves decoded pixels and ICC profile", async (t) => {
  const root = fixture(t);
  const image = path.join(root, "profile.png");
  await sharp({ create: { width: 12, height: 12, channels: 3, background: "#368cff" } }).withIccProfile("p3").png().toFile(image);
  execFileSync(binary, ["-Artist=Private", "-Comment=Private note", "-overwrite_original", image]);
  const beforePixels = await sharp(image).raw().toBuffer();
  const before = await sharp(image).metadata();
  const tool = await createMetadataTool();
  assert.equal(tool.clean([image]), 1);
  assert.deepEqual(await sharp(image).raw().toBuffer(), beforePixels);
  assert.deepEqual((await sharp(image).metadata()).icc, before.icc);
});

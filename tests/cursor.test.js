import test from "node:test";
import assert from "node:assert/strict";
import { createCursorValue, DEFAULT_CURSOR_COLOR } from "../src/lib/cursor.js";

const svg = (value) => decodeURIComponent(value.slice(value.indexOf(",") + 1, value.lastIndexOf('\")')));

test("native cursor supports scoped gradients while preserving its dimensions and hotspot", () => {
  const value = createCursorValue("#fff0a6", "#ffffff", "#f4b15e");
  const image = svg(value);
  assert.match(image, /<linearGradient/);
  assert.match(image, /stop-color="#fff0a6"/);
  assert.match(image, /stop-color="#f4b15e"/);
  assert.match(image, /fill="url\(#cursor-fill\)"/);
  assert.match(image, /stroke="#ffffff"/);
  assert.match(image, /width="36" height="45"/);
  assert.ok(value.endsWith(" 11 5"));
});

test("default cursor remains solid and invalid colors cannot inject SVG", () => {
  assert.ok(!svg(createCursorValue()).includes("linearGradient"));
  const image = svg(createCursorValue('"/><script>bad</script>', "invalid", "url(https://example.test)"));
  assert.ok(image.includes(`fill="${DEFAULT_CURSOR_COLOR}"`));
  assert.ok(!image.includes("<script>") && !image.includes("example.test"));
});

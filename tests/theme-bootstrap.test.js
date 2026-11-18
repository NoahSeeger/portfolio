import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { runInNewContext } from "node:vm";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)[1];

test("first-paint theme honors valid preferences and follows the system for invalid or blocked storage", () => {
  for (const systemDark of [true, false]) for (const preference of ["dark", "light", null, "invalid"]) for (const blocked of [true, false]) {
    let dark;
    const meta = {};
    const root = { classList: { toggle: (_name, value) => { dark = value; } }, style: {} };
    const window = { matchMedia: () => ({ matches: systemDark }), localStorage: { getItem: () => { if (blocked) throw new Error("blocked"); return preference; } } };
    runInNewContext(bootstrap, {
      window, document: { documentElement: root, querySelector: () => meta },
      getComputedStyle: () => ({ backgroundColor: dark ? "rgb(16, 16, 16)" : "rgb(255, 255, 255)" }),
    });
    const valid = !blocked && ["dark", "light"].includes(preference);
    const expected = valid ? preference === "dark" : systemDark;
    assert.equal(dark, expected);
    assert.equal(root.style.colorScheme, expected ? "dark" : "light");
    assert.equal(meta.content, expected ? "rgb(16, 16, 16)" : "rgb(255, 255, 255)");
  }
});

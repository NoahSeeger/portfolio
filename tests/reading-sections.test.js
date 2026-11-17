import test from "node:test";
import assert from "node:assert/strict";
import { remarkReadingSections } from "../src/lib/reading-sections.js";

test("reading sections preserve Markdown order and group only at main headings", () => {
  const nodes = [
    { type: "paragraph", children: [] },
    { type: "heading", depth: 2, children: [] },
    { type: "code", lang: "js", value: "example" },
    { type: "heading", depth: 3, children: [] },
    { type: "table", children: [] },
    { type: "heading", depth: 2, children: [] },
    { type: "paragraph", children: [] },
  ];
  const tree = { type: "root", children: [...nodes] };
  remarkReadingSections()(tree);
  assert.equal(tree.children.length, 3);
  assert.deepEqual(tree.children.flatMap((section) => section.children), nodes);
  assert.equal(tree.children[1].children.length, 4);
  assert.ok(tree.children.every((section) => section.data.hName === "section"));
  const empty = { type: "root", children: [] };
  remarkReadingSections()(empty);
  assert.deepEqual(empty.children, []);
});

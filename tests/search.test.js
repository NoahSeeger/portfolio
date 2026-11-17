import test from "node:test";
import assert from "node:assert/strict";
import { createSearchIndex, searchNotes, highlightParts, plainText } from "../src/lib/search.js";

const post = (slug, title, description, content, pubDatetime = "2026-01-01") => ({ slug, title, description, content, pubDatetime });

test("search trims queries, supports words across fields, and ranks titles above body repetition", () => {
  const index = createSearchIndex([
    post("body", "A note", "Interface ideas", "scroll ".repeat(80)),
    post("title", "Designing the scroll", "Interface ideas", "Details"),
    post("unrelated", "Something else", "Ideas", "scroll"),
  ]);
  assert.deepEqual(searchNotes(index, "  SCROLL   interface  ").map(({ post }) => post.slug), ["title", "body"]);
  assert.deepEqual(searchNotes(index, " \n "), []);
  assert.deepEqual(searchNotes(index, "scroll absent"), []);
});

test("search indexes readable text and returns a bounded excerpt near the matching body text", () => {
  const markdown = '# Heading\n\n**Useful** [label](https://hidden-url.example) ![image](private.png)\n\n```js\nconst value = 3;\n```';
  const readable = plainText(markdown);
  assert.match(readable, /Heading Useful label image const value = 3;/);
  assert.ok(!readable.includes("hidden-url") && !readable.includes("private.png"));
  const index = createSearchIndex([post("note", "A note", "An introduction.", "Before ".repeat(100) + "needle in the body " + "after ".repeat(100))]);
  const [result] = searchNotes(index, "needle");
  assert.match(result.snippet, /needle in the body/);
  assert.ok(result.snippet.startsWith("…") && result.snippet.endsWith("…"));
  assert.ok(result.snippet.length < 250);
});

test("highlighting treats regex characters literally and preserves the complete original text", () => {
  const text = "C++ and [a.b], then C++ again.";
  const parts = highlightParts(text, "c++ [a.b]");
  assert.equal(parts.map((part) => part.text).join(""), text);
  assert.deepEqual(parts.filter((part) => part.match).map((part) => part.text), ["C++", "[a.b]", "C++"]);
  assert.deepEqual(highlightParts(text, "  "), [{ text, match: false }]);
});

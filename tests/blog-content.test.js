import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build, createServer } from "vite";
import { parsePost, readPosts, metadataOnly } from "../scripts/lib/blog-content.js";
import { generateDocuments } from "../scripts/generate-rss.js";
import { blogPlugin } from "../scripts/blog-plugin.js";

const now = Date.parse("2026-11-17T12:00:00Z");
function post(body = "VISIBLE_BODY_SENTINEL", extra = "") {
  return `---\ntitle: "Example: one, two"\ndescription: Description\npubDatetime: 2026-01-01T10:00:00Z\n${extra}---\n${body}`;
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-blog-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const folder of ["published", "drafts"]) fs.mkdirSync(path.join(root, "src/content/blog", folder), { recursive: true });
  const write = (folder, name, source) => fs.writeFileSync(path.join(root, "src/content/blog", folder, `${name}.md`), source);
  write("published", "visible", post());
  write("published", "scheduled", post("FUTURE_SECRET_SENTINEL").replace("2026-01-01", "2999-01-01"));
  write("published", "flagged", post("FLAGGED_SECRET_SENTINEL", "draft: true\n"));
  write("published", "archived", post("ARCHIVED_BODY_SENTINEL", "status: archived\n"));
  // Folder membership alone must keep this out of production.
  write("drafts", "private", post("DRAFT_SECRET_SENTINEL", "draft: false\n"));
  return { root, write };
}

test("YAML parsing supports quoted commas, comments and multiline values", () => {
  const parsed = parsePost(post("200 words", "draft: true # comment\n"), "example.md");
  assert.equal(parsed.draft, true);
  assert.equal(parsed.readTime, 1);
  assert.equal(parsePost(post().replace("description: Description", "description: >\n  first line\n  second line"), "example.md").description, "first line second line");
});

test("invalid metadata fails with a file-specific message", () => {
  for (const source of [post().replace("2026-01-01", "2026-02-30"), post().replace("2026-01-01T10:00:00Z", "tomorrow"), post("body", 'draft: "false"\n'), post("body", "title: Duplicate\n"), post("body", "tags: invalid\n")]) {
    assert.throws(() => parsePost(source, "example.md"), /example.md:/);
  }
});

test("production, development and exact publication boundary use explicit rules", (t) => {
  const { root, write } = fixture(t);
  assert.deepEqual(readPosts(root, { now }).map((p) => p.slug).sort(), ["archived", "visible"]);
  assert.equal(readPosts(root, { now, includeDrafts: true }).length, 5);
  assert.equal(readPosts(root, { now, includeDrafts: true }).find((p) => p.slug === "private").draft, true);
  write("published", "boundary", post().replace("2026-01-01T10:00:00Z", "2026-11-17T12:00:00Z"));
  assert.ok(readPosts(root, { now }).some((p) => p.slug === "boundary"));
  assert.ok(!readPosts(root, { now: now - 1 }).some((p) => p.slug === "boundary"));
  write("drafts", "visible", post());
  assert.throws(() => readPosts(root, { includeDrafts: true }), /Duplicate blog slug/);
});

test("RSS and sitemap share visibility rules and escape XML/CDATA", (t) => {
  const { root, write } = fixture(t);
  write("published", "escaped", post('[relative](/target?a=1&b=2) [local](photo.png) [anchor](#section)\n\nText ]]> & < >').replace('Example: one, two', 'Example ]]> & text'));
  const documents = generateDocuments(readPosts(root, { now }), { now, siteUrl: "https://example.test" });
  const rss = documents["rss.xml"];
  assert.match(rss, /https:\/\/example.test\/target\?a=1&amp;b=2/);
  assert.match(rss, /https:\/\/example.test\/blog\/photo.png/);
  assert.match(rss, /https:\/\/example.test\/blog\/escaped#section/);
  assert.match(rss, /\]\]\]\]><!\[CDATA\[>/);
  for (const xml of Object.values(documents)) {
    for (const hidden of ["scheduled", "flagged", "private", "archived"]) assert.ok(!xml.includes(`/blog/${hidden}`));
    assert.ok(!xml.includes("Invalid Date"));
  }
  assert.throws(() => generateDocuments([], { siteUrl: "https://example.test/path" }), /SITE_URL/);
});

test("production build excludes secrets; initial bundle has metadata only", async (t) => {
  const { root } = fixture(t);
  fs.writeFileSync(path.join(root, "entry.js"), 'import posts, {loaders} from "virtual:blog/index"; console.log(posts); window.articleLoaders = loaders; window.search = () => import("virtual:blog/search");');
  const result = await build({ configFile: false, root, plugins: [blogPlugin()], logLevel: "silent", build: { write: false, rollupOptions: { input: path.join(root, "entry.js") } } });
  const outputs = result.output;
  const all = outputs.map((item) => item.code ?? item.source).join("\n");
  for (const secret of ["FUTURE_SECRET_SENTINEL", "FLAGGED_SECRET_SENTINEL", "DRAFT_SECRET_SENTINEL"]) assert.ok(!all.includes(secret), secret);
  const entry = outputs.find((item) => item.isEntry);
  const staticCode = (chunk, seen = new Set()) => {
    if (seen.has(chunk.fileName)) return "";
    seen.add(chunk.fileName);
    return chunk.code + chunk.imports.map((name) => staticCode(outputs.find((item) => item.fileName === name), seen)).join("\n");
  };
  const initial = staticCode(entry);
  assert.ok(!initial.includes("VISIBLE_BODY_SENTINEL"));
  assert.ok(!initial.includes("ARCHIVED_BODY_SENTINEL"));
  assert.ok(all.includes("VISIBLE_BODY_SENTINEL"));
  assert.ok(outputs.some((item) => item.fileName === "rss.xml"));
  // An unusual mode name must not turn a production build into a draft preview.
  const alternate = await build({ configFile: false, mode: "development", root, plugins: [blogPlugin()], logLevel: "silent", build: { write: false, rollupOptions: { input: path.join(root, "entry.js") } } });
  assert.ok(!alternate.output.map((item) => item.code ?? item.source).join("").includes("DRAFT_SECRET_SENTINEL"));
});

test("local dev exposes draft previews and lazy article/search content", async (t) => {
  const { root } = fixture(t);
  const server = await createServer({ configFile: false, root, plugins: [blogPlugin()], server: { middlewareMode: true }, logLevel: "silent" });
  try {
    const index = await server.ssrLoadModule("virtual:blog/index");
    assert.equal(index.default.length, 5);
    assert.ok(index.default.every((p) => !("content" in p)));
    assert.equal(await index.loaders.private(), "DRAFT_SECRET_SENTINEL");
    const search = await server.ssrLoadModule("virtual:blog/search");
    assert.ok(search.default.some((p) => p.content === "DRAFT_SECRET_SENTINEL"));
    assert.ok(search.default.some((p) => p.slug === "archived"), "search includes archived notes that are visible in the listing");
  } finally { await server.close(); }
});

test("content fields fail closed on typos and invalid cover paths", () => {
  for (const extra of ["drfat: true", "heroImage: javascript:alert(1)", "heroImage: relative.png", "heroImage: https:example.test", "heroImage: https://user:pass@example.test/image.png", "heroImage: //other.example/image.png", "updatedDatetime: 2025-01-01T00:00:00Z"]) {
    assert.throws(() => parsePost(post("body", `${extra}\n`), "example.md"), /example.md:/, extra);
  }
  const valid = parsePost(post("body", "heroImage: /img/project.webp\n"), "example.md");
  assert.equal(valid.heroImage, "/img/project.webp");
});

test("removed taxonomy and special link fields are rejected; regular Markdown links work in RSS", () => {
  for (const extra of ["tags: [one]", "category: project", "featured: true", "github: https://github.com/example/project", "liveDemo: https://example.test"]) {
    assert.throws(() => parsePost(post("body", `${extra}\n`), "example.md"), /Unknown frontmatter field/);
  }
  const parsed = parsePost(post("[Website](https://example.test) and [Source](https://github.com/example/project)"), "example.md");
  const browser = metadataOnly(parsed);
  assert.ok(!("content" in browser));
  const rss = generateDocuments([parsed], { now })["rss.xml"];
  assert.match(rss, /href="https:\/\/example.test"/);
  assert.match(rss, /href="https:\/\/github.com\/example\/project"/);
  assert.ok(!rss.includes("<category>"));
});

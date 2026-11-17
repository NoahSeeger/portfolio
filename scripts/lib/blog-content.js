import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { URL } from "node:url";

const SUPPORTED_FIELDS = new Set([
  "title", "description", "pubDatetime", "updatedDatetime", "draft", "status",
  "heroImage",
]);

export function parsePost(raw, filePath, { inDrafts = false } = {}) {
  const fail = (message) => { throw new Error(`${filePath}: ${message}`); };
  const match = raw.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) fail("Missing YAML frontmatter.");
  let data;
  try { data = parse(match[1], { uniqueKeys: true, maxAliasCount: 0 }); }
  catch (error) { fail(`Invalid YAML: ${error.message}`); }
  if (!data || typeof data !== "object" || Array.isArray(data)) fail("Frontmatter must be a mapping.");
  for (const key of Object.keys(data)) {
    if (!SUPPORTED_FIELDS.has(key)) fail(`Unknown frontmatter field: ${key}.`);
  }
  for (const key of ["title", "description", "pubDatetime"]) {
    if (typeof data[key] !== "string" || !data[key].trim()) fail(`${key} must be a non-empty string.`);
  }
  for (const key of ["pubDatetime", "updatedDatetime"]) {
    if (data[key] === undefined) continue;
    if (typeof data[key] !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(data[key]) || !Number.isFinite(Date.parse(data[key]))) {
      fail(`${key} must be an ISO timestamp with a timezone.`);
    }
    const [year, month, day] = data[key].slice(0, 10).split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) fail(`${key} contains an invalid calendar date.`);
  }
  for (const key of ["draft"]) {
    if (data[key] !== undefined && typeof data[key] !== "boolean") fail(`${key} must be true or false, without quotes.`);
  }
  for (const key of ["heroImage", "status"]) {
    if (data[key] !== undefined && typeof data[key] !== "string") fail(`${key} must be a string.`);
  }
  for (const key of ["heroImage"]) {
    if (data[key] === undefined) continue;
    const value = data[key].trim();
    const localImage = key === "heroImage" && value.startsWith("/") && !value.startsWith("//");
    let url;
    try { url = new URL(value, localImage ? "https://portfolio.invalid" : undefined); }
    catch { fail(`${key} must be an absolute HTTP(S) URL${key === "heroImage" ? " or a root-relative image path" : ""}.`); }
    if (!value || (!localImage && !/^https?:\/\//i.test(value)) || /[\\\u0000-\u001f\u007f]/.test(value) || !["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      fail(`${key} must be an HTTP(S) URL without credentials or control characters.`);
    }
    data[key] = value;
  }
  if (data.updatedDatetime && Date.parse(data.updatedDatetime) < Date.parse(data.pubDatetime)) fail("updatedDatetime must not precede pubDatetime.");
  if (data.status !== undefined && !["published", "archived"].includes(data.status)) fail("status must be published or archived.");
  const slug = path.basename(filePath, ".md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("Filename must be a lowercase, hyphen-separated slug.");
  const content = raw.replace(/^\uFEFF/, "").slice(match[0].length).trim();
  // Preserve validated authoring fields; metadataOnly strips build-only fields.
  const metadata = { slug, title: data.title.trim(), description: data.description.trim(), pubDatetime: data.pubDatetime,
    draft: inDrafts || data.draft === true, readTime: content ? Math.ceil(content.split(/\s+/).length / 200) : 0 };
  for (const key of ["updatedDatetime", "heroImage", "status"]) {
    if (data[key] !== undefined) metadata[key] = data[key];
  }
  return { ...metadata, content };
}

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(fullPath) : entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

export function readPosts(root, { includeDrafts = false, now = Date.now() } = {}) {
  const directory = path.join(root, "src/content/blog");
  const folders = includeDrafts ? ["published", "drafts"] : ["published"];
  const seen = new Set();
  return folders.flatMap((folder) => markdownFiles(path.join(directory, folder)).map((filePath) => {
    const post = parsePost(fs.readFileSync(filePath, "utf8"), filePath, { inDrafts: folder === "drafts" });
    if (seen.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`);
    seen.add(post.slug);
    return post;
  })).filter((post) => includeDrafts || (!post.draft && Date.parse(post.pubDatetime) <= now))
    .sort((a, b) => Date.parse(b.pubDatetime) - Date.parse(a.pubDatetime) || a.slug.localeCompare(b.slug));
}

export function metadataOnly({ content: _content, ...metadata }) {
  return metadata;
}

export function currentPosts(posts) {
  return posts.filter((post) => !post.draft && post.status !== "archived");
}

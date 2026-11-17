import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export function parsePost(raw, filePath, { inDrafts = false } = {}) {
  const fail = (message) => { throw new Error(`${filePath}: ${message}`); };
  const match = raw.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) fail("Missing YAML frontmatter.");
  let data;
  try { data = parse(match[1], { uniqueKeys: true, maxAliasCount: 0 }); }
  catch (error) { fail(`Invalid YAML: ${error.message}`); }
  if (!data || typeof data !== "object" || Array.isArray(data)) fail("Frontmatter must be a mapping.");
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
  for (const key of ["draft", "featured"]) {
    if (data[key] !== undefined && typeof data[key] !== "boolean") fail(`${key} must be true or false, without quotes.`);
  }
  for (const key of ["category", "heroImage", "github", "liveDemo", "status"]) {
    if (data[key] !== undefined && typeof data[key] !== "string") fail(`${key} must be a string.`);
  }
  if (data.status !== undefined && !["published", "archived"].includes(data.status)) fail("status must be published or archived.");
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string" || !tag.trim()))) fail("tags must be a list of non-empty strings.");
  const slug = path.basename(filePath, ".md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("Filename must be a lowercase, hyphen-separated slug.");
  const content = raw.replace(/^\uFEFF/, "").slice(match[0].length).trim();
  // Only explicitly supported metadata is sent to the client.
  const metadata = { slug, title: data.title.trim(), description: data.description.trim(), pubDatetime: data.pubDatetime,
    draft: inDrafts || data.draft === true, tags: data.tags || [], readTime: content ? Math.ceil(content.split(/\s+/).length / 200) : 0 };
  for (const key of ["updatedDatetime", "category", "heroImage", "github", "liveDemo", "status", "featured"]) {
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

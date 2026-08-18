import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, "../src/content/blog");
const DIST_DIR = path.join(__dirname, "../dist");
const BASE_URL = (process.env.SITE_URL || "https://noahseeger.de").replace(/\/$/, "");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content: raw };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if (value !== "" && !Number.isNaN(Number(value))) {
      value = Number(value);
    }
    data[key] = value;
  }

  return { data, content: raw.slice(match[0].length).trim() };
}

function findMarkdownFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...findMarkdownFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
  }
  return files;
}

function readPosts() {
  return findMarkdownFiles(BLOG_DIR)
    .map((filePath) => {
      const { data, content } = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
      return { slug: path.basename(filePath, ".md"), ...data, content };
    })
    .filter((post) => {
      if (post.draft || post.status === "archived") return false;
      const publishedAt = new Date(post.pubDatetime).getTime();
      return Number.isNaN(publishedAt) || publishedAt <= Date.now();
    })
    .sort((a, b) => new Date(b.pubDatetime) - new Date(a.pubDatetime));
}

function escapeXml(value = "") {
  return String(value).replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character]);
}

function cdata(value = "") {
  return `<![CDATA[${String(value).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function absolutizeMediaUrls(html) {
  return html.replace(/(src|href)=(['"])\/(?!\/)/g, `$1=$2${BASE_URL}/`);
}

function markdownToHtml(content) {
  const html = renderToStaticMarkup(
    React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, content)
  );
  return absolutizeMediaUrls(html);
}

function generateRSS(posts) {
  const items = posts.map((post) => {
    const link = `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`;
    const description = post.description ? `    <description>${cdata(post.description)}</description>` : "";
    const content = `    <content:encoded>${cdata(markdownToHtml(post.content))}</content:encoded>`;
    const categories = (Array.isArray(post.tags) ? post.tags : [])
      .map((tag) => `    <category>${escapeXml(tag)}</category>`)
      .join("\n");

    return `  <item>
    <title>${cdata(post.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
${description}
${content}
${categories}
    <author>noahseeger@outlook.de (Noah Seeger)</author>
    <pubDate>${new Date(post.pubDatetime).toUTCString()}</pubDate>
  </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Noah Seeger — notes and projects</title>
    <description>Notes on software, iOS apps, homelabbing and things I am learning.</description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function generateSitemap(posts) {
  const urls = [
    { loc: `${BASE_URL}/`, lastmod: new Date().toISOString() },
    { loc: `${BASE_URL}/blog`, lastmod: posts[0]?.updatedDatetime || posts[0]?.pubDatetime },
    ...posts.map((post) => ({
      loc: `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`,
      lastmod: post.updatedDatetime || post.pubDatetime,
    })),
  ];

  const entries = urls.map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

const posts = readPosts();
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(path.join(DIST_DIR, "rss.xml"), generateRSS(posts));
fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), generateSitemap(posts));
console.log(`Generated rss.xml and sitemap.xml with ${posts.length} published posts`);

import fs from "fs";
import path from "path";
import { fileURLToPath, URL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readPosts, currentPosts } from "./lib/blog-content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "../dist");

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

function absolutizeMediaUrls(html, documentUrl) {
  return html.replace(/(src|href)=(['"])(.*?)\2/g, (attribute, name, quote, value) => {
    if (!value || /^[a-z][a-z0-9+.-]*:/i.test(value)) return attribute;
    return `${name}=${quote}${escapeXml(new URL(value.replaceAll("&amp;", "&"), documentUrl).href)}${quote}`;
  });
}

function markdownToHtml(content, documentUrl) {
  const html = renderToStaticMarkup(
    React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, content)
  );
  return absolutizeMediaUrls(html, documentUrl);
}

function generateRSS(posts, BASE_URL, now) {
  const items = posts.map((post) => {
    const link = `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`;
    const description = post.description ? `    <description>${cdata(post.description)}</description>` : "";
    const content = `    <content:encoded>${cdata(markdownToHtml(post.content, link))}</content:encoded>`;
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
    <lastBuildDate>${new Date(now).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function generateSitemap(posts, BASE_URL) {
  const urls = [
    { loc: `${BASE_URL}/` },
    { loc: `${BASE_URL}/blog`, lastmod: posts.length ? new Date(Math.max(...posts.map((post) => Date.parse(post.updatedDatetime || post.pubDatetime)))).toISOString() : undefined },
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

export function generateDocuments(allPosts, { siteUrl = process.env.SITE_URL || "https://noahseeger.de", now = Date.now() } = {}) {
  const url = new URL(siteUrl);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("SITE_URL must be an HTTP(S) origin without a path or credentials.");
  const baseUrl = url.origin;
  const posts = currentPosts(allPosts).filter((post) => Date.parse(post.pubDatetime) <= now);
  return { "rss.xml": generateRSS(posts, baseUrl, now), "sitemap.xml": generateSitemap(posts, baseUrl) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const now = Date.now();
  const documents = generateDocuments(readPosts(path.join(__dirname, ".."), { now }), { now });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  for (const [name, content] of Object.entries(documents)) fs.writeFileSync(path.join(DIST_DIR, name), content);
  console.log("Generated rss.xml and sitemap.xml");
}

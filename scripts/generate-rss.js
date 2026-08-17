import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, "../src/content/blog");
const BASE_URL = "https://noahseeger.de";

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
      value = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^["']|["']$/g, ""));
    } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if (!Number.isNaN(Number(value)) && value !== "") {
      value = Number(value);
    }
    data[key] = value;
  }

  return { data, content: raw.slice(match[0].length).trim() };
}

function markdownToHtml(content) {
  return renderToStaticMarkup(
    React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, content)
  );
}

function generateRSS(posts) {
  const items = posts.map((post) => {
    const link = `${BASE_URL}/blog/${post.slug}`;
    const description = post.description ? `<description><![CDATA[${post.description}]]></description>` : "";
    const content = `<content:encoded><![CDATA[${markdownToHtml(post.content)}]]></content:encoded>`;
    return `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    ${description}
    ${content}
    <pubDate>${new Date(post.pubDatetime).toUTCString()}</pubDate>
  </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>Noah Seeger</title>
<description>Blog posts about software development, AI, and technology.</description>
<link>${BASE_URL}</link>
<link rel="alternate" type="text/html" href="${BASE_URL}/blog"/>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;
}

const posts = fs.readdirSync(BLOG_DIR)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const { data, content } = parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, file), "utf-8"));
    return { slug: file.replace(".md", ""), ...data, content };
  })
  .filter((post) => !post.draft)
  .sort((a, b) => new Date(b.pubDatetime) - new Date(a.pubDatetime));

const distDir = path.join(__dirname, "../dist");
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "rss.xml"), generateRSS(posts));
console.log(`Generated rss.xml with ${posts.length} posts`);

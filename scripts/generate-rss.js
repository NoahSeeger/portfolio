import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, "../src/content/blog");
const BASE_URL = "https://noahseeger.de";

function parseFrontmatter(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return { data: {}, content: raw };

  const data = {};
  const lines = fmMatch[1].split(/\r?\n/);

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if (!isNaN(value) && value !== "") {
      value = Number(value);
    }

    data[key] = value;
  }

  const content = raw.slice(fmMatch[0].length).trim();
  return { data, content };
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function markdownToHtml(content) {
  // Simple markdown to HTML conversion
  // Handles: headings, bold, italic, links, images, code blocks, paragraphs, lists, blockquotes
  let html = content;

  // Code blocks (must be before inline code)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");

  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr />");

  // Paragraphs - split by double newlines
  html = html
    .split(/\n\n+/)
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (
        block.startsWith("<h") ||
        block.startsWith("<ul") ||
        block.startsWith("<ol") ||
        block.startsWith("<pre") ||
        block.startsWith("<blockquote") ||
        block.startsWith("<hr")
      ) {
        return block;
      }
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

function generateRSS(posts) {
  const items = posts
    .map((post) => {
      const link = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.pubDatetime).toUTCString();
      const description = post.description
        ? `<description><![CDATA[${post.description}]]></description>`
        : "";
      const contentHtml = markdownToHtml(post.content);
      const contentEncoded = `<content:encoded><![CDATA[${contentHtml}]]></content:encoded>`;

      return `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    ${description}
    ${contentEncoded}
    <pubDate>${pubDate}</pubDate>
  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>Noah Seeger</title>
<description>Blog posts about software development, AI, and technology.</description>
<link>${BASE_URL}</link>
<link rel="alternate" type="text/html" href="${BASE_URL}/blog"/>
${items}
</channel>
</rss>`;
}

function getAllPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = parseFrontmatter(raw);
      const slug = file.replace(".md", "");

      return {
        slug,
        ...data,
        content,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.pubDatetime) - new Date(a.pubDatetime));
}

const posts = getAllPosts();
const rss = generateRSS(posts);
const distDir = path.join(__dirname, "../dist");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, "rss.xml"), rss);
console.log(`Generated rss.xml with ${posts.length} posts`);

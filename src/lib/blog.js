import ReactMarkdown from "react-markdown";

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

    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""));
    } else if (!isNaN(value) && value !== "") {
      value = Number(value);
    } else if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }

    data[key] = value;
  }

  const content = raw.slice(fmMatch[0].length).trim();
  return { data, content };
}

export function getAllPosts() {
  const posts = import.meta.glob("/src/content/blog/*.md", { eager: true, query: "?raw", import: "default" });

  return Object.entries(posts)
    .map(([path, post]) => {
      const { data, content } = parseFrontmatter(post);
      const slug = path.split("/").pop().replace(".md", "");

      return {
        slug,
        ...data,
        content,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.pubDatetime) - new Date(a.pubDatetime));
}

export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export function formatDate(dateString, locale = "de") {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateString, locale = "en") {
  const date = new Date(dateString);
  const month = date.toLocaleDateString(locale, { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

export function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export function groupPostsByYearMonth(posts) {
  const grouped = {};

  for (const post of posts) {
    const date = new Date(post.pubDatetime);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(post);
  }

  return grouped;
}
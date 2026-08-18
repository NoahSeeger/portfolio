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
    } else if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    } else if (!isNaN(value) && value !== "") {
      value = Number(value);
    }

    data[key] = value;
  }

  const content = raw.slice(fmMatch[0].length).trim();
  return { data, content };
}

const publishedModules = import.meta.glob("/src/content/blog/published/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Drafts are useful during local writing, but they should not be part of the
// production JavaScript bundle or discoverable through its source.
const draftModules = import.meta.env.DEV
  ? import.meta.glob("/src/content/blog/drafts/*.md", { eager: true, query: "?raw", import: "default" })
  : {};

const postModules = { ...publishedModules, ...draftModules };

const parsedPosts = Object.entries(postModules)
  .map(([filePath, rawPost]) => {
    const { data, content } = parseFrontmatter(rawPost);
    const slug = filePath.split("/").pop().replace(".md", "");

    return {
      slug,
      ...data,
      content,
    };
  })
  .sort((a, b) => new Date(b.pubDatetime) - new Date(a.pubDatetime));

function isVisiblePost(post) {
  if (import.meta.env.DEV) return true;
  if (post.draft) return false;

  const publicationTime = new Date(post.pubDatetime).getTime();
  return Number.isNaN(publicationTime) || publicationTime <= Date.now();
}

// Parsing the markdown once keeps the home page, blog and search route from
// repeating the same work on every render.
const visiblePosts = parsedPosts.filter(isVisiblePost);

export function getAllPosts() {
  return visiblePosts;
}

export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export function formatDateShort(dateString, locale = "en") {
  const date = new Date(dateString);
  const month = date.toLocaleDateString(locale, { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

export function formatMonth(monthIndex, locale = "en") {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(2026, monthIndex, 1)
  );
}

export function calculateReadTime(content) {
  if (!content?.trim()) return 0;
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

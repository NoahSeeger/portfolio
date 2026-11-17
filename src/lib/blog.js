import posts, { loaders } from "virtual:blog/index";

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function loadPostContent(slug) {
  const load = Object.hasOwn(loaders, slug) ? loaders[slug] : null;
  return load ? load() : Promise.reject(new Error("Post not found"));
}

export function formatDateShort(dateString, locale = "en") {
  const date = new Date(dateString);
  const month = date.toLocaleDateString(locale, { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

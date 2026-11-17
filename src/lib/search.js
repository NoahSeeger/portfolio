// Keep search independent of the Markdown renderer and its browser bundle.
export function plainText(markdown = "") {
  return markdown
    .replace(/```[^\n]*\n|```|~~~[^\n]*\n|~~~/g, " ")
    .replace(/!?(\[([^\]]*)\])\([^)]*\)/g, "$2")
    .replace(/^\s*\[[^\]]+\]:.*$/gm, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s*|[-*+]\s+)/gm, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ").trim();
}

export function queryTerms(query) {
  return [...new Set(query.trim().toLowerCase().split(/\s+/).filter(Boolean))];
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightParts(text, query) {
  const terms = queryTerms(query).sort((a, b) => b.length - a.length);
  if (!terms.length) return [{ text, match: false }];
  return text.split(new RegExp(`(${terms.map(escapeRegex).join("|")})`, "gi"))
    .filter((part) => part !== "")
    .map((part) => ({ text: part, match: terms.some((term) => term === part.toLowerCase()) }));
}

export function createSearchIndex(posts) {
  return posts.map((post) => {
    const body = plainText(post.content);
    return { post, body, title: post.title.toLowerCase(), description: post.description.toLowerCase(), text: body.toLowerCase() };
  });
}

function excerpt(text, terms, radius = 100) {
  const lower = text.toLowerCase();
  const positions = terms.map((term) => lower.indexOf(term)).filter((index) => index >= 0);
  const first = positions.length ? Math.min(...positions) : 0;
  let start = Math.max(0, first - radius);
  let end = Math.min(text.length, first + radius);
  // Clip at word boundaries rather than cutting words in half.
  if (start > 0) { const space = text.lastIndexOf(" ", start); if (space >= 0) start = space + 1; }
  if (end < text.length) { const space = text.indexOf(" ", end); if (space >= 0) end = space; }
  return `${start ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

export function searchNotes(index, query) {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  const phrase = terms.join(" ");
  return index.flatMap((entry) => {
    const { post, title, description, text, body } = entry;
    if (!terms.every((term) => title.includes(term) || description.includes(term) || text.includes(term))) return [];
    const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 12 : 0) + (description.includes(term) ? 4 : 0) + (text.includes(term) ? 1 : 0), 0)
      + (title === phrase ? 100 : title.includes(phrase) ? 20 : 0);
    const bodyOnlyMatch = terms.some((term) => !description.includes(term) && text.includes(term));
    return [{ post, score, snippet: bodyOnlyMatch ? excerpt(body, terms) : excerpt(post.description || body, terms) }];
  }).sort((a, b) => b.score - a.score || Date.parse(b.post.pubDatetime) - Date.parse(a.post.pubDatetime));
}

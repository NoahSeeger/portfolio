import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const shell = (element, route = "/blog") => React.createElement(HelmetProvider, null, React.createElement(MemoryRouter, { initialEntries: [route] }, element));

test("unified notes show the latest three entries and keep article navigation and Markdown semantics", async () => {
  const server = await createServer({ root, logLevel: "silent", server: { middlewareMode: true } });
  try {
    await server.ssrLoadModule("/src/i18n.js");
    const { BlogIndex } = await server.ssrLoadModule("/src/pages/BlogIndex.jsx");
    const listing = renderToString(shell(React.createElement(BlogIndex), "/blog?category=project"));
    assert.match(listing, /<h1>Notes<\/h1>/);
    assert.ok(!listing.includes("reading-topbar"), "notes have no duplicate sticky back bar");
    assert.match(listing, /href="\/blog\/picswipe"/);
    assert.match(listing, /href="\/rss.xml"/);
    assert.equal((listing.match(/class="note-preview-paper note-preview-paper-image"/g) || []).length, 3, "notes with local covers show thumbnails in the index");
    assert.ok(listing.includes('loading="lazy"'), "closed cover thumbnails load lazily");
    assert.ok(listing.includes("CC1101 und ein kleines Funk-Gadget"), "legacy category URLs must show the unified notes index");
    const { default: Hero } = await server.ssrLoadModule("/src/components/Hero.jsx");
    const home = renderToString(shell(React.createElement(Hero), "/"));
    assert.match(home, /href="https:\/\/picswipe.noahseeger.de"/);
    assert.match(home, /href="https:\/\/apps.apple.com\/app\/id6753695596"/);
    assert.match(home, /href="https:\/\/apps.apple.com\/app\/id6753290752"/);
    assert.equal((home.match(/class="inline-app-chip /g) || []).length, 3);
    assert.ok(!home.includes("<iframe") && !home.includes('aria-haspopup="dialog"'), "app links navigate directly without live-preview controls");
    const notes = home.slice(home.indexOf('id="notes"'), home.indexOf('</section>', home.indexOf('id="notes"')));
    assert.match(notes, /Notes/);
    assert.match(notes, /View all/);
    assert.equal((notes.match(/href="\/blog\//g) || []).length, 3);
    assert.ok(!notes.includes("<img"), "note previews must not download cover images");
    assert.ok(!notes.includes("DRAFT"));
    const { SiteFooter } = await server.ssrLoadModule("/src/components/SiteFooter.jsx");
    const footer = renderToString(shell(React.createElement(SiteFooter), "/"));
    assert.match(footer, /SEEGER/);
    assert.ok(!footer.includes("©"), "footer omits the optional copyright notice");
    assert.ok(!footer.includes('href="/blog"'), "footer avoids repeating the notes navigation");
    assert.ok(!footer.includes("<a "), "footer is only the decorative wordmark");
    assert.ok(!footer.includes("mailto:"), "email remains in the contact dock, not duplicated in the footer");
    assert.ok(!footer.includes("A small place") && !footer.includes("Made with curiosity"));
    const noteLinks = [...notes.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map((match) => match[0]);
    assert.ok(noteLinks.every((link) => !link.includes("note-preview-expanded")), "expanded cards must not become part of the link hitbox");
    const { SearchPage } = await server.ssrLoadModule("/src/pages/Search.jsx");
    const search = renderToString(shell(React.createElement(SearchPage), "/search?q=bruno"));
    assert.match(search, /href="\/blog\/bruno"/);
    assert.match(search, /<mark>Bruno<\/mark>/);
    assert.equal((search.match(/class="search-clear"/g) || []).length, 1);
    assert.ok(!search.includes("reading-topbar"), "search uses the shared corner navigation");
    assert.ok(!search.includes("background-color:var(--accent)"), "search marks inherit readable theme colors");
    const { PortfolioDock } = await server.ssrLoadModule("/src/components/PortfolioDock.jsx");
    for (const [route, destination] of [["/blog", "/"], ["/blog/picswipe", "/blog"], ["/search", "/blog"]]) {
      const dock = renderToString(shell(React.createElement(PortfolioDock), route));
      const navigation = dock.slice(0, dock.indexOf("</nav>") + 6);
      assert.match(navigation, /right-5 top-5/);
      assert.ok(!navigation.includes("portfolio-reading-nav"));
      assert.ok(navigation.includes(`href="${destination}"`));
      assert.equal((navigation.match(/<button/g) || []).length, 2);
      assert.equal((navigation.match(/<a /g) || []).length, 1);
    }
    const { NotePreview } = await server.ssrLoadModule("/src/components/PostList.jsx");
    const previewPost = { title: "Preview title", description: "Preview description", heroImage: "/img/projects/picswipe.webp" };
    const closedPreview = renderToString(React.createElement(NotePreview, { post: previewPost, expanded: false }));
    assert.ok(!closedPreview.includes("<img"), "closed previews must not request images");
    const expandedPreview = renderToString(React.createElement(NotePreview, { post: previewPost, expanded: true }));
    assert.match(expandedPreview, /src="\/img\/projects\/picswipe.webp"/);
    assert.match(expandedPreview, /Preview title/);
    assert.match(expandedPreview, /Preview description/);
    assert.match(expandedPreview, /inert=""/);
    const textPreview = renderToString(React.createElement(NotePreview, { post: { ...previewPost, heroImage: undefined }, expanded: true }));
    assert.ok(!textPreview.includes("<img"));
    assert.match(textPreview, /Preview description/);
    const { getPostBySlug } = await server.ssrLoadModule("/src/lib/blog.js");
    const { BlogPost } = await server.ssrLoadModule("/src/pages/Blog.jsx");
    const post = { ...getPostBySlug("picswipe"), content: "## Test section\n\n[Website](https://picswipe.noahseeger.de) and [Source](https://github.com/NoahSeeger/PicSwipe)\n\nSome **strong** and *italic* text.\n\n```unknown\nplain code\n```\n\n| Column | Value |\n| --- | --- |\n| a | b |\n\n- [x] Checked task\n- [ ] Open task\n\n> A quote\n\n~~Removed~~\n\n1. First item\n2. Second item\n\n![Diagram](/img/projects/picswipe.webp)\n\n---\n\n### Subsection\n\nInline `value`" };
    const article = renderToString(shell(React.createElement(BlogPost, { post }), "/blog/picswipe"));
    assert.match(article, /PicSwipe - iOS Gallery Sorter/);
    assert.match(article, /href="\/blog"/);
    assert.ok(!article.includes("reading-topbar"), "articles have no duplicate sticky back bar");
    assert.match(article, /href="https:\/\/picswipe.noahseeger.de"/);
    assert.match(article, /<h2>Test section<\/h2>/);
    assert.match(article, /<strong>strong<\/strong>/);
    assert.match(article, /<em>italic<\/em>/);
    assert.match(article, /<table>/);
    assert.match(article, /<blockquote>/);
    assert.match(article, /<del>Removed<\/del>/);
    assert.match(article, /<ol>/);
    assert.match(article, /alt="Diagram"/);
    const checkboxes = article.match(/<input[^>]*type="checkbox"[^>]*>/g) || [];
    assert.equal(checkboxes.length, 2);
    assert.ok(checkboxes.every((checkbox) => checkbox.includes("disabled")), "Markdown tasks are read-only");
    assert.match(article, /plain code/);
    assert.ok(!/<pre[^>]*>\s*<pre/.test(article));
    assert.match(article, /More notes/);
    assert.match(article, /href="https:\/\/github.com\/NoahSeeger\/PicSwipe"/);
    assert.ok(!article.includes("reading-links"), "links belong in Markdown, without a special header block");
    assert.ok(!article.includes("reading-topics"), "article tags are not rendered");
    assert.ok(!article.includes("reading-progress"), "the decorative progress bar is removed");
    assert.ok(!article.includes("category=project"), "articles share one notes navigation");
    assert.match(article, /data-reading-reveal=""/);
    assert.ok(!article.includes('href="/blog/picswipe"'), "related articles must not link to the current article");
  } finally { await server.close(); }
});

test("app palettes keep text contrast across their light and dark gradients", async () => {
  const luminance = (hex) => hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255)
    .map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  const contrast = (a, b) => { const values = [luminance(a), luminance(b)].sort((x, y) => x - y); return (values[1] + 0.05) / (values[0] + 0.05); };
  const server = await createServer({ root, logLevel: "silent", server: { middlewareMode: true } });
  try {
    const { featuredApps } = await server.ssrLoadModule("/src/content/apps.js");
    for (const app of featuredApps) for (const [mode, palette] of Object.entries(app.palette)) {
      for (let step = 0; step <= 20; step += 1) {
        const channels = [1, 3, 5].map((i) => Math.round(parseInt(palette.start.slice(i, i + 2), 16) * (1 - step / 20) + parseInt(palette.end.slice(i, i + 2), 16) * step / 20));
        const color = "#" + channels.map((value) => value.toString(16).padStart(2, "0")).join("");
        assert.ok(contrast(palette.ink, color) >= 4.5, `${app.id} ${mode}: insufficient text contrast`);
      }
    }
  } finally { await server.close(); }
});

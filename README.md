# Personal Portfolio Website

## Setup

```bash
npm install
```

Use Node 24 (see `.nvmrc`). For a reproducible install from the committed
lockfile, use `npm ci`, including development and optional dependencies.
Sharp and the platform-specific ExifTool are supplied by npm; a separate
Homebrew ExifTool installation is not needed. Unix build runners need Perl
(macOS and standard Netlify Linux build images provide it).

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

The Vite blog plugin creates `dist/rss.xml` and `dist/sitemap.xml` from the
same validated content snapshot as the website. Set `SITE_URL`
when building for another domain; it defaults to `https://noahseeger.de`.

## Content

The interface uses `src/assets/fonts/Inter-Variable.woff2` for all normal
weights (100–900). Blog articles use Source Serif 4, with normal and italic
faces loaded through the article stylesheet. Vite fingerprints these files;
only Inter is preloaded on the homepage.

The blog index, article renderer and syntax highlighter are separate chunks.
The highlighter loads only when an article contains a supported fenced code
block. Images use lossless WebP; old public project-image URLs redirect to
their WebP equivalents on Netlify.

Published posts live in `src/content/blog/published/`. Work-in-progress posts
belong in `src/content/blog/drafts/`; folder membership always makes them drafts,
even if frontmatter says `draft: false`. `npm run dev` previews drafts and
scheduled posts. Every production build excludes draft-folder posts, posts with
`draft: true`, and posts whose publication timestamp is later than build start.
This also applies to builds using `--mode development`.

The homepage and blog index receive metadata and a precomputed reading time.
Article bodies load on demand; article renderer and text download in parallel.
Full-text search loads searchable bodies only when opening the search route.

`scripts/lib/blog-content.js` is the shared YAML parser and validator for the
website, RSS and sitemap. Missing title/description, invalid timestamps or field
types, duplicate YAML keys and duplicate slugs stop the build. `yaml` is a
build-time dependency and is not shipped to visitors.

Netlify publishes only `dist` with this repository's configuration. Versioned
drafts still exist in its build checkout, but are not emitted into `dist`.
Everything placed in `public` is published after image sanitization, including
images referenced only by a draft; do not place private media there. A public Git repository also
exposes its source independently of the deployed website.

Publication dates are evaluated at build time: a scheduled post needs a new
build after its date passes. It does not appear automatically on an unchanged
static deployment.

Run the checks before committing:

```bash
npm run lint
npm test
```

## Automatic image pipeline

`npm run build` and direct `vite build` calls automatically run
`scripts/media-plugin.js`. No separate preparation command is needed.

- Imported raster images (including CSS `url(...)`) and files under `public`
  are processed as build copies. Original source files are never rewritten.
- Still PNG/JPEG/TIFF content images are offered a lossless WebP conversion,
  with orientation applied and a maximum dimension of 1920 px, without upscaling.
  The WebP is used only if it is smaller. High-bit-depth and animated files are
  not flattened or reduced to 8-bit WebP. Existing WebP is never re-encoded.
- `public/img` is for content images and gets this conversion policy. Other
  public images, especially favicons and app icons, retain formats and URLs.
- Embedded metadata is inspected with bundled ExifTool. Unapproved fields are
  removed from copies; ICC/color information, orientation and essential format
  information are retained. Unknown/unremovable metadata or tool failures stop
  the build rather than silently publishing unchecked output.
- All emitted raster image files in the actual output directory are checked
  again after writing, including cached files and assets emitted by other plugins.
- Cache: `node_modules/.cache/portfolio-media`, ignored through `node_modules`.
  Keys include source bytes, extension, conversion settings, policy version and
  tool versions. Corrupt cache payloads are regenerated. Removing the cache is
  safe; every image will simply be processed again. If a runner restores no
  cache, the build remains correct and performs a fresh preparation.
- Converted public URLs are updated in application modules, HTML, CSS and
  generated XML. Their former URLs receive generated `_redirects` entries for
  Netlify. Keep manually maintained redirect rules in `netlify.toml`.
- Symlinks and obvious backup/source files in `public` fail the build. Identical
  output filenames after conversion also fail with an actionable error.

The pipeline handles raster files; SVG vectors remain vectors. It is not a
scraping/download blocker. It cannot remove identifying information visible
in image pixels or promise detection of deliberately hidden data.

`npm run dev` remains fast and shows original local images. Test the production
output with the normal `npm run build` and `npm run preview` workflow.

`npm run strip-exif` remains an explicit maintenance command that rewrites
source images. It is not required for deployment or called by the build.

## Repository housekeeping

Keep `src`, `public`, `scripts`, configuration files and `package-lock.json`.
`node_modules` contains installed dependencies and `dist` contains generated
build output; both are ignored by Git and can be recreated with `npm ci`
and `npm run build`. Neither directory is source code.

`.agtx`, `.rambler` and `.playwright-mcp` are local tool data and are ignored.
Before removing Rambler data, stop its project daemon, preserve any work and
remove registered worktrees with `git worktree remove`; deleting their folders
alone leaves stale Git registrations. Local VS Code settings can remain.

## Notes interface

The homepage shows the three newest published notes across all content types.
`/blog` is one notes index; old category query parameters no longer filter it.
There are no tags, categories or featured flags. Notes and projects use the same
simple Markdown format; links are authored directly in the body.

`PostList` uses metadata-only document thumbnails and a shared 300ms hover tilt.
It has no visibility observer or entry animation of its own. Only the first
homepage intro animates the Notes section, using the hero's unfolding keyframes,
duration, easing, stagger and reveal phase. Other routes keep lists static;
the article body retains its own scroll-triggered blur effect. Hovering a
note row (or focusing its link with a keyboard) opens a 200px preview anchored
to the right edge of the list item. First hover waits 350ms; switching within
300ms of leaving an open row is immediate. The overlay is inert and ignores
pointer events, so it never changes or blocks the row hitboxes. The front opens
in 350ms with a critically damped curve; the rear sheet moves down 8px over
450ms after an 80ms delay. The optional image loads on first opening and stays
mounted for a smooth exit. No article renderer or full Markdown is loaded.
The preview stays inside the viewport vertically and closes on Escape, scrolling,
resize or row leave. Reduced motion disables scaling; touch taps navigate
directly. A failed image falls back to a text-only preview.

Article layout is capped at 38rem, with a 30–32px Source Serif 4 title and 16px
Inter body. The existing Markdown pipeline groups content at main headings;
one IntersectionObserver reveals each section once with a 550ms blur/fade.
A second observer fades out the decorative viewport-edge gradient near the
end of the article. It cannot capture pointer input. There are no per-scroll
state updates or progress-bar handlers. Reduced motion keeps all content
visible and disables entry/hover transforms. No animation library is needed.

Hero, notes and article columns share the `--content-width`
token (38rem / 608px). Responsive horizontal gutters are controlled centrally
by `--page-gutter`; the decorative footer wordmark uses the same column.

## Homepage footer

The homepage footer uses the same maximum 38rem column and responsive gutters
as the main content. Its Inter wordmark scales down on mobile and is capped at
11rem font size on desktop. The
wordmark is clipped at the bottom and hidden from assistive technology. It is
the only footer content; there is no divider, copyright row or product navigation.
Notes and email remain available through the notes section and contact dock. The
contact dock lifts above the wordmark while it is in view, using one
IntersectionObserver and a CSS transition; no per-scroll updates are needed.
Other routes keep their normal bottom spacing and navigation.

## RSS Feed

An RSS feed is automatically generated at `/rss.xml` during build. Generation
runs once in Vite, not in visitors' browsers or on every request. Full Markdown
is rendered into the feed, relative links are resolved against the article URL,
and XML/CDATA are escaped. RSS and sitemap exclude drafts, scheduled posts and
archived posts. Archived articles themselves remain accessible through their
article URLs. The standalone `node scripts/generate-rss.js` command remains
available for regenerating both documents from the same parser.

## Blog post metadata

Posts use YAML frontmatter. Timestamps must include a timezone. `draft: true` excludes a post from production and RSS
(but keeps it visible during local development). Archived projects stay
available as context, are included in notes search and are omitted from the current
project highlights, RSS feed and sitemap:

```md
pubDatetime: 2026-08-05T10:00:00+02:00
updatedDatetime: 2026-08-12T10:00:00+02:00 # optional
status: "archived" # optional
draft: false
```

## Notes search

Search uses a route-local index of all visible notes, including archived entries.
Drafts and future posts remain excluded from production by the content pipeline.
All query words must occur, with title matches ranked above description and body
matches. Markdown is reduced to readable text once when the route loads; results
show a single contextual excerpt. Search hits and native text selection share one
CSS definition: pastel blue background, dark blue text and a blue wavy underline.

The search input has one clear button. Escape clears a nonempty query first,
then returns to Notes. URL updates replace history entries, so typing does not
fill the browser history; Back/Forward restore the query. Clearing returns focus
to the input. The layout uses the shared reading column and Notes typography.

The homepage intro plays only when the document opens directly on Home. Internal
navigation back from notes or search skips the intro and content entry animations,
even if an earlier visit left Home before the intro finished. Reloading Home starts
the intro again; no cookies or session storage are needed.

Frontmatter validation rejects unknown fields (including removed fields and
misspelled `draft`), invalid timestamps, update dates before publication, and
invalid cover paths. `heroImage` supports root-relative paths or absolute
HTTP(S) URLs without credentials. These checks validate URL format, not the
availability of external websites.

Minimal note frontmatter:

```yaml
---
title: "A note"
description: "A short summary."
pubDatetime: 2026-11-17T12:00:00+01:00
draft: true
---
```

For private writing, put the file in `src/content/blog/drafts/`. To publish,
move it into `published/`, remove `draft: true` (or set `false`) and set a
publication date that has arrived. Publication is decided at build time; a
scheduled note needs a new build after its date. Optional fields are
`updatedDatetime`, `heroImage` and `status`.
`status: archived` keeps a note readable and searchable but marks it noindex
and excludes it from RSS and sitemap. Root-relative page links in Markdown use
client navigation; links to static files, fragments and external sites stay native.

Links belong directly in the Markdown body, wherever they make sense:

```markdown
[Website](https://example.com)
[Source code](https://github.com/example/project)
[Another note](/blog/example)
```

There are no special GitHub or website fields, automatic link buttons or RSS
categories. Existing project links remain in the articles' Links sections.

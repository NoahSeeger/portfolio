# Noah Seeger — Portfolio

Personal portfolio, apps and notes. Built as a static site and hosted on Netlify.

## Stack & highlights

- **React 19, Vite 8, Tailwind CSS 3 and React Router**.
- **Markdown + YAML frontmatter**, rendered with React Markdown and GFM. The index
  loads metadata; article bodies, search and syntax highlighting load on demand.
- **Lightweight note previews:** local covers get automatic, cached 144px WebP
  thumbnails for All Notes. Images load lazily; notes without a cover use a text miniature.
- **Custom SVG wordmark intro:** the collapsed name unfolds through masks and
  transforms, synchronized with text reveals. Internal return visits skip it;
  article scroll effects use IntersectionObserver instead of per-scroll React updates.
- **Native SVG cursors** pick up app gradients on hover. Theme switching uses
  a native circular View Transition. Reduced motion and unsupported browsers switch directly.
- **Light/dark themes**, following the system until a choice is saved. Self-hosted
  **Inter Variable** and **Source Serif 4**, with versioned asset filenames.
- **Sharp + ExifTool privacy pipeline:** build copies lose GPS, camera and author
  metadata while retaining needed image information. Sources stay untouched;
  content hashes reuse cached results. Images are audited before publication,
  and failed cleanup/checks stop the build. Lossless WebP is used when smaller.

## Local development

Use **Node 24** (`.nvmrc`). Image tools are installed through npm; Unix runners need Perl.

```sh
nvm use
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run build` | Generate the production site in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check code quality |
| `npm test` | Run the Node test suite |

## Writing notes

Drafts live in `src/content/blog/drafts/`, published notes in `src/content/blog/published/`.

```markdown
---
title: "A note"
description: "A short summary."
pubDatetime: 2026-11-18T12:00:00+01:00
draft: true
---

Write here. Add links directly: [Website](https://example.com).
```

To publish, move the file to `published/`, remove `draft: true` or set it to `false`,
and use a publication date that has arrived. Dates require a timezone.

- Optional fields: `heroImage`, `updatedDatetime` and `status: archived`.
- Development previews drafts and future posts. Production excludes both;
  future posts need another build after their publication date.
- Archived notes remain readable and searchable, but are marked noindex and omitted from RSS/sitemap.
- Invalid frontmatter stops the build. App links and colors live in `src/content/apps.js`.

## Markdown features

Headings, **bold**, *italic*, strikethrough, links, images, blockquotes, numbered
and bulleted lists, task lists (`- [x]`), tables, horizontal rules and inline code.
Supported fenced code languages get syntax highlighting and a copy button;
task checkboxes are read-only. Raw HTML is not executed. See the [Markdown showcase](src/content/blog/drafts/markdown-feature-showcase.md) for examples.

## Deployment

Netlify runs `npm run build` and publishes **only `dist/`**. Tests are a separate check.
The build generates `/rss.xml` and `/sitemap.xml`; `SITE_URL` defaults to `https://noahseeger.de`.

Imported raster images and images in `public/` are processed automatically without
rewriting originals. Existing WebP is not re-encoded. `npm run strip-exif` is an
optional maintenance command that **does** rewrite source images.

Everything in `public/` is published, including unused assets: keep private files out.
Draft exclusion does not hide source files in a public Git repository.

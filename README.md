# Noah Seeger — Portfolio

Personal portfolio, apps and notes. Built as a static site and hosted on Netlify.

## Stack & highlights

- **React 19, Vite 8, Tailwind CSS 3 and React Router**.
- **Markdown + YAML frontmatter**, rendered with React Markdown and GFM. Articles,
  search and syntax highlighting load on demand. Lightweight note previews use
  metadata and cover images; opening one never downloads the full article.
- **Custom SVG wordmark intro**, CSS text reveals and scroll-triggered reading
  effects using IntersectionObserver. The intro is skipped on internal return visits.
- **Native SVG cursors** pick up app gradients on hover. Theme switching uses
  View Transitions where supported; reduced motion and direct-switch fallbacks are respected.
- **Light/dark themes**, following the system until a choice is saved. Self-hosted
  **Inter Variable** and **Source Serif 4**, with versioned asset filenames.
- **Sharp + ExifTool** for automatic image optimization, metadata cleanup and
  cached build copies. Lossless WebP is used when smaller; failed image checks stop the build.

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

## Deployment

Netlify runs `npm run build` and publishes **only `dist/`**. Tests are a separate check.
The build generates `/rss.xml` and `/sitemap.xml`; `SITE_URL` defaults to `https://noahseeger.de`.

Imported raster images and images in `public/` are processed automatically without
rewriting originals. Existing WebP is not re-encoded. `npm run strip-exif` is an
optional maintenance command that **does** rewrite source images.

Everything in `public/` is published, including unused assets: keep private files out.
Draft exclusion does not hide source files in a public Git repository.

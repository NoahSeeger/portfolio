# Personal Portfolio Website

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

The build also creates `dist/rss.xml` and `dist/sitemap.xml`. Set `SITE_URL`
when building for another domain; it defaults to `https://noahseeger.de`.

## Content

Published posts live in `src/content/blog/published/`. Work-in-progress posts
belong in `src/content/blog/drafts/`; drafts are available in development but
are excluded from the production JavaScript bundle, RSS feed and sitemap.

Run the checks before committing:

```bash
npm run lint
```

## Optional: EXIF Stripping

Images in `src/assets` and `public` may contain EXIF metadata (GPS, camera info, timestamps).

To remove all EXIF data from images before committing:

```bash
npm run strip-exif
```

This is optional but recommended for privacy (prevents leaking location data, camera serial numbers, etc.).

Requires `exiftool` to be installed:

```bash
brew install exiftool
```

## RSS Feed

An RSS feed is automatically generated at `/rss.xml` during build.

## Blog post metadata

Posts use frontmatter. `draft: true` excludes a post from production and RSS
(but keeps it visible during local development). Archived projects stay
available as context, are hidden from search and are omitted from the current
project highlights, RSS feed and sitemap:

```md
pubDatetime: 2026-08-05T10:00:00+02:00
updatedDatetime: 2026-08-12T10:00:00+02:00 # optional
status: "archived" # optional
draft: false
```

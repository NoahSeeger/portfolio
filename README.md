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
available as context but are omitted from the current project highlights:

```md
pubDatetime: 2026-08-05T10:00:00+02:00
updatedDatetime: 2026-08-12T10:00:00+02:00 # optional
status: "archived" # optional
draft: false
```

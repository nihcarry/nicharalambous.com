# Architecture

High-level overview of how nicharalambous.com is built and how data flows. For build and deploy details see [BUILD.md](BUILD.md) and [DEPLOY.md](DEPLOY.md).

## High-level

- **Next.js 15** with `output: "export"` — fully static site. No Node server at runtime, no ISR, no API routes that run in production.
- **Content** comes from **Sanity CMS**. All data is fetched at **build time** via GROQ; the built `out/` tree is plain HTML, JS, and assets.
- **Hosting**: static files are deployed to **S3** and served via **CloudFront**.

Sanity Studio is embedded in the app at `/studio` and runs client-side only; it is not part of the static export.

## Data flow

1. **Build** (`npm run build`): Next.js runs each page. Page components call `client.fetch(...)` from `lib/sanity/client.ts`.
2. **Sanity client** uses native `fetch()` against Sanity’s API (CDN in production). Queries are GROQ strings defined in `lib/sanity/queries.ts`.
3. **Result**: Each route is rendered to static HTML (and associated JS/CSS) and written under `out/`.
4. **Runtime**: No server. The browser loads HTML and JS; no further Sanity (or other) API calls for page content.

**Critical**: In production build, the Sanity client **must** use `cache: "force-cache"` so Next.js treats the request as cacheable and allows static export. See `lib/sanity/client.ts`. Using `no-store` or `no-cache` would force dynamic rendering and break static export.

## Route types

| Type | Examples | How routes are determined |
|------|----------|----------------------------|
| **Static** | `/`, `/about`, `/speaker`, `/blog`, `/keynotes`, `/books`, `/contact`, `/media` | One page file per route. |
| **Dynamic** | `/blog/[slug]`, `/archive/[slug]`, `/keynotes/[slug]`, `/books/[slug]`, `/topics/[slug]` | `generateStaticParams()` in the page fetches slugs from Sanity and returns `{ slug }[]`; Next.js pre-renders one page per slug. |
| **Studio** | `/studio`, `/studio/*` | Single client-side app; only root `/studio` is pre-rendered. |

Dynamic routes require at least one param set (e.g. one slug) for static export; the codebase uses fallback slugs when Sanity returns none.

## Content model (Sanity)

**Singletons** (one document per type, fixed IDs in Studio):

| Type | Document ID | Used for |
|------|-------------|----------|
| `siteSettings` | `siteSettings` | Global site config. |
| `speaker` | `speakerPage` | Speaker page (`/speaker`) — hero, why book Nic, FAQ, testimonials, etc. |
| `author` | `mainAuthor` | Default author for blog posts. |

**Documents** (many per type, listed in Studio):

| Type | Used for |
|------|----------|
| `post` | Blog posts. `contentStatus`: published → `/blog`, archived → `/archive`. Per-post **Most Popular** curates the blog listing hero block (up to 5). |
| `keynote` | Keynote pages `/keynotes/[slug]` and listing. |
| `topicHub` | Topic hubs `/topics/[slug]` and blog topic filters. |
| `book` | Book pages `/books/[slug]` and listing. |
| `testimonial` | Testimonials on speaker and keynote pages. |
| `mediaAppearance` | Media page content. |
| `business` | Businesses page. |
| `redirect` | Redirects (e.g. migration). |

Reusable schema objects: `seoFields`, `portableTextBody` (rich text).

## Key files

| File | Purpose |
|------|---------|
| `next.config.ts` | Sets `output: "export"`, `trailingSlash: false`, image config. |
| `lib/sanity/client.ts` | Sanity fetch wrapper; must use `force-cache` in production. |
| `lib/sanity/queries.ts` | All GROQ queries and TypeScript types for query results. |
| `lib/sanity/image.ts` | Image URL builder for Sanity assets. |
| `sanity/schemas/` | Document and singleton schemas; `sanity/schemas/index.ts` registers them. |
| `sanity/sanity.config.ts` | Studio config and structure (nav, document IDs). |
| `app/` | Next.js App Router: one directory per route; `generateStaticParams` in dynamic `[slug]` pages. |

## See also

- [BUILD.md](BUILD.md) — What the build does and how to verify it.
- [DEPLOY.md](DEPLOY.md) — CI and local deploy.
- [CONTENT-PAGES.md](CONTENT-PAGES.md) — Which content is CMS-driven vs code-driven.

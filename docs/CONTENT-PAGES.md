# Updating page content

How to change content depending on whether the page is **CMS-driven** (Sanity) or **code-driven** (React/TS in the repo).

## CMS-driven content (edit in Sanity Studio)

Content is stored in Sanity. Edit in **Sanity Studio** at **`/studio`**, then **Publish**. A webhook can trigger a deploy, or you run deploy manually. See [DEPLOY.md](DEPLOY.md).

| Page / area | Studio location | Notes |
|-------------|-----------------|--------|
| **Speaker** (`/speaker`) | **Speaker Page** (singleton) | Hero, why book Nic, how virtual works, FAQ, testimonials, client logos, CTA. Document ID: `speakerPage`. |
| **Keynotes** | **Keynotes** | Listing and each `/keynotes/[slug]` page. |
| **Books** | In Studio (books) | Listing and each `/books/[slug]` page. |
| **Topic hubs** | **Topic Hubs** | Each `/topics/[slug]` and blog topic filters. |
| **Blog listing** | **Blog Posts** | Which posts appear and in what order (by publish date). |
| **Most Popular (blog)** | **Blog Posts** → per-post field | Curated "Most Popular" block: in each post check **Most Popular** (and optionally **Featured Label**). Up to 5 published posts, by publish date. |
| **Testimonials** | Testimonials | Used on speaker and keynote pages. |
| **Site settings** | **Site Settings** (singleton) | Global settings. Document ID: `siteSettings`. |
| **Author** | **Author** (singleton) | Default author for posts. Document ID: `mainAuthor`. |

After changing any of these: Publish in Studio. Then either let the webhook trigger a deploy or push to `main` / run the deploy workflow so the next build picks up the new content.

## Code-driven content (edit in the repo)

Content is hardcoded or derived in React/TS. Edit the relevant file(s), then commit, push (CI deploys), or do a local deploy and then commit and push.

| Page / area | File(s) | Notes |
|-------------|---------|--------|
| **About** (`/about`) | `app/about/page.tsx` | Bio, pillars, “As Featured In”, books teaser, CTA. |
| **Homepage** (`/`) | `app/page.tsx` | Layout and structure. Some data (e.g. keynotes, “as seen at”) still comes from Sanity; copy and structure are in code. |
| **Contact** | `app/contact/page.tsx` | Form and copy. |
| **Footer / global** | Components and layout under `app/` | Depends on implementation; check `app/layout.tsx` and shared components. |

After code changes: commit and push (CI will build and deploy), or run a local deploy and then **always** commit and push so the repo matches production (see [DEPLOY.md](DEPLOY.md)).

## Summary

- **CMS-driven** → Sanity Studio → Publish → deploy (webhook or manual).
- **Code-driven** → Edit files in repo → commit & push (or local deploy then commit & push).

## See also

- [CONTENT-BLOG.md](CONTENT-BLOG.md) — Blog posts and publishing from Sanity or Cursor.
- [ARCHITECTURE.md](ARCHITECTURE.md) — Content model (singletons vs documents).
- [DEPLOY.md](DEPLOY.md) — How deploys work.

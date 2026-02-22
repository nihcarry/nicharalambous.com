# nicharalambous.com

Static personal site and blog for Nic Haralambous. Built with Next.js 15 (static export), content from Sanity CMS at build time, deployed to S3 and served via CloudFront. No server runtime.

## Where to find things

| Location | Purpose |
|----------|---------|
| **`docs/`** | Project documentation: architecture, build, deploy, content workflows. Start at [docs/README.md](docs/README.md). |
| **`app/`** | Next.js pages and routes (e.g. `app/about/page.tsx`, `app/blog/[slug]/page.tsx`). |
| **`lib/`** | Sanity client, GROQ queries, metadata helpers (`lib/sanity/`, `lib/metadata.ts`). |
| **`sanity/`** | Sanity Studio config and schemas; Studio is embedded at `/studio`. |
| **`components/`** | Shared React components. |
| **`scripts/`** | Content pipeline (parse Medium/Substack, enrich, import to Sanity). |

## Quick commands

```bash
npm run dev      # Local dev server at http://localhost:3001
npm run build    # Static export → out/
npm run lint     # ESLint
```

**Full deploy** (local or CI): see [docs/DEPLOY.md](docs/DEPLOY.md).

## Documentation

Full doc set and index: **[docs/README.md](docs/README.md)** — architecture, build, deploy, blog publishing (Sanity vs Cursor), and how to update page content.

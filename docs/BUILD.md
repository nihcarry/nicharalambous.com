# Build

What happens when you run the build and how to verify it. For deployment see [DEPLOY.md](DEPLOY.md).

## What `npm run build` does

1. **Next.js build**: Compiles the app and runs all page components. Each page that needs data calls the Sanity client (`lib/sanity/client.ts`); those requests run at build time and their results are baked into the output.
2. **Static export**: Because `next.config.ts` sets `output: "export"`, Next.js writes a fully static site under `out/` — HTML, JS, CSS, and assets. No server bundle.
3. **Postbuild**: The `postbuild` script runs `next-sitemap`, which generates `sitemap*.xml` and `robots.txt` in `out/` based on the built routes.

So: **one command** (`npm run build`) produces the entire deployable tree in `out/`.

## Prerequisites

- **Environment**: A `.env.local` in the project root with at least:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` — your Sanity project ID (e.g. `lsivhm7f`).
  - `NEXT_PUBLIC_SANITY_DATASET` — dataset name (e.g. `production`).
- **Node**: Use a Node version compatible with the project (e.g. Node 20 for CI). See `package.json` engines or CI config if specified.

Without valid Sanity env vars, the build may succeed but pages can fall back to defaults or error shells (see below).

## Verifying build output

Before deploying, spot-check that the build produced real content, not error pages:

```bash
# Should show real page content (e.g. <html lang="en">), not an error shell
head -c 500 out/blog/the-brutality-of-burnout.html

# Error shell would contain something like: <html id="__next_error__">
```

Optional sanity checks:

```bash
# Blog post HTML should be substantial (e.g. 80KB+), not a tiny error shell (~16KB)
wc -c out/blog/the-brutality-of-burnout.html

# Exactly one lang="en" in the main document
grep -c 'lang="en"' out/blog/the-brutality-of-burnout.html
```

If you see error shells, fix the cause (e.g. Sanity unreachable, wrong dataset, or client cache setting) and rebuild. Do not deploy.

## Critical constraint: Sanity client cache

For static export to work, **the Sanity client must use `cache: "force-cache"`** when building for production. That is implemented in `lib/sanity/client.ts` (production uses `force-cache`, development uses `no-store`).

Do **not** change it to `no-store` or `no-cache` for production builds. That would make Next.js treat the route as dynamic and break static export (e.g. missing `generateStaticParams` or similar errors).

## Clean builds

If you see stale or inconsistent output, do a clean build:

```bash
rm -rf .next out
npm run build
```

Then verify `out/` as above.

## See also

- [ARCHITECTURE.md](ARCHITECTURE.md) — How data flows at build time.
- [DEPLOY.md](DEPLOY.md) — Full deploy steps (local and CI).
- Build-deploy skill (`.cursor/skills/build-deploy/SKILL.md`) — Step-by-step local deploy and troubleshooting.

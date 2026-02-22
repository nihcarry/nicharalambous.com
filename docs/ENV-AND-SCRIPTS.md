# Environment and scripts

Quick reference for `.env.local` and `package.json` scripts. For full context see [ARCHITECTURE.md](ARCHITECTURE.md), [BUILD.md](BUILD.md), and [CONTENT-BLOG.md](CONTENT-BLOG.md).

## Environment (`.env.local`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes (build) | Sanity project ID (e.g. `lsivhm7f`). |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes (build) | Sanity dataset (e.g. `production`). |
| `SANITY_WRITE_TOKEN` | For import scripts | Sanity token with write access; needed for `import:sanity` and related. |
| `AWS_ACCESS_KEY_ID` | Local deploy | AWS credentials for S3/CloudFront (local deploy only; CI uses GitHub secrets). |
| `AWS_SECRET_ACCESS_KEY` | Local deploy | Same. |

CI uses GitHub Actions secrets for Sanity and AWS; see [DEPLOY.md](DEPLOY.md) and [SANITY-CI-SECRETS.md](SANITY-CI-SECRETS.md).

## Scripts (`npm run …`)

**Dev and build**

| Script | Purpose |
|--------|---------|
| `dev` | Start Next.js dev server on port 3001. |
| `build` | Static export into `out/`. |
| `start` | Run production server (optional; production is static files). |
| `lint` | Run ESLint. |

**Content pipeline (blog)**

| Script | Purpose |
|--------|---------|
| `parse:medium` | Parse Medium HTML → `scripts/output/medium/`. |
| `parse:substack` | Parse Substack HTML → `scripts/output/substack/`. |
| `parse:all` | Run both parsers. |
| `inventory` | Generate inventory from parsed output. |
| `import:parse` | `parse:all` + `inventory`. |
| `enrich` | Enrich parsed articles → `scripts/output/enriched/`. |
| `enrich:sample` | Enrich a sample (e.g. 5 articles). |
| `import:sanity` | Import enriched articles into Sanity (production). |
| `import:sanity:staging` | Import into staging dataset. |
| `import:sanity:dry-run` | Preview import without writing. |
| `import:full` | Parse + inventory + enrich + import. |

**Verification**

| Script | Purpose |
|--------|---------|
| `verify:sanity` | Check Sanity API (e.g. speaker content); uses `.env.local` Sanity vars. |

## See also

- [CONTENT-BLOG.md](CONTENT-BLOG.md) — When to use which content script.
- [BUILD.md](BUILD.md) — Build prerequisites.
- [DEPLOY.md](DEPLOY.md) — CI secrets and local deploy.

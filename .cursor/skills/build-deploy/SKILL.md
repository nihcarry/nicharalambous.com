---
name: build-deploy
description: Builds and deploys the nicharalambous.com static site to S3/CloudFront, then commits and pushes so the repo matches production. Covers local build, S3 sync with correct cache headers, CloudFront invalidation, verification, and Step 7 (commit & push). Always run Step 7 after a successful deploy. Use when the user says /build-deploy, /build, requests a build, deploy, or wants to push changes to production.
---

# Build & Deploy nicharalambous.com

## Architecture Summary

Static Next.js site (`output: "export"`) deployed to S3 + CloudFront. All content fetched from Sanity CMS at build time. No server runtime.

```
npm run build → out/ → S3 sync → CloudFront invalidation → verify live → commit & push (when you have code changes; see Step 7)
```

## Prerequisites

Before building, verify:

1. `.env.local` exists with `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET=production`
2. AWS CLI is available at `~/Library/Python/3.13/bin/aws`
3. AWS credentials are set (from `.env.local`: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)

## Build & Deploy Steps

### Step 1: Clean build

Always delete `.next` and `out` before building to avoid stale cache issues:

```bash
cd /Users/nicharry/Projects/nicharalambous.com
rm -rf .next out
npm run build
```

**Expected output:**
- "Compiled successfully"
- "Generating static pages (N/N)" — should include all blog posts (178+ published)
- "Exporting (2/2)"
- `next-sitemap` generation at the end
- Exit code 0

**If exit code is non-zero**, check the build output for errors. Common issues:
- TypeScript errors in `scripts/` — these should be excluded via `tsconfig.json` `"exclude": ["node_modules", "scripts"]`
- `generateStaticParams` errors — usually means Sanity is unreachable or dataset is misconfigured

### Step 2: Verify build output

Before deploying, confirm the build produced real content, not error shells:

```bash
head -c 150 out/blog/the-brutality-of-burnout.html
```

**Must see:** `<html lang="en"` — this means real content.
**Bad sign:** `<html id="__next_error__">` — this means data fetching failed during build. Do NOT deploy. See Troubleshooting below.

Also verify a few key metrics:

```bash
wc -c out/blog/the-brutality-of-burnout.html  # Should be 80KB+, not 16KB
grep -c 'lang="en"' out/blog/the-brutality-of-burnout.html  # Should be 1
grep -c 'lang="en"' out/blog.html  # Should be 1
```

### Step 3: Deploy to S3

Two-phase sync with different cache policies:

```bash
AWS=~/Library/Python/3.13/bin/aws

# Phase 1: Static assets (JS, CSS, images, RSC payloads) — long cache, immutable
$AWS s3 sync out/ s3://nicharalambous-com-site \
  --delete \
  --size-only \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "sitemap*.xml" \
  --exclude "robots.txt" \
  --exclude "rss.xml" \
  --exclude "llms.txt"

# Phase 2: HTML + dynamic files — short cache, revalidated on deploy.
# --delete removes from S3 any HTML/sitemap/robots/rss/llms no longer in out/
# (e.g. deleted blog posts), so removed routes stop being served.
$AWS s3 sync out/ s3://nicharalambous-com-site \
  --delete \
  --size-only \
  --exclude "*" \
  --include "*.html" \
  --include "sitemap*.xml" \
  --include "robots.txt" \
  --include "rss.xml" \
  --include "llms.txt" \
  --cache-control "public, max-age=3600, must-revalidate"
```

**CRITICAL: Always use `--size-only`.** Without it, `s3 sync` compares timestamps. If a CI build deployed more recently than your local build, sync will skip your files even though they're different. `--size-only` compares file sizes instead, which catches content changes reliably.

### Step 4: Verify S3 upload

Confirm S3 has the correct files before invalidating CloudFront:

```bash
$AWS s3api head-object --bucket nicharalambous-com-site --key blog/the-brutality-of-burnout.html | grep ContentLength
```

Should match the local file size (80KB+, not 16KB).

### Step 5: Invalidate CloudFront

```bash
$AWS cloudfront create-invalidation \
  --distribution-id E1ACQY3898IZF9 \
  --paths "/*"
```

This returns an invalidation ID. Wait 30-60 seconds for completion:

```bash
$AWS cloudfront get-invalidation \
  --distribution-id E1ACQY3898IZF9 \
  --id <INVALIDATION_ID> | grep Status
```

Wait until `"Status": "Completed"`.

### Step 6: Verify live site

```bash
HTML=$(curl -s https://d18g1r3g4snekl.cloudfront.net/blog/the-brutality-of-burnout.html)
echo "Has content: $(echo "$HTML" | grep -c 'lang=\"en\"')"
echo "Title: $(echo "$HTML" | grep -oE '<h1[^>]*>[^<]+</h1>' | head -1 | sed 's/<[^>]*>//g')"

HTML=$(curl -s https://d18g1r3g4snekl.cloudfront.net/blog.html)
echo "Blog posts: $(echo "$HTML" | grep -oE '/blog/[a-z0-9][a-z0-9-]+' | grep -v '/_next' | sort -u | wc -l | tr -d ' ')"
```

If live content is still wrong after invalidation completes, a CI/CD run may have overwritten your deploy. See "CI/CD Stomping" below.

### Step 7: Commit and push (always run after Steps 1–6)

**Always run this step** after a successful local deploy (Steps 1–6 done, live site verified). Check `git status`; if there are uncommitted changes, commit and push so the repo matches production. If there are no changes (e.g. you only changed Sanity content and had no code changes), there is nothing to push — that’s the only case to skip.

**Why:** After a local deploy, production has your changes but `main` may not. If you skip this step when you do have changes, the next CI run (e.g. from a Sanity webhook) will deploy from the old `main` and overwrite what you just deployed.

```bash
git status   # see what changed
git add -A   # or add specific files
git commit -m "Describe the deploy"
git push origin main
```

**If push fails:** Retry until it succeeds. Do not leave production ahead of the repo — that is when CI stomping happens.

## Automated Deploy (CI/CD)

Pushing to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`) which runs the same build + deploy. This is the preferred path for routine changes:

```bash
git add -A && git commit -m "your message" && git push origin main
```

The CI pipeline also triggers on Sanity content updates via `repository_dispatch` webhook.

## Troubleshooting

### `__next_error__` pages in build output

**Symptom:** Blog post HTML files contain `<html id="__next_error__">` instead of `<html lang="en">`.

**Root cause:** The Sanity client uses `fetch()` with a cache mode incompatible with static export. Next.js 15 treats `cache: "no-store"` as dynamic rendering (`revalidate: 0`), which fails with `output: "export"`.

**Fix:** `lib/sanity/client.ts` MUST use `cache: "force-cache"`. Never change this to `"no-store"` or `"no-cache"`.

### CI/CD stomping local deploys

**Symptom:** You deploy locally, verify it works, but minutes later the site reverts to broken content.

**Root cause:** A GitHub Actions run (triggered by Sanity webhook or previous push) completed and re-deployed, overwriting your local deploy with its build output.

**Fix:**
1. Check for active runs: `curl -s "https://api.github.com/repos/nihcarry/nicharalambous.com/actions/runs?per_page=5" | python3 -c "import json,sys;[print(f'{r[\"id\"]} {r[\"status\"]:12} {r[\"event\"]:25} sha:{r[\"head_sha\"][:8]}') for r in json.load(sys.stdin).get('workflow_runs',[])[:5]]"`
2. If old-SHA runs are in progress/queued, cancel them via GitHub API or the Actions UI
3. Ensure your fix is pushed to `main` before deploying — CI runs check out HEAD of main

### Bulk Sanity imports trigger webhook storms

**Problem:** Importing many documents to Sanity fires a `repository_dispatch` event per document, spawning hundreds of CI builds.

**Prevention:** Before bulk imports, temporarily disable the Sanity webhook:
1. Go to https://www.sanity.io/manage → project → API → Webhooks
2. Disable "Deploy on publish"
3. Run the import
4. Re-enable the webhook
5. Trigger a single manual rebuild: `gh workflow run deploy.yml` or push a commit

### S3 sync skips changed files

**Symptom:** Local build has correct content but S3 still has old files after sync.

**Root cause:** `s3 sync` without `--size-only` uses timestamp comparison. If a CI build deployed a newer (but broken) version, sync thinks S3 is already up-to-date.

**Fix:** Always use `--size-only` flag on `s3 sync`. This is already included in the commands above.

## Key Files

| File | Purpose |
|------|---------|
| `lib/sanity/client.ts` | Sanity fetch client — MUST use `cache: "force-cache"` |
| `next.config.ts` | Static export config (`output: "export"`) |
| `.github/workflows/deploy.yml` | CI/CD pipeline |
| `.env.local` | Local env vars (AWS creds, Sanity config) |
| `tsconfig.json` | Must exclude `scripts/` directory |
| `next-sitemap.config.js` | Sitemap generation (runs as postbuild) |

## Quick Reference

```
Full local build + deploy:
  rm -rf .next out && npm run build && verify → S3 sync → CF invalidate → verify live → Step 7: commit & push (always run Step 7; skip only when git status shows nothing to commit)

Push to CI (preferred for routine changes):
  git add -A && git commit -m "..." && git push origin main → CI handles build + deploy automatically

Production CloudFront URL:
  https://d18g1r3g4snekl.cloudfront.net

S3 Bucket:
  nicharalambous-com-site (eu-central-1)

CloudFront Distribution:
  E1ACQY3898IZF9
```

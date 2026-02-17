# Sanity content and CI: why Speaker page (or other CMS content) might not update in production

If you publish content in Sanity Studio but the live site still shows old or default content after a build or git push, the most likely cause is **missing or incorrect Sanity env vars in GitHub Actions**.

---

## What we found (Feb 2026)

- **Local build** (with `.env.local`): Fetches published Speaker page from Sanity and the built `out/speaker.html` contains CMS content (Why Book Nic, How Virtual Delivery Works, As Seen At, etc.).
- **CI build** runs with **secrets**, not `.env.local`. If `NEXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_DATASET` are missing or wrong in the repo’s GitHub Actions secrets, the Sanity request in CI fails or returns nothing. The app catches the error and falls back to **hardcoded defaults**, so the build succeeds but the deployed site shows default content.

---

## What to do

### 1. Set GitHub Actions secrets

In the repo: **Settings → Secrets and variables → Actions**.

Ensure these exist and match your Sanity project:

| Secret | Example | Description |
|--------|--------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `lsivhm7f` | Same as in `.env.local` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Dataset you publish to in Studio |

Values must match what you use in Sanity Studio (same project and dataset).

### 2. Use the verify step (already in CI)

The workflow runs **Verify Sanity API (speaker content)** before the build. It calls the same Sanity API the site uses. If secrets are missing or wrong, this step fails with a clear error and the build does not deploy. So:

- If **Verify Sanity API** fails: fix the secrets above, then re-run the workflow (or push a commit).
- If it passes but the live site is still wrong: check that the deploy step completed and that you’re looking at the correct URL; optionally run a manual CloudFront invalidation.

### 3. Run the check locally (optional)

```bash
npm run verify:sanity
```

This loads `.env.local` and checks that the Speaker page document is published and returned by the API. Useful to confirm Studio and dataset before pushing.

---

## S3 deploy and cache

The deploy workflow uses `--size-only` on `aws s3 sync` so that content changes are detected by file size, not just timestamp. After fixing secrets, trigger a new run (push or “Run workflow”); once that run completes, the new build is what’s on production.

CloudFront is invalidated on `/*` after each deploy; if the site still looks stale, wait a minute and hard-refresh or try an incognito window.

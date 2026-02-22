# Deploy

Two ways to get the site to production: **CI (recommended)** and **local deploy**. After any successful local deploy, always commit and push so the repo matches production.

## Two paths

| Path | When to use |
|------|--------------|
| **CI (push to `main`)** | Routine code or content changes. Push triggers GitHub Actions, which builds and deploys. Preferred for most updates. |
| **Local deploy** | When you need to deploy from your machine (e.g. hotfix, or CI is unavailable). You run build + S3 sync + CloudFront invalidation yourself. |

## CI deploy (push to main)

1. Commit and push to `main`:
   ```bash
   git add -A && git commit -m "Your message" && git push origin main
   ```
2. GitHub Actions runs the **Build & Deploy** workflow (`.github/workflows/deploy.yml`).
3. Workflow: checkout → install deps → verify Sanity API → build → deploy to S3 → invalidate CloudFront.

**Triggers for the same workflow:**

- **Push to `main`** — any push.
- **Manual** — Actions tab → “Build & Deploy” → “Run workflow”.
- **Sanity webhook** — when the webhook is configured (see [SANITY-WEBHOOK-SETUP.md](SANITY-WEBHOOK-SETUP.md)), each publish in Sanity Studio sends a `POST` to GitHub’s repository_dispatch endpoint with `event_type: sanity-content-update`; that triggers this workflow. If the webhook is not set up or is disabled, publish does nothing to deploy — you must push or run the workflow manually.

**Required GitHub Secrets** (Settings → Secrets and variables → Actions):

| Secret | Purpose |
|--------|---------|
| `AWS_ACCESS_KEY_ID` | AWS deploy. |
| `AWS_SECRET_ACCESS_KEY` | AWS deploy. |
| `AWS_REGION` | e.g. `us-east-1`. |
| `S3_BUCKET_NAME` | e.g. `nicharalambous-com-site`. |
| `CLOUDFRONT_DISTRIBUTION_ID` | For cache invalidation. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Same as in `.env.local`. |
| `NEXT_PUBLIC_SANITY_DATASET` | e.g. `production`. |

If the Sanity secrets are missing or wrong, the build can succeed but the site may show default/empty content. See [SANITY-CI-SECRETS.md](SANITY-CI-SECRETS.md).

## Local deploy (high level)

1. **Clean build**: `rm -rf .next out && npm run build`. Verify `out/` (see [BUILD.md](BUILD.md)).
2. **S3 sync (two phases)**:
   - Static assets (JS, CSS, images): long cache, immutable.
   - HTML, sitemaps, `robots.txt`, `rss.xml`: short cache, `must-revalidate`.
   Use `--delete` and `--size-only` (for assets) so S3 matches the local build. Exact commands and cache headers: see the **build-deploy** skill (`.cursor/skills/build-deploy/SKILL.md`).
3. **CloudFront invalidation**: `create-invalidation` for `/*`.
4. **Verify live**: Hit a known URL and confirm content (e.g. blog post HTML has real content).
5. **Step 7 — commit and push**: If you have uncommitted changes, **always** commit and push after a successful local deploy. That keeps `main` in sync with what’s on production. If you skip this, the next CI run (e.g. from a Sanity publish) can deploy an older build and overwrite your deploy.

## See also

- [BUILD.md](BUILD.md) — How to run and verify the build.
- [SANITY-CI-SECRETS.md](SANITY-CI-SECRETS.md) — Sanity env in CI and why content might not update.
- [SANITY-WEBHOOK-SETUP.md](SANITY-WEBHOOK-SETUP.md) — Configure “deploy on publish” from Sanity.
- Build-deploy skill — Full local deploy steps, troubleshooting (CI stomping, webhook storms, S3 sync).

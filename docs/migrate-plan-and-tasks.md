# Plan + Tasks: Migrate to Amplify SSR for near-instant Sanity publishing

> **⚠️ Status: PARKED.** Active plan is [`publishing-workflow-improvements.md`](publishing-workflow-improvements.md). This SSR migration is held in reserve — pick it up only if the workflow improvements aren't enough (criteria in the active plan).
>
> **Companion**: [`migrate-spec.md`](../migrate-spec.md) — what we're doing and why.
> **Status (when active)**: v2 — incorporates resolved decisions; ready to start Phase A.

## Goal (recap)

- Run the site as **Next.js SSR on AWS Amplify Hosting** (not static export).
- Sanity-driven routes update **without redeploy** with **typical < 5s, worst-case < 60s** freshness, via `revalidateTag` on a Sanity webhook plus a 60s TTL safety net.
- **Preview** via **Sanity Presentation tool** + `defineLive` for click-to-edit visual editing.
- URL/layout for `/`, `/about`, `/contact`, header/footer stay code-driven; CMS data still flows through them.
- Preserve URL shape, canonicals, and every existing redirect.

---

## Phasing

```
Phase A — Codebase prep (feature branch, no prod impact)
Phase B — Amplify staging (next.nicharalambous.com)
Phase C — Production cutover (DNS swap)
Phase D — Post-launch hardening (alarms tuned, WAF to block, retire CloudFront)
```

### Phase A — Prepare the codebase for runtime Next.js

All work on a feature branch. No production effect until Phase B.

1. Strip `output: "export"` from `next.config.ts`.
2. Refactor `lib/sanity/client.ts` to use `next-sanity` v9 client + `defineLive` + `sanityFetch`. Single client (no dev/prod split).
3. Add `lib/sanity/live.ts` exporting `sanityFetch` and `<SanityLive />`; mount `<SanityLive />` in `app/layout.tsx`.
4. Add `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SANITY_PREVIEW_SECRET` to `.env.local` (with placeholders) and document in `docs/ENV-AND-SCRIPTS.md`.
5. Convert every dynamic `[slug]/page.tsx` to the new pattern (see snippet below). Delete `FALLBACK_SLUGS`, `FALLBACK_POSTS`, `blogPostBySlugDevQuery`, `blogPostSlugListDevQuery`.
6. Add `/api/revalidate/route.ts` with `Bearer` auth + tag mapper for each `_type`.
7. Add `/api/draft/enable/route.ts` and `/api/draft/disable/route.ts` for preview cookie toggle.
8. Add Sanity Presentation tool to `sanity/sanity.config.ts` with `previewUrl` set per environment.
9. Add `app/sitemap.ts`, `app/robots.ts`, `app/rss.xml/route.ts`. Move `public/llms.txt` content to a static file at `public/llms.txt` (already there) or generate at runtime if dynamic data is involved.
10. Remove `next-sitemap` package + `next-sitemap.config.js` once parity is verified.
11. Add `middleware.ts` that handles:
    - Exact-match legacy redirects (table from `infra/cloudfront-url-rewrite.js`).
    - Squarespace dated blog URL pattern → `/blog/[slug]`.
12. Add `/api/search/route.ts` (Sanity-side GROQ search, blog + archive scope) + new client `SearchUI` that consumes it. Remove Pagefind from deps.
13. Rewrite `package.json` `postbuild` script — drop everything that depends on `out/`.
14. Update `npm run validate:redirects` to read its source from `middleware.ts` (or the redirect map exported from it) instead of `infra/cloudfront-url-rewrite.js`.
15. Add Playwright smoke suite under `tests/smoke/`:
    - top-10 routes return 200 + correct canonical
    - sitemap.xml is valid XML and contains expected URL count
    - publish-and-verify (creates a draft post via Sanity Mutate API, asserts it appears within 60s on `/blog`, then deletes it)
16. Update `next.config.ts`:
    - Drop `output: "export"`.
    - Decide on `images.unoptimized` after measuring LCP on staging (default to `false` for SSR mode if no regression).
17. Update `.github/workflows/`:
    - **Add** `staging.yml` — runs lint, build, Playwright smoke against `next.nicharalambous.com` on every PR.
    - **Keep** `deploy.yml` (static rollback path) but only run on `workflow_dispatch` for the rollback window.

#### New dynamic route pattern (canonical)

```ts
import { sanityFetch } from "@/lib/sanity/live";
import { postBySlugQuery, postSlugListQuery } from "@/lib/sanity/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await sanityFetch({ query: postSlugListQuery });
  return data.map(({ slug }: { slug: string }) => ({ slug }));
}

async function getPost(slug: string) {
  const { data } = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`],
  });
  return data;
}
```

Apply identically to `blog`, `archive`, `keynotes`, `topics`, `books`.

### Phase B — Stand up Amplify SSR (staging)

1. Create Amplify app, connect the GitHub repo, target a `migrate/amplify-ssr` branch.
2. Configure build:
   - install: `npm ci`
   - build: `npm run build`
   - artifacts: `.next` (Amplify auto-detects Next.js SSR)
3. Configure environment variables in Amplify (mark secret values as "secret"):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_READ_TOKEN`
   - `SANITY_REVALIDATE_SECRET`
   - `SANITY_PREVIEW_SECRET`
   - `NEXT_PUBLIC_SITE_URL=https://next.nicharalambous.com` (staging)
4. Add custom domain `next.nicharalambous.com` in Amplify; verify TLS.
5. Configure Sanity webhook (staging) → `https://next.nicharalambous.com/api/revalidate`:
   - Trigger: Create/Update/Delete on all relevant `_type`s.
   - Headers: `Authorization: Bearer ${SANITY_REVALIDATE_SECRET}`.
   - Body projection: `{ "_type": _type, "slug": slug.current, "_id": _id }`.
6. Configure Sanity Presentation in Studio:
   - `previewUrl` for staging Studio → `https://next.nicharalambous.com`.
   - Test click-to-edit on a post, keynote, topic, book, speaker, media, business doc.
7. Run smoke suite against staging; iterate until all green.
8. Measure: cold-start time, p95 latency on a warm Lambda, Amplify build minutes per deploy. Fill cost envelope in `migrate-spec.md`.
9. Soak for **≥3 days** with at least one full publish/edit cycle per Sanity content type.

### Phase C — Production cutover

1. Lower DNS TTL on `www.nicharalambous.com` to 60s. Wait 24h.
2. Reconfigure Sanity production webhook → `https://www.nicharalambous.com/api/revalidate`.
3. Add `www.nicharalambous.com` and `nicharalambous.com` as custom domains in Amplify (apex auto-redirects to www).
4. Switch DNS:
   - `www` → Amplify CNAME / ALIAS.
   - Apex (`nicharalambous.com`) → Amplify ALIAS (Amplify handles the 301 to www).
5. Verify: top-10 routes, every redirect in the legacy map, RSS, sitemap, robots, search, Studio Presentation.
6. Configure CloudWatch alarms (5xx, p95 latency, Sanity API errors) and notification target (email or Slack).
7. Attach WAFv2 in `count` mode for week 1.
8. Leave the existing CloudFront distribution `E1ACQY3898IZF9` alive but with no DNS pointing at it. Document the static rollback procedure (see "Rollback" below).
9. Smoke-test on production with the same Playwright suite (read-only routes only — no publish-and-verify against prod).

### Phase D — Post-launch hardening

1. After 7 days of stable production, switch WAF rate rule from `count` to `block`.
2. Tune CloudWatch alarm thresholds based on observed baselines.
3. After 30 days of clean operation, **delete** CloudFront distribution `E1ACQY3898IZF9`, S3 bucket policy, and the static rollback workflow.
4. Remove `next-sitemap`, Pagefind, and any other now-unused deps from `package.json`.
5. Archive `infra/cloudfront-url-rewrite.js` with a comment pointing to `middleware.ts`.

---

## Task list (ordered, execution-ready)

### 0) Preconditions + decisions

- [ ] **0.1** Generate `SANITY_API_READ_TOKEN` (Viewer + drafts on `production`); place in `.env.local` and Amplify env. Never commit.
- [ ] **0.2** Generate `SANITY_REVALIDATE_SECRET` (`openssl rand -hex 32`); place in `.env.local` and Amplify env.
- [ ] **0.3** Generate `SANITY_PREVIEW_SECRET` (`openssl rand -hex 32`); place in `.env.local` and Amplify env.
- [ ] **0.4** Confirm AWS account has Amplify Hosting + WAFv2 + Route 53 access for the domain.

### 1) Strip static export

- [ ] **1.1** Remove `output: "export"` from `next.config.ts`. Keep `trailingSlash: false`.
- [ ] **1.2** Verify `npm run build` produces a normal Next build (no `out/`).
- [ ] **1.3** Verify `npm run start` serves all routes locally without errors.

### 2) Sanity runtime client + caching

- [ ] **2.1** Replace native-`fetch` shim in `lib/sanity/client.ts` with `next-sanity` v9 `createClient`. Default host: `apicdn.sanity.io`. With `SANITY_API_READ_TOKEN` set, switch to `api.sanity.io` and pass `useCdn: false` for draft-aware reads.
- [ ] **2.2** Create `lib/sanity/live.ts` exporting `sanityFetch` + `<SanityLive />` via `defineLive({ client })`.
- [ ] **2.3** Mount `<SanityLive />` in `app/layout.tsx`.
- [ ] **2.4** Replace every `client.fetch(...)` call site with `sanityFetch({ query, params, tags })`. Tag scheme:
  - `post`, `post:<slug>`
  - `keynote`, `keynote:<slug>`
  - `topic`, `topic:<slug>`
  - `book`, `book:<slug>`
  - `speakerPage`, `siteSettings`, `homepage`, `media`, `business`
- [ ] **2.5** Remove dev/prod query duplication: delete `blogPostBySlugDevQuery`, `blogPostSlugListDevQuery`, and any other `*DevQuery` pairs.

### 3) Dynamic-route conversion

- [ ] **3.1** `app/blog/[slug]/page.tsx` — apply canonical pattern; delete `FALLBACK_SLUGS`, `FALLBACK_POSTS`. Verify a brand-new Sanity post is reachable on `/blog/<slug>` without redeploy.
- [ ] **3.2** `app/archive/[slug]/page.tsx` — same treatment.
- [ ] **3.3** `app/keynotes/[slug]/page.tsx` — same; remove the merge-with-`FALLBACK_SLUGS` logic at the call to `getKeynotesSlugs()`.
- [ ] **3.4** `app/topics/[slug]/page.tsx` — same.
- [ ] **3.5** `app/books/[slug]/page.tsx` — same.
- [ ] **3.6** Listing pages (`/blog`, `/keynotes`, `/topics`, `/books`, `/media`, `/businesses`, `/speaker`) — wrap their fetches in `sanityFetch` with the right tags.

### 4) Preview / draft mode

- [ ] **4.1** `app/api/draft/enable/route.ts` — verify `?secret=` matches `SANITY_PREVIEW_SECRET`, call `draftMode().enable()`, redirect to `?slug=`.
- [ ] **4.2** `app/api/draft/disable/route.ts` — call `draftMode().disable()`, redirect to `/`.
- [ ] **4.3** Update `sanityFetch` to consult `draftMode()` and switch perspective + `useCdn: false` when enabled.
- [ ] **4.4** Add a small "Preview" badge component shown only when `draftMode().isEnabled` is true.
- [ ] **4.5** Add `presentationTool({ previewUrl: ... })` to `sanity/sanity.config.ts`. Configure `resolve.locations` for each document type → its public URL.
- [ ] **4.6** Verify Presentation works for: `post`, `keynote`, `topicHub`, `book`, `speaker`, `mediaAppearance`, `business`.

### 5) Revalidation webhook

- [ ] **5.1** `app/api/revalidate/route.ts`:
  - Verify `Authorization: Bearer ${SANITY_REVALIDATE_SECRET}`.
  - Read `_type`, `slug.current`, `_id` from body.
  - Map to tags: e.g. `post` → `revalidateTag('post')` + `revalidateTag('post:<slug>')` + `revalidateTag('homepage')`.
  - Return `{ revalidated: true, tags: [...] }`.
- [ ] **5.2** Document the tag map in `docs/ARCHITECTURE.md`.

### 6) Sitemap / robots / RSS / llms.txt

- [ ] **6.1** `app/sitemap.ts` — return entries for static routes + Sanity-driven routes via `sanityFetch`.
- [ ] **6.2** `app/robots.ts` — port rules from current `next-sitemap.config.js`.
- [ ] **6.3** `app/rss.xml/route.ts` — return RSS for published posts.
- [ ] **6.4** Confirm `public/llms.txt` is served at `/llms.txt`.
- [ ] **6.5** Diff output against current production sitemap/robots/rss before cutover.

### 7) Middleware + redirects

- [ ] **7.1** Create `middleware.ts`:
  - Exact-match legacy redirects (port from `infra/cloudfront-url-rewrite.js` — table of 6 entries).
  - Squarespace dated blog URL regex → `/blog/[slug]`.
  - Apex→www **not** handled here (Amplify domain config does it).
  - Trailing slash strip **not** handled here (Next.js native).
- [ ] **7.2** Update `scripts/validate-redirects.ts` to read the redirect map from `middleware.ts` (or a shared `lib/redirects.ts`).
- [ ] **7.3** Run `npm run validate:redirects` — must pass.

### 8) Search

- [ ] **8.1** `app/api/search/route.ts` — accept `?q=`, run a Sanity-side GROQ search across `post` (published only), return JSON.
- [ ] **8.2** Replace Pagefind-driven `SearchUI` in `app/search/search-ui.tsx` with a fetch-driven version that hits `/api/search`.
- [ ] **8.3** Remove `pagefind` from `devDependencies`. Remove all Pagefind references in `package.json` and any layout files.
- [ ] **8.4** Verify `/blog` search returns relevant results for at least 3 known queries.

### 9) Postbuild + sitemap retirement

- [ ] **9.1** Rewrite `package.json` `postbuild` — strip `next-sitemap`, `cp public/sitemap*.xml ...`, Pagefind step. Either remove the script entirely or use it for tasks that genuinely belong post-build.
- [ ] **9.2** Remove `next-sitemap.config.js` and the `next-sitemap` dep.

### 10) Image config

- [ ] **10.1** Set `images.unoptimized = false` in `next.config.ts`. Add `images.remotePatterns` for `cdn.sanity.io`.
- [ ] **10.2** Smoke-test LCP for blog post hero images on staging. Revert if regression > 200ms.

### 11) Playwright smoke suite

- [ ] **11.1** `tests/smoke/routes.spec.ts` — top 10 routes return 200 with expected canonical.
- [ ] **11.2** `tests/smoke/sitemap.spec.ts` — sitemap is valid XML, contains expected URL count.
- [ ] **11.3** `tests/smoke/redirects.spec.ts` — every entry in `lib/redirects.ts` returns 301 with the right `Location`.
- [ ] **11.4** `tests/smoke/publish-and-verify.spec.ts` — creates a Sanity draft, publishes via the Sanity client (using a write token, **only on staging**), polls `/blog/<slug>` for up to 60s, asserts visible, deletes the doc.

### 12) Amplify staging

- [ ] **12.1** Create Amplify app, connect repo, target `migrate/amplify-ssr` branch.
- [ ] **12.2** Configure env vars (see Phase B step 3).
- [ ] **12.3** Add `next.nicharalambous.com` as custom domain.
- [ ] **12.4** Configure staging Sanity webhook → staging URL.
- [ ] **12.5** Run smoke suite via GitHub Actions workflow `staging.yml`.
- [ ] **12.6** Soak ≥3 days. Confirm: build minutes used, p95 latency, cold-start observed.
- [ ] **12.7** Fill cost envelope back into `migrate-spec.md` § Operational baseline.

### 13) Production cutover

- [ ] **13.1** 24h before: lower `www.nicharalambous.com` DNS TTL to 60s.
- [ ] **13.2** Add prod custom domains in Amplify (`www`, apex). Verify TLS issued.
- [ ] **13.3** Reconfigure prod Sanity webhook → `https://www.nicharalambous.com/api/revalidate`.
- [ ] **13.4** Switch DNS records to Amplify.
- [ ] **13.5** Verify: top-10 routes, every legacy redirect, sitemap, RSS, robots, /llms.txt, search, Studio Presentation.
- [ ] **13.6** Attach WAFv2 (rate-based, count mode).
- [ ] **13.7** Configure CloudWatch alarms.

### 14) Rollback drill (mandatory before cutover)

- [ ] **14.1** On staging, simulate "switch DNS back" — repoint `next.nicharalambous.com` at the existing S3 bucket via a temporary CloudFront origin. Confirm the static build serves correctly.
- [ ] **14.2** Document the exact AWS console clicks / CLI commands needed to point `www` back at S3+CloudFront. Add to `docs/DEPLOY.md` as "Rollback to static".

### 15) Post-launch hardening

- [ ] **15.1** After 7 days: switch WAF rate rule from `count` to `block`.
- [ ] **15.2** After 30 days: delete CloudFront `E1ACQY3898IZF9`, the legacy S3 bucket if unused elsewhere, and the static-deploy GitHub workflow.
- [ ] **15.3** Archive `infra/cloudfront-url-rewrite.js` (move to `infra/archive/` with a header comment pointing at `middleware.ts`).
- [ ] **15.4** Tune CloudWatch alarm thresholds based on observed baselines.

---

## Verification checklist (copy/paste at cutover)

- [ ] Homepage, /about, /contact render correctly.
- [ ] `/blog` lists latest posts.
- [ ] Publish a post → visible on `/blog` within ~5s (typical), <60s (worst case).
- [ ] New post slug `/blog/<slug>` opens without redeploy.
- [ ] Preview from Studio Presentation opens the right URL and shows drafts; click-to-edit works.
- [ ] Preview off shows only published content.
- [ ] `/keynotes`, `/topics`, `/books`, `/speaker`, `/media`, `/businesses` reflect Sanity edits within window.
- [ ] No `.html` or `.txt` rewrite artefacts in URLs anywhere.
- [ ] Apex `nicharalambous.com` 301s to `www.nicharalambous.com`.
- [ ] Every legacy redirect (`/the-speaker`, `/contact-me`, `/its-not-over`, etc.) returns 301 with the right target.
- [ ] Squarespace dated blog URL pattern (`/blog/2014/05/06/foo`) 301s to `/blog/foo`.
- [ ] Search on `/blog` returns relevant results.
- [ ] `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/llms.txt` all served and equivalent (or improved) vs current production.
- [ ] CloudWatch alarms armed.
- [ ] WAFv2 attached.

---

## Rollback plan

### Rollback signal

Any of:
- 5xx rate > 5% sustained for 10 minutes.
- Sanity-driven content not updating after `revalidate` and 60s TTL.
- Critical SEO regression (canonical breakage, mass 404s).

### Rollback procedure

1. In Route 53, repoint `www.nicharalambous.com` from Amplify back to the existing CloudFront distribution `E1ACQY3898IZF9` (kept warm for 30 days).
2. Repoint apex `nicharalambous.com` back to its prior target.
3. Disable the production Sanity webhook (it now points at a defunct URL).
4. Trigger a fresh static build via `gh workflow run deploy.yml` to ensure CloudFront has the freshest content.
5. Communicate status; debug Amplify SSR issue without time pressure.

Static rollback is fully usable for the 30-day window. After day 30 the CloudFront distribution is deleted and rollback becomes "rebuild static deploy infra" — not a fast option.

---

## Open items (to fill during execution)

- [ ] Cost envelope after Phase B Day 3 (Amplify SSR + WAF + data transfer).
- [ ] LCP measurements before/after `images.unoptimized = false`.
- [ ] Final tag map in `docs/ARCHITECTURE.md` once `/api/revalidate` is implemented.
- [ ] Decision on whether to expand search beyond blog+archive after launch.

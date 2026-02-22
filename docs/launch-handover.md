# Launch Handover — nicharalambous.com

**Date:** 2026-02-22
**Status:** Blocks 8–9 complete. Ready for deploy + DNS switch (Block 10).
**Reference docs:** `nicharalambous-migration-plan.md` (full build plan), `nicharalambous-seo-strategy.md` (SEO/GEO strategy)

---

## What's Done

### Block 8: Launch Features (complete)

- **Redirects:** CloudFront Function updated at `infra/cloudfront-url-rewrite.js` — exact-match redirects for 7 old Squarespace URLs + pattern rule for dated blog URLs (`/blog/YYYY/MM/DD/slug` → `/blog/slug`). The function needs to be deployed to CloudFront (distribution `E1ACQY3898IZF9`) — it's code-only, not yet pushed to AWS.
- **`llms.txt`:** Deployed at `public/llms.txt` per GEO strategy (see `nicharalambous-seo-strategy.md` Part 6).
- **`robots.txt`:** Deployed at `public/robots.txt`. Blocks `/studio` only. Sitemap directive points to `https://nicharalambous.com/sitemap.xml`.
- **Pagefind search:** Installed, runs post-build (`npx pagefind --site out`), indexes 205 pages. Search page at `/search`. Linked from mobile More menu and footer.
- **GA4 tracking:** Measurement ID `G-BDW5JXFX8Y` in `components/google-analytics.tsx`. Conversion events added:
  - `form_submission` — fires on successful contact form submit (`app/contact/contact-form.tsx` via `lib/analytics.ts`)
  - `cta_click` — global click listener in GA script catches clicks on links to `/contact` and `/speaker`
- **Google Search Console:** Domain verified via DNS TXT record on Namecheap. Sitemap NOT yet submitted (do after DNS switch).

### Block 9: QA Fixes Applied

- **Internal linking:** `/speaker` is now the most internally-linked page. Blog post FinalCta has `/speaker` as primary CTA. ContextualCta links to `/speaker`. Topic hub FinalCta links to `/speaker`. See `nicharalambous-seo-strategy.md` Part 7 for linking rules.
- **`og:type`:** Added to all 11 page templates that were missing it.
- **Sitemap:** `/api/debug-log` excluded via `next-sitemap.config.js`.
- **Build:** 209 static pages, 0 errors, 0 lint issues. Pagefind indexes 205 pages.

### Not Done (deferred, non-blocking)

These were in Block 9 of the migration plan but are not launch-blocking:

- HTML sanitization (`isomorphic-dompurify`) for `dangerouslySetInnerHTML` in blog/archive templates
- Build-time validation for `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (currently falls back to placeholder)
- Escape key handler for mobile nav drawer in `components/header.tsx`

---

## What's Next: Block 10 (Launch)

Per `nicharalambous-migration-plan.md` Block 10:

### 1. Deploy to CloudFront

Use the build-deploy skill (`/build-deploy`) or follow these steps:
- `npm run build` (generates `out/` with 209 pages + Pagefind index)
- Sync `out/` to S3 bucket `nicharalambous-com-site` with correct cache headers
- Invalidate CloudFront distribution `E1ACQY3898IZF9`

### 2. Deploy Updated CloudFront Function

The redirect function at `infra/cloudfront-url-rewrite.js` has been updated but needs to be published to CloudFront. This is a manual step via AWS Console or CLI — update the viewer-request function associated with distribution `E1ACQY3898IZF9`.

### 3. Switch DNS

In Namecheap, update DNS records for `nicharalambous.com`:
- Point the domain to CloudFront distribution `d18g1r3g4snekl.cloudfront.net`
- The ACM certificate (`a8305c1c-803e-4dd7-8bbf-57bbfdebd3ae`) is already issued and attached

### 4. Post-DNS Tasks

- **Submit sitemap** in Google Search Console: `https://nicharalambous.com/sitemap.xml`
- **Request indexing** for key pages: `/speaker`, `/keynotes/*`, `/topics/*`
- **Monitor** crawl errors in Search Console daily for first week
- **Keep Squarespace active** (redirecting) for 30 days as safety net
- **GA4 dashboard:** Mark `form_submission` and `cta_click` as conversion events in GA4 settings

---

## Key Files

| File | Purpose |
|---|---|
| `infra/cloudfront-url-rewrite.js` | CloudFront Function (redirects + URL rewriting) |
| `components/google-analytics.tsx` | GA4 + CTA click tracking |
| `lib/analytics.ts` | Analytics event utility (used by contact form) |
| `app/search/search-ui.tsx` | Pagefind search UI |
| `next-sitemap.config.js` | Sitemap generation config |
| `public/robots.txt` | Crawl directives |
| `public/llms.txt` | AI/LLM guidance file |
| `.github/workflows/deploy.yml` | CI/CD pipeline (build → S3 → CloudFront) |

---

## AWS Resources

- **S3 Bucket:** `nicharalambous-com-site` (eu-central-1)
- **CloudFront Distribution:** `E1ACQY3898IZF9` → `d18g1r3g4snekl.cloudfront.net`
- **ACM Certificate:** `a8305c1c-803e-4dd7-8bbf-57bbfdebd3ae` (us-east-1, ISSUED)
- **Sanity Project:** `lsivhm7f` (datasets: `production`, `staging`)

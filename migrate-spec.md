# Spec: Migrate nicharalambous.com to AWS Amplify SSR with near-instant Sanity publishing

> **⚠️ Status: PARKED.** This is the full SSR migration spec. After review we decided the ROI doesn't justify the work right now. The active plan is [`docs/publishing-workflow-improvements.md`](docs/publishing-workflow-improvements.md) — a smaller, no-infra-change set of workflow fixes. Reopen this spec only if the criteria in `publishing-workflow-improvements.md` § "When to revisit the SSR migration" are met.
>
> **Status (when active)**: v2 — decisions resolved; ready for plan/execution.
> **Companion**: [`docs/migrate-plan-and-tasks.md`](docs/migrate-plan-and-tasks.md) — phased plan + task list.

## Objective

Move from **static export to S3/CloudFront** to a **Next.js SSR runtime on AWS Amplify Hosting** so that:

- When Nic publishes content in **Sanity Studio**, the live site reflects the change in **~1–3 seconds** (typical) and **<60 seconds worst-case**.
- We keep the editorial model unchanged: **Sanity edits affect pages/templates that already exist in code**.
- We explicitly **do not** CMS-ify URL/layout for: homepage, about, contact, footer (those stay code-driven; CMS data still flows through them at runtime same as today).

## Assumptions

- **Current state**: Next.js 15 App Router with `output: "export"` in production; deployed as static files to **S3 + CloudFront** (per `docs/ARCHITECTURE.md`, `.github/workflows/deploy.yml`, `infra/cloudfront-url-rewrite.js`).
- **Desired publishing latency**: typical < 5s, worst-case < 60s.
- **Sanity** is the source of truth for: blog posts, keynotes, topics, books, speaker page content, testimonials, media appearances, businesses, redirects.
- New page **types** still require code work (new route + Sanity schema/query wiring). New **instances** of existing types (e.g. a new blog post) do not.

If any assumption is wrong, update this spec before executing the plan.

---

## Scope

### In scope (becomes runtime-backed)

Sanity-driven routes that should update without redeploy:

- **Blog**: `/blog`, `/blog/[slug]`, `/archive/[slug]`
- **Keynotes**: `/keynotes`, `/keynotes/[slug]`
- **Topics**: `/topics`, `/topics/[slug]`
- **Books**: `/books`, `/books/[slug]`
- **Speaker**: `/speaker` (its CMS-driven sections)
- **Media**: `/media`
- **Businesses**: `/businesses`

Also in scope:

- **Sanity Studio** at `/studio` continues to work for editing content (stays at this path).
- **Sanity Presentation tool** for visual/click-to-edit preview from inside Studio.
- **Search** for blog + archive (replacing the static Pagefind index).
- **Sitemap, robots, RSS, llms.txt** generation (replacing the postbuild `out/` step).

### URL/layout stays code-driven (CMS data still flows in at runtime)

- `/` (homepage) — pulls recent posts, speaker copy, testimonials from Sanity at runtime, but the slide layout and copy structure live in code.
- `/about`
- `/contact`
- Global header/footer

### Non-goals

- Page builder / arbitrary layout creation in Sanity.
- Rewriting content models unless required for runtime.
- Moving off AWS.
- ISR for pages that aren't Sanity-driven.

---

## Resolved decisions

These were captured during planning and are now baked into the plan.

| # | Decision | Choice |
|---|---|---|
| 1 | **Search** | **Sanity-side GROQ search**, exposed via a server route handler (`/api/search`). Scope on launch: blog + archive (matches today). Pagefind is retired. |
| 2 | **Caching strategy** | **Long TTL + on-demand `revalidateTag`**. Each Sanity fetch tags its result; a Sanity webhook hits `POST /api/revalidate` to invalidate exactly the affected tags. Baseline `revalidate: 60` per fetch as a safety net so stale content never persists past 60s even if a webhook is dropped. |
| 3 | **Hosting shape** | **Amplify Hosting only.** The existing CloudFront distribution `E1ACQY3898IZF9` is retired for the app domain. The five behaviours in `infra/cloudfront-url-rewrite.js` migrate to: apex→www (Amplify domain config), legacy + Squarespace dated-blog redirects (`middleware.ts`), trailing slash strip (Next.js native), `.html`/`.txt` rewrite (deleted — no longer needed). |
| 4 | **Preview / drafts** | **Sanity Presentation tool + `next-sanity` v9 `defineLive`.** Click-to-edit visual editing from inside Studio. Drafts fetched via `api.sanity.io` with `SANITY_API_READ_TOKEN` (Viewer role). Toggle backed by Next.js `draftMode()` and a secret-protected `/api/draft/enable` + `/api/draft/disable` pair. |
| 5 | **Dynamic-route pattern** | One pattern across `blog`, `archive`, `keynotes`, `topics`, `books`: `generateStaticParams` returns CMS slugs only (no fallback arrays); `export const dynamicParams = true` so new slugs render on demand; per-fetch `next: { tags, revalidate: 60 }`. `FALLBACK_SLUGS` and `FALLBACK_POSTS` are deleted. |
| 6 | **Cutover safety** | DNS TTL on `www` lowered to 60s 24h before cutover. Stand SSR up at `next.nicharalambous.com` for ≥3 days of validation. After cutover, keep last successful static deploy artefact warm for 14 days as the rollback path; keep CloudFront `E1ACQY3898IZF9` alive (no DNS pointing at it) for 30 days, then delete. |
| 7 | **Operational baseline** | CloudWatch alarms: 5xx rate > 1% over 5 min, p95 latency > 1500ms over 10 min. WAFv2 with a rate-based rule (2000 req / 5 min / IP) attached to Amplify on day 1. Cost envelope to be added once we have a build artefact and traffic estimate. |
| 8 | **Smoke tests** | Playwright suite running in CI **before** promotion: top-10 routes load with 200, sitemap parses, OG tags present, "publish a draft post and assert it is reachable on staging within 60s". |
| 9 | **Sitemap/robots/RSS/llms.txt** | `app/sitemap.ts` (dynamic, queries Sanity), `app/robots.ts` (static config in code), `app/rss.xml/route.ts` (dynamic), `public/llms.txt` (static file served by Next). `next-sitemap` package is retired. |
| 10 | **Studio location** | **Stay at `/studio`** in the same app. Studio is `"use client"` so its bundle does not run in the SSR Lambda. Revisit only if cold-start or artefact-size issues surface. |
| 11 | **`postbuild` script** | Rewritten — drop everything that depends on `out/`. Sitemap/RSS/robots/llms are served at runtime. |
| 12 | **Homepage scope wording** | "Out of scope" reworded to: URL and layout remain code-driven; CMS data continues to flow in at runtime same as today. The only thing changing for these routes is they're served by SSR rather than statically exported. |

### Auth / secrets resolved

- **`SANITY_API_READ_TOKEN`** — Viewer role on `production` dataset. Used only server-side. Hand-delivered out of band; stored in Amplify env + `.env.local`.
- **`SANITY_REVALIDATE_SECRET`** — random 32-byte hex. Sent by the Sanity webhook in an `Authorization: Bearer …` header; verified by `/api/revalidate`.
- **`SANITY_PREVIEW_SECRET`** — random 32-byte hex. Required as a query param on `/api/draft/enable` to set the draft-mode cookie.

---

## Acceptance criteria

### Publishing

- [ ] **Typical publish latency**: a change published in Sanity is visible on the live site in **< 5 seconds** (webhook path).
- [ ] **Worst-case publish latency**: even if the webhook is dropped, the change is visible within **60 seconds** (TTL safety net).
- [ ] **New blog post**: creating + publishing a `post` in Studio results in:
  - It appears on `/blog` within the typical latency window.
  - Its detail page `/blog/[slug]` is reachable immediately, with no redeploy and no pre-listing of slugs.
- [ ] **Existing content updates**: editing any keynote / topic / book / speaker / testimonial / media / business field updates the live site within the typical latency window.

### Preview

- [ ] From inside Studio, opening Presentation for any Sanity-driven document type renders the corresponding route on the staging site (and after cutover, production) with **drafts visible and click-to-edit working**.
- [ ] Disabling preview returns the user to a fully published view.
- [ ] Preview state is clearly indicated in the UI (e.g. small "Preview" badge).

### Reliability and failure modes

- [ ] If Sanity API is degraded, the site returns a sensible error page or last-good cached content (no blank shells, no 5xx storms).
- [ ] During Amplify deploys, no requests 5xx (Amplify supports atomic deploys).
- [ ] If `/api/revalidate` is unreachable or rejects a webhook, content still becomes consistent within 60s via TTL fallback.

### SEO and canonical correctness

- [ ] Canonicals remain stable; no trailing-slash flips; no `.html` artefacts.
- [ ] Sitemap, RSS, robots, llms.txt match (or improve on) current production output.
- [ ] All redirects in `infra/cloudfront-url-rewrite.js` continue to return 301 with the same target. Validated by `npm run validate:redirects` against the new origin.
- [ ] Apex `nicharalambous.com` continues to 301 to `www.nicharalambous.com`.

### Operational

- [ ] CloudWatch alarms exist for 5xx and p95 latency.
- [ ] WAFv2 rate-based rule is attached and counting (not blocking) for the first week, then switched to block.
- [ ] Cost envelope estimate exists in `docs/migrate-plan-and-tasks.md` after first staging deploy.

---

## Target architecture

```
Route 53
  ├── nicharalambous.com (apex)             → Amplify domain (auto-redirects to www)
  └── www.nicharalambous.com                → Amplify Hosting (Next.js SSR)
        ├── middleware.ts: legacy + dated-blog redirects, draft-mode gating
        ├── App Router routes (SSR + RSC)
        ├── /studio (Sanity Studio, client-only bundle)
        ├── /api/revalidate              ← Sanity webhook target
        ├── /api/draft/enable | /disable ← preview cookie toggle
        ├── /api/search                  ← blog + archive Sanity-side search
        ├── app/sitemap.ts | app/robots.ts | app/rss.xml/route.ts
        └── WAFv2 (rate-based 2000/5min/IP)

Sanity.io
  ├── Content API (used at runtime via next-sanity v9 + defineLive/sanityFetch)
  ├── Image CDN
  ├── Sanity Studio (embedded at /studio + Presentation tool)
  └── Webhook → POST /api/revalidate (Bearer SANITY_REVALIDATE_SECRET)

Retired (kept for 30-day rollback window)
  └── CloudFront distribution E1ACQY3898IZF9 + S3 static origin
```

### Caching & freshness model

- Every Sanity fetch on a route is wrapped in `sanityFetch(...)` (or `client.fetch(..., { next: { tags, revalidate: 60 } })`).
- Tag scheme: `post`, `post:<slug>`, `keynote`, `keynote:<slug>`, `topic`, `topic:<slug>`, `book`, `book:<slug>`, `speakerPage`, `siteSettings`, `homepage`.
- Sanity webhook posts a projection that includes `_type` and `slug.current`. `/api/revalidate` translates that into `revalidateTag(...)` calls — typically 2–4 tags per publish (the doc itself plus its listing pages).
- 60s TTL is the safety net, never the target.

### Redirect/URL behaviour

- Apex → www: handled by Amplify domain config when `nicharalambous.com` is added as a custom domain.
- Exact-match legacy redirects (`/the-speaker`, `/contact-me`, etc.) and Squarespace dated blog URLs (`/blog/YYYY/MM/DD/slug`): live in `middleware.ts`. Source of truth is unchanged.
- `npm run validate:redirects` runs against the redirect map in `middleware.ts`. The CloudFront Function source is retired.

---

## Application changes (summary)

Detailed task list lives in [`docs/migrate-plan-and-tasks.md`](docs/migrate-plan-and-tasks.md).

1. **Remove static export** — strip `output: "export"` from `next.config.ts`.
2. **Sanity client refactor** — switch to `next-sanity` v9 client, `defineLive`, `sanityFetch`. Single client (no dev/prod split). Drop the `blogPostBySlugDevQuery` family.
3. **Dynamic route pattern** — apply the resolved pattern to all six dynamic `[slug]` routes. Delete `FALLBACK_SLUGS` and `FALLBACK_POSTS`.
4. **Preview/draft mode** — `/api/draft/enable`, `/api/draft/disable`, draft-mode-aware fetching; integrate Sanity Presentation in `sanity.config.ts`.
5. **Revalidation route** — `/api/revalidate` with `SANITY_REVALIDATE_SECRET` Bearer auth + tag mapper.
6. **Search** — `/api/search` route + new client-side `SearchUI` consuming it; remove Pagefind dependency.
7. **Sitemap / robots / RSS / llms.txt** — `app/sitemap.ts`, `app/robots.ts`, `app/rss.xml/route.ts`; `public/llms.txt` retained.
8. **Middleware** — legacy redirects + dated-blog rewrites + draft-mode helper (if needed).
9. **Postbuild rewrite** — strip `out/`-dependent steps.
10. **Image config** — flip `images.unoptimized` to `false` and rely on Sanity's image CDN behind `next/image` (decision to confirm during Phase A based on LCP impact).
11. **Playwright smoke suite** — `tests/smoke/*.spec.ts`, runs in CI against the staging URL before promote.

---

## Operational baseline

### Monitoring

- CloudWatch alarms (region: same as Amplify app):
  - **5xx rate** > 1% over 5 minutes → notify.
  - **p95 latency** > 1500ms over 10 minutes → notify.
  - **Sanity API errors** (logged from `/api/revalidate` and `sanityFetch` retries) > 5/min → notify.
- Amplify build minutes — Amplify console quota alert at 80% of monthly budget.

### Security

- WAFv2 attached to Amplify on day 1:
  - Rate-based rule: 2000 requests / 5 min / IP. Mode = `count` for week 1, then `block`.
  - AWS Managed Rules: Common Rule Set + Known Bad Inputs.
- Secrets stored as Amplify env vars marked secret; never logged.
- `SANITY_API_READ_TOKEN` is Viewer-only and dataset-scoped.

### Cost envelope (placeholder — fill during Phase B)

Will be filled in after first staging deploy with measured request rate. Expected order of magnitude: $10–$30/month on top of current ~$5/month static cost (Amplify SSR compute + WAF + data transfer). Sanity stays on free tier.

---

## Boundaries

### Always

- Preserve every existing canonical URL.
- Keep redirects functioning (`npm run validate:redirects` passes).
- Keep homepage / about / contact / header / footer code-driven for URL and layout.
- Use sane caching so traffic spikes don't DDoS Sanity.

### Ask first

- Any Sanity schema change that affects authoring.
- Any decision that increases monthly AWS cost above $50 baseline.
- Any change to primary domain routing behaviour beyond this migration.
- Adding ISR or dynamic rendering to currently-static routes (homepage / about / contact).

### Never

- Commit secrets or tokens (Sanity, AWS, webhook secrets).
- Introduce a page builder system.
- Disable WAF entirely in production.
- Skip the staging validation period before cutover.

---

## Success criteria (definition of done)

- [ ] Amplify SSR app exists and serves the site at `next.nicharalambous.com` for ≥3 days with all smoke tests green.
- [ ] Publishing a new blog post in Sanity makes it visible at `/blog` and `/blog/[slug]` **without redeploy** within < 5s typical / < 60s worst-case.
- [ ] Editing existing keynote/topic/book/speaker fields updates live within the same window.
- [ ] All redirects from `infra/cloudfront-url-rewrite.js` still return 301 with the same target via `middleware.ts` + Amplify domain config.
- [ ] Sitemap, robots, RSS, llms.txt parity with current production.
- [ ] Search on `/blog` works and covers blog + archive.
- [ ] Preview from Sanity Studio (Presentation tool) opens the right URL with drafts visible.
- [ ] CloudWatch alarms armed; WAF attached.
- [ ] Static rollback path documented and exercised once on staging.

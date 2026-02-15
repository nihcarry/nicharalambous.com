# nicharalambous.com Migration — High-Level Overview

---

## What's Happening

Migrating nicharalambous.com from Squarespace to a custom-built, statically-exported Next.js site backed by Sanity CMS and hosted on AWS (S3 + CloudFront). The site's purpose is singular: **drive virtual keynote speaking bookings.** An AI content pipeline, trained on Nic's keynotes and books, will continuously optimize and generate content post-launch.

---

## The Steps (9 Pre-Launch Blocks + Post-Launch)

### Pre-Launch

| Block | What | Summary |
|-------|------|---------|
| **1. Foundation** | Infrastructure | AWS setup (S3, CloudFront, Route53, TLS), GitHub repo, CI/CD pipeline, Sanity project. A blank page serving over HTTPS. |
| **2. Scaffold** | App shell | Next.js with App Router, Tailwind, Sanity client, base layout, reusable components (SEO head, JSON-LD, CTAs), sitemap generation, 404 page. |
| **3. CMS** | Content model | All Sanity schemas defined (posts, keynotes, topic hubs, books, testimonials, etc.), Studio embedded at `/studio`, webhook-triggered rebuilds working, staging + production datasets. |
| **4. Money Pages** | Core conversion pages | `/speaker` (the primary money page) and `/keynotes/*` — full content, testimonials, structured data, CTAs. These are the pages that generate bookings. |
| **5. Supporting Pages** | Everything else | Homepage, `/about`, `/books`, `/media`, `/contact` (booking form), `/topics` (7 topic hub pages). Can run in parallel with Block 4. |
| **6. Blog System** | Templates & features | Blog listing with pagination, individual post template, archive template for legacy posts, RSS feed, topic filtering, related posts. Can run in parallel with Blocks 4–5. |
| **7. Core Blog Migration** | Content migration | Parse Medium + Substack HTML from `Legacy Content/`, import as-is (no edits) to Sanity as published posts. Resolve slug collisions. Squarespace XML is deferred to Block 11 (archive). |
| **8. SEO & Launch Prep** | Verification | Deploy redirects, `llms.txt`, `robots.txt`, sitemaps. Audit internal links, meta tags, structured data. Set up Search Console + GA4. Full crawl for broken links. Lighthouse audits (target >95). Mobile/browser testing. |
| **9. Launch** | Go live | Switch DNS from Squarespace to CloudFront. Submit sitemaps. Request indexing for key pages. Keep Squarespace active (redirecting) for 30 days as a safety net. |

### Post-Launch

| Block | What | Summary |
|-------|------|---------|
| **10. Archive Import** | Squarespace content | Parse `Legacy Content/Squarespace-Wordpress-Export-*.xml`, import all posts as `archived` with raw HTML. AI categorizes by topic cluster. Update redirects to point to `/archive/{slug}` instead of catch-all. |
| **11. AI Content Pipeline** | Ongoing optimization | AI agent optimizes archive posts (calibration batch of 20–30 first, then scale), generates new posts from keynote transcripts and books, targets keyword gaps. You review every draft before publish. This never "finishes." |

---

## Gates (What Must Be True Before Moving On)

Each block has a clear "done when" condition. These are the critical gates:

| Gate | Condition |
|------|-----------|
| **Foundation complete** | A blank page serves over HTTPS at the domain (or staging domain). |
| **Scaffold complete** | Site has working layout, navigation, and auto-deploys on push. |
| **CMS complete** | All schemas defined, content flows from Sanity to Next.js, webhook triggers rebuild. |
| **Money pages complete** | `/speaker` and `/keynotes/*` render with real content; structured data validates. |
| **Blog migration complete** | All Medium + Substack articles live in Sanity as published. Redirect map covers Squarespace old URLs (catch-all until archive imported). |
| **Launch-ready** | Redirects work, sitemaps correct, full crawl shows no broken links, Lighthouse >95, forms work, mobile tested. |
| **Launch** | DNS switched, Search Console receiving data, Squarespace still active as fallback. |
| **Squarespace cancellation** | 30 days of stable post-launch operation. |
| **AI pipeline calibration** | You've reviewed a 20–30 post calibration batch and approved the agent's approach before scaling. |

---

## Guardrails

### Content Quality
- **Human review on every AI draft.** No AI-generated content publishes without your approval. The workflow is: `archived` → `ai-draft` → `in-review` → `published`.
- **Calibration before scale.** The AI agent optimizes 20–30 posts first. You review for voice accuracy, keyword fit, and readability. Only after calibration does it scale to the full archive.
- **Voice corpus grounding.** All AI content is anchored to your actual keynote transcripts and books — not invented from scratch.

### SEO Protection
- **Comprehensive redirects.** Pattern-based rule handles `/blog/YYYY/MM/DD/slug` → `/blog/slug` or `/archive/slug`. Exact-match map handles page-level redirects. Every old URL is accounted for.
- **Slug collision resolution.** When flattening 17 years of date-based URLs, the post with more traffic/backlinks keeps the clean slug; the other gets `{slug}-{yyyy}`.
- **30-day Squarespace overlap.** Squarespace stays active and redirecting for 30 days post-launch as a safety net against ranking loss.
- **Launch blog = Medium + Substack.** Articles from `Legacy Content/` are imported as-is at `/blog/{slug}`. Squarespace content goes to `/archive/{slug}` post-launch (Block 10) — nothing is deleted or 404'd without deliberate decision. 410 (Gone) is reserved only for actively harmful content.

### Technical
- **Static-only architecture.** No server runtime. Every page is pre-built HTML served from CloudFront edge. This guarantees performance (LCP <2s, Lighthouse >95) and keeps costs at $4–9/month.
- **Performance targets baked in.** LCP <2.0s, CLS <0.05, INP <150ms, TTFB <200ms, page weight <500KB on key pages.
- **Staging before production.** Content imports go to Sanity's `staging` dataset first, get verified, then promote to `production`.
- **Pre-launch crawl.** Full site crawl (Screaming Frog or similar) before launch — no broken links, no missing meta, no orphan pages.
- **50+ redirect spot-checks.** Sample old URLs and verify correct 301 destinations before going live.

### Operational
- **Two content modes run independently.** Manual publishing through Sanity Studio works normally, completely separate from the AI pipeline.
- **Ongoing SEO monitoring.** Search Console for crawl errors and ranking changes. AI citation monitoring across ChatGPT, Perplexity, and Google AI Overviews.

---

## Expected End-State

When fully operational, nicharalambous.com will be:

**A high-performance, SEO-optimized content platform built to convert organic search traffic into virtual keynote speaking bookings.**

Specifically:

- **Primary money page** (`/speaker`) ranking for "virtual keynote speaker" — the #1 target keyword.
- **7 topic hub pages** (`/topics/curiosity`, `/topics/innovation`, `/topics/entrepreneurship`, `/topics/focus`, `/topics/ai`, `/topics/agency`, `/topics/failure`) acting as authority clusters that funnel link equity to the speaker page.
- **Individual keynote pages** with testimonials, video, and direct booking CTAs.
- **A growing blog** of SEO-optimized posts, each linked to a topic hub and (where relevant) a keynote page, creating a dense internal link network.
- **An AI content pipeline** continuously optimizing archive posts, generating new content from keynote transcripts and books, and targeting keyword gaps identified in Search Console — all grounded in Nic's actual voice and reviewed by Nic before publishing.
- **Every old URL redirected.** 17 years of Squarespace content either optimized and live at `/blog/{slug}` or preserved at `/archive/{slug}`, with 301 redirects covering every legacy URL.
- **Sub-$10/month hosting costs** on a fully static AWS stack (S3 + CloudFront) with Lighthouse scores >95.
- **A clear booking funnel:** organic search → content → speaker/keynote page → booking form → inquiry received.
- **Structured data** (JSON-LD) on every page type for rich search results.
- **AI discoverability** via `llms.txt` and content structured for citation by ChatGPT, Perplexity, and Google AI Overviews.

The site is not a blog with a speaker page bolted on. It's a **speaker booking engine** with a content strategy designed to build topical authority and funnel visitors toward one action: booking Nic for a virtual keynote.

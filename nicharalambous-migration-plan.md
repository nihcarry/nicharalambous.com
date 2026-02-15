# nicharalambous.com — Build & Launch Plan (v2)

**Status:** In progress — Blocks 1-7c complete (except Squarespace redirect map in 7c, deferred to Block 11). All 230 Medium + Substack articles imported to Sanity with enriched metadata. Production CloudFront URL serving full site with 178 published blog posts. Ready for Block 8 (Launch Features).
**Overall Progress:** 75% (Blocks 1-7c of 12)
**Last Updated:** 2026-02-15

---

## What This Is

A plan to migrate nicharalambous.com from Squarespace to a custom-built content platform. The site's primary goal is to drive virtual keynote speaking bookings. The architecture includes an AI-powered content pipeline that uses Nic's keynote transcripts, books, and 17 years of blog posts as source material to build a high-authority site.

This plan has no timelines or effort estimates. Work is sequenced by dependency — what blocks what. Move through it at whatever pace you move through it.

### Positioning

> Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker. With 4 startup exits, 3 books, and 20+ years building technology businesses, he helps modern teams unlock curiosity, build with AI, and turn innovation into profit.

The SEO target keyword is "virtual keynote speaker." The positioning communicates WHY someone books you, not just WHAT you are.

---

## Part 1: Stack & Architecture

### Technology Stack

| Component | Choice | Rationale |
|---|---|---|
| CMS | Sanity.io (hosted SaaS, free tier) | Zero infra, TypeScript schemas, Portable Text, GROQ, real-time editing |
| Frontend | Next.js App Router + TypeScript | Static export, React Server Components, excellent Sanity integration |
| CSS | Tailwind CSS | Utility-first, purged CSS, fast DX |
| Hosting | S3 + CloudFront | Static CDN, $3-8/month, full control |
| DNS | Route53 + ACM | Native AWS, free TLS |
| Forms | Formspree or Formspark | Serverless, email notifications, spam filtering |
| Search | Pagefind | Client-side, zero cost, works with static sites |
| Analytics | Google Search Console + GA4 | Search performance + traffic/conversions (add Clarity later if needed) |
| CI/CD | GitHub Actions | Build on push + Sanity webhook triggers rebuild |
| AI Pipeline | Claude/Cursor agent + Sanity API | Voice corpus in repo, drafts content in CMS |

### Deployment Model

**Static export with webhook-triggered rebuilds.** Next.js generates fully static HTML at build time. Every content change in Sanity triggers a rebuild via webhook → GitHub Actions → deploy to S3 → CloudFront cache invalidation. No Node.js runtime, no ISR, no server.

### AWS Infrastructure

```
Route53 (DNS)
  └── CloudFront Distribution (CDN + TLS via ACM)
        ├── Default Origin: S3 Bucket (static Next.js export)
        ├── CloudFront Function: URL redirects (pattern + exact match)
        └── CloudFront Function: Security headers

Sanity.io (external, hosted)
  ├── Content API (GROQ queries at build time only)
  ├── Image CDN (on-the-fly transforms)
  └── Sanity Studio (embedded in Next.js at /studio)

GitHub Actions (CI/CD)
  ├── On push to main: build → deploy to S3 → invalidate CloudFront
  └── On Sanity webhook: trigger rebuild
```

### Why Not Vercel?

AWS was specified. S3 + CloudFront gives full control, no vendor lock-in, and cheaper at scale. If operational simplicity ever outweighs cost control, Vercel is a one-command alternative.

---

## Part 2: Site Architecture

### URL Structure

```
/                           → Homepage (authority hub)
/speaker                    → PRIMARY money page (virtual keynote speaker)
/keynotes                   → Keynote listing
/keynotes/{slug}            → Individual keynote pages
/topics                     → Topic hub index
/topics/{slug}              → Individual topic hubs (7 hubs)
/blog                       → Blog listing (paginated)
/blog/{slug}                → Optimized blog posts (flat URLs)
/archive/{slug}             → Legacy posts awaiting optimization
/books                      → Books listing
/books/{slug}               → Individual book pages
/about                      → Consolidated bio, businesses, exits, timeline
/media                      → Press, podcasts, video appearances
/contact                    → Booking inquiry form
/newsletter                 → Substack redirect or embed
/search                     → Client-side search (Pagefind)
/sitemap.xml                → Sitemap index
/robots.txt                 → Crawl directives
/rss.xml                    → Blog RSS feed
/llms.txt                   → AI/LLM guidance file
```

### Redirects (from old site)

- `/virtual-keynote-speaker` → 301 to `/speaker` (prevents keyword cannibalization)
- `/meet-nic-haralambous` → 301 to `/about`
- `/the-speaker` → 301 to `/speaker`
- `/contact-me` → 301 to `/contact`
- `/businesses` → 301 to `/about`
- `/its-not-over` → 301 to `/media`
- `/side-hustle-course` → 301 to `/books/how-to-start-a-side-hustle`

---

## Part 3: Content Model (Sanity CMS)

### Document Types

```typescript
// Core content types
speaker          // Singleton: the main speaker page content
keynote          // Repeatable: individual keynotes
topicHub         // Repeatable: topic cluster pages (7 hubs)
post             // Repeatable: blog posts (optimized + archive)
book             // Repeatable: books
mediaAppearance  // Repeatable: press/podcast/video appearances
testimonial      // Repeatable: client testimonials
business         // Repeatable: past and current businesses

// Supporting types
author           // Singleton (just Nic, but extensible)
siteSettings     // Singleton: global SEO defaults, social links, bio
redirect         // Repeatable: old URL → new URL mapping
```

### Shared SEO Fields (reusable object)

```typescript
seo: {
  seoTitle: string        // Override for <title> tag
  seoDescription: string  // Meta description
  ogImage: image          // Open Graph image
  canonical: url          // Canonical URL (optional override)
  noIndex: boolean        // Exclude from search engines
}
```

### Post Schema (with AI workflow fields)

```typescript
post: {
  // Core fields
  title: string
  slug: slug (unique)
  author: reference → author
  publishedAt: datetime
  updatedAt: datetime
  excerpt: text (plain, max 200 chars)
  body: portableText (rich text with custom blocks)
  featuredImage: image (with alt text)
  topics: array of references → topicHub
  relatedKeynote: reference → keynote (optional)
  faq: array of objects { question: string, answer: text } (5 items — frequently asked questions related to post content)
  seo: seoFields
  estimatedReadTime: number

  // AI workflow fields
  contentStatus: "archived" | "ai-draft" | "in-review" | "published"
  sourceReferences: array of strings (which transcript/book/archive post this derives from)
  targetKeywords: array of strings (keywords this post targets)
  targetTopicHub: reference → topicHub
  optimizationNotes: text (what the AI changed and why)
  originalUrl: url (Squarespace URL, for redirect generation)
  rawHtmlBody: text (original HTML, preserved for reference)
}
```

### Keynote Schema

```typescript
keynote: {
  title: string
  slug: slug (unique)
  tagline: string
  description: portableText
  deliveryFormat: string ("virtual" | "hybrid" | "in-person")
  duration: string
  audiences: array of strings
  outcomes: array of strings (what attendees leave with)
  topics: array of references → topicHub
  testimonials: array of references → testimonial
  videoEmbed: url (demo/sizzle reel)
  seo: seoFields
  order: number (display ordering)
}
```

### Topic Hub Schema

```typescript
topicHub: {
  title: string
  slug: slug (unique)
  oneSentenceSummary: string
  definition: portableText
  whyItMatters: portableText
  relatedKeynotes: array of references → keynote
  featuredPosts: array of references → post
  seo: seoFields
}
```

### Editorial Workflow

Two modes run in parallel:

**Mode 1 — Manual.** You write and publish content through Sanity Studio. Normal CMS workflow: draft → published. Webhook triggers rebuild. No AI involved.

**Mode 2 — AI Agent.** The agent creates/updates posts via Sanity API:
- `archived` → AI processes → `ai-draft` → you review → `in-review` → you approve → `published`
- New content from voice corpus → `ai-draft` → you review → `published`
- Sanity's native draft/published states still apply on top of `contentStatus`

---

## Part 4: AI Content Pipeline

### Source Material (Voice Corpus)

Stored in the repo at `nicharalambous-voice-training/`:

| Source | Content | Key Frameworks & Stories |
|---|---|---|
| Reclaiming Focus keynote | Digital addiction, productivity, attention management | DIAL framework (Decide, Intend, Act, Loop), sacrifice fallacy, high agency, boredom as catalyst |
| Breakthrough Product Teams keynote | Entrepreneurial teams, curiosity, innovation, AI | Innovation Flywheel, Socratic method, T-shaped people, selective agency, "action produces information" |
| Curiosity Catalyst keynote | Stagnation, innovation theater, curiosity in business | Stagnation hypothesis, wackovation, OK plateau, curiosity as "god particle of innovation" |
| Do. Fail. Learn. Repeat. (book) | Personal entrepreneurship memoir | Impostor phenomenon, resilience, "just avoid dying", failure as through-point |
| Business Builder's Toolkit (book) | Comprehensive business-building guide | Starting, planning, culture, leadership, customers, side-hustle culture |

### How the AI Agent Works

The agent has access to:
1. The voice corpus (keynotes + books) for tone, stories, frameworks, and arguments
2. The Sanity API for reading archive posts and creating/updating drafts
3. The SEO strategy document for target keywords and topic cluster definitions

**Archive optimization workflow:**
1. Agent reads an `archived` post from Sanity
2. Analyzes content against target keywords and mapped topic hub
3. Rewrites/restructures for SEO: adds TL;DR, optimizes title and meta description, adds internal links to topic hub and relevant keynote, improves heading hierarchy
4. Preserves the original voice (references voice corpus for tone calibration)
5. Creates a new version in Sanity with status `ai-draft` and `optimizationNotes` explaining changes
6. You review, edit, approve → status moves to `published`, post moves from `/archive/` to `/blog/`

**New content generation workflow:**
1. Agent identifies keyword gaps from the SEO strategy
2. Mines voice corpus for relevant stories, frameworks, and arguments
3. Composes a new blog post targeting the gap, grounded in your actual words and ideas
4. Creates draft in Sanity with status `ai-draft`, `sourceReferences` listing which transcripts/books were used
5. You review, edit, approve → published

**Calibration process (before scaling):**
1. Agent optimizes 20-30 posts across all topic clusters
2. You review — check voice accuracy, keyword integration, internal links, readability
3. Adjust the agent's approach based on what you see
4. Then scale to the full archive

### Topic Hubs Mapped to Voice Corpus

| Topic Hub | Primary Keynote Source | Book Source | Example Frameworks |
|---|---|---|---|
| `/topics/curiosity` | Curiosity Catalyst, Breakthrough Teams | Both books | "God particle of innovation", epistemic/diversive/empathetic curiosity, Onfido hiring for curiosity |
| `/topics/innovation` | Breakthrough Teams, Curiosity Catalyst | Business Builder's Toolkit | Innovation Flywheel, wackovation, stagnation hypothesis, "innovation is an outcome not an action" |
| `/topics/entrepreneurship` | All keynotes | Do. Fail. Learn. Repeat. | Do/Fail/Learn/Repeat cycle, resilience, "just avoid dying", impostor phenomenon |
| `/topics/focus` | Reclaiming Focus | Business Builder's Toolkit | DIAL framework, sacrifice fallacy, "email is not your job", 90-minute deep work blocks |
| `/topics/ai` | Breakthrough Teams | — | AI as tool not replacement, MIT cognitive bankruptcy study, "did you try it?", Gamma team ($1.7M/person) |
| `/topics/agency` | Reclaiming Focus, Breakthrough Teams | Do. Fail. Learn. Repeat. | High agency spectrum, locus of control, selective agency, "action produces information", Mosana Makate story |
| `/topics/failure` | All keynotes | Do. Fail. Learn. Repeat. | "Failure is data not destiny", blameless postmortems, post-traumatic growth, Dyson's 5,127 prototypes |

---

## Part 5: Migration Strategy

### Content Priority for Launch

Blog content is sourced from two locations in `Legacy Content/`:

| Source | Location | Launch Action | Rationale |
|---|---|---|---|
| **Medium articles** | `Legacy Content/Medium Articles/*.html` | Import as published posts at `/blog/{slug}` | Most recent, relevant, up-to-date, contextual for SEO targets |
| **Substack articles** | `Legacy Content/Substack Articles/*.html` | Import as published posts at `/blog/{slug}` | Same as Medium — recent, relevant, SEO-aligned |
| **Squarespace/WordPress export** | `Legacy Content/Squarespace-Wordpress-Export-*.xml` | **Archive only** (Block 11) — not launch-blocking | 17 years of legacy content; triage and optimize post-launch |

**Launch approach:** Medium and Substack articles are uploaded **as-is with no changes** before go-live. No AI optimization, no content edits. They form the starting point for the blog. Squarespace content is deferred to the archive for later pickup.

### Launch Content: Medium & Substack Inventory

1. Parse HTML files from `Legacy Content/Medium Articles/` and `Legacy Content/Substack Articles/`
2. Extract: title, slug, publish date, HTML body, original URL (Medium/Substack canonical)
3. Generate inventory: `id, title, slug, publishedAt, sourceUrl, source (medium|substack), hasImages, wordCount`
4. Resolve any slug collisions across both sources (prefer more recent; use `-{yyyy}` suffix when needed)

**File naming conventions:**
- Medium: `YYYY-MM-DD_Title-slug-{id}.html` — date and title are parseable
- Substack: `{id}.{slug}.html` — ID + slug in filename

### Archive Content: Squarespace Export (post-launch)

1. Parse `Legacy Content/Squarespace-Wordpress-Export-*.xml` (WordPress XML format)
2. Build inventory CSV: `id, title, slug, publishedAt, oldUrl, newUrl, hasImages, hasEmbeds, wordCount, topicCluster, qualityScore`
3. All Squarespace posts import to Sanity as `contentStatus: "archived"` at `/archive/{slug}` (Block 11)
4. AI agent categorizes and optimizes archive posts post-launch (Block 12)

**Squarespace export limitations:**
- Images are URLs only (not included in export) — need separate scraping
- Some formatting may be lost
- Gallery blocks and embedded media need special handling

### Content Triage (simplified)

| Tier | Source | Action |
|---|---|---|
| **Launch blog** | Medium + Substack from Legacy Content | Import as-is, no edits. Published at `/blog/{slug}`. Raw HTML or basic Portable Text. |
| **Archive** | Squarespace WordPress XML | Import as `archived` at `/archive/{slug}`. Enters AI optimization queue post-launch. |

**Default for genuinely toxic/embarrassing content:** 301 redirect to nearest relevant page. Reserve 410 (Gone) only for content that would actively harm the site's reputation. The bar for 410 is high.

### Image Migration

**Launch (Medium/Substack):** Medium and Substack HTML may contain embedded image URLs. Options: (a) preserve original URLs as-is in the imported HTML, or (b) scrape, download, optimize, and upload to Sanity for posts with images. Decision: keep as-is at launch for speed; images can be migrated later if needed.

**Archive (Squarespace):** Archive posts keep their original Squarespace image URLs until they're promoted to `/blog/`.

### HTML → Portable Text Conversion

**Launch (Medium/Substack):** Import as-is. Store HTML in `rawHtmlBody` and render in blog template (same approach as archive). No Portable Text conversion at launch — content displays with minimal processing.

**Archive promotion (future):** When promoting archive posts to `/blog/`, use full HTML → Portable Text converter: embeds → `videoEmbed`, code blocks → `codeBlock`, pull quotes → `pullQuote`, galleries → `gallery`. Built in Block 12 tooling.

### Slug Collision Resolution

When combining Medium + Substack articles, slug collisions are possible. Resolution:
1. During inventory parsing, flag any duplicate slugs across both sources
2. The more recent post keeps `/blog/{slug}`
3. The other gets `/blog/{slug}-{yyyy}` using its publish year
4. Redirect map (for Medium/Substack canonical URLs) accounts for both resolved URLs

Squarespace slug collisions are resolved in Block 11 when the archive is imported.

### Import to Sanity

**Launch:**
1. Medium + Substack: import with `rawHtmlBody`, `contentStatus: "published"`, preserve `publishedAt`, `originalUrl` (Medium/Substack canonical)
2. Import to `staging` dataset first, verify, then promote to `production`

**Post-launch (Block 11):**
3. Squarespace archive: import with `rawHtmlBody` and `contentStatus: "archived"`
4. Preserve `publishedAt`, `originalUrl`, `rawHtmlBody` for all archive posts

---

## Part 6: Redirect Strategy

### Pattern-based redirects (CloudFront Function)

Most blog redirects follow a pattern: `/blog/YYYY/MM/DD/slug` → `/blog/slug` or `/archive/slug`. One regex rule handles the bulk.

```
# Pattern rule (handles majority of blog URLs)
/blog/\d{4}/\d{1,2}/\d{1,2}/(.+) → /blog/$1 or /archive/$1

# The function checks: does /blog/$1 exist? If yes, redirect there.
# If not, redirect to /archive/$1.
```

### Exact-match redirects (small map in same CloudFront Function)

```json
{
  "/meet-nic-haralambous": "/about",
  "/the-speaker": "/speaker",
  "/virtual-keynote-speaker": "/speaker",
  "/contact-me": "/contact",
  "/businesses": "/about",
  "/its-not-over": "/media",
  "/side-hustle-course": "/books/how-to-start-a-side-hustle"
}
```

This small map fits comfortably within CloudFront Function's 10KB limit. The pattern rule handles everything else.

### If the map grows too large

Fallback to Lambda@Edge (1MB limit) or move the redirect map to S3 and have the function fetch it. This is unlikely to be needed.

---

## Part 7: Conversion Optimization

### Booking Funnel

```
Visitor arrives (organic search, referral, AI citation)
  → Lands on /speaker or /keynotes/{slug}
    → Reads content, watches video, sees testimonials
      → Clicks "Book This Keynote" or "Enquire Now"
        → /contact (structured inquiry form)
          → Automated confirmation email
            → You review and respond
```

### Contact/Booking Form Fields

- Name (required)
- Email (required)
- Company/Organisation (required)
- Role/Title
- Event type (dropdown: conference, corporate event, team offsite, webinar, other)
- Preferred keynote topic (dropdown populated from Sanity keynotes)
- Event date (date picker)
- Estimated audience size
- Budget range (optional — dropdown with ranges)
- Additional details (textarea)

### CTAs (Calls to Action)

Every page has a contextually relevant CTA:
- **Speaker page:** "Book Nic for Your Next Virtual Event" → `/contact`
- **Keynote pages:** "Book This Keynote" → `/contact` (pre-selecting that keynote)
- **Blog posts:** Soft CTA in footer → "Want Nic to deliver this as a keynote?" → `/speaker`
- **Topic hubs:** "Explore this topic as a virtual keynote" → relevant keynote page
- **Archive posts:** "From the archive" banner + link to `/blog` for latest thinking

### Social Proof Elements

- Client logos (companies that have booked you)
- Video testimonials (attributed: name, title, company)
- Written testimonials (attributed: name, title, company)
- Media logos (BBC, Fast Company, CNBC Africa)
- Speaking event photos
- "As seen at" list (SXSW, Standard Bank, Vodacom, etc.)

---

## Part 8: Analytics & Measurement

### Launch Stack (lean)

| Tool | Purpose |
|---|---|
| Google Search Console | Search performance, indexing errors, crawl stats |
| GA4 | Traffic, behaviour, conversion tracking |

That's it at launch. Add Microsoft Clarity (heatmaps) and Google Tag Manager (advanced event tracking) later if needed.

### Conversion Events (GA4)

- `form_submission` — booking inquiry submitted
- `cta_click` — any "Book" or "Enquire" CTA clicked
- `video_play` — sizzle reel or testimonial video played
- `keynote_view` — individual keynote page viewed

### KPIs

| KPI | Tool |
|---|---|
| `/speaker` ranking for "virtual keynote speaker" | Search Console |
| Organic traffic to `/speaker` and `/keynotes/*` | GA4 |
| Booking form submissions | GA4 conversion events |
| Core Web Vitals (LCP, CLS, INP) | Search Console |
| Pages indexed | Search Console |
| AI citation accuracy | Manual checks (ChatGPT, Perplexity, Google AI Overview) |

---

## Part 9: Performance Targets

| Metric | Target | How |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.0s mobile | Static HTML, optimized images, font preloading |
| CLS (Cumulative Layout Shift) | < 0.05 | Fixed image dimensions, no layout-shifting ads |
| INP (Interaction to Next Paint) | < 150ms | Minimal JavaScript |
| Time to First Byte | < 200ms | CloudFront edge serving static HTML |
| Total page weight | < 500KB on key pages | Aggressive image optimization, minimal JS |
| Lighthouse Performance | > 95 | All of the above |

### Implementation Details

- **Images:** Sanity image CDN with WebP/AVIF + Next.js `<Image>` for lazy loading and responsive sizes
- **Fonts:** Self-hosted, preload critical weights, `font-display: swap`
- **JavaScript:** Minimal client-side JS. Most pages are static HTML. JS only for: form validation, search, video embeds, analytics
- **CSS:** Tailwind with purging — ship only what's used
- **Caching:** CloudFront: static assets cached 1 year, HTML cached 1 hour (invalidated on deploy)

---

## Part 10: Work Sequence

Work is ordered by dependency. Each block depends on the one before it (with some noted exceptions). Within a block, tasks can be done in any order unless noted.

### Block 1: Foundation 🟩

**Depends on:** Nothing — this is the start.
**Done when:** A blank page serves over HTTPS at nicharalambous.com (or a staging domain).

- [x] Create GitHub repository (`nihcarry/nicharalambous.com`)
- [x] Set up AWS: S3 bucket (`nicharalambous-com-site` in eu-central-1), CloudFront distribution (`E1ACQY3898IZF9`), ACM TLS certificate (us-east-1)
- [ ] Configure DNS (Namecheap → CloudFront CNAME) *(deferred to Block 10 — DNS switch is the final launch step)*
- [x] Create Sanity.io project (free tier) — Project ID: `lsivhm7f`
- [x] ACM certificate DNS validation CNAME added in Namecheap — certificate ISSUED
- [x] Set up GitHub Actions CI/CD: build → deploy to S3 → CloudFront invalidation *(verified working — Run #6 passed)*
- [x] Configure GitHub repository secrets (7 secrets: AWS credentials, S3, CloudFront, Sanity)
- [x] Create "coming soon" page and verify it builds

**Notes:**
- DNS is on Namecheap (not Route53). Updated from original plan.
- AWS CLI installed locally at `~/bin/aws`.
- `.env.example` created with all required environment variables.
- CI/CD pipeline verified end-to-end: push to main → build → deploy to S3 → CloudFront invalidation.

**AWS Resources Created (2026-02-14):**
- S3 Bucket: `nicharalambous-com-site` (eu-central-1)
- CloudFront Distribution: `E1ACQY3898IZF9` → `d18g1r3g4snekl.cloudfront.net`
- CloudFront OAC: `E3VYUDWGN7RR8` (secure S3 access)
- ACM Certificate: `a8305c1c-803e-4dd7-8bbf-57bbfdebd3ae` (us-east-1, ISSUED)

**Sanity Project (2026-02-14):**
- Project ID: `lsivhm7f`
- Datasets: `production`, `staging`
- CORS Origins: `http://localhost:3000`, `https://nicharalambous.com`, `https://d18g1r3g4snekl.cloudfront.net`

**Live staging URL:** https://d18g1r3g4snekl.cloudfront.net (homepage returns 200, auto-deploys on push)

### Block 2: Scaffold 🟩

**Depends on:** Block 1 (repo exists, CI/CD works).
**Done when:** The site has a working layout, navigation, and deploys automatically on push.

- [x] Initialize Next.js project with App Router + TypeScript + static export (`output: "export"` in `next.config.ts`)
- [x] Install and configure Tailwind CSS v4 (with `@tailwindcss/typography` plugin)
- [x] Install and configure `next-sanity` + Sanity client (`lib/sanity/client.ts`, `lib/sanity/image.ts`)
- [x] Create base layout: header, navigation, footer (`app/layout.tsx`, `components/header.tsx`, `components/footer.tsx`)
- [x] Create reusable components: JSON-LD injector, CTA button, section wrapper (`components/json-ld.tsx`, `components/cta-button.tsx`, `components/section.tsx`)
- [x] Create shared metadata utilities with structured data helpers (`lib/metadata.ts`)
- [x] Create typography and spacing design tokens (`app/globals.css` with `@theme`)
- [x] Set up `next-sitemap` for automatic sitemap generation (`next-sitemap.config.js`)
- [x] Create 404 page (`app/not-found.tsx`)
- [x] Verify: `npm run build` succeeds, static export to `out/`, homepage returns 200, 404 page returns 404

**Build verification (2026-02-14):**
- `next build` compiles successfully in 3.4s
- Static export generates: `index.html` (32KB), `404.html` (25KB), `llms.txt`
- Sitemap generated: `sitemap.xml` + `sitemap-0.xml`
- First Load JS: 106KB (homepage), 102KB (404)
- Dev server: `localhost:3000` returns 200 for `/`, 404 for unknown routes

### Block 3: CMS 🟩

**Depends on:** Block 2 (Next.js project exists, Sanity client configured).
**Done when:** All schemas are defined, Studio works, content flows from Sanity to Next.js, webhook triggers rebuild.

- [x] Initialize Sanity Studio (embedded at `/studio` — `app/studio/page.tsx` + `studio-client.tsx`)
- [x] Define schemas: `siteSettings`, `author`, `speaker` (singletons in `sanity/schemas/singletons/`)
- [x] Define schemas: `keynote`, `topicHub`, `post` (with AI workflow fields: `contentStatus`, `sourceReferences`, `targetKeywords`, `optimizationNotes`, `originalUrl`, `rawHtmlBody`) in `sanity/schemas/documents/`
- [x] Define schemas: `book`, `mediaAppearance`, `testimonial`, `business`, `redirect` in `sanity/schemas/documents/`
- [x] Define reusable objects: `seoFields`, `portableTextBody` (with videoEmbed, codeBlock, pullQuote custom blocks) in `sanity/schemas/objects/`
- [x] Configure Studio: document structure with grouped navigation, custom views for content status filtering (published/ai-draft/in-review/archived)
- [x] Create `staging` and `production` datasets (Sanity Project ID: `lsivhm7f`)
- [x] Configure CORS origins for local dev and production domains
- [x] Set up Sanity webhook → GitHub Actions (rebuild on publish) — `repository_dispatch` trigger added to deploy.yml; Sanity webhook config documented below
- [x] Verify: GROQ queries fetch data, pages render with fallback content at build time (verified in static export)

**Schema inventory (13 types):**
- Singletons (3): `siteSettings`, `author`, `speaker`
- Documents (8): `keynote`, `topicHub`, `post`, `book`, `mediaAppearance`, `testimonial`, `business`, `redirect`
- Objects (2): `seoFields`, `portableTextBody`

**Build verification (2026-02-14):**
- All schemas compile and type-check successfully
- Studio page renders at `/studio` (1.51MB client-side bundle)
- `npm run build` succeeds with 10 static pages (including speaker + keynotes from early Block 4 work)
- CI/CD pipeline passes (GitHub Actions Run #6) and deploys to CloudFront
- Live at: https://d18g1r3g4snekl.cloudfront.net
- Sanity Project ID `lsivhm7f` wired into `.env.local` and GitHub Secrets

**Content flow verification (2026-02-15):**
- GROQ queries fetch from Sanity CDN API vbefore you do that, there is an item in block 4 that is incomplete: "Configure Sanity webhook GitHub actions." Is that incomplete by error or is that work still to be doneia native fetch (no `next-sanity` in server components)
- Pages render with fallback data when Sanity has no content
- Static export generates all pages correctly: speaker, keynotes listing, 3 keynote detail pages
- `repository_dispatch` trigger added to deploy.yml for Sanity webhook integration

### Block 4: Money Pages 🟩

**Depends on:** Block 3 (CMS schemas exist, content flows).
**Done when:** `/speaker` and `/keynotes/*` pages render with real content, structured data validates.

- [x] Build `/speaker` page template (sections: why book Nic, keynote topics, how virtual delivery works, client logos, testimonials, FAQ, CTA) — CMS-driven with hardcoded fallbacks
- [x] Build `/keynotes` listing page — CMS-driven with hardcoded fallbacks
- [x] Build `/keynotes/[slug]` dynamic page — CMS-driven with hardcoded fallbacks, `generateStaticParams` fetches slugs from Sanity
- [x] Implement JSON-LD: `Service` + `FAQPage` on speaker page, `Service` on keynote pages
- [x] Configure Sanity webhook → GitHub Actions (GitHub PAT created, webhook configured in Sanity dashboard with projection body)
- [x] Create speaker page content in Sanity — seeded via API: headline, subheadline, whyBookNic (Portable Text), howVirtualWorks (Portable Text), asSeenAt, FAQ (5 items), CTA text
- [x] Create all keynote content in Sanity — 3 keynotes seeded: Reclaiming Focus, Breakthrough Teams, Curiosity Catalyst (each with Portable Text description, outcomes, audiences, delivery format)
- [x] Add testimonials to Sanity and display on speaker/keynote pages — 3 placeholder testimonials seeded, referenced by speaker page and individual keynotes
- [x] Verify: pages render with CMS content, JSON-LD validates (Person, WebSite, Service, FAQPage with 5 Q&As), internal links verified (/speaker ↔ /keynotes ↔ /contact)

**Architecture notes (2026-02-15):**
- Pages use `@/lib/sanity/client` which is a lightweight native-fetch wrapper (NOT `next-sanity`). The `next-sanity` package registers server actions internally, which are incompatible with `output: "export"`. The import chain is carefully managed: `page → queries → client (native fetch)` and `page → portable-text → image (uses projectId/dataset directly, not next-sanity client)`.
- `next-sanity` is only imported in the Sanity Studio client component (`"use client"`), which is safe.
- All pages fall back to hardcoded content when Sanity returns no data, so the site works before content is entered in the CMS.
- GROQ queries are in `lib/sanity/queries.ts` with full TypeScript interfaces.
- Portable Text renderer in `components/portable-text.tsx` handles all custom blocks (video, code, pull quotes).

**Sanity webhook setup (manual steps required):**
1. Create a GitHub Personal Access Token (fine-grained) at https://github.com/settings/tokens with `Contents: Read` permission for the `nihcarry/nicharalambous.com` repo
2. In Sanity dashboard (https://www.sanity.io/manage → project → API → Webhooks), create a webhook:
   - Name: `Deploy on publish`
   - URL: `https://api.github.com/repos/nihcarry/nicharalambous.com/dispatches`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["speaker", "keynote", "topicHub", "post", "book", "testimonial", "mediaAppearance", "siteSettings"]`
   - HTTP method: POST
   - HTTP Headers: `Authorization: Bearer <YOUR_GITHUB_PAT>`, `Accept: application/vnd.github.v3+json`
   - HTTP body: `{"event_type": "sanity-content-update"}`
   - Dataset: `production`
   - Status: Enabled

### Block 5: Supporting Pages 🟩

**Depends on:** Block 3 (CMS schemas exist). Can run in parallel with Block 4.
**Done when:** All supporting pages render with real content.

- [x] Build homepage (hero + featured keynotes + recent posts + social proof) — CMS-driven with hardcoded fallbacks, shows recent posts when available
- [x] Build `/about` page (bio, businesses/exits timeline, media logos) — timeline with exit badges, key facts, media logos, book teasers
- [x] Build `/books` listing and `/books/[slug]` pages — cover images, buy links, Portable Text descriptions, Book JSON-LD
- [x] Build `/media` page (press, podcasts, videos) — grouped by type (podcast/video/press/broadcast), media outlet logos
- [x] Build `/contact` page with booking form (Formspree) — 10-field structured inquiry form, client component with server metadata wrapper
- [x] Build `/topics` listing and `/topics/[slug]` hub pages — 7 topic hubs with definition, why it matters, related keynotes, featured posts, cross-topic navigation
- [ ] Create content for all supporting pages in Sanity (including 7 topic hub pages) — *deferred: pages work with hardcoded fallbacks, CMS content can be added anytime*
- [x] Implement JSON-LD for all page types — AboutPage, Book, CollectionPage, ContactPage added to `lib/metadata.ts`
- [x] Verify: all pages render (24 static pages), `npm run build` passes, sitemap generates, no linter errors

**Architecture notes (2026-02-15):**
- All pages follow the established pattern: async server component → GROQ query → CMS data || hardcoded fallback
- Contact form split into server page (metadata export) + client component (`contact-form.tsx`) for form interactivity
- GROQ queries added: homepage (featured keynotes, recent posts, testimonials), about (businesses, site settings), books (list + by slug), media appearances, topic hubs (list + by slug + posts by topic)
- TypeScript interfaces for all new query shapes in `lib/sanity/queries.ts`
- New JSON-LD helpers: `bookJsonLd()`, `collectionPageJsonLd()`, `contactPageJsonLd()`, `aboutPageJsonLd()`
- Formspree endpoint configurable via `NEXT_PUBLIC_FORMSPREE_ENDPOINT` env var
- Topic hub pages include cross-topic navigation and "Explore as a keynote" sections linking to /speaker

**Build verification (2026-02-15):**
- `next build` compiles successfully in 5.4s
- Static export generates 24 pages including all new routes
- All dynamic pages generate via `generateStaticParams`: 2 book slugs, 7 topic slugs
- First Load JS: 106KB (pages), 104KB (contact form), 1.61MB (studio)
- Sitemap generated: `sitemap-0.xml` with all new routes
- No TypeScript errors, no linter errors

### Block 6: Blog System 🟩

**Depends on:** Block 3 (post schema exists). Can run in parallel with Blocks 4-5.
**Done when:** Blog listing, individual posts, and archive template all render. RSS works. Blog template supports both Portable Text (`body`) and raw HTML (`rawHtmlBody`) for as-is Medium/Substack imports.

- [x] Build `/blog` listing page with pagination — client-side pagination (12 posts/page) with `BlogList` component
- [x] Build `/blog/[slug]` post template — supports `body` (Portable Text) and `rawHtmlBody` (for as-is imports). Includes: TL;DR, body, FAQ section, topic hub links, related posts, contextual CTA
- [x] Build FAQ component (`FaqSection`) — expand/collapse Q&A pairs, used on blog posts and any page with FAQ content
- [x] Build `/archive/[slug]` template — basic rendering of raw HTML, "From the archive" banner, link to `/blog`, `noIndex` metadata
- [x] Implement topic filtering on blog listing — topic filter chips in `BlogList` component, client-side filtering
- [x] Add "Related posts" component (`RelatedPosts`) — displays up to 3 posts from same topic hub, excludes current post
- [x] Add contextual CTA component (`ContextualCta`) — links to related keynote when set, falls back to generic /speaker CTA
- [x] Implement `Article` + `FAQPage` JSON-LD on blog posts — `articleJsonLd()` always present, `faqJsonLd()` when FAQs exist
- [x] Generate RSS feed (`/rss.xml`) — route handler with `force-static`, RSS 2.0, latest 50 posts, Atom self-link
- [x] Verify: `npm run build` passes, 28 static pages generated (25 HTML + RSS + sitemaps), all routes compile

**Architecture notes (2026-02-15):**
- Blog listing uses a server/client split: server component fetches all posts from Sanity, passes to `BlogList` client component for interactive pagination and topic filtering. All data embedded in static HTML.
- Blog post template supports dual rendering: Portable Text (`body`) for new/optimized posts, raw HTML (`rawHtmlBody`) for as-is Medium/Substack imports. Falls back to `descriptionText` array for placeholder posts.
- GROQ queries added: blog listing (all published), blog post by slug (full data), blog post slugs (for generateStaticParams), related posts (same topic, excluding current), archive post by slug, archive slugs, blog topic filters, RSS feed posts
- TypeScript interfaces: `BlogPostListItem`, `BlogPostData`, `ArchivePostData`, `RelatedPostItem`, `RssFeedPost`
- New components: `FaqSection` (client, expand/collapse), `BlogList` (client, pagination + filtering), `RelatedPosts` (server), `ContextualCta` (server)
- RSS feed generated at `/rss.xml` via Next.js route handler with `dynamic = "force-static"` for static export compatibility
- Added `accent-50` and `accent-800` to Tailwind theme tokens for blog UI elements
- RSS feed discoverable via `<link>` tag in root layout (`alternates.types`)
- `lib/sanity/client.ts` param type widened to `Record<string, string | string[]>` to support GROQ array params (related posts query)

**Next.js static export note:**
- `generateStaticParams()` must return at least one entry with `output: "export"` — returning an empty array triggers a misleading "missing generateStaticParams" build error (Next.js 15.5.12). All dynamic routes use `FALLBACK_SLUGS` to ensure non-empty arrays, matching the pattern established in Blocks 4-5.

**Build verification (2026-02-15):**
- `next build` compiles successfully in ~7s
- Static export generates 28 pages including all new blog routes
- Dynamic pages: `/blog/placeholder`, `/archive/placeholder` (from fallback slugs, replaced by real slugs when Sanity has content)
- RSS feed: valid XML at `/rss.xml` with proper escaping and Atom self-link
- First Load JS: 106KB (blog post), 107KB (blog listing with client component), 106KB (archive)
- Sitemap generated: all new routes included in `sitemap-0.xml`
- No TypeScript errors, no linter errors

### Block 7a: Medium & Substack Inventory + Parsing (launch-blocking)

**Depends on:** Block 6 (blog template exists).
**Done when:** You have structured JSON for every Medium and Substack article in `Legacy Content/` and a complete inventory CSV. HTML is cleaned and ready for enrichment.

Launch blog content comes from Medium + Substack only. Squarespace XML is deferred to Block 11 (archive).

**Content approach (decided 2026-02-15):** Three levels of optimization apply to imported content:
- **Level 1 — HTML cleanup (this block):** Strip platform-specific markup (Medium's nested `<div>`/`<section>` wrappers, Substack's newsletter chrome), preserve semantic HTML (`<p>`, `<h2>`, `<h3>`, `<blockquote>`, `<ul>`, `<ol>`, `<a>`, `<img>`, `<em>`, `<strong>`). Keep all image `src` URLs pointing to original hosts (Medium CDN, Substack CDN). **No copy changes.**
- **Level 2 — AI metadata generation (Block 7b):** For each article, use AI to generate: excerpt/TL;DR, 5 FAQs, SEO title + meta description, topic hub assignment, related keynote mapping, target keywords, estimated read time. **No copy changes** — the article body stays exactly as written. This populates every field the blog template uses (TL;DR block, FAQ section + JSON-LD, topic links, contextual CTA, Article structured data).
- **Level 3 — Copy rewriting (deferred to post-launch):** Full AI-assisted rewrite of article body with SEO-optimized structure, keyword placement, updated frameworks, current voice. **Not done in Block 7.** Can be done selectively on high-priority articles later.

Source material:
- `Legacy Content/Medium Articles/` — 158 published HTML (2013–2019), 63 drafts (prefixed `draft_`)
- `Legacy Content/Substack Articles/` — 23 HTML articles, 24 CSV stats files (ignored)

- [x] Build parser script: Medium HTML (`Legacy Content/Medium Articles/*.html`) → structured JSON (title, slug, publishedAt, cleaned body HTML, originalUrl, wordCount) — `scripts/parse-medium.ts` — 158 published + 52 drafts parsed, 11 empty drafts skipped
- [x] Build parser script: Substack HTML (`Legacy Content/Substack Articles/*.html`) → structured JSON (title, slug, publishedAt, cleaned body HTML, originalUrl, wordCount) — `scripts/parse-substack.ts` — 20 articles parsed, 3 empty skipped. Dates extracted from companion CSV delivery timestamps where available (12 of 20).
- [x] Generate combined inventory CSV: `id, title, slug, publishedAt, source (medium|substack), sourceUrl, newUrl, hasImages, wordCount` — `scripts/generate-inventory.ts` → `scripts/output/inventory.csv` (230 articles)
- [x] Flag any duplicate slugs across Medium + Substack; resolve with `-{yyyy}` suffix for older post — 0 cross-source duplicates. 2 within-Medium collisions resolved with `-2` suffix (same title, different content).
- [x] Decide on Medium drafts (63 files prefixed `draft_`): 52 drafts with content imported as `contentStatus: "ai-draft"`, 11 empty drafts skipped
- [x] Verify: inventory CSV is complete and every article in both folders is accounted for — 221 Medium (210 parsed + 11 empty) + 23 Substack (20 parsed + 3 empty) = 244 source files, 230 articles in inventory

**Note:** Squarespace export (`Legacy Content/Squarespace-Wordpress-Export-*.xml`) is not parsed in this block. It is inventoried in Block 11 when the archive is imported.

### Block 7b: AI Metadata Enrichment + Import Tooling (launch-blocking)

**Depends on:** Block 7a (parsed JSON + inventory exists).
**Done when:** AI enrichment pipeline generates metadata for all articles. Sanity importer works correctly on a sample of 5 articles. Posts render with full SEO fields populated.

Every article gets AI-generated metadata while preserving the original body copy unchanged. This ensures every post goes live with full SEO/GEO value from day one.

- [x] Build enrichment script (`scripts/enrich-articles.ts`) — local text analysis, no external API needed. Generates:
  - `excerpt` — first paragraph sentences, max 200 chars
  - `faq` — 5 Q&A pairs from article headings + surrounding paragraphs
  - `seo.seoTitle` — cleaned title, max 70 chars
  - `seo.seoDescription` — first paragraph sentence, max 160 chars
  - `topics` — 1-3 topic hub assignments via keyword frequency matching
  - `relatedKeynote` — derived from primary topic via topic→keynote mapping
  - `targetKeywords` — 3-5 keywords from title, headings, and frequent bigrams
  - `estimatedReadTime` — word count / 225 wpm
- [x] Run enrichment on full article set — all 230 articles enriched in <2 seconds. Output: `scripts/output/enriched/`
- [x] Spot-check enriched articles: topic assignments accurate, excerpts from first paragraphs, heading-based FAQs working. Minor keyword noise acceptable for launch (refinable in Studio).
- [x] Build Sanity import script (`scripts/import-to-sanity.ts`): creates `post` documents with `rawHtmlBody` + all enriched metadata fields. Uses deterministic `_id` (imported-{source}-{slug}) for safe re-runs. Auto-creates 7 topic hub documents if missing. Supports --dataset, --sample, --only, --dry-run flags.
- [x] Ensure blog template renders enriched posts correctly (TL;DR block, FAQ section, topic links, contextual CTA, JSON-LD)
- [x] **Sample run:** 5 articles imported to Sanity `staging` dataset with 7 topic hubs. 3 keynotes exist in production but not staging (expected). All posts have 3 topics, FAQs, and excerpts.
- [x] Import sample articles to Sanity `staging` dataset — 5 posts, 0 failures
- [x] Verify in Next.js: formatting, FAQ section, topic hub links, contextual CTA, Article + FAQPage JSON-LD, RSS feed — all 5 sample posts verified on production dataset
- [x] Fix rawHtmlBody styling gaps: added Tailwind utility classes for `h4` (265 uses), `figure` (224), `figcaption` (87), `hr` (36), `iframe` (16), `li` text sizing, and `s` (strikethrough) to blog post template
- [x] Verified: Blog listing shows all 5 posts with topic filters + pagination. Homepage shows 3 most recent posts. RSS feed includes all 5 articles. Every article has Article + FAQPage JSON-LD, TL;DR block, FAQ section, topic hub links, contextual keynote CTA, and bottom speaker CTA. Keynote mappings: burnout→reclaiming-focus, advice→curiosity-catalyst, social-media→reclaiming-focus, no-clue→curiosity-catalyst, email→breakthrough-product-teams.

### Block 7c: Full Medium & Substack Import (launch-blocking)

**Depends on:** Block 7b (enrichment + import tooling validated on sample articles).
**Done when:** All Medium and Substack articles are in Sanity as published blog posts with full metadata. Topic hub pages show related posts. RSS feed populated.

- [x] Slug collisions resolved in Block 7a — cross-source and intra-source collisions handled with numeric suffixes. No unresolved collisions remain.
- [x] Import all 230 articles to Sanity production — 210 Medium + 20 Substack. 178 published, 52 ai-draft. 5 batches, 0 failures. Deterministic IDs: `imported-{source}-{slug}`.
- [x] Spot-check migrated posts: 5 diverse articles verified (oldest, newest, mid, Substack, Medium). All render with TL;DR, FAQ section, topic links (3 each), contextual keynote CTA, bottom speaker CTA, Article + FAQPage JSON-LD.
- [x] Verify topic hub pages show related posts — added dynamic "Recent Articles" section using `postsByTopicQuery`. All 7 hubs show 10 posts each. Topic distribution: Curiosity (138), Entrepreneurship (149), Innovation (104), Failure (82), Focus (56), Agency (51), AI (12).
- [x] Verify homepage shows 3 most recent posts with excerpts
- [x] Verify RSS feed: 50 items (capped per query design, newest first)
- [x] Blog listing: 178 published posts with topic filters and client-side pagination (12 per page)
- [ ] Generate redirect map: Squarespace old URLs → catch-all (e.g. `/blog`) until Block 11 archive import. (Medium/Substack content is net-new on this domain; no legacy URL redirects needed for those.)

**Critical build fix (2026-02-15):**
- `lib/sanity/client.ts` changed from `cache: "no-store"` to `cache: "force-cache"`. Next.js 15 treats `no-store` as `revalidate: 0` (dynamic rendering), which is incompatible with `output: "export"`. This caused all blog posts to generate as empty error shells (`<html id="__next_error__">`) during static build. The fix allows SSG to work correctly. **Do not revert to `no-store`.**
- `tsconfig.json` excludes `scripts/` from TypeScript compilation. The import tooling scripts use cheerio types that conflict with Next.js build. Scripts run via `npx tsx` independently.

**CI/CD gotcha — bulk imports trigger webhook storms:**
- The Sanity webhook fires a `repository_dispatch` event for every document create/update. Importing 230 articles triggered 230+ GitHub Actions runs, each rebuilding and deploying the site. During the import, these runs were deploying the old (broken) build, overwriting manual deploys of the fixed build. Resolution: cancelled all old-SHA runs via GitHub API, pushed the `force-cache` fix to main, and let the push-triggered build deploy correctly. **For future bulk imports:** consider temporarily disabling the Sanity webhook in the Sanity dashboard before importing, then re-enabling and triggering a single manual rebuild after.

**Production URL status (2026-02-15):**
- CloudFront (`d18g1r3g4snekl.cloudfront.net`) serving full site: 178 published blog posts with TL;DR, FAQ, topic links, contextual CTAs, Article + FAQPage JSON-LD. Blog listing with pagination and topic filters. Homepage with 3 recent posts. RSS feed with 50 items. All static pages (speaker, keynotes, topics, about, books, contact, media) returning 200.

### Block 8: Launch Features

**Depends on:** Blocks 4-7c (all pages + core blog posts exist).
**Done when:** Redirects are deployed, search works, analytics are configured, and all remaining launch features are implemented.

This block completes the remaining implementation work. No QA yet — that's Block 9.

- [ ] Deploy all redirects via CloudFront Function (pattern rule + exact-match map)
- [ ] Create and deploy `llms.txt`
- [ ] Create and deploy `robots.txt` (block `/studio` and draft/preview routes only)
- [ ] Implement client-side search with Pagefind
- [ ] Set up Google Search Console and verify ownership
- [ ] Set up GA4 with conversion events (form submissions, CTA clicks)

### Block 9: QA & Launch Prep

**Depends on:** Block 8 (all features implemented).
**Done when:** Full crawl shows no broken links, all structured data validates, redirects verified, Lighthouse >95 on key pages, forms and mobile tested.

This is a pure verification pass. No new features — only testing and fixing what's already built.

- [ ] Verify all sitemaps generate correctly (segmented by content type)
- [ ] Audit internal linking: confirm `/speaker` is the most internally-linked page
- [ ] Audit all pages have unique title tags, meta descriptions, OG images
- [ ] Verify JSON-LD with Google Rich Results Test on all template types
- [ ] Full crawl with Screaming Frog or `linkinator`: no broken links, no missing meta, no orphan pages
- [ ] Test redirects: sample 50+ old URLs, verify correct 301 destinations
- [ ] Test forms submit correctly
- [ ] Test on mobile devices and multiple browsers
- [ ] Run Lighthouse audit on key pages — target >95 performance

### Block 10: Launch

**Depends on:** Block 9 (everything verified).
**Done when:** DNS points to CloudFront, site is live, Search Console is receiving data.

The site launches with: all main pages, Medium + Substack blog posts (imported as-is), topic hubs, keynote pages, redirects, and analytics. Squarespace archive is not imported yet — that happens in Block 11.

- [ ] Final content review in Sanity production
- [ ] Switch DNS from Squarespace to CloudFront
- [ ] Submit sitemaps to Google Search Console
- [ ] Request indexing for key pages (`/speaker`, `/keynotes/*`, topic hubs)
- [ ] Monitor crawl errors in Search Console
- [ ] Keep Squarespace site active (but redirecting) for 30 days as safety net

---

**--- LAUNCH LINE ---**

Everything below happens after the site is live. None of it blocks launch.

---

### Block 11: Squarespace Archive Import (post-launch)

**Depends on:** Block 10 (site is live, redirects are working).
**Done when:** All Squarespace/WordPress export content is in Sanity as `archived`, `/archive/{slug}` pages render, redirects updated to point to archive URLs instead of catch-all.

This block processes the full Squarespace WordPress XML in `Legacy Content/`. All of it goes to archive — no launch triage.

- [ ] Build parser: `Legacy Content/Squarespace-Wordpress-Export-*.xml` → structured JSON inventory
- [ ] Generate inventory CSV: `id, title, slug, publishedAt, oldUrl, newUrl, hasImages, hasEmbeds, wordCount`
- [ ] Import all Squarespace posts to Sanity as `contentStatus: "archived"` with `rawHtmlBody`
- [ ] Flag and resolve duplicate slugs (higher-value or more recent keeps `/archive/{slug}`, other gets `/archive/{slug}-{yyyy}`)
- [ ] AI agent categorizes each archive post by topic cluster and scores quality
- [ ] Verify `/archive/{slug}` pages render correctly
- [ ] Update redirect map: Squarespace old URLs now point to `/archive/{slug}` instead of catch-all
- [ ] Deploy updated CloudFront Function with new redirect destinations

### Block 12: AI Content Pipeline (post-launch)

**Depends on:** Block 11 (archive posts are in Sanity).
**Done when:** This is ongoing — it doesn't "finish." The pipeline runs as long as the site exists.

- [ ] Set up AI agent access to Sanity API (read archive posts, create/update drafts)
- [ ] Create prompt templates referencing voice corpus (`nicharalambous-voice-training/`)
- [ ] Define target keywords per topic cluster (from SEO strategy document)
- [ ] **Calibration batch:** AI agent optimizes 20-30 archive posts across all 7 topic clusters
- [ ] You review calibration batch — check voice, keyword integration, internal links, readability
- [ ] Adjust agent approach based on review
- [ ] **Scale batch:** AI agent optimizes remaining high-potential archive posts
- [ ] **New content batch:** AI agent generates new posts from keynote transcripts and books, targeting keyword gaps
- [ ] You review all drafts in batches
- [ ] Approved posts: `contentStatus` → `published`, move from `/archive/` to `/blog/`
- [ ] All optimized posts have internal links to their topic hub and (where relevant) a keynote page

### Ongoing Operations

**Manual content:** You post through Sanity Studio whenever you want. Normal workflow, unrelated to the AI pipeline.

**AI pipeline (continuing):**
- Continue optimizing archive posts and promoting to `/blog/`
- Generate new content targeting keyword gaps from Search Console data
- Refresh existing posts when performance declines

**SEO maintenance:**
- Monitor Search Console for crawl errors, indexing issues, ranking changes
- Update `llms.txt` as content changes
- Monitor AI citations (ChatGPT, Perplexity, Google AI Overview)
- Keep FAQ sections current
- Maintain consistent one-line bio across all platforms

**Content growth:**
- Mine archive for posts that map to topic clusters
- Create definitive guides for each topic hub (pillar content)
- Repurpose book chapters as blog posts
- Pitch podcast appearances and link back to `/speaker`
- Encourage past clients to leave attributed testimonials
- Cancel Squarespace subscription after 30 days of stable operation

---

## Appendix A: Estimated Costs

### Monthly Recurring

| Service | Cost |
|---|---|
| AWS (S3 + CloudFront + Route53) | $3-8/month |
| Sanity.io (Free tier) | $0/month |
| Formspree (Free tier, 50 submissions/month) | $0/month |
| Domain renewal | ~$1/month (amortized) |
| **Total** | **$4-9/month** |

### vs. Current Squarespace

| | Squarespace | New Stack |
|---|---|---|
| Monthly cost | $16-49/month | $4-9/month |
| SEO control | Limited | Full |
| Performance | Squarespace-dependent | Excellent (static CDN) |
| Content flexibility | Template-bound | Unlimited |
| AI content pipeline | Not possible | Built-in |

---

## Appendix B: Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Migration breaks old URLs | High — loss of existing (modest) SEO equity | Comprehensive redirect map with pattern + exact-match rules. Test every URL before launch. |
| Temporary ranking dip after migration | Medium — normal for site migrations | Keep Squarespace redirecting for 30 days. Monitor Search Console daily post-launch. |
| AI-generated content sounds off-brand | Medium — damages trust if published without review | Calibration batch before scaling. You review every draft before publish. Voice corpus ensures grounding. |
| Slug collisions during URL flattening | Medium — could cause wrong redirects | Detect during inventory parsing. Resolve deterministically (higher-value post wins). |
| Squarespace export misses content | Medium — some content types may not export | Cross-reference export against live sitemap. Fill gaps manually. |
| Sanity free tier limits exceeded | Low — 500K API requests/month is generous | API only called at build time, not per visitor. Static site means near-zero API usage in production. |
| Image migration misses assets | Low (for top-tier), acceptable (for archive) | Archive posts keep original Squarespace URLs. Scrape and verify images for top-tier posts only. |

---

## Appendix C: Voice Corpus Inventory

These files live in `nicharalambous-voice-training/` and serve as the AI agent's reference material:

| File | Type | Content |
|---|---|---|
| `Reclaiming-Focus-in-a-World-That-Profits-From-Your-Distraction_Keynote.md` | Keynote transcript | DIAL framework, digital addiction, focus, agency, boredom as catalyst |
| `how_to_build_breakthrough_Product_teams_Keynote.md` | Keynote transcript | Entrepreneurial teams, curiosity, innovation flywheel, high agency, failure as data |
| `Curiosity_Catalyst_keynote_transcript.md` | Keynote transcript | Stagnation hypothesis, wackovation, curiosity as god particle, T-shaped people, experimentation |
| `Business_Builders_Toolkit_Nic_Book.doc.md` | Full book | Starting businesses, planning, culture, leadership, customers (~380K chars) |
| `DO_FAIL_LEARN_REPEAT_Nic_Book.md` | Full book | Personal entrepreneurship memoir, failure, resilience, impostor phenomenon (~380K chars) |

---

*SEO strategy details are maintained separately in `nicharalambous-seo-strategy.md`.*

# nicharalambous.com — Build & Launch Plan (v2)

**Status:** In progress — Blocks 1-3 complete
**Overall Progress:** 25% (3/12 blocks)
**Last Updated:** 2026-02-14

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

### Export & Inventory

1. Export from Squarespace (WordPress XML format): Settings → Advanced → Import/Export
2. Build Node.js parser script: XML → structured JSON with title, slug, publish date, HTML body, featured image URL, categories/tags, original URL
3. Generate inventory CSV: `id, title, slug, publishedAt, oldUrl, newUrl, hasImages, hasEmbeds, wordCount, topicCluster, qualityScore`
4. AI agent categorizes each post by topic cluster and scores content quality

**Squarespace export limitations:**
- Images are URLs only (not included in export) — need separate scraping
- Some formatting may be lost
- Gallery blocks and embedded media need special handling

### Content Triage (simplified)

Two tiers, not four:

| Tier | Criteria | Action |
|---|---|---|
| **Optimize** (top 30-50) | Has measurable search traffic, strong backlinks, or high-quality evergreen content | Full Portable Text conversion, image migration, AI optimization, published at `/blog/{slug}` |
| **Archive** (everything else) | Low/no traffic, dated, or thin content | Raw HTML in basic template at `/archive/{slug}`, enters AI optimization queue |

Use Search Console click data + backlink data to identify the top tier. The decision is binary: optimize now, or archive for later.

**Default for genuinely toxic/embarrassing content:** 301 redirect to nearest relevant page. Reserve 410 (Gone) only for content that would actively harm the site's reputation. The bar for 410 is high.

### Image Migration

Only for top-tier posts at launch:
1. Scrape image URLs from top-tier post HTML
2. Download images locally
3. Optimize (resize, compress, WebP)
4. Upload to Sanity asset pipeline (CDN + on-the-fly transforms)
5. Update image references in Portable Text content

Archive posts keep their original Squarespace image URLs until they're promoted to `/blog/`.

### HTML → Portable Text Conversion

For top-tier posts only. Build a converter script that:
1. Takes HTML content
2. Converts to Portable Text using `@sanity/block-tools` or `html-to-portable-text`
3. Handles: YouTube/Vimeo embeds → `videoEmbed` block, code blocks → `codeBlock`, pull quotes → `pullQuote`, image galleries → `gallery`
4. Outputs Sanity-compatible document JSON

### Slug Collision Resolution

When flattening URLs from `/blog/YYYY/MM/DD/slug` to `/blog/slug`, collisions are possible across 17 years.

Resolution:
1. During inventory parsing, flag any duplicate slugs
2. The post with more search traffic or backlinks keeps `/blog/{slug}`
3. The other gets `/blog/{slug}-{yyyy}` using its publish year
4. Redirect map accounts for both resolved URLs

### Import to Sanity

1. Top-tier posts: import as Portable Text documents with `contentStatus: "published"`
2. Archive posts: import with raw HTML body and `contentStatus: "archived"`
3. All posts: preserve `publishedAt` dates, `originalUrl`, `rawHtmlBody`
4. Import to `staging` dataset first, verify, then promote to `production`

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

- [x] Create GitHub repository
- [x] Set up AWS: S3 bucket (`nicharalambous-com-site` in eu-central-1), CloudFront distribution (`E1ACQY3898IZF9`), ACM TLS certificate (us-east-1, pending DNS validation)
- [ ] Configure DNS (Namecheap → CloudFront CNAME) *(deferred to Block 10 — DNS switch is the final launch step)*
- [ ] Create Sanity.io project (free tier) *(in progress — project ID pending)*
- [ ] ACM certificate DNS validation *(add CNAME record in Namecheap — see notes below)*
- [x] Set up GitHub Actions CI/CD: build → deploy to S3 → CloudFront invalidation *(`.github/workflows/deploy.yml` — ready, needs AWS secrets)*
- [x] Create "coming soon" page and verify it builds

**Notes:**
- DNS is on Namecheap (not Route53). Updated from original plan.
- AWS CLI installed locally at `~/bin/aws`.
- `.env.example` created with all required environment variables.

**AWS Resources Created (2026-02-14):**
- S3 Bucket: `nicharalambous-com-site` (eu-central-1)
- CloudFront Distribution: `E1ACQY3898IZF9` → `d18g1r3g4snekl.cloudfront.net`
- CloudFront OAC: `E3VYUDWGN7RR8` (secure S3 access)
- ACM Certificate: `a8305c1c-803e-4dd7-8bbf-57bbfdebd3ae` (us-east-1, PENDING_VALIDATION)

**ACM DNS Validation Record (add to Namecheap):**
- Type: CNAME
- Host: `_38689a8e984b1e5d9773de76666528d1`
- Value: `_07243a3fd21d51a854eb4d84e8538d21.jkddzztszm.acm-validations.aws.`

**Live staging URL:** https://d18g1r3g4snekl.cloudfront.net (homepage returns 200)

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
- [ ] Create `staging` and `production` datasets *(needs Sanity project ID)*
- [ ] Set up Sanity webhook → GitHub Actions (rebuild on publish) *(needs Sanity project)*
- [ ] Verify: create test content, query via GROQ, confirm data renders in Next.js *(needs Sanity project)*

**Schema inventory (13 types):**
- Singletons (3): `siteSettings`, `author`, `speaker`
- Documents (8): `keynote`, `topicHub`, `post`, `book`, `mediaAppearance`, `testimonial`, `business`, `redirect`
- Objects (2): `seoFields`, `portableTextBody`

**Build verification (2026-02-14):**
- All schemas compile and type-check successfully
- Studio page renders at `/studio` (1.51MB client-side bundle)
- `npm run build` succeeds with 5 static pages: `/`, `/studio`, `/_not-found`
- Deployed to CloudFront: https://d18g1r3g4snekl.cloudfront.net

### Block 4: Money Pages

**Depends on:** Block 3 (CMS schemas exist, content flows).
**Done when:** `/speaker` and `/keynotes/*` pages render with real content, structured data validates.

- [ ] Build `/speaker` page template (sections: why book Nic, keynote topics, how virtual delivery works, client logos, testimonials, FAQ, CTA)
- [ ] Build `/keynotes` listing page
- [ ] Build `/keynotes/[slug]` dynamic page
- [ ] Implement JSON-LD: `Service` + `FAQPage` on speaker page, `Service` + `VideoObject` on keynote pages
- [ ] Create speaker page content in Sanity
- [ ] Create all keynote content in Sanity
- [ ] Add testimonials to Sanity and display on speaker/keynote pages
- [ ] Verify: pages render, structured data validates (Google Rich Results Test), internal links work

### Block 5: Supporting Pages

**Depends on:** Block 3 (CMS schemas exist). Can run in parallel with Block 4.
**Done when:** All supporting pages render with real content.

- [ ] Build homepage (hero + featured keynotes + recent posts + social proof)
- [ ] Build `/about` page (bio, businesses/exits timeline, media logos)
- [ ] Build `/books` listing and `/books/[slug]` pages
- [ ] Build `/media` page (press, podcasts, videos)
- [ ] Build `/contact` page with booking form (Formspree/Formspark)
- [ ] Build `/topics` listing and `/topics/[slug]` hub pages
- [ ] Create content for all supporting pages in Sanity (including 7 topic hub pages)
- [ ] Implement JSON-LD for all page types
- [ ] Verify: all pages render, all internal links work, all structured data validates

### Block 6: Blog System

**Depends on:** Block 3 (post schema exists). Can run in parallel with Blocks 4-5.
**Done when:** Blog listing, individual posts, and archive template all render. RSS works.

- [ ] Build `/blog` listing page with pagination
- [ ] Build `/blog/[slug]` post template (TL;DR, body, key takeaways, FAQ section, related topic hub link, related keynote link, CTA)
- [ ] Build FAQ component (renders 5 Q&A pairs with `FAQPage` JSON-LD)
- [ ] Build `/archive/[slug]` template (basic rendering of raw HTML, "From the archive" banner, link to `/blog`)
- [ ] Implement topic filtering on blog listing
- [ ] Add "Related posts" component (same topic hub)
- [ ] Add contextual CTA component (links to relevant keynote)
- [ ] Implement `Article` + `FAQPage` JSON-LD on blog posts
- [ ] Generate RSS feed (`/rss.xml`)
- [ ] Verify: create test posts in Sanity, confirm rendering, pagination, RSS, archive template

### Block 7a: Export & Inventory (launch-blocking)

**Depends on:** Block 6 (blog template exists).
**Done when:** You have structured JSON for every Squarespace post and a triage CSV that categorizes each post as "optimize" or "archive."

This is the first of three migration sub-blocks. The full archive import happens post-launch (Block 12).

- [ ] Export content from Squarespace (WordPress XML format)
- [ ] Build parser script: XML → structured JSON inventory
- [ ] Generate inventory CSV: `id, title, slug, publishedAt, oldUrl, newUrl, hasImages, hasEmbeds, wordCount, topicCluster, qualityScore`
- [ ] Identify top 30-50 posts using Search Console data + content quality
- [ ] Flag any duplicate slugs in the inventory (from URL flattening)
- [ ] Verify: inventory CSV is complete and every post in the Squarespace export is accounted for

### Block 7b: Conversion Tooling (launch-blocking)

**Depends on:** Block 7a (inventory exists, top-tier posts identified).
**Done when:** The image scraper, HTML → Portable Text converter, and Sanity importer all work correctly on a sample of 5 posts.

Build and validate all migration tooling before running the full batch.

- [ ] Build image scraper: download images for top-tier posts from Squarespace CDN
- [ ] Build HTML → Portable Text converter script (handle: embeds, code blocks, galleries, pull quotes)
- [ ] Build Sanity import script (creates documents with correct schema, preserves dates, sets `contentStatus`)
- [ ] **Sample run:** Pick 5 posts spanning different content types (one with embeds, one with images, one with code blocks, etc.)
- [ ] Run image scraper → upload to Sanity asset pipeline on sample posts
- [ ] Run HTML → Portable Text conversion on sample posts
- [ ] Import sample posts to Sanity `staging` dataset
- [ ] Verify: sample posts render correctly in Next.js — check formatting, images, embeds, links, metadata
- [ ] Fix any conversion or import issues before proceeding

### Block 7c: Full Migration Run (launch-blocking)

**Depends on:** Block 7b (tooling validated on sample posts).
**Done when:** Top 30-50 posts are in Sanity as published blog posts. Redirect map covers ALL old URLs (pointing either to `/blog/{slug}` for migrated posts or to a catch-all for everything else).

- [ ] Run image scraper and upload for all top-tier posts
- [ ] Run HTML → Portable Text conversion on all top-tier posts
- [ ] Resolve any slug collisions (higher-value post keeps `/blog/{slug}`, other gets `/blog/{slug}-{yyyy}`)
- [ ] Import all top-tier posts to Sanity as `contentStatus: "published"`
- [ ] Spot-check all migrated posts for formatting, images, embeds
- [ ] Fix conversion issues, re-import as needed
- [ ] Generate redirect map: old URL → new `/blog/{slug}` for migrated posts, old URL → catch-all (e.g. `/blog`) for everything else until archive is imported

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

The site launches with: all main pages, core blog posts, topic hubs, keynote pages, redirects, and analytics. No archive yet.

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

### Block 11: Archive Import (post-launch)

**Depends on:** Block 10 (site is live, redirects are working).
**Done when:** All remaining blog posts are in Sanity as `archived`, `/archive/{slug}` pages render, redirects updated to point to archive URLs instead of catch-all.

- [ ] Import all remaining posts to Sanity as `contentStatus: "archived"` with `rawHtmlBody`
- [ ] AI agent categorizes each archive post by topic cluster and scores quality
- [ ] Verify `/archive/{slug}` pages render correctly
- [ ] Update redirect map: old URLs now point to `/archive/{slug}` instead of catch-all
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

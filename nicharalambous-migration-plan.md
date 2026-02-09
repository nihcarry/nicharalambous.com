# nicharalambous.com Migration & Rebuild Plan

**Overall Progress:** `0%`

---

## Part 1: Critical Review of the ChatGPT SEO/GEO Strategy

### What the ChatGPT plan gets right

1. **Clear primary keyword focus.** Centering on "virtual keynote speaker" as the commercial keyword is sound. It has clear transactional intent — someone searching this wants to hire.
2. **Internal linking hierarchy.** The idea that authority flows upward from blog → topic hubs → keynotes → speaker page is textbook SEO architecture and correct.
3. **GEO awareness.** Including `llms.txt`, consistent one-line descriptors, definition blocks, and FAQ patterns for AI-readability is forward-thinking and genuinely useful.
4. **Structured data per template type.** JSON-LD strategy is well-considered.
5. **Content model with SEO fields baked in.** Requiring `seoTitle`, `seoDescription`, `canonical`, `schema toggle` at the CMS level prevents SEO from being an afterthought.

### What the ChatGPT plan gets wrong or misses

#### 1. THE CMS CHOICE IS WRONG FOR THIS PROJECT

The plan recommends **Payload CMS** (or Strapi) self-hosted on ECS Fargate with a Postgres database on RDS. This is enterprise-grade infrastructure for a personal website. It means:

- Running and patching a Node.js CMS server 24/7 (~$30-80/month on Fargate)
- Managing a Postgres database on RDS (~$15-30/month minimum)
- An Application Load Balancer (~$16/month + data)
- Operational overhead: backups, scaling, security patches, uptime monitoring

**Total infrastructure cost for CMS alone: ~$60-130/month before you even serve a single page.**

You mentioned **Sanity.io** and you're right — it's the correct choice here. Sanity is:

- **Hosted SaaS** — zero infrastructure to manage
- **Free tier** covers personal sites (3 users, 500K API requests/month, 20GB assets)
- **Structured content** with GROQ query language is powerful and flexible
- **Real-time editing** with visual preview built in
- **Portable Text** format for rich content (better than raw HTML for multi-channel)
- **TypeScript-first** schema definitions that live in your codebase
- **No database to manage** — Sanity handles storage, CDN, and API

Using Sanity eliminates ECS Fargate, ALB, RDS, Secrets Manager, and most of the operational complexity from the plan. Your "CMS infrastructure" becomes a `sanity.config.ts` file in your repo.

#### 2. THE AWS ARCHITECTURE IS OVER-ENGINEERED

The ChatGPT plan describes an architecture suited for a mid-size SaaS product, not a personal website that needs to rank well and convert visitors to booking inquiries.

**What the plan proposes:**
- ECS Fargate for CMS + possibly SSR frontend
- RDS Postgres
- ALB (Application Load Balancer)
- WAF on CloudFront
- Secrets Manager / SSM

**What you actually need:**
- S3 bucket (static site hosting) — ~$0.50/month
- CloudFront CDN — ~$1-3/month at personal-site traffic levels
- Route53 DNS — $0.50/month per hosted zone
- ACM certificate — free
- Lambda@Edge or CloudFront Functions for redirects — negligible cost

**Total hosting cost: ~$2-5/month.** Not $60-130+/month.

The key insight: with Sanity as a hosted CMS, and Next.js configured for **static export with Incremental Static Regeneration (ISR)**, every page is pre-rendered HTML served from CloudFront's edge. There is no server to run, no database to manage, no application load balancer needed.

If you later need server-side rendering for dynamic features (e.g., personalised content), you can add a single Lambda function behind CloudFront — still no Fargate required.

#### 3. THE `/virtual-keynote-speaker` PAGE CREATES CANNIBALIZATION RISK

Having both `/speaker` AND `/virtual-keynote-speaker` targeting the same keyword cluster is a classic SEO mistake. Google has to choose which one to rank, and often picks neither decisively.

**Better approach:**
- `/speaker` is the single definitive ranking + conversion page for "virtual keynote speaker" — it does both jobs (education AND conversion)
- Use long-form content on `/speaker` to cover the "what is a virtual keynote speaker" and "why virtual" angles that the ChatGPT plan splits into a separate page
- Create a FAQ section on `/speaker` that captures the question-intent queries
- If you want an additional exact-match URL, use `/virtual-keynote-speaker` as a **301 redirect to `/speaker`** so any backlinks or direct traffic still benefit the main page

#### 4. "AI KEYNOTE SPEAKER" IS A MASSIVE MISSED KEYWORD CLUSTER

The ChatGPT plan lists secondary keywords as "online keynote speaker", "remote keynote speaker", etc. — these are just synonyms of the primary keyword. They add no thematic depth.

You are an **AI product engineer** who builds things with AI. In 2026, this is one of the most in-demand speaker topics globally. The plan should include:

**Missing keyword clusters:**
- `AI keynote speaker`
- `artificial intelligence keynote speaker`
- `AI speaker for corporate events`
- `innovation and AI keynote`
- `entrepreneurship and AI speaker`

**Missing keynote topics:**
- A dedicated keynote on AI + entrepreneurship / AI + product building
- Content that positions you as someone who BUILDS with AI, not just talks about it — this is a huge differentiator from the "futurist" speakers who only theorize

#### 5. THE BLOG MIGRATION IS HAND-WAVED

"Full URL inventory of current site. One-to-one redirect map. No redirect chains." — this is three sentences for what is actually the single largest piece of work in this entire project.

17 years of blog posts means:
- Hundreds (possibly 1,000+) of posts to extract from Squarespace
- HTML content that needs to be converted to Sanity's Portable Text format
- Images hosted on Squarespace CDN that need to be downloaded and re-hosted on S3
- Old URL patterns (Squarespace often uses `/blog/yyyy/mm/dd/slug` or `/blog/slug`) that need redirect rules
- Metadata (publish dates, categories, tags) that need to be preserved
- Internal links within posts that reference other posts — these all need updating
- Embedded media (YouTube, SoundCloud, podcasts) that need to be preserved

This needs a dedicated migration pipeline, not a bullet point.

#### 6. MISSING: THE ACTUAL CONVERSION FLOW

The plan talks extensively about ranking but barely addresses what happens when someone decides to book you. Questions the plan doesn't answer:

- What does the booking CTA look like? A form? Calendly? Email?
- Is there a pricing page or "packages" approach?
- What information do you collect from potential clients?
- Is there a follow-up automation (email sequence)?
- What's the booking qualification process?

For a site whose primary goal is "book virtual keynote speaking engagements," the conversion funnel should be designed with the same rigor as the SEO architecture.

#### 7. MISSING: EXISTING CONTENT AND REVENUE STREAMS

The current site has assets the ChatGPT plan ignores:
- **Podcast ("It's Not Over")** — no mention
- **Side Hustle Course ($99)** — no mention
- **Brain-picking sessions ($350)** — no mention
- **Substack newsletter (16,000 subscribers)** — no mention or integration strategy
- **Businesses/exits page** — important authority signal, no dedicated plan
- **E-commerce cart** (Squarespace native) — needs replacement strategy

These aren't just "nice to have" — the podcast and newsletter are authority-building machines for SEO and GEO, and the course/sessions are revenue streams.

#### 8. MISSING: ANALYTICS AND MEASUREMENT

No mention of:
- Google Analytics 4 / Plausible / Fathom
- Google Search Console
- Conversion tracking (what counts as a conversion? Form submission? Calendar booking?)
- Heatmaps (Hotjar / Microsoft Clarity)
- A/B testing framework
- Rank tracking for target keywords
- AI citation monitoring (for GEO)

"Definition of success" at the end of the ChatGPT plan is aspirational prose, not measurable KPIs.

#### 9. POSITIONING CRITIQUE: TOO NARROW

The core positioning statement — *"Nic Haralambous is a virtual keynote speaker helping modern, distributed organisations build curiosity, innovation, and focus"* — strips away everything that makes you unique.

There are thousands of "virtual keynote speakers." There is exactly one person who:
- Started coding at 11, first business at 16
- Has 4+ startup exits (Motribe, NicHarry, ForeFront Africa, Nudjit)
- Wrote 3 books on entrepreneurship
- Builds AI products as a product engineer
- Has been featured on BBC, Fast Company, CNBC Africa
- Has a decade of speaking experience across SXSW, Standard Bank, Vodacom, etc.

**Better positioning:**
> Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker. With 4 startup exits, 3 books, and 20+ years building technology businesses, he helps modern teams unlock curiosity, build with AI, and turn innovation into profit.

The SEO target keyword is still "virtual keynote speaker" — but the positioning should communicate WHY someone books you, not just WHAT you are.

#### 10. TOPIC HUBS ARE UNDEFINED

The plan says create `/topics/{slug}` but never defines what the topics are. Based on browsing the site and your keynotes, here are the natural topic clusters:

| Topic Hub | Supports Keynote | Blog Content Cluster |
|---|---|---|
| `/topics/curiosity` | Creating a Culture of Innovation | Posts on curiosity, learning, experimentation |
| `/topics/innovation` | Creating a Culture of Innovation | Posts on innovation, startups, disruption |
| `/topics/remote-work` | Future of Company Collaboration | Posts on WFH, distributed teams, collaboration |
| `/topics/burnout` | Beating the Burnout Beast | Posts on mental health, digital fatigue |
| `/topics/entrepreneurship` | Cross-cutting authority | Posts on starting businesses, failure, exits |
| `/topics/ai` | **New keynote opportunity** | Posts on AI, product building, AI + humanity |
| `/topics/side-hustles` | Cross-cutting authority | Posts on side hustles, book content |

---

## Part 2: Revised Technical Architecture

### Stack Decision Summary

| Component | ChatGPT Plan | Revised Plan | Rationale |
|---|---|---|---|
| CMS | Payload CMS (self-hosted) | **Sanity.io** (hosted SaaS) | Zero infra, free tier, TypeScript schemas, Portable Text |
| Frontend | Next.js App Router | **Next.js App Router** (agreed) | Best-in-class SSG/ISR, React Server Components |
| Database | RDS Postgres | **None needed** | Sanity handles all content storage |
| Hosting | ECS Fargate + ALB | **S3 + CloudFront** (static) | $2-5/month vs $60-130/month |
| DNS | Route53 + ACM | **Route53 + ACM** (agreed) | Standard AWS DNS + free TLS |
| Media/Assets | S3 + CloudFront | **Sanity CDN + S3 fallback** | Sanity has built-in image CDN with transforms |
| Search | Not mentioned | **Pagefind** (client-side) | Zero-cost static search, no server needed |
| Forms | Not mentioned | **Formspree or Formspark** | Simple, no server needed, email notifications |
| Analytics | Not mentioned | **Plausible or GA4** | Privacy-friendly, lightweight |
| Email | Not mentioned | **Substack integration** (existing) | Already has 16K subscribers |
| Redirects | Not mentioned | **CloudFront Functions** | Edge-executed, sub-millisecond |

### AWS Infrastructure (Minimal)

```
Route53 (DNS)
  └── CloudFront Distribution (CDN + TLS via ACM)
        ├── Default Origin: S3 Bucket (static Next.js export)
        ├── CloudFront Function: URL redirects (old → new)
        └── CloudFront Function: Security headers

Sanity.io (external, hosted)
  ├── Content API (GROQ queries at build time)
  ├── Image CDN (on-the-fly transforms)
  └── Sanity Studio (hosted or embedded in Next.js)

GitHub Actions (CI/CD)
  ├── On push: build Next.js → deploy to S3 → invalidate CloudFront
  └── On Sanity webhook: trigger rebuild for content changes
```

**Estimated monthly cost: $3-8/month** (Route53 zone + CloudFront + S3 storage)

### Why NOT Vercel?

You asked for AWS specifically, and self-hosting on S3+CloudFront gives you:
- Full control over infrastructure
- No vendor lock-in on hosting
- Cheaper at scale (Vercel charges per function invocation)
- CloudFront's global edge network is excellent

However, if operational simplicity ever outweighs cost control, Vercel is a one-click alternative that works natively with Next.js and Sanity. Worth keeping as a fallback.

---

## Part 3: Revised Information Architecture

### URL Structure

```
/                           → Homepage (authority hub, not keyword-competing)
/speaker                    → PRIMARY money page (virtual keynote speaker)
/keynotes                   → Keynote listing page
/keynotes/{slug}            → Individual keynote pages
/topics                     → Topic hub index
/topics/{slug}              → Individual topic hubs
/blog                       → Blog listing (paginated)
/blog/{slug}                → Individual blog posts (flat URLs, no dates)
/books                      → Books listing
/books/{slug}               → Individual book pages
/about                      → Full bio, businesses, exits, timeline
/media                      → Press, podcasts, video appearances
/contact                    → Booking inquiry form
/newsletter                 → Substack redirect or embed
/search                     → Client-side search (Pagefind)
/sitemap.xml                → Sitemap index
/sitemap-pages.xml          → Static pages sitemap
/sitemap-blog.xml           → Blog posts sitemap
/sitemap-keynotes.xml       → Keynotes sitemap
/robots.txt                 → Crawl directives
/rss.xml                    → Blog RSS feed
/llms.txt                   → AI/LLM guidance file
```

### Pages removed from ChatGPT plan:
- `/virtual-keynote-speaker` → **301 redirect to `/speaker`** (prevents cannibalization)

### Pages added:
- `/about` consolidated (replaces `/meet-nic-haralambous` and `/businesses` — one authoritative bio page)
- `/newsletter` (leverage 16K subscriber base)
- `/search` (site-wide search for 17 years of content)

---

## Part 4: Sanity CMS Content Model

### Document Types

```typescript
// Core content types
speaker          // Singleton: the main speaker page content
keynote          // Repeatable: individual keynotes
topicHub         // Repeatable: topic cluster pages
post             // Repeatable: blog posts
book             // Repeatable: books
mediaAppearance  // Repeatable: press/podcast/video appearances
testimonial      // Repeatable: client testimonials
business         // Repeatable: past and current businesses

// Supporting types
author           // Singleton (just Nic, but extensible)
siteSettings     // Singleton: global SEO defaults, social links, etc.
redirect         // Repeatable: old URL → new URL mapping
```

### Shared SEO Fields (reusable object)

```typescript
seo: {
  seoTitle: string        // Override for <title> tag
  seoDescription: string  // Meta description
  ogImage: image          // Open Graph image
  canonical: url           // Canonical URL (optional override)
  noIndex: boolean         // Exclude from search engines
}
```

### Key Schema: Post (Blog)

```typescript
post: {
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
  seo: seoFields
  // Computed/derived
  estimatedReadTime: number
}
```

### Key Schema: Keynote

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

### Key Schema: Topic Hub

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

Sanity supports draft/published states natively. Configure:
- **Draft** → only visible in Studio and preview
- **Published** → triggers webhook → GitHub Actions rebuild → live on site
- **Scheduled publishing** → use Sanity's scheduling plugin
- **Preview** → Next.js draft mode with Sanity's preview connector

---

## Part 5: SEO & GEO Implementation Details

### On-Page SEO (per template)

**Homepage:**
- H1: "Entrepreneur, AI product builder, and virtual keynote speaker" (not keyword-stuffed, but includes target)
- Above fold: Clear value prop + CTA to `/speaker`
- Below fold: Featured keynotes, recent blog posts, social proof
- Schema: `WebSite` + `Person`

**Speaker Page (`/speaker`):**
- H1: "Virtual keynote speaker for curious, modern teams"
- Title tag: "Virtual Keynote Speaker | Nic Haralambous"
- First 100 words: Include "virtual keynote speaker" naturally
- Sections: Why book Nic → Keynote topics → How virtual delivery works → Client logos → Testimonials → FAQ → CTA
- Schema: `Person` + `Service` + `FAQPage`
- This page MUST be the most internally-linked page on the site

**Keynote Pages (`/keynotes/{slug}`):**
- H1: "Virtual Keynote: {Keynote Title}"
- Title tag: "{Keynote Title} | Virtual Keynote by Nic Haralambous"
- Content: Description → What the audience learns → Virtual delivery details → Related topic → Testimonials → CTA
- Schema: `Service` + `VideoObject` (if video embed)

**Topic Hubs (`/topics/{slug}`):**
- H1: "{Topic}: Insights from Nic Haralambous"
- Content: One-sentence summary → Definition → Why it matters → Best articles → Related keynotes
- Schema: `WebPage` + `CollectionPage`

**Blog Posts (`/blog/{slug}`):**
- H1: {Post title}
- Content: TL;DR block → Main content → Key takeaways → Related topic hub link → Related keynote link (where relevant)
- Schema: `Article` + `Person` (author)
- Every post links to at least 1 topic hub

**Books (`/books/{slug}`):**
- Schema: `Book`

**Media (`/media`):**
- Schema: `PodcastEpisode` / `VideoObject` per item

### Technical SEO Checklist

- [ ] All pages pre-rendered as static HTML (no client-side-only content)
- [ ] Single canonical URL per page (self-referencing)
- [ ] Sitemap index with segmented sitemaps by content type
- [ ] `robots.txt` blocking only `/studio` (Sanity Studio if embedded) and draft/preview routes
- [ ] 301 redirects for ALL old Squarespace URLs (see migration section)
- [ ] No redirect chains (every old URL maps directly to new URL)
- [ ] OG tags + Twitter cards on every page
- [ ] Proper heading hierarchy (single H1, logical H2-H4)
- [ ] Image alt text on all images
- [ ] Lazy loading for below-fold images
- [ ] RSS feed for blog (`/rss.xml`)
- [ ] Proper 404 page with navigation and search
- [ ] `hreflang` not needed (single-language site)

### GEO (Generative Engine Optimization) Implementation

**Consistency signals for AI models:**
- Identical one-line bio used across: homepage, speaker page, about page, schema markup, llms.txt
- "Virtual keynote speaker" appears in: H1s of money pages, first paragraphs, schema descriptions, image alt text
- Structured FAQ blocks with clear question/answer format (AI models love pulling from these)

**`/llms.txt` content:**
```
# Nic Haralambous

## Who
Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker with 4 startup exits, 3 published books, and 20+ years of experience building technology businesses.

## What he does
Nic delivers virtual keynotes to modern organisations on curiosity, innovation, AI, and entrepreneurship. He helps distributed teams build cultures of experimentation and growth.

## Preferred citation
"Nic Haralambous, entrepreneur and virtual keynote speaker (nicharalambous.com)"

## Key pages
- Speaker & booking: https://nicharalambous.com/speaker
- Keynotes: https://nicharalambous.com/keynotes
- Blog: https://nicharalambous.com/blog
- About: https://nicharalambous.com/about
- Books: https://nicharalambous.com/books

## Topics he speaks on
- Curiosity and innovation in organisations
- AI and the future of product building
- Entrepreneurship, failure, and resilience
- Remote work and distributed team collaboration
- Burnout and mental fitness for leaders
```

**Content patterns for AI-readability:**
- Every topic hub starts with a "In one sentence" block
- Every keynote page has a clear "Who is this for?" section
- Definition blocks use `<dl>` or clearly labeled sections
- Testimonials are attributed with name, title, company (AI models weight attributed quotes)

### Structured Data (JSON-LD) — Per Template

| Template | Schema Types |
|---|---|
| All pages | `WebSite`, `Person` (sitewide) |
| `/speaker` | `Service`, `FAQPage` |
| `/keynotes/{slug}` | `Service`, `VideoObject` |
| `/topics/{slug}` | `WebPage` |
| `/blog/{slug}` | `Article` |
| `/books/{slug}` | `Book` |
| `/media` items | `PodcastEpisode`, `VideoObject` |
| Testimonials | `Review` (within `Service`) |

---

## Part 6: Blog Migration Strategy (17 Years of Content)

This is the single largest workload in the project. Here's the detailed approach:

### Step 1: Export from Squarespace

Squarespace provides a WordPress-format XML export:
- Go to Settings → Advanced → Import/Export → Export
- This gives you a `.xml` file containing all posts, pages, images references, and metadata

**Limitations of Squarespace export:**
- Images are NOT included in the export — only URLs to Squarespace-hosted images
- Some formatting may be lost
- Comments (if any) may or may not export cleanly
- Gallery blocks, embedded media need special handling

### Step 2: Parse and Inventory

Build a Node.js script that:
1. Parses the WordPress XML export
2. Extracts for each post:
   - Title
   - Slug
   - Publish date
   - HTML body content
   - Featured image URL
   - Categories/tags
   - Current Squarespace URL
3. Generates a full inventory spreadsheet (CSV) for review
4. Flags posts with: embedded media, galleries, custom blocks, broken links

**Expected output:** A CSV with columns: `id, title, slug, publishedAt, oldUrl, newUrl, hasImages, hasEmbeds, wordCount, status`

### Step 3: Content Triage

Not all 17 years of content deserves equal treatment. Categorize posts into:

| Tier | Criteria | Action |
|---|---|---|
| **A: Evergreen** | High traffic, timeless advice, still relevant | Migrate, refresh, optimize for SEO |
| **B: Good enough** | Decent content, still somewhat relevant | Migrate as-is with basic cleanup |
| **C: Dated but historical** | Old but part of your story | Migrate with minimal effort, mark with "Originally published in YYYY" |
| **D: Dead weight** | Broken, irrelevant, embarrassing, or trivial | Redirect to nearest relevant content or 410 (Gone) |

This triage should happen manually — you reviewing the inventory CSV and assigning tiers. AI can help flag candidates for each tier based on word count, age, and topic matching.

### Step 4: Image Migration

1. Crawl all Squarespace image URLs from the exported content
2. Download all images locally
3. Optimize images (resize, compress, convert to WebP where appropriate)
4. Upload to Sanity's asset pipeline (which provides CDN + on-the-fly transforms)
5. Update all image references in content to new Sanity URLs

**Script output:** A mapping file: `oldImageUrl → newSanityAssetId`

### Step 5: HTML → Portable Text Conversion

Sanity uses Portable Text (a JSON-based rich text format) instead of raw HTML. This is better for:
- Multi-channel content (web, email, API)
- Consistent rendering
- Custom block types (callouts, CTAs, code blocks)

Build a converter script that:
1. Takes HTML content from each post
2. Converts to Portable Text using `@sanity/block-tools` or `html-to-portable-text`
3. Handles special cases:
   - YouTube/Vimeo embeds → custom `videoEmbed` block
   - Code blocks → custom `codeBlock` block
   - Pull quotes → custom `pullQuote` block
   - Image galleries → custom `gallery` block
4. Outputs Sanity-compatible document JSON

### Step 6: Import to Sanity

Use Sanity's mutation API or the `sanity dataset import` CLI to bulk-import:
1. All post documents with Portable Text content
2. All image assets
3. All metadata (dates, slugs, categories → topic references)

Run in a `staging` dataset first, verify, then promote to `production`.

### Step 7: Redirect Map

Generate a comprehensive redirect map:

```
# Pattern: old Squarespace URL → new URL
/blog/2008/3/15/some-old-post → /blog/some-old-post
/blog/2020/4/21/mentors-vs-frentors → /blog/mentors-vs-frentors
/blog/advice-from-40-year-old-me-to-20-year-oldnbspme → /blog/advice-from-40-year-old-me
/meet-nic-haralambous → /about
/the-speaker → /speaker
/contact-me → /contact
/businesses → /about
/its-not-over → /media (or dedicated podcast page)
/side-hustle-course → /books/how-to-start-a-side-hustle (or keep as product)
```

Implement as a CloudFront Function that checks incoming URLs against a JSON map and returns 301s.

### Step 8: Verification

After migration:
1. Crawl the new site with Screaming Frog or `linkinator`
2. Compare old sitemap URLs against new sitemap
3. Verify every old URL correctly 301s to the right new URL
4. Check that no images are broken
5. Verify publish dates are preserved (important for SEO — Google values original publish dates)
6. Spot-check 20-30 posts across all tiers for formatting accuracy

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
            → You review and respond within 24h
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

Use **Formspree** or **Formspark** for serverless form handling — submissions go to your email + stored for reference. No server needed.

### CTAs (Calls to Action)

Every page should have a contextually relevant CTA:
- Speaker page: "Book Nic for Your Next Virtual Event" → `/contact`
- Keynote pages: "Book This Keynote" → `/contact` (pre-selecting that keynote)
- Blog posts: Soft CTA in sidebar/footer → "Want Nic to deliver this as a keynote?" → `/speaker`
- Topic hubs: "Explore this topic as a virtual keynote" → relevant keynote page

### Social Proof Elements

Collect and display throughout:
- Client logos (companies that have booked you)
- Video testimonials
- Written testimonials with name, title, company
- Media logos (BBC, Fast Company, CNBC)
- Speaking event photos/screenshots
- "Booked by X companies" counter (if applicable)

---

## Part 8: Analytics & Measurement

### Tools

| Tool | Purpose | Cost |
|---|---|---|
| Google Search Console | Search performance, indexing, errors | Free |
| GA4 or Plausible Analytics | Traffic, behaviour, conversions | Free / $9/month |
| Microsoft Clarity | Heatmaps, session recordings | Free |
| Google Tag Manager | Event tracking, conversion pixels | Free |

### KPIs to Track

| KPI | Target | Tool |
|---|---|---|
| `/speaker` page ranking for "virtual keynote speaker" | Top 20 → Top 10 → Top 5 | Google Search Console |
| Organic traffic to `/speaker` | Month-over-month growth | GA4 |
| Booking form submissions | Track all submissions as conversions | GTM + GA4 |
| Form submission rate | > 3% of `/speaker` visitors | GA4 |
| Core Web Vitals (LCP, CLS, INP) | All "Good" | Search Console |
| Pages indexed | All public pages indexed | Search Console |
| AI citation accuracy | Nic described as "virtual keynote speaker" | Manual + AI monitoring |
| Blog traffic | Stable or growing post-migration | GA4 |

### Conversion Events (GA4)

- `form_submission` — booking inquiry submitted
- `cta_click` — any "Book" or "Enquire" CTA clicked
- `video_play` — sizzle reel or testimonial video played
- `keynote_view` — individual keynote page viewed
- `scroll_depth` — 25/50/75/100% scroll on speaker page

---

## Part 9: Performance Targets

| Metric | Target | How |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.0s mobile | Static HTML, optimized images, font preloading |
| CLS (Cumulative Layout Shift) | < 0.05 | Fixed image dimensions, no layout-shifting ads |
| INP (Interaction to Next Paint) | < 150ms | Minimal JavaScript, no heavy client-side frameworks |
| Time to First Byte | < 200ms | CloudFront edge serving static HTML |
| Total page weight | < 500KB on key pages | Aggressive image optimization, minimal JS |
| Lighthouse Performance | > 95 | All of the above |

### Implementation

- **Images:** Use Sanity's image CDN with automatic WebP/AVIF conversion + Next.js `<Image>` component for lazy loading and responsive sizes
- **Fonts:** Self-host (not Google Fonts CDN), preload critical font weights, use `font-display: swap`
- **JavaScript:** Minimal client-side JS — most pages are static HTML with zero JS needed. Only add JS for: form validation, search, video embeds, analytics
- **CSS:** Use Tailwind CSS with purging — ship only the CSS you use
- **Caching:** CloudFront cache all static assets for 1 year, HTML for 1 hour (with invalidation on deploy)

---

## Part 10: Implementation Batches

This project is broken into 10 sequential phases. Each phase is independently deployable and testable. You should be able to stop after any phase and have a working (if incomplete) website.

### Phase 0: Foundation & Infrastructure
**Estimated effort: 2-3 hours**

- [ ] 🟥 **0.1** Create GitHub repository
- [ ] 🟥 **0.2** Set up AWS account (if not existing)
- [ ] 🟥 **0.3** Register/transfer `nicharalambous.com` to Route53 (or configure external DNS)
- [ ] 🟥 **0.4** Create S3 bucket for static site hosting
- [ ] 🟥 **0.5** Create CloudFront distribution with ACM TLS certificate
- [ ] 🟥 **0.6** Create Sanity.io project (free tier)
- [ ] 🟥 **0.7** Set up GitHub Actions CI/CD pipeline (build → S3 → CloudFront invalidation)
- [ ] 🟥 **0.8** Verify: deploy a "coming soon" page and confirm it serves over HTTPS

### Phase 1: Next.js Scaffold & Design System
**Estimated effort: 4-6 hours**

- [ ] 🟥 **1.1** Initialize Next.js project with App Router + TypeScript
- [ ] 🟥 **1.2** Install and configure Tailwind CSS
- [ ] 🟥 **1.3** Install and configure `next-sanity` + Sanity client
- [ ] 🟥 **1.4** Create base layout: header, navigation, footer
- [ ] 🟥 **1.5** Create reusable components: SEO head, JSON-LD injector, CTA button, section wrapper
- [ ] 🟥 **1.6** Create typography and spacing design tokens
- [ ] 🟥 **1.7** Set up `next-sitemap` for automatic sitemap generation
- [ ] 🟥 **1.8** Create 404 page template
- [ ] 🟥 **1.9** Verify: build and deploy scaffold — all pages return 200 with layout

### Phase 2: Sanity CMS Setup & Content Models
**Estimated effort: 3-5 hours**

- [ ] 🟥 **2.1** Initialize Sanity Studio (embedded in Next.js at `/studio` or standalone)
- [ ] 🟥 **2.2** Define document schemas: `siteSettings`, `author`, `speaker` (singleton)
- [ ] 🟥 **2.3** Define document schemas: `keynote`, `topicHub`, `post`
- [ ] 🟥 **2.4** Define document schemas: `book`, `mediaAppearance`, `testimonial`, `business`
- [ ] 🟥 **2.5** Define reusable objects: `seoFields`, `portableTextBody`, `videoEmbed`
- [ ] 🟥 **2.6** Configure Sanity Studio with preview panes and document structure
- [ ] 🟥 **2.7** Create `staging` and `production` datasets
- [ ] 🟥 **2.8** Set up Sanity webhook → GitHub Actions (trigger rebuild on content publish)
- [ ] 🟥 **2.9** Verify: create test content in Studio, query via GROQ, confirm data flows

### Phase 3: Core Money Pages (Speaker + Keynotes)
**Estimated effort: 6-8 hours**

- [ ] 🟥 **3.1** Build `/speaker` page template with all sections from SEO spec
- [ ] 🟥 **3.2** Build `/keynotes` listing page
- [ ] 🟥 **3.3** Build `/keynotes/[slug]` dynamic page template
- [ ] 🟥 **3.4** Implement JSON-LD for `Service` + `FAQPage` on speaker page
- [ ] 🟥 **3.5** Implement JSON-LD for `Service` on keynote pages
- [ ] 🟥 **3.6** Create speaker page content in Sanity (rewrite existing content for virtual-first framing)
- [ ] 🟥 **3.7** Create all keynote content in Sanity (rewrite each keynote with virtual delivery emphasis)
- [ ] 🟥 **3.8** Add testimonials to Sanity and display on speaker/keynote pages
- [ ] 🟥 **3.9** Verify: pages render, schema validates (Google Rich Results Test), internal links work

### Phase 4: Supporting Pages
**Estimated effort: 4-6 hours**

- [ ] 🟥 **4.1** Build homepage template (hero + featured keynotes + recent posts + social proof)
- [ ] 🟥 **4.2** Build `/about` page (consolidated bio, businesses/exits timeline, media logos)
- [ ] 🟥 **4.3** Build `/books` listing and `/books/[slug]` pages
- [ ] 🟥 **4.4** Build `/media` page (press, podcasts, videos)
- [ ] 🟥 **4.5** Build `/contact` page with booking inquiry form (Formspree/Formspark)
- [ ] 🟥 **4.6** Build `/topics` listing and `/topics/[slug]` hub pages
- [ ] 🟥 **4.7** Create content for all supporting pages in Sanity
- [ ] 🟥 **4.8** Implement JSON-LD for all page types
- [ ] 🟥 **4.9** Verify: all pages render, all internal links work, all schema validates

### Phase 5: Blog System
**Estimated effort: 4-6 hours**

- [ ] 🟥 **5.1** Build `/blog` listing page with pagination
- [ ] 🟥 **5.2** Build `/blog/[slug]` post template with: TL;DR, body, key takeaways, related links
- [ ] 🟥 **5.3** Implement topic filtering on blog listing
- [ ] 🟥 **5.4** Add "Related posts" component (same topic hub)
- [ ] 🟥 **5.5** Add contextual CTA component (links to relevant keynote)
- [ ] 🟥 **5.6** Implement `Article` JSON-LD on blog posts
- [ ] 🟥 **5.7** Generate RSS feed (`/rss.xml`)
- [ ] 🟥 **5.8** Verify: create 3-5 test posts in Sanity, confirm rendering, pagination, RSS

### Phase 6: Blog Migration (The Big One)
**Estimated effort: 8-15 hours**

- [ ] 🟥 **6.1** Export content from Squarespace (WordPress XML format)
- [ ] 🟥 **6.2** Build Node.js parser script: XML → structured JSON inventory
- [ ] 🟥 **6.3** Generate inventory CSV for manual review
- [ ] 🟥 **6.4** Triage posts into Tier A/B/C/D (manual review with your input)
- [ ] 🟥 **6.5** Build image scraper: download all images from Squarespace CDN
- [ ] 🟥 **6.6** Upload images to Sanity asset pipeline
- [ ] 🟥 **6.7** Build HTML → Portable Text converter script
- [ ] 🟥 **6.8** Handle special blocks: YouTube embeds, code blocks, galleries
- [ ] 🟥 **6.9** Run conversion on all Tier A/B/C posts
- [ ] 🟥 **6.10** Bulk import posts to Sanity `staging` dataset
- [ ] 🟥 **6.11** Spot-check 30+ posts for formatting, images, embeds
- [ ] 🟥 **6.12** Fix any conversion issues, re-import
- [ ] 🟥 **6.13** Promote to `production` dataset
- [ ] 🟥 **6.14** Generate complete redirect map (old URL → new URL)

### Phase 7: SEO & GEO Finalization
**Estimated effort: 3-4 hours**

- [ ] 🟥 **7.1** Implement all 301 redirects via CloudFront Function
- [ ] 🟥 **7.2** Create and deploy `llms.txt`
- [ ] 🟥 **7.3** Create and deploy `robots.txt`
- [ ] 🟥 **7.4** Verify all sitemaps generate correctly and submit to Google Search Console
- [ ] 🟥 **7.5** Audit internal linking: ensure `/speaker` is most-linked page
- [ ] 🟥 **7.6** Audit all pages have unique title tags, meta descriptions, OG images
- [ ] 🟥 **7.7** Verify JSON-LD with Google Rich Results Test on all template types
- [ ] 🟥 **7.8** Implement client-side search with Pagefind
- [ ] 🟥 **7.9** Verify: full crawl with Screaming Frog — no broken links, no missing meta, no orphan pages

### Phase 8: Analytics & Conversion Tracking
**Estimated effort: 2-3 hours**

- [ ] 🟥 **8.1** Set up Google Search Console and verify ownership
- [ ] 🟥 **8.2** Set up GA4 or Plausible Analytics
- [ ] 🟥 **8.3** Set up Google Tag Manager
- [ ] 🟥 **8.4** Configure conversion events: form submissions, CTA clicks, video plays
- [ ] 🟥 **8.5** Set up Microsoft Clarity for heatmaps
- [ ] 🟥 **8.6** Create a simple dashboard/report template for monthly review
- [ ] 🟥 **8.7** Verify: test all events fire correctly

### Phase 9: Performance & QA
**Estimated effort: 2-3 hours**

- [ ] 🟥 **9.1** Run Lighthouse audit on all key pages — target >95 performance
- [ ] 🟥 **9.2** Test Core Web Vitals on mobile and desktop
- [ ] 🟥 **9.3** Test all redirects (sample 50+ old URLs)
- [ ] 🟥 **9.4** Test all forms submit correctly
- [ ] 🟥 **9.5** Test on mobile devices (responsive design)
- [ ] 🟥 **9.6** Test in multiple browsers (Chrome, Safari, Firefox)
- [ ] 🟥 **9.7** Load test with `k6` or similar (verify CloudFront handles traffic)
- [ ] 🟥 **9.8** Fix any issues found

### Phase 10: Launch & Cutover
**Estimated effort: 1-2 hours (plus monitoring)**

- [ ] 🟥 **10.1** Final content review in Sanity production
- [ ] 🟥 **10.2** Switch DNS from Squarespace to CloudFront (Route53 or external DNS)
- [ ] 🟥 **10.3** Monitor for crawl errors in Search Console over 48 hours
- [ ] 🟥 **10.4** Submit updated sitemaps to Google Search Console
- [ ] 🟥 **10.5** Request indexing for key pages (`/speaker`, `/keynotes/*`)
- [ ] 🟥 **10.6** Monitor keyword rankings for "virtual keynote speaker" daily for 2 weeks
- [ ] 🟥 **10.7** Keep Squarespace site active (but redirecting) for 30 days as safety net
- [ ] 🟥 **10.8** Cancel Squarespace subscription after 30 days of stable operation

---

## Part 11: Post-Launch Roadmap (Ongoing)

After launch, the site needs ongoing content work to achieve ranking goals:

### Month 1-2: Content Optimization
- Refresh Tier A blog posts with updated internal links to keynote and topic pages
- Write 2-3 new blog posts per month targeting long-tail keywords in each topic cluster
- Add "Originally published in YYYY, updated in 2026" to refreshed posts
- Build backlinks by pitching guest posts to speaking industry publications

### Month 3-6: Authority Building
- Create a dedicated AI + entrepreneurship keynote page
- Write definitive guides for each topic hub (3,000+ word pillar content)
- Pitch podcast appearances and ensure each links back to `/speaker`
- Encourage past clients to leave testimonials with links

### Ongoing: GEO Maintenance
- Monitor AI citations monthly (search your name in ChatGPT, Perplexity, Google AI Overview)
- Update `llms.txt` as content changes
- Keep FAQ sections current — AI models pull heavily from these
- Maintain consistent one-line bio across all platforms (LinkedIn, Substack, X, etc.)

---

## Appendix A: Technology Choices Summary

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| CMS | Sanity.io (hosted) | Payload CMS, Strapi, WordPress | Zero infrastructure, free tier, TypeScript, Portable Text, excellent DX |
| Frontend | Next.js (App Router) | Astro, Remix, Hugo | Best SSG/ISR support, React ecosystem, Sanity integration |
| CSS | Tailwind CSS | Vanilla CSS, styled-components | Utility-first, excellent for static sites, great DX |
| Hosting | S3 + CloudFront | Vercel, Netlify, ECS Fargate | User requested AWS, cheapest option ($3-8/month), full control |
| DNS | Route53 | Cloudflare DNS | Native AWS integration, simple |
| Forms | Formspree | Custom Lambda, Netlify Forms | Zero server, email notifications, spam filtering |
| Search | Pagefind | Algolia, Elasticsearch | Client-side, zero cost, works with static sites |
| Analytics | GA4 + Plausible | Fathom, Umami | GA4 for Search Console integration, Plausible for privacy |
| CI/CD | GitHub Actions | AWS CodePipeline | Free for public repos, excellent Next.js support |

## Appendix B: Estimated Costs

### Monthly Recurring

| Service | Cost |
|---|---|
| AWS (S3 + CloudFront + Route53) | $3-8/month |
| Sanity.io (Free tier) | $0/month |
| Formspree (Free tier, 50 submissions/month) | $0/month |
| Plausible Analytics (optional) | $0-9/month |
| Domain renewal | ~$1/month (amortized) |
| **Total** | **$4-18/month** |

### One-Time / Initial

| Item | Cost |
|---|---|
| ACM TLS certificate | Free |
| DNS transfer (if needed) | ~$10 |
| GitHub (free tier or existing) | $0 |

### vs. Current Squarespace

| | Squarespace | New Stack |
|---|---|---|
| Monthly cost | $16-49/month | $4-18/month |
| Annual cost | $192-588/year | $48-216/year |
| SEO control | Limited | Full |
| Performance | Squarespace-dependent | Excellent (static CDN) |
| Content flexibility | Template-bound | Unlimited |

## Appendix C: Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Blog migration breaks old URLs | High — loss of 17 years of SEO equity | Comprehensive redirect map, test every URL before launch |
| Ranking drop after migration | Medium — temporary dip is normal | Keep old site redirecting for 30 days, monitor Search Console daily |
| Sanity free tier limits exceeded | Low — 500K API requests/month is generous | Build as static site — API only called at build time, not per visitor |
| Image migration misses some assets | Medium — broken images hurt UX | Automated crawler + manual spot-check of 50+ posts |
| Squarespace export incomplete | Medium — some content types may not export | Cross-reference export against live sitemap, fill gaps manually |
| Content model changes needed post-launch | Low — normal iteration | Sanity schemas are versioned in code, easy to evolve |

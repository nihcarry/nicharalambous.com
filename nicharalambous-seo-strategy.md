# nicharalambous.com — SEO & GEO Strategy

This document defines the search engine optimization and generative engine optimization strategy for nicharalambous.com. It is a companion to the main build plan (`nicharalambous-migration-plan.md`).

---

## Primary Objective

Rank `/speaker` for "virtual keynote speaker" and related commercial-intent queries. Drive booking inquiries from organic search and AI citations.

---

## Part 1: Keyword Strategy

### Primary Keyword

**"virtual keynote speaker"** — clear transactional intent. Someone searching this wants to hire.

### Commercial Keyword Clusters

| Cluster | Target Keywords | Target Page |
|---|---|---|
| Core | virtual keynote speaker, online keynote speaker, remote keynote speaker | `/speaker` |
| AI speaking | AI keynote speaker, artificial intelligence keynote speaker, AI speaker for corporate events | `/keynotes/ai-and-product-building` (+ `/speaker`) |
| Innovation | innovation keynote speaker, innovation and AI keynote, culture of innovation speaker | `/keynotes/curiosity-catalyst` (+ `/speaker`) |
| Entrepreneurship | entrepreneurship keynote speaker, startup keynote speaker, entrepreneurship and AI speaker | `/keynotes/[relevant-slug]` (+ `/speaker`) |
| Focus/Productivity | focus keynote speaker, productivity keynote speaker, digital wellness speaker | `/keynotes/reclaiming-focus` (+ `/speaker`) |
| Branded | nic haralambous, nic haralambous speaker, nic haralambous keynote | `/speaker`, `/about` |

### Informational Keyword Clusters (blog content targets)

| Topic Hub | Long-tail Keywords to Target |
|---|---|
| `/topics/curiosity` | how to build a curious team, curiosity in the workplace, why curiosity matters at work, curiosity and innovation |
| `/topics/innovation` | how to innovate in business, innovation vs wackovation, innovation fatigue, building entrepreneurial teams |
| `/topics/entrepreneurship` | lessons from failed startups, what it takes to be an entrepreneur, resilience in business, impostor syndrome entrepreneur |
| `/topics/focus` | how to focus at work, digital distraction at work, deep work strategies, email is not your job |
| `/topics/ai` | AI replacing jobs, how to use AI without losing your mind, AI and creativity, AI making us dumber |
| `/topics/agency` | high agency thinking, taking initiative at work, bias towards action, action produces information |
| `/topics/failure` | failure is data not destiny, blameless postmortem, how to fail well, reframing failure in business |

### Keyword Mapping to Content Types

```
Commercial intent keywords → Money pages (/speaker, /keynotes/*)
Informational intent keywords → Blog posts (/blog/*)
Navigational intent keywords → Topic hubs (/topics/*)
Brand keywords → /speaker, /about
```

---

## Part 2: Information Architecture for SEO

### Authority Flow

The site's internal linking architecture is designed to flow authority upward toward `/speaker`:

```
Blog posts (/blog/*)
  → link to Topic hubs (/topics/*)
    → link to Keynote pages (/keynotes/*)
      → link to Speaker page (/speaker)

Every blog post links to at least 1 topic hub.
Every topic hub links to its related keynotes.
Every keynote page links to /speaker.
/speaker is the most internally-linked page on the site.
```

### URL Rules

- **Flat blog URLs:** `/blog/{slug}` — no dates in URLs. Clean, permanent, shareable.
- **Archive URLs:** `/archive/{slug}` — for unoptimized legacy content. Not in sitemap.
- **No trailing slashes.** Canonical URLs are without trailing slash.
- **All lowercase.** Slugs are lowercase, hyphen-separated.
- **Self-referencing canonicals** on every page.

### Sitemap Strategy

Segmented sitemaps by content type:
- `/sitemap.xml` — sitemap index
- Includes: all `/blog/*` posts, all `/keynotes/*`, all `/topics/*`, all `/books/*`, and static pages
- **Excludes:** `/archive/*` pages (not in sitemap — Google can crawl them via redirects and internal links, but we don't actively promote them)
- **Excludes:** `/studio`, draft/preview routes

---

## Part 3: On-Page SEO — Per Template

### Homepage (`/`)

- **H1:** "Entrepreneur, AI product builder, and virtual keynote speaker"
- **Purpose:** Authority hub. Not competing for keywords — establishes identity and routes visitors.
- **Above fold:** Clear value prop + CTA to `/speaker`
- **Below fold:** Featured keynotes, recent blog posts, social proof (client logos, media logos)
- **Schema:** `WebSite` + `Person`

### Speaker Page (`/speaker`) — THE MONEY PAGE

- **H1:** "Virtual keynote speaker for curious, modern teams"
- **Title tag:** "Virtual Keynote Speaker | Nic Haralambous"
- **Meta description:** "Book Nic Haralambous as your virtual keynote speaker. 4 startup exits, 3 books, 20+ years building tech businesses. Keynotes on curiosity, innovation, AI, and entrepreneurship."
- **First 100 words:** Include "virtual keynote speaker" naturally
- **Sections:**
  1. Why book Nic (differentiators: builds with AI, doesn't just theorize)
  2. Keynote topics (with links to individual keynote pages)
  3. How virtual delivery works
  4. Client logos / "As seen at" (SXSW, Standard Bank, Vodacom, etc.)
  5. Testimonials (attributed: name, title, company)
  6. FAQ section (structured for AI readability and featured snippets)
  7. Booking CTA → `/contact`
- **Schema:** `Person` + `Service` + `FAQPage`
- **Critical rule:** This page MUST be the most internally-linked page on the site

### Keynote Pages (`/keynotes/{slug}`)

- **H1:** "{Keynote Title} — Virtual Keynote"
- **Title tag:** "{Keynote Title} | Virtual Keynote by Nic Haralambous"
- **Sections:**
  1. Tagline and description
  2. What the audience learns (outcomes)
  3. Who is this for? (audiences)
  4. Virtual delivery details
  5. Related topic hub link
  6. Testimonials
  7. CTA → `/contact` (pre-selecting this keynote)
- **Schema:** `Service` + `VideoObject` (if video embed)

### Topic Hubs (`/topics/{slug}`)

- **H1:** "{Topic}: Insights from Nic Haralambous"
- **Title tag:** "{Topic} | Nic Haralambous"
- **Sections:**
  1. One-sentence summary (AI-readable definition)
  2. Definition block (what this topic means)
  3. Why it matters
  4. Best articles (linked blog posts in this cluster)
  5. Related keynotes
- **Schema:** `WebPage` + `CollectionPage`
- **Critical rule:** Every topic hub links to its related keynotes AND to `/speaker`

### Blog Posts (`/blog/{slug}`)

- **H1:** {Post title}
- **Title tag:** "{Post title} | Nic Haralambous"
- **Sections:**
  1. TL;DR block (2-3 sentence summary — AI models pull from these)
  2. Main content
  3. Key takeaways
  4. FAQ section (5 questions and answers related to the post's content)
  5. Related topic hub link
  6. Related keynote link (where relevant)
  7. Soft CTA → `/speaker`
- **Schema:** `Article` + `Person` (author) + `FAQPage`
- **Critical rules:**
  - Every post links to at least 1 topic hub
  - Every post ends with 5 FAQs derived from the post's content, targeting "People Also Ask" and AI citation

### Archive Posts (`/archive/{slug}`)

- **H1:** {Post title}
- **Banner:** "This post is from the archive. For Nic's latest thinking, visit the blog."
- **No SEO optimization.** Basic rendering of raw HTML.
- **`noindex` optional** — or leave indexed for long-tail discovery. Decision per post.
- **No structured data** beyond basic `WebPage`.

### Books (`/books/{slug}`)

- **Schema:** `Book`

### Media (`/media`)

- **Schema:** `PodcastEpisode` / `VideoObject` per item

---

## Part 4: Technical SEO Checklist

- [ ] All pages pre-rendered as static HTML (no client-side-only content)
- [ ] Single canonical URL per page (self-referencing)
- [ ] Sitemap index with segmented sitemaps by content type
- [ ] `robots.txt` blocking only `/studio` and draft/preview routes
- [ ] 301 redirects for ALL old Squarespace URLs
- [ ] No redirect chains (every old URL maps directly to its new destination)
- [ ] OG tags + Twitter cards on every page
- [ ] Proper heading hierarchy (single H1 per page, logical H2-H4)
- [ ] Image alt text on all images
- [ ] Lazy loading for below-fold images
- [ ] RSS feed for blog (`/rss.xml`)
- [ ] Proper 404 page with navigation and search
- [ ] `hreflang` not needed (single-language site)
- [ ] Publish dates preserved on migrated posts (Google values original publish dates)
- [ ] "Updated on" dates shown for refreshed content

---

## Part 5: Structured Data (JSON-LD)

### Sitewide

Every page includes:
- `WebSite` schema (site name, URL, search action)
- `Person` schema (Nic Haralambous — name, image, jobTitle, description, sameAs links to social profiles)

### Per Template

| Template | Additional Schema Types |
|---|---|
| `/speaker` | `Service`, `FAQPage` |
| `/keynotes/{slug}` | `Service`, `VideoObject` (if video) |
| `/topics/{slug}` | `CollectionPage` |
| `/blog/{slug}` | `Article`, `FAQPage` |
| `/books/{slug}` | `Book` |
| `/media` items | `PodcastEpisode`, `VideoObject` |
| Testimonials (within pages) | `Review` (within `Service`) |

### Validation

Use Google Rich Results Test on every template type before launch. Schema must validate without errors.

---

## Part 6: GEO (Generative Engine Optimization)

### Why GEO Matters

AI tools (ChatGPT, Perplexity, Google AI Overview) already refer traffic to the site. GEO ensures that when AI models describe Nic, they use the right framing: "entrepreneur, AI product builder, and virtual keynote speaker."

### Consistency Signals

The same one-line bio appears in:
- Homepage H1 / hero
- Speaker page first paragraph
- About page opening
- JSON-LD `Person` schema description
- `llms.txt`
- Substack bio
- LinkedIn headline
- X (Twitter) bio

> Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker with 4 startup exits, 3 books, and 20+ years building technology businesses.

### `/llms.txt` Content

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
- Focus, agency, and attention management
- Building entrepreneurial teams
```

### Content Patterns for AI Readability

- **TL;DR blocks** on every blog post (AI models pull summaries from these)
- **FAQ sections** on money pages and every blog post (5 questions per post) with clear question/answer format
- **"In one sentence" blocks** on every topic hub
- **"Who is this for?"** sections on every keynote page
- **Attributed testimonials** (name, title, company) — AI models weight attributed quotes
- **Definition blocks** with clearly labeled sections

### AI Citation Monitoring

Ongoing post-launch:
- Search your name in ChatGPT, Perplexity, Google AI Overview
- Check if descriptions match the preferred citation
- If not, reinforce consistency signals across site and external platforms
- Update `llms.txt` when content changes

---

## Part 7: Internal Linking Strategy

### Linking Rules

1. **Every blog post** links to at least 1 topic hub in its body text
2. **Every blog post** links to a related keynote if one exists (contextual CTA or in-text)
3. **Every topic hub** links to ALL related blog posts and ALL related keynotes
4. **Every keynote page** links to `/speaker` and its related topic hub(s)
5. **Homepage** links to all keynote pages and all topic hubs
6. **Footer** includes links to `/speaker`, `/keynotes`, `/topics`, `/blog`, `/about`, `/contact`
7. **Blog post footer** includes "Related posts" (same topic hub) and soft CTA to `/speaker`

### Link Priority

`/speaker` receives the most internal links. Audit this before launch — count internal links to `/speaker` and ensure it exceeds any other page by a significant margin.

### Cross-linking New Content

When the AI agent optimizes a post or creates new content, it must:
- Add at least 1 link to the target topic hub
- Add a link to the relevant keynote page (if applicable)
- Add 1-2 links to other blog posts in the same topic cluster
- Include the soft CTA component linking to `/speaker`

---

## Part 8: Content Strategy (AI-Powered)

### Content Types and Their SEO Purpose

| Content Type | SEO Purpose | Creation Method |
|---|---|---|
| Money pages (`/speaker`, `/keynotes/*`) | Rank for commercial-intent keywords | Written manually with SEO structure |
| Topic hubs (`/topics/*`) | Build topical authority, bridge blog to keynotes | Written manually, enriched with linked posts |
| Optimized blog posts (`/blog/*`) | Capture long-tail informational queries, build authority | AI agent + human review |
| New blog posts | Target keyword gaps, fresh content signal | AI agent from voice corpus + human review, OR manual writing |
| Archive posts (`/archive/*`) | Preserve URL equity, raw material for future optimization | Migrated as-is, queued for AI optimization |

### AI Agent Content Rules

When the AI agent creates or optimizes content, it must:

1. **Preserve Nic's voice.** Reference the voice corpus for tone: direct, personal, story-driven, framework-oriented. No generic content-mill language.
2. **Ground in real material.** Every claim, story, or framework must trace back to something in the keynote transcripts, books, or original blog post. No fabrication.
3. **Structure for SEO.** Include: TL;DR, clear H2/H3 hierarchy, target keyword in title and first 100 words, internal links to topic hub and keynote.
4. **Structure for GEO.** Include: definition blocks, 5 FAQs at the end of every post (derived from the post's content, targeting common questions a reader would ask), attributed quotes.
5. **Include `optimizationNotes`.** Explain what was changed and why, so the human reviewer can assess quickly.
6. **Set `targetKeywords` and `targetTopicHub`.** Every piece of content has explicit SEO intent.

### Content Prioritization

The AI agent should prioritize content work in this order:
1. Posts with existing search impressions but low CTR (quick wins — better titles and meta descriptions)
2. Posts that map to high-value topic clusters (curiosity, innovation, AI, entrepreneurship)
3. Keyword gaps where no content exists yet (new content from voice corpus)
4. Archive posts with decent raw content that can be refreshed
5. Posts in lower-priority topic clusters (focus, agency, failure)

---

## Part 9: Redirect Strategy (SEO-Critical)

### Why Redirects Matter

Every old Squarespace URL must resolve to a valid destination. Even though current search traffic is modest (~150 clicks/month from Google), the domain has 17 years of history and existing backlinks. 404s during migration signal to Google that the site is broken.

### Implementation

**Pattern rule** (handles majority of blog URLs):
```
/blog/YYYY/MM/DD/slug → /blog/slug (if optimized) or /archive/slug (if archived)
```

**Exact-match map** (small, for page-level redirects):
```
/meet-nic-haralambous → /about
/the-speaker → /speaker
/virtual-keynote-speaker → /speaker
/contact-me → /contact
/businesses → /about
/its-not-over → /media
/side-hustle-course → /books/how-to-start-a-side-hustle
```

**Default for dropped content:** 301 to nearest relevant page. NOT 410 unless content is genuinely toxic.

### Verification

Before launch:
- Test 50+ old URLs manually — verify correct 301 destination
- Run full crawl comparing old sitemap against new redirect destinations
- Confirm no redirect chains (every old URL maps directly, not through an intermediate)

---

## Part 10: Measurement

### Tools

| Tool | Purpose |
|---|---|
| Google Search Console | Rankings, impressions, clicks, indexing, crawl errors |
| GA4 | Traffic, behaviour, conversion events |

### Key Metrics

| Metric | What to Watch |
|---|---|
| `/speaker` impressions and clicks | Is the money page gaining visibility? |
| `/speaker` average position for "virtual keynote speaker" | Is it climbing? |
| Total indexed pages | Are all pages getting indexed? |
| Crawl errors | Any 404s or redirect issues? |
| Booking form submissions | Are visitors converting? |
| Core Web Vitals | All in "Good" range? |
| AI citation accuracy | Does ChatGPT/Perplexity describe Nic correctly? |

### Ongoing SEO Reviews

- Check Search Console weekly for the first month post-launch, then biweekly
- Look for: new keyword opportunities (queries you're getting impressions for but haven't targeted), pages losing traffic (may need refresh), crawl errors
- Feed insights back into the AI content pipeline — keyword gaps become new content assignments

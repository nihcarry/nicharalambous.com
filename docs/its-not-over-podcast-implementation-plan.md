# It's Not Over — Podcast Section — Implementation Plan

Context: Initial exploration and user decisions. Entry from Building only; no new nav item. Podcast lives under the **Building** section (no new nav item). Entry point: `/businesses` → link to podcast hub. Episodes get dedicated SEO pages with keynote/topic cross-links and booking CTAs.

---

## SEO Recommendations (aligned with nicharalambous-seo-strategy.md)

| Decision | Recommendation | Rationale |
|----------|----------------|------------|
| **Hub URL** | `/its-not-over` | Branded, matches show name; reclaims legacy links (Medium, etc.). Remove current redirect to `/media` and serve the hub here. |
| **Episode URL** | `/its-not-over/[slug]` with **guest-name** slugs (e.g. `zanele-matome`, `chris-jones`) | Flat, lowercase, hyphenated; stable and shareable. Full title in H1/meta for keywords. |
| **Content** | TL;DR/summary, main takeaways, “Ties to keynotes” (1 primary), 1–2 topic hub links, Book Nic CTA | Matches authority flow: episode → topics → keynotes → /speaker. |
| **Schema** | `PodcastSeries` (landing), `PodcastEpisode` (each episode) | Per strategy: structured data for podcast content. |

---

## Data Model (static, no Sanity for now)

- **Source:** Static data only (no new episodes planned). You can add/edit in code or later move to CMS.
- **Episode shape:**  
  `slug`, `title`, `guestName`, `description` (2–4 sentences for TL;DR + body), `publishedAt` (ISO date), `durationMinutes`, `spotifyUrl`, `appleUrl?`, `youtubeUrl?`, `relatedKeynoteSlug` (one), `topicSlugs` (array of 1–2, e.g. `["failure", "entrepreneurship"]`).
- **Listen links (hub):**  
  - Spotify: `https://open.spotify.com/show/3cix677zkpJ3FfnLgPuJc2`  
  - Apple Podcasts / YouTube: placeholders until you provide; we can use standard patterns (e.g. Apple show search URL, YouTube channel/playlist).

---

## Implementation Steps

### 1. Redirect and route ownership

- [ ] **1.1** In `infra/cloudfront-url-rewrite.js`: remove the entry `'/its-not-over': '/media'`.
- [ ] **1.2** In `scripts/validate-redirects.ts`: add `"/its-not-over"` to `LIVE_ROUTES` so the app owns this path.
- [ ] **1.3** (Optional) In `nicharalambous-seo-strategy.md` Part 9: update redirect list to state that `/its-not-over` is now the podcast hub (no redirect).

### 2. Episode data and types

- [ ] **2.1** Add `lib/its-not-over/types.ts`: TypeScript types for `PodcastEpisode` and `PodcastSeries` (show-level) and any helpers.
- [ ] **2.2** Add `lib/its-not-over/episodes.ts` (or `data/its-not-over-episodes.ts`): export a single array of episodes. Initial rows can be seeded from the [Spotify show](https://open.spotify.com/show/3cix677zkpJ3FfnLgPuJc2) (e.g. Zanele Matome, Chris Jones, Jason Bagley, Hiten Keshave, Mike Abel, Fred Roed, Andy Higgins, Cesar Hasselmann, Brett StClair, Jonathan Elcock, Jonathan Kropf, Gitanjali Trevorrow-Seymour). You fill `description`, `relatedKeynoteSlug`, and `topicSlugs` per episode; we can add more episodes later by appending to the array.
- [ ] **2.3** Add show-level constants: title "It's Not Over", tagline (e.g. from Spotify), Spotify URL, Apple URL (placeholder), YouTube URL (placeholder).

### 3. Podcast hub page (`/its-not-over`)

- [ ] **3.1** Add `app/its-not-over/page.tsx`:  
  - H1: "It's Not Over"  
  - Subhead/tagline (e.g. real-time therapy for entrepreneurs; vulnerable conversations about near-death business experiences).  
  - “Listen / Watch” block: buttons or links to Spotify, Apple Podcasts, YouTube (open in new tab).  
  - Episode list: cards or list with title, guest, date, duration, link to `/its-not-over/[slug]`.  
  - Reuse `Section`, `FinalCta` (optional soft CTA to /speaker).  
- [ ] **3.2** Metadata: title "It's Not Over | Podcast | Nic Haralambous", description, canonical `https://www.nicharalambous.com/its-not-over`, OG/Twitter.  
- [ ] **3.3** JSON-LD: add `podcastSeriesJsonLd()` in `lib/metadata.ts` and render `PodcastSeries` on this page (name, description, url, author = Person).

### 4. Episode page (`/its-not-over/[slug]`)

- [ ] **4.1** Add `app/its-not-over/[slug]/page.tsx`:  
  - Resolve episode by slug from the static episodes array; 404 if not found.  
  - `generateStaticParams`: return all episode slugs.  
  - Layout: breadcrumb or back link to `/its-not-over`; H1 = episode title (e.g. "Zanele Matome — From a personal butler to broke and back"); guest name and date/duration.  
  - Main content: TL;DR/summary block, then full description (or body).  
  - “Ties to keynotes”: one primary keynote — link to `/keynotes/[relatedKeynoteSlug]` with short label.  
  - “Related topics”: 1–2 topic hub links to `/topics/[slug]`.  
  - `FinalCta`: "Book Nic" → `/contact`, "Explore keynotes" → `/speaker` (or `/keynotes`).  
- [ ] **4.2** Metadata: `generateMetadata` — title "{Episode title} | It's Not Over | Nic Haralambous", description from episode summary, canonical, OG/Twitter.  
- [ ] **4.3** JSON-LD: add `podcastEpisodeJsonLd()` in `lib/metadata.ts` (name, description, datePublished, duration, partOf PodcastSeries, author); render on each episode page.

### 5. Building page entry point

- [ ] **5.1** On `app/businesses/page.tsx`: add a section (e.g. after “What I'm Building Now” or before Past Startups) titled “The Podcast” (or “It's Not Over”). One card: title "It's Not Over", short blurb, link to `/its-not-over` (internal). Reuse existing card/slide styling so it fits the Building narrative.  
- [ ] **5.2** Ensure the card is visible on the first “Building” scroll or on the same slide deck so users don’t miss it.

### 6. Footer and internal linking

- [ ] **6.1** In `components/footer-content.tsx`: add "It's Not Over" to `footerLinks.explore` (e.g. `{ href: "/its-not-over", label: "It's Not Over (Podcast)" }`) for internal linking and discoverability.

### 7. Search (Pagefind)

- [ ] **7.1** In `package.json` `postbuild`: extend the `pagefind` `--glob` to include `its-not-over.html` and `its-not-over/**/*.html` so episode pages are searchable with the blog (e.g. `"{blog.html,blog/**/*.html,archive/**/*.html,its-not-over.html,its-not-over/**/*.html}"`).  
- [ ] **7.2** Keep the same `--exclude-selectors` so nav/footer are excluded.

### 8. Sitemap and SEO doc

- [ ] **8.1** Confirm `next-sitemap` includes `/its-not-over` and `/its-not-over/*` (no exclude rule needed).  
- [ ] **8.2** Optional: in `nicharalambous-seo-strategy.md`, add a short subsection for “Podcast (`/its-not-over`)” — H1, sections, schema (PodcastSeries + PodcastEpisode), and that episode pages link to one keynote and 1–2 topic hubs and end with Book Nic CTA.

---

## Episode slug and keynote/topic mapping

- Slugs: **guest-name** only (e.g. `zanele-matome`, `chris-jones`, `jason-bagley`). No episode numbers in URL for stability.  
- **One primary keynote per episode:** set `relatedKeynoteSlug` to one of the existing keynotes (e.g. `reclaiming-focus`, `curiosity-catalyst`, `breakthrough-product-teams`, `innovation-starts-at-home`, `creating-a-curious-company`, `connected-not-consumed`).  
- **1–2 topics per episode:** set `topicSlugs` to 1–2 of: `curiosity`, `innovation`, `entrepreneurship`, `focus`, `ai`, `agency`, `failure` (must match existing topic hub slugs in Sanity/route).

---

## Listen links (hub)

- **Spotify:** `https://open.spotify.com/show/3cix677zkpJ3FfnLgPuJc2`  
- **Apple Podcasts:** placeholder (e.g. `https://podcasts.apple.com/...` or search link) until you provide.  
- **YouTube:** placeholder until you provide (channel or playlist).

When you have Apple and YouTube URLs, we’ll replace the placeholders in the show-level constants and in the hub page.

---

## Progress

- [ ] Step 1 — Redirect and route ownership  
- [ ] Step 2 — Episode data and types  
- [ ] Step 3 — Podcast hub page  
- [ ] Step 4 — Episode page  
- [ ] Step 5 — Building page entry  
- [ ] Step 6 — Footer  
- [ ] Step 7 — Pagefind  
- [ ] Step 8 — Sitemap and SEO doc  

**Overall: 0% complete.**

---

## File checklist

| File | Action |
|------|--------|
| `infra/cloudfront-url-rewrite.js` | Remove `/its-not-over` redirect |
| `scripts/validate-redirects.ts` | Add `/its-not-over` to LIVE_ROUTES |
| `lib/its-not-over/types.ts` | Create (episode + series types) |
| `lib/its-not-over/episodes.ts` | Create (episode array + show constants) |
| `lib/metadata.ts` | Add podcastSeriesJsonLd, podcastEpisodeJsonLd |
| `app/its-not-over/page.tsx` | Create hub page |
| `app/its-not-over/[slug]/page.tsx` | Create episode page |
| `app/businesses/page.tsx` | Add “The Podcast” section + card to /its-not-over |
| `components/footer-content.tsx` | Add It's Not Over to explore |
| `package.json` | Extend pagefind glob |
| `nicharalambous-seo-strategy.md` | Optional: document podcast section |

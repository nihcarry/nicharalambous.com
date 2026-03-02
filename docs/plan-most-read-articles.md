# Most Read Articles — Implementation Plan

**Overall Progress:** `0%`

## TLDR

Add a curated "Most Read Articles" section at the top of `/blog` showing exactly 6 hand-picked posts in a grid layout. Articles are selected and ordered via a new **Blog Settings** singleton in Sanity, replacing the existing "Most Popular" ranked-list section. Not driven by analytics — purely editorial curation.

## Critical Decisions

- **Replace "Most Popular" section** — the existing `MostPopularHero` (5 posts, vertical list) serves the same purpose. Having both is redundant, so "Most Read Articles" replaces it entirely.
- **Sanity singleton for selection** — instead of per-post booleans (like the existing `mostPopular` field), use an ordered reference array on a **Blog Settings** singleton. This gives one dashboard view of all 6 picks with drag-to-reorder, rather than hunting through individual posts.
- **Grid layout (3×2)** — 6 articles display in a 3-column × 2-row grid on desktop (matching the existing `BlogList` grid pattern), 2 columns on tablet, 1 column on mobile.
- **Card style: `border-4`** — uses the medium-weight brutalist card (same as current `MostPopularHero`) to visually elevate the section above the standard `border-2` listing cards.
- **Graceful degradation** — section renders with however many posts are selected (1–6), hides entirely if none are selected. This avoids blocking the page on having exactly 6.

## Tasks

- [ ] 🟥 **Step 1: Create Blog Settings singleton in Sanity**
  - [ ] 🟥 Create `sanity/schemas/singletons/blog-settings.ts` with a `mostReadArticles` field (ordered array of post references, max 6)
  - [ ] 🟥 Register the singleton in `sanity/sanity.config.ts` (add to schema types and structure builder alongside existing singletons like Site Settings)

- [ ] 🟥 **Step 2: Add GROQ query and TypeScript type**
  - [ ] 🟥 Add `mostReadArticlesQuery` to `lib/sanity/queries.ts` — fetches the singleton's ordered post references with title, slug, excerpt, featuredImage, topics, publishedAt, estimatedReadTime
  - [ ] 🟥 Add `MostReadArticleItem` interface (or reuse `FeaturedPostItem` if the shape matches)

- [ ] 🟥 **Step 3: Build MostReadArticles component**
  - [ ] 🟥 Create `components/most-read-articles.tsx` — server component rendering a 3×2 grid of article cards
  - [ ] 🟥 Card contents: featured image (16:9), title, excerpt (line-clamped), date + read time, topic tags
  - [ ] 🟥 Section heading with icon and "Most Read" label (matching existing heading pattern from `MostPopularHero`)
  - [ ] 🟥 Responsive: 1 col mobile → 2 cols tablet → 3 cols desktop

- [ ] 🟥 **Step 4: Integrate into blog page**
  - [ ] 🟥 In `app/blog/page.tsx`, replace `getMostPopularPosts()` with a new `getMostReadArticles()` fetch function
  - [ ] 🟥 Replace `<MostPopularHero>` render with `<MostReadArticles>`
  - [ ] 🟥 Keep the section inside `<Section width="wide">` with conditional rendering (hide if empty)

- [ ] 🟥 **Step 5: Clean up replaced code**
  - [ ] 🟥 Remove `MostPopularHero` component (`components/most-popular-hero.tsx`)
  - [ ] 🟥 Remove `mostPopularPostsQuery` from `lib/sanity/queries.ts`
  - [ ] 🟥 Remove the `mostPopular` and `featuredLabel` fields from the post schema (and the unused `featured` field)
  - [ ] 🟥 Remove the `FeaturedPostItem` type if no longer referenced

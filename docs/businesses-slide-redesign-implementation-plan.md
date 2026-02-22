# Feature Implementation Plan

**Overall Progress:** `83%`

## TLDR
Redesign `/businesses` into a slide-based page that matches the site’s keynote-style experience, including a hero H1 treatment consistent with other slide pages. Each business card will prioritize real product screenshots, with category-specific presentation for current builds, past startups, and a muted deadpool section. We will also update Sanity to support screenshot-first content and introduce a canonical URL recommendation policy for current and past ventures.

## Critical Decisions
- Decision 1: Use `SlideDeck` + `Slide` on `/businesses` - aligns the page with existing homepage/topics/keynotes interaction model and visual language.
- Decision 2: Use slide-style hero H1 (`heading-stroke` accent treatment) - matches the approved direction from other slide pages.
- Decision 3: Keep one slide per category as the base structure - preserves narrative flow while allowing iterative adjustment if card counts overflow.
- Decision 4: Add a new Sanity `screenshot` image field on `business` - supports screenshot-first cards without overloading the existing `logo` field semantics.
- Decision 5: Deadpool cards have no links - follows the clarified requirement and keeps the section archival/muted in tone.
- Decision 6: Canonical URL recommendation policy: active + past businesses should use one canonical public URL each (official product homepage preferred, then company/about page, then app root); deadpool entries intentionally have no canonical outbound URL - keeps external linking consistent, maintainable, and intentional.

## Tasks:

- [x] 🟩 **Step 1: Define content model + URL policy updates**
  - [x] 🟩 Add `screenshot` image field to `sanity/schemas/documents/business.ts`.
  - [x] 🟩 Extend `businessesQuery` and `BusinessData` in `lib/sanity/queries.ts` to include `screenshot`.
  - [x] 🟩 Document canonical URL recommendation rules for business records (active/past only; deadpool none).
  - [x] 🟩 Prepare a recommended canonical URL list draft for existing active/past entries in Sanity (to be reviewed before publish).

- [x] 🟩 **Step 2: Migrate `/businesses` to slide architecture**
  - [x] 🟩 Replace `Section`-stack layout in `app/businesses/page.tsx` with `SlideDeck` and category `Slide`s.
  - [x] 🟩 Add `NextSlideIndicator` and footer slide integration consistent with other slide pages.
  - [x] 🟩 Preserve existing data partition logic (`active`, `exits`, `deadpool`) and fallback behavior.

- [x] 🟩 **Step 3: Build hero slide with matching H1 treatment**
  - [x] 🟩 Implement a hero slide with the approved slide-style H1 treatment used on other key pages.
  - [x] 🟩 Keep the current narrative copy, adapted to hero-slide spacing and hierarchy.
  - [x] 🟩 Ensure mobile and desktop rendering stays readable within slide constraints.

- [x] 🟩 **Step 4: Implement category slides and card designs**
  - [x] 🟩 **What I’m Building Now:** screenshot-first cards, active styling, and outbound links to canonical business URLs.
  - [x] 🟩 **Past Startups:** screenshot-first cards with outcome badges and muted-but-positive “archive exits” treatment.
  - [x] 🟩 **Deadpool:** muted card treatment with no outbound links (explicitly non-clickable).
  - [x] 🟩 Add robust fallbacks when screenshots are missing (logo fallback, then neutral placeholder treatment).

- [x] 🟩 **Step 5: Handle capacity/overflow experimentation for one-slide-per-category**
  - [x] 🟩 Test realistic business counts per category against desktop and mobile constraints.
  - [x] 🟩 If overflow occurs, apply minimal extension strategy (e.g., split long categories into continuation slides) without changing the core narrative.
  - [x] 🟩 Keep transitions and spacing consistent with existing slide pages.

- [ ] 🟨 **Step 6: QA, polish, and deployment readiness**
  - [x] 🟩 Validate visual consistency against `/`, `/topics`, and `/keynotes` hero + slide patterns.
  - [x] 🟩 Verify external link behavior for active/past and absence of links for deadpool.
  - [ ] 🟨 Run lint/build checks and manual responsive QA.
  - [ ] 🟥 Confirm Sanity content completeness for screenshots + canonical URLs before release.


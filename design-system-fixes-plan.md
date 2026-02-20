# Design System Fixes — Complete Implementation Plan

**Overall Progress:** `100%`

## TLDR

Complete the design system rollout across all pages. The rollout plan claimed 100% but many page-level sub-tasks were never implemented, and a new issue was identified: inner-page H1s use `heading-display-stroke` (4px black stroke) at sizes too small to carry it, making headlines illegible. This plan fixes that first as a global prerequisite, then addresses the confirmed unimplemented components and pages.

## Critical Decisions

- **New `heading-display-stroke-sm` utility**: Inner page H1s need a 1px stroke — enough to preserve the brutalist character without making the letterforms unreadable at 4xl–6xl. The homepage slides keep `heading-display-stroke` (2px/4px) since they're designed for much larger text.
- **`heading-display-stroke` stays on homepage only**: After the audit, only `app/page.tsx` slide headings should use the heavy version. All other H1s switch to `heading-display-stroke-sm`.
- **H2 section headings never get stroke**: `heading-display` (no stroke) is the correct class for section H2s site-wide — the Bebas weight alone is sufficient at that scale.
- **`MostReadHero` gets `border-4`**: The lighter card treatment spec from rollout Step 10. Not `card-brutalist`.
- **`BlogList` cards get `border-2`**: Lightest treatment — high-density listing. Not `card-brutalist`.
- **`card-brutalist` responsive border**: Mobile gets `12px`, md+ gets `20px` — applied once in `globals.css`, zero call-site changes.
- **Pages are partially implemented**: Many pages were modified during the initial rollout. Each page step below targets only what's confirmed missing — verify before overwriting what's already there.

---

## Tasks

- [x] 🟩 **Step 1: Add `heading-display-stroke-sm` to `globals.css`**
  - [x] 🟩 Add `.heading-display-stroke-sm` utility: Bebas Neue + uppercase + `1px black` stroke (no responsive breakpoint scaling)
  - [x] 🟩 Make `card-brutalist` border responsive: `12px` base, `20px` at `md+`

- [x] 🟩 **Step 2: Audit and update all inner-page H1s to `heading-display-stroke-sm`**
  - [x] 🟩 `app/about/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/keynotes/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/keynotes/[slug]/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/topics/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/topics/[slug]/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/blog/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/blog/[slug]/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/books/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/books/[slug]/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/businesses/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/media/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/contact/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/not-found.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/archive/[slug]/page.tsx` — H1: `heading-display-stroke` → `heading-display-stroke-sm`
  - [x] 🟩 `app/speaker/page.tsx` — updated to `heading-display-stroke-sm`
  - [x] 🟩 `app/page.tsx` (homepage) — confirmed unchanged; slides keep `heading-display-stroke`

- [x] 🟩 **Step 3: Fix `MostReadHero` component**
  - [x] 🟩 Card wrapper: `rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white shadow-sm` → `border-4 border-accent-600 bg-white`
  - [x] 🟩 Card hover: `hover:border-amber-300 hover:shadow-lg` → `hover:bg-accent-50`
  - [x] 🟩 Rank circle: removed `rounded-full` → sharp square
  - [x] 🟩 Featured label pill: removed `rounded-full` → sharp
  - [x] 🟩 Topic pills: removed `rounded-full` → sharp
  - [x] 🟩 Post title h3: `text-lg font-bold tracking-tight` → `heading-display text-lg`
  - [x] 🟩 Thumbnail wrapper: removed `rounded-lg`
  - [x] 🟩 Section heading icon container: removed `rounded-full`; heading → `heading-display`

- [x] 🟩 **Step 4: Fix `BlogList` component**
  - [x] 🟩 Topic filter buttons: removed `rounded-full` → sharp (both active and inactive)
  - [x] 🟩 Post card wrapper: `rounded-xl border border-brand-200` → `border-2 border-accent-600`
  - [x] 🟩 Post card featured image wrapper: removed `rounded-lg`
  - [x] 🟩 Post card h2 title: `text-lg font-semibold` → `heading-display text-lg`
  - [x] 🟩 Topic tag spans: removed `rounded-full` → sharp
  - [x] 🟩 Pagination Previous/Next buttons: removed `rounded-lg` → sharp
  - [x] 🟩 Pagination page number buttons: removed `rounded-lg` → sharp

- [x] 🟩 **Step 5: Complete `/about` page remaining items**
  - [x] 🟩 All H2 section headings confirmed using `heading-display` (no stroke)
  - [x] 🟩 Key facts grid: `card-brutalist` with per-card rotation confirmed; fact numbers → `heading-display`
  - [x] 🟩 Book teaser cards: `card-brutalist` with per-card rotation confirmed
  - [x] 🟩 "As Featured In" brand names: `heading-display uppercase` confirmed
  - [x] 🟩 Outcome pills: removed `rounded-full` → sharp

- [x] 🟩 **Step 6: Complete `/keynotes/[slug]` remaining items**
  - [x] 🟩 All H2 section headings confirmed using `heading-display`
  - [x] 🟩 "Virtual Keynote" label confirmed using `heading-display uppercase`
  - [x] 🟩 Outcome list numbers confirmed square (no `rounded-full`)
  - [x] 🟩 Testimonial blockquotes confirmed `card-brutalist` + rotation
  - [x] 🟩 Related topic pills confirmed sharp
  - [x] 🟩 Video embed confirmed sharp corners

- [x] 🟩 **Step 7: Complete `/topics` listing page**
  - [x] 🟩 Card H2 titles confirmed using `heading-display`
  - [x] 🟩 Topic cards confirmed using `card-brutalist` with per-card rotation
  - [x] 🟩 Related keynote pills confirmed sharp

- [x] 🟩 **Step 8: Complete `/topics/[slug]` remaining items**
  - [x] 🟩 H2 section headings confirmed using `heading-display`
  - [x] 🟩 "Topic Hub" label confirmed using `heading-display uppercase`
  - [x] 🟩 Related keynote card h3 title: `text-lg font-semibold` → `heading-display text-lg`
  - [x] 🟩 Featured/recent post card h3 titles: `text-lg font-semibold` → `heading-display text-lg`
  - [x] 🟩 "All topics" pills confirmed sharp

- [x] 🟩 **Step 9: Update shared blog components (`/blog/[slug]`)**
  - [x] 🟩 `FaqSection`: heading confirmed using `heading-display`; dividers sharp
  - [x] 🟩 `RelatedPosts`: heading `heading-display`; cards `border-2 border-accent-600` sharp; h3 titles `heading-display`
  - [x] 🟩 `ContextualCta`: heading `heading-display`; sharp corners confirmed; accent-50 bg preserved
  - [x] 🟩 `VideoReadAlong`: video container sharp; featured label badge `rounded-full` removed
  - [x] 🟩 `/blog/[slug]` page: topic tag pills sharp; TL;DR aside `border-l-[8px] border-accent-600`; featured image sharp

- [x] 🟩 **Step 10: Complete `/books` listing page**
  - [x] 🟩 Book cards confirmed using `card-brutalist` with per-card rotation
  - [x] 🟩 Card H2 titles confirmed using `heading-display`
  - [x] 🟩 Cover images confirmed sharp corners
  - [x] 🟩 Topic pills confirmed sharp corners

- [x] 🟩 **Step 11: Complete `/books/[slug]` page**
  - [x] 🟩 "Book" label confirmed using `heading-display uppercase`
  - [x] 🟩 All H2 section headings confirmed using `heading-display`
  - [x] 🟩 Cover image confirmed sharp corners
  - [x] 🟩 Buy link buttons confirmed `border-2 border-accent-600` sharp
  - [x] 🟩 Related topic pills confirmed sharp corners

- [x] 🟩 **Step 12: Complete `/businesses` page**
  - [x] 🟩 All H2 section headings confirmed using `heading-display`
  - [x] 🟩 "What I'm Building Now" cards: `card-brutalist` + rotation confirmed; H3 titles `heading-display` confirmed
  - [x] 🟩 "Past Startups" cards: `card-brutalist` + rotation confirmed; H3 titles `text-lg font-semibold` → `heading-display text-lg`
  - [x] 🟩 "Deadpool" cards: `border-4 border-brand-400` sharp confirmed; H3 titles `text-base font-semibold` → `heading-display text-base`
  - [x] 🟩 Outcome pills: removed `rounded-full` → sharp

- [x] 🟩 **Step 13: Complete `/media` page**
  - [x] 🟩 All H2 section headings confirmed using `heading-display`
  - [x] 🟩 Media outlet logos confirmed using `heading-display uppercase`
  - [x] 🟩 Appearance cards confirmed using `card-brutalist` + rotation
  - [x] 🟩 Type pills confirmed sharp corners
  - [x] 🟩 Card H3 titles: `text-lg font-semibold` → `heading-display text-lg`

- [x] 🟩 **Step 14: Complete `/contact` page**
  - [x] 🟩 Form inputs confirmed sharp corners (no `rounded-*` in shared `inputStyles`)
  - [x] 🟩 Submit button confirmed sharp, Bebas, uppercase

- [x] 🟩 **Step 15: Polish fixes (peer review LOW items)**
  - [x] 🟩 `components/final-cta.tsx` — blockquote: `heading-display` → `heading-display-stroke-sm`
  - [x] 🟩 `app/archive/[slug]/page.tsx` — imported `CTAButton`; replaced hand-rolled link CTAs with `<CTAButton>` variants; section heading → `heading-display`

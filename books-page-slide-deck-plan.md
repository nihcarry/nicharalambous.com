# Books Page Slide Deck — Implementation Plan

**Overall Progress:** 100%

## TLDR

Transform the /books page into a keynote-style slide deck matching the homepage and speaker/keynotes pages. Hero slide + one full-viewport slide per book (Do. Fail. Learn. Repeat., How to Start a Side Hustle, The Business Builder's Toolkit), each with headline, cover image, one-paragraph summary, BUY NOW CTA, and link to the individual book page. Add 16-bit Nic placeholders (varying count per slide) using existing assets as temporary. Remove the "Want the Keynote Version?" CTA; add footer slide.

## Critical Decisions

- Use existing SlideDeck pattern from homepage/speaker/keynotes — consistent UX and proven scroll-snap behavior
- Three distinct books with third as "The Business Builder's Toolkit" — separate from How to Start a Side Hustle
- Add `shortSummary` to book schema and `booksListQuery` — enables one-paragraph teaser on slides; individual pages keep full `description`
- Add `buyLinks` to `booksListQuery` — required for BUY NOW per book slide
- Varying 16-bit counts per slide — hero: 2, book 1: 1, book 2: 3, book 3: 2 — mix it up as requested
- Use existing 16-bit images temporarily — user will replace with reading-specific assets later
- Keep individual /books/{slug} pages — link from each slide (title/cover) plus BUY NOW button

## Tasks

- [x] 🟩 **Step 1: Extend book data for listing page**
  - [x] 🟩 Add `buyLinks` and `shortSummary` to `booksListQuery` in `lib/sanity/queries.ts`
  - [x] 🟩 Add `shortSummary` field to book schema in `sanity/schemas/documents/book.ts`
  - [x] 🟩 Update `BookListItem` interface to include `buyLinks` and `shortSummary`
  - [x] 🟩 Add third book (The Business Builder's Toolkit) to `FALLBACK_BOOKS` in `app/books/page.tsx` and `app/books/[slug]/page.tsx` with slug `the-business-builders-toolkit`, Amazon link, `shortSummary`, and `descriptionText`
  - [x] 🟩 Add `the-business-builders-toolkit` to `FALLBACK_SLUGS` in `app/books/[slug]/page.tsx`

- [x] 🟩 **Step 2: Refactor books page to SlideDeck layout**
  - [x] 🟩 Replace current layout with `SlideDeck`, `NextSlideIndicator`
  - [x] 🟩 Add `ConditionalFooter` exclusion for `/books` path
  - [x] 🟩 Remove `FinalCta` "Want the Keynote Version?" section
  - [x] 🟩 Keep `JsonLd` and metadata unchanged

- [x] 🟩 **Step 3: Build hero slide**
  - [x] 🟩 Slide with variant `hero`, background `bg-openbook-pattern`, id `hero`
  - [x] 🟩 Headline "My Books"
  - [x] 🟩 Subtitle "Three books from 20+ years of building, failing, and learning."
  - [x] 🟩 Two 16-bit placeholder positions using existing assets (e.g. `16Bit_Nic_Keynotes.png`, `Nic_Ancient_greece_16bit.png`)

- [x] 🟩 **Step 4: Build three book slides**
  - [x] 🟩 Each slide: variant `centered` or appropriate, `bg-openbook-pattern`, unique id per book
  - [x] 🟩 Content: book title (headline), cover image, one-paragraph summary from `shortSummary` or fallback
  - [x] 🟩 BUY NOW button linking to first `buyLinks[0].url` (or primary Amazon) — style as CTAButton primary
  - [x] 🟩 "Learn more" / title link to `/books/{slug}` — secondary CTA or text link
  - [x] 🟩 16-bit placeholders: book 1 slide — 1 placeholder; book 2 slide — 3 placeholders; book 3 slide — 2 placeholders
  - [x] 🟩 Handle missing cover: placeholder div or generic book icon when `coverImage` is null

- [x] 🟩 **Step 5: Add footer slide**
  - [x] 🟩 Final slide with `FooterContent`, variant `footer`, background `bg-foot-pattern`
  - [x] 🟩 Match homepage/speaker/keynotes footer slide pattern

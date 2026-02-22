# Em Dash Removal Implementation Plan

**Overall Progress:** `75%`

## TLDR

Remove all em dashes (—) and `&mdash;` from user-facing website content, replacing them with grammatically appropriate alternatives (colons, commas, parentheses, or rephrasing). Covers hardcoded strings in app/components/lib, shared components, and documents how to handle CMS content.

## Critical Decisions

- **Replace with context-appropriate alternatives** — Em dashes serve different roles: parenthetical (→ commas or parentheses), appositive (→ colons), list intros (→ "including" or colons), quote attribution (→ hyphen or "by"). Each instance gets the best-fit replacement.
- **Exclude code comments** — File headers and inline comments are developer-facing, not page content. Out of scope unless explicitly requested.
- **Exclude docs/** — `docs/DEPLOY.md`, `docs/SANITY-VS-SITE-AUDIT.md` etc. are internal; not rendered on the live site.
- **Sanity CMS content** — Blog posts, keynotes, topic descriptions, speaker copy etc. live in Sanity. Plan includes a step to audit and edit in Studio (or run a Sanity migration script).
- **Legacy Content and optimized_content** — Source/migration content; live site serves from Sanity. Only relevant if re-importing; otherwise out of scope.
- **En dashes (–)** — Used for date ranges (e.g. "Nov 2012 – Nov 2019") and number ranges. Grammatically correct; **do not** replace.

---

## Tasks

- [x] 🟩 **Step 1: App pages — hardcoded prose and metadata**
  - [x] 🟩 `app/about/page.tsx`: "around the world — SXSW" → "around the world, including SXSW"; "cultures — whether through" → "cultures, whether through"; "&mdash; Nic Haralambous" → "- Nic Haralambous"
  - [x] 🟩 `app/page.tsx`: Homepage topic descriptions updated ("innovation, and", "your mind, or")
  - [x] 🟩 `app/books/page.tsx`: "entrepreneurship — the real version" → "entrepreneurship: the real version"
  - [x] 🟩 `app/businesses/page.tsx`: "shut down — from" and "shut down — 20+" replaced with comma/colon
  - [x] 🟩 `app/media/page.tsx`: "in the media — press" and "Media Appearances — Nic" replaced with "including" / pipe
  - [x] 🟩 `app/topics/[slug]/page.tsx`: Title/metadata updated; fallback topic prose updated with context-appropriate punctuation
  - [x] 🟩 `app/blog/page.tsx`: JSON-LD name "Blog — Nic" → "Blog | Nic Haralambous"
  - [x] 🟩 `app/blog/[slug]/page.tsx`: Fallback post descriptions (2 instances) updated
  - [x] 🟩 `app/rss.xml/route.ts`: "Nic Haralambous — Blog" → "Nic Haralambous | Blog"
  - [x] 🟩 `app/contact/contact-form.tsx`: "Reclaiming Focus — The DIAL" → "Reclaiming Focus: The DIAL Framework"
  - [x] 🟩 `app/speaker/page.tsx`: DEFAULT_WHY_BOOK, DEFAULT_FAQS, and list item copy updated

- [x] 🟩 **Step 2: Shared components — attribution and user-visible strings**
  - [x] 🟩 `components/final-cta.tsx`: `&mdash; {quoteAttribution}` → `- {quoteAttribution}`
  - [x] 🟩 `components/portable-text.tsx`: `— {value.attribution}` → `- {value.attribution}`
  - [x] 🟩 `components/video-read-along.tsx`: "— Video Read-Along" and "below — read" replaced with colon/semicolon variants

- [x] 🟩 **Step 3: Sanity schema descriptions (Studio UI only)**
  - [x] 🟩 `sanity/schemas/singletons/speaker.ts`: "Differentiators — why"; "List of events — SXSW" replaced
  - [x] 🟩 `sanity/schemas/documents/topic-hub.ts`: "What this topic means — in Nic's words" replaced

- [ ] 🟥 **Step 4: Sanity CMS content (optional / post-code)**
  - [ ] 🟥 Audit blog posts, keynotes, topic hub copy, speaker page sections for em dashes in Studio
  - [ ] 🟥 Edit in Sanity Studio or run a GROQ + patch migration to replace `—` with chosen alternatives in Portable Text and string fields

---

## Replacement Guide

| Em dash role | Example | Replacement |
|-------------|---------|-------------|
| Parenthetical / aside | "X — which we do" | "X, which we do" or "X (which we do)" |
| Appositive / clarification | "X — the real version" | "X: the real version" or "X (the real version)" |
| List introduction | "including X, Y, Z" | "including X, Y, Z" or "X, Y, Z" after colon |
| Quote attribution | "— Nic Haralambous" | "- Nic Haralambous" or "by Nic Haralambous" |
| Contrast / "or" | "X — or Y" | "X, or Y" or "X. Or Y" |
| Continuation | "X — and Y" | "X, and Y" or "X. And Y" |

---

## Out of Scope (per decisions)

- Code comments in `.tsx`, `.ts`, `.css`, `scripts/`
- `docs/` markdown files
- `Legacy Content/` and `optimized_content/` (source/migration only unless re-imported)
- En dashes (–) in date/number ranges

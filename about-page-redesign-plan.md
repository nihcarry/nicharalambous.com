# About Page Redesign Plan

**Overall Progress:** `100%`

## TLDR

Redesign the `/about` page by merging the warm, personal tone from the old Squarespace site with the structured layout of the new site. Replace all fabricated fallback data with LinkedIn-verified career positions, organized into identity pillars (not time-boxed eras). Make the page visually engaging with a hero image, the famous quote, and a career section grouped by who Nic is — not just what he built.

## Critical Decisions

- **Identity pillars, not chronological eras** — Career phases are grouped thematically (Entrepreneur, Speaker & Coach, Product Builder, Writer) with no dates on the phase headers. Individual items within each pillar have their own date ranges.
- **LinkedIn as single source of truth** — All career data comes exclusively from Nic's LinkedIn profile. No fabricated positions. User will add anything missing later.
- **Merge old + new site content** — Combine the first-person warmth of the old `/meet-nic-haralambous` page with the structured sections of the current build.
- **Brutalist design system** — All new sections use existing design tokens: `heading-display-stroke-sm`, `heading-display`, `card-brutalist`, sharp corners, accent borders, `bg-person-pattern`.
- **Reuse existing components** — `Section`, `CTAButton`, `FinalCta`, `tilt()` — no new shared components needed.
- **Keep `/businesses` separate** — About page shows career pillars; `/businesses` keeps its full venture detail. They serve different purposes.

## Open Items (resolve before or during implementation)

- **Photo:** Use `Nic_Main-removebg.png` (full-body) or source a different headshot?
- **Voice:** First-person ("I am..."), third-person, or blend?
- **Key facts:** 3 verified exits from LinkedIn (Nic Harry, Resolve Mobile, Motribe). Is Nudjit (sold to Avusa) also real? That would make 4.
- **Social links:** Feature LinkedIn/YouTube prominently on this page?
- **Coindirect grouping:** Entrepreneur or Product Builder pillar?
- **Mail & Guardian grouping:** Writer or Product Builder pillar?

## LinkedIn-Verified Career Data

### The Entrepreneur
| Item | Role | Dates | Outcome |
|------|------|-------|---------|
| Nic Harry | CEO & Founder | Nov 2012 – Nov 2019 | Sold (2018) |
| Resolve Mobile | Director & Co-Founder | 2013 – 2014 | Sold to Imperial Logistics |
| Motribe | CEO & Co-Founder | Aug 2010 – Sep 2012 | Sold to Mxit (2011) |
| The Slow Fund | Founder | Jan 2021 – Dec 2022 | Non-profit, 250+ entrepreneurs |
| Slow Hustle | Founder | 2020 – 2022 | Community/courses |
| Coindirect | COO | May 2018 – Apr 2020 | — |
| Studentwire | Founder | Aug 2005 – Jan 2008 | Student news network |

### The Speaker & Coach
| Item | Role | Dates |
|------|------|-------|
| Professional Speaker | Keynote Speaker | Jan 2010 – Present |
| Business Coach & Consultant | Coach | Mar 2019 – Dec 2022 |
| Missing Link | Speaker Coach | Nov 2020 – Dec 2022 |

### The Product Builder
| Item | Role | Dates |
|------|------|-------|
| Yoco | Senior Product Manager | Jan 2023 – Present |
| Vodacom | Product Manager: Social Networking | Jun 2009 – Jul 2010 |

### The Writer
| Item | Role | Dates |
|------|------|-------|
| Daily Maverick | Columnist | Dec 2019 – Jan 2024 |
| Courier | Columnist | Jun 2021 – May 2023 |
| Entrepreneur Magazine SA | Columnist | 2012 – 2015 |
| Mail & Guardian Online | Mobile Manager | Apr 2008 – Aug 2008 |
| Financial Mail | Campus Editor | Jun 2007 – May 2008 |
| 702 Talk Radio | Junior Journalist/Intern | May 2003 – Jul 2003 |

## Tasks

- [x] 🟩 **Step 1: Rewrite hero section**
  - [x] 🟩 Replace third-person heading with bold identity-first "I AM NIC HARALAMBOUS" using `heading-display-stroke-sm`
  - [x] 🟩 Add Nic's photo (`Nic_Main-removebg.png`) positioned alongside bio text in 2-column grid
  - [x] 🟩 Write short punchy first-person bio merging old site warmth with key positioning
  - [x] 🟩 Integrate key stats as inline accent-bordered chips (3 exits, 3 books, 20+ years, 16+ years speaking)

- [x] 🟩 **Step 2: Add personal story section**
  - [x] 🟩 Write narrative section pulling from old site content: first website at 11, first business at 16, career arc through journalism → product → entrepreneurship → speaking
  - [x] 🟩 Add the famous quote as a large `heading-display-stroke-sm` pullquote with accent left border

- [x] 🟩 **Step 3: Build career pillars section**
  - [x] 🟩 Create 4 pillar blocks: The Entrepreneur, The Speaker & Coach, The Product Builder, The Writer
  - [x] 🟩 Each pillar: `heading-display` title (no dates), list of items with company name, role, date range, and outcome badge (Sold/Acquired)
  - [x] 🟩 Replace all fabricated data with LinkedIn-verified positions
  - [x] 🟩 Style using `card-brutalist` blocks with `tilt()` rotations in 2-column grid

- [x] 🟩 **Step 4: Update media and books sections**
  - [x] 🟩 Keep "As Featured In" media logos (BBC, Fast Company, CNBC Africa, SXSW, Forbes, TechCrunch)
  - [x] 🟩 Keep books teaser section with existing book data

- [x] 🟩 **Step 5: Update Final CTA and metadata**
  - [x] 🟩 Include the famous quote in the `FinalCta` component
  - [x] 🟩 Update SEO metadata to "3 business exits" (LinkedIn-verified)
  - [x] 🟩 Replace KEY_FACTS with KEY_STATS using verified numbers

- [x] 🟩 **Step 6: Update businesses page fallback data**
  - [x] 🟩 Replace all fabricated FALLBACK_BUSINESSES with LinkedIn-verified entries only
  - [x] 🟩 Fix "ForeFront Africa" → "Resolve Mobile", correct all dates and descriptions from LinkedIn
  - [x] 🟩 Remove entries not on LinkedIn (No Bull Ship Academy, The Reducer, Buy Home Helper, Savistash, Nudjit, BookSum, SA Rocks, Digspot, etc.)
  - [x] 🟩 Update metadata to remove inflated "20+ ventures" claim

- [x] 🟩 **Step 7: Visual polish and responsive check**
  - [x] 🟩 `npm run build` passes clean — all pages compile
  - [x] 🟩 No linter errors on either modified file
  - [x] 🟩 Dev server running on port 3001 for manual preview

# Businesses Page Implementation Plan

**Overall Progress:** `100%`

## TLDR
Create a dedicated `/businesses` page showcasing Nic's full entrepreneurial history — 19+ ventures organized into three sections (Current, Exits, Deadpool). Add it to the main nav. Update the about page to show just highlights and link to `/businesses` for the full list.

## Critical Decisions
- **Standalone `/businesses` page**: Full-detail page with all ventures, separate from `/about`
- **Main nav inclusion**: Add "Building" (or "Businesses") as a nav item in the header
- **Three sections**: "What I'm Building Now" (active), "Past Startups" (exits), "Deadpool" (closed) — matching the current Squarespace structure
- **Reuse existing Sanity query + `BusinessData` type**: The `outcome` field already maps to the sections (`active` / `exit-*` / `closed`)
- **Hardcoded fallback data**: All ~20 businesses from the current site + nobullship.co as a new addition
- **About page becomes a summary**: The `/about` timeline stays short (top highlights only) with a "View all businesses" link to `/businesses`

## Tasks:

- [x] 🟩 **Step 1: Create `app/businesses/page.tsx`**
  - [x] 🟩 Page metadata + JSON-LD (CollectionPage schema)
  - [x] 🟩 Hero section with intro paragraph
  - [x] 🟩 "What I'm Building Now" section — card grid for active businesses (The Reducer, No Bull Ship Academy, Buy Home Helper, Savistash, YOCO, Speaker, It's Not Over Podcast)
  - [x] 🟩 "Past Startups" section — cards for exited businesses with outcome badges (The Slow Fund, Nic Harry, ForeFront Africa, Motribe, Nudjit)
  - [x] 🟩 "Deadpool" section — simpler cards for closed businesses (BookSum, Slow Hustle, Curious Cult, Remote Keynote, SA Rocks, Digspot, Studentwire, Thus Far)
  - [x] 🟩 Closing quote ("Plan in decades...") + CTA to `/contact`
  - [x] 🟩 Fallback data array with all ~20 businesses

- [x] 🟩 **Step 2: Add to main navigation**
  - [x] 🟩 Add "Building" nav item to header.tsx (with rocket icon)
  - [x] 🟩 Add `/businesses` link to footer.tsx "Explore" column

- [x] 🟩 **Step 3: Update the about page**
  - [x] 🟩 Simplify the about page businesses section to show top 5 highlights
  - [x] 🟩 Add "View all businesses →" link + CTA button pointing to `/businesses`
  - [x] 🟩 Updated file header comment (removed outdated redirect note)

- [x] 🟩 **Step 4: Verify build**
  - [x] 🟩 `next build` passed — 205 static pages generated, `/businesses` at 175 B

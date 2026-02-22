# Feature Implementation Plan

**Overall Progress:** `100%`

## TLDR
Replace the current `/blog` "Most Read" sourcing model with a per-post curated flag named "Most Popular". This keeps curation fully manual (based on your historical cross-platform reads) while removing dependence on the `mostReadSection` singleton list. The blog page will render a renamed "Most Popular" section using tagged published posts.

## Critical Decisions
Key architectural/implementation choices made during exploration:
- Decision: Use a per-post boolean field (`mostPopular`) instead of the `mostReadSection` singleton - matches your desired "I tag posts myself" workflow.
- Decision: Rename section copy from "Most Read" to "Most Popular" in both Studio and site UI - aligns language with curated popularity, not live analytics.
- Decision: Keep existing hero/card component pattern and top-list behavior (up to 5 posts) - minimizes code churn and preserves current layout/performance.

## Tasks:

- [x] 🟩 **Step 1: Update Sanity post schema for curated tag**
  - [x] 🟩 Add/rename post field to `mostPopular` (label: "Most Popular").
  - [x] 🟩 Update field description to reflect manual curation from historical reads.
  - [x] 🟩 Ensure related conditional UI (e.g. label visibility) follows the new field name.

- [x] 🟩 **Step 2: Switch blog query source from singleton to tagged posts**
  - [x] 🟩 Replace `/blog` section query to fetch `post` documents where `contentStatus == "published"` and `mostPopular == true`.
  - [x] 🟩 Keep response shape compatible with the existing hero component to avoid unnecessary UI refactor.
  - [x] 🟩 Enforce section list cap (max 5) to match current block behavior.

- [x] 🟩 **Step 3: Rename section and component language to "Most Popular"**
  - [x] 🟩 Update section heading and inline code comments on `/blog` page.
  - [x] 🟩 Rename component text (and component/file name if desired for consistency) from "Most Read" to "Most Popular".
  - [x] 🟩 Update Studio singleton/menu naming only if any remaining singleton references are intentionally kept.

- [x] 🟩 **Step 4: Remove/retire old Most Read singleton path**
  - [x] 🟩 Remove unused `mostReadSection` query/types from `lib/sanity/queries.ts`.
  - [x] 🟩 Remove or deprecate `mostReadSection` schema + Studio nav item if no longer used.
  - [x] 🟩 Verify no remaining imports/usages reference `mostReadSection` or "Most Read" in blog flow.

- [x] 🟩 **Step 5: Content + docs alignment**
  - [x] 🟩 Tag desired posts in Studio with the new "Most Popular" field. _(Manual: in Studio → Blog Posts, open each post and check **Most Popular**; optionally set **Featured Label**.)_
  - [x] 🟩 Update docs that currently mention `Most Read (Blog)` singleton to the new tag-based model.
  - [x] 🟩 Sanity-check `/blog` rendering with populated and empty states.

# Feature Implementation Plan: Blog-Only Search

**Overall Progress:** `100%`

## TLDR

Scope site search to blog and archive only, remove search from the footer, and add a search bar to the blog page. Pagefind will index only blog/archive HTML; SearchUI will filter results and use a blog-focused placeholder when used on the blog page.

## Critical Decisions

- **Restrict Pagefind index to blog + archive** — Use a single `--glob` with pipe syntax (`blog.html|blog/*.html|archive/*.html`) so only blog listing, blog posts, and archive posts are indexed. Smaller index and search results stay blog-only.
- **Keep existing SearchUI component** — Add optional props (`blogOnly`, `placeholder`) for URL filtering and copy; no new search component.
- **Search only on blog page** — Remove Search from footer and from header More menu so the only search entry point is the bar on `/blog`. Dedicated `/search` page can remain for direct links but is no longer surfaced in nav.
- **Filter results in SearchUI when `blogOnly`** — Even though the index is blog/archive-only, filter results by URL (e.g. `/blog` or `/archive`) so behavior is correct if the index ever includes other pages.

## Tasks

- [x] 🟩 **Step 1: Restrict Pagefind to blog and archive**
  - [x] 🟩 In `package.json` `postbuild` script, change `--glob` from `"**/*.html"` to `"blog.html|blog/*.html|archive/*.html"`.
  - [x] 🟩 Leave `--exclude-selectors` unchanged.

- [x] 🟩 **Step 2: Update SearchUI for blog-only search**
  - [x] 🟩 Add optional props: `blogOnly?: boolean`, `placeholder?: string` (default to current placeholder when not set).
  - [x] 🟩 When `blogOnly` is true, filter `results` to entries where `result.url` includes `/blog` or `/archive` before setting state.
  - [x] 🟩 Use `placeholder` prop for the input when provided (e.g. "Search blog posts..." on blog page).

- [x] 🟩 **Step 3: Remove Search from footer**
  - [x] 🟩 In `components/footer-content.tsx`, remove `{ href: "/search", label: "Search" }` from the `explore` array in `footerLinks`.

- [x] 🟩 **Step 4: Add search bar to blog page**
  - [x] 🟩 In `app/blog/page.tsx`, import `SearchUI` from `@/app/search/search-ui`.
  - [x] 🟩 Add a `<Section>` (e.g. `width="content"`) after the first Section (heading + description), containing `<SearchUI blogOnly placeholder="Search blog posts..." />`.
  - [x] 🟩 Ensure layout/spacing matches existing blog page sections.

- [x] 🟩 **Step 5: Remove Search from header More menu**
  - [x] 🟩 In `components/header.tsx`, remove the Search item from `moreMenuLinks` (the object with `href: "/search"`, `label: "Search"`, `icon: "search"`).
  - [x] 🟩 Remove `"/search"` from the `moreMenuRoutes` array so the More pill does not highlight when on the search page.

# Site documentation plan

**Overall Progress:** `100%`

## TLDR

Add project documentation so both you and the AI can understand how the site works: architecture, build, deployment, blog publishing (Cursor vs Sanity), and updating page content. Docs live in `docs/` and a new root `README.md`; they are minimal, cross-linked, and written for human + AI readability (clear headings, code blocks, tables).

## Critical decisions

- **Place all project docs in `docs/`** — Already used for `SANITY-WEBHOOK-SETUP.md` and `SANITY-CI-SECRETS.md`; new docs sit alongside them. One place to look.
- **Root README as entry point** — Single file that describes the repo, points to `docs/` and key commands, so humans and AI know where to start.
- **One concern per doc** — Separate files for architecture, build, deploy, blog workflow, and page content. Each file is independently findable and linkable.
- **Summarize and link, don’t duplicate** — New docs give a short overview and “see also” links to the build-deploy skill and existing `docs/SANITY-*.md` for step-by-step and troubleshooting.
- **AI- and human-readable** — Use consistent headings (H2/H3), code blocks with language tags, tables for env vars and key files, and short paragraphs so both scanning and tools work well.

## Tasks

- [x] 🟩 **Step 1: Add root README.md**
  - [x] 🟩 One-paragraph project description (static Next.js site, Sanity CMS, S3/CloudFront).
  - [x] 🟩 “Where to find things”: `docs/` (project docs), `app/` (pages), `lib/` (Sanity client, queries), `sanity/` (schemas, Studio config).
  - [x] 🟩 Quick commands: `npm run dev`, `npm run build`, link to “Full deploy” in docs.
  - [x] 🟩 Point to `docs/README.md` or “Documentation index” for the full doc set.

- [x] 🟩 **Step 2: Add docs/ARCHITECTURE.md**
  - [x] 🟩 High-level: Next.js 15 static export, no server runtime, all content from Sanity at build time.
  - [x] 🟩 Data flow: build → GROQ from Sanity → static HTML in `out/`; `lib/sanity/client.ts` fetch with `force-cache` in production.
  - [x] 🟩 Route types: static pages (e.g. `/about`), dynamic with `generateStaticParams` (e.g. `/blog/[slug]`, `/keynotes/[slug]`), Studio at `/studio`.
  - [x] 🟩 Content model summary: singletons (siteSettings, author, speaker, mostReadSection) vs documents (post, keynote, topicHub, book, etc.); one sentence per type and where it’s used.
  - [x] 🟩 Key files table: `next.config.ts`, `lib/sanity/client.ts`, `lib/sanity/queries.ts`, `sanity/schemas/`, `app/` structure.

- [x] 🟩 **Step 3: Add docs/BUILD.md**
  - [x] 🟩 What `npm run build` does: clean build, static export to `out/`, postbuild (next-sitemap).
  - [x] 🟩 Prerequisites: `.env.local` with `NEXT_PUBLIC_SANITY_*`; optional note on Node version.
  - [x] 🟩 How to verify build output (e.g. check a blog HTML for real content vs error shell).
  - [x] 🟩 Critical constraint: Sanity client must use `cache: "force-cache"` for static export; reference `lib/sanity/client.ts`.
  - [x] 🟩 Link to build-deploy skill or `DEPLOY.md` for full deploy steps.

- [x] 🟩 **Step 4: Add docs/DEPLOY.md**
  - [x] 🟩 Two paths: (1) Push to `main` → CI builds and deploys; (2) Local build + S3 sync + CloudFront invalidation (when to use each).
  - [x] 🟩 CI: triggers (push, workflow_dispatch, repository_dispatch for Sanity webhook); required GitHub secrets list.
  - [x] 🟩 Local: high-level steps (clean build, S3 two-phase sync with cache headers, CloudFront invalidation, verify live); “Full details: see build-deploy skill”.
  - [x] 🟩 Step 7: after a successful local deploy, always commit and push so repo matches production (avoid CI stomping).
  - [x] 🟩 Links to `docs/SANITY-CI-SECRETS.md` and `docs/SANITY-WEBHOOK-SETUP.md` for secrets and webhook.

- [x] 🟩 **Step 5: Add docs/CONTENT-BLOG.md**
  - [x] 🟩 Where blog content lives: Sanity `post` documents; `contentStatus` (archived, ai-draft, in-review, published); only `published` on `/blog`, archived on `/archive`.
  - [x] 🟩 **Publishing from Sanity:** create/edit post in Studio at `/studio`, set contentStatus to Published, Publish; webhook triggers deploy (or manual deploy).
  - [x] 🟩 **Publishing from Cursor (pipeline):** parse source (Medium/Substack) → `scripts/output/medium|substack`; enrich → `scripts/output/enriched`; import to Sanity via `npm run import:sanity` (env: `SANITY_WRITE_TOKEN`); then in Studio set status to Published and Publish. List npm scripts: `parse:medium`, `parse:substack`, `import:parse`, `enrich`, `import:sanity`, etc.
  - [x] 🟩 Slug and URLs: slug from Sanity; `/blog/[slug]` for published, `/archive/[slug]` for archived.
  - [x] 🟩 Optional: link to post schema or queries for field reference.

- [x] 🟩 **Step 6: Add docs/CONTENT-PAGES.md**
  - [x] 🟩 How to update content by page type: **CMS-driven** (edit in Sanity Studio) vs **code-driven** (edit React/TS in repo).
  - [x] 🟩 CMS-driven: Speaker (`/speaker` — singleton “Speaker Page”), Keynotes, Books, Topic Hubs, Blog listing + Most Read, Testimonials; list Studio nav labels and document IDs where useful.
  - [x] 🟩 Code-driven: About (`/about` — `app/about/page.tsx`), homepage structure; mention that some homepage data (e.g. keynotes, as seen at) still comes from Sanity.
  - [x] 🟩 After CMS changes: publish in Studio; webhook triggers deploy, or run deploy manually.
  - [x] 🟩 After code changes: commit, push (CI deploys) or local deploy then commit & push.

- [x] 🟩 **Step 7: Add docs index or README in docs**
  - [x] 🟩 Add `docs/README.md` (or a short “Documentation” section in an existing doc) that lists all docs with one-line descriptions and links: ARCHITECTURE, BUILD, DEPLOY, CONTENT-BLOG, CONTENT-PAGES, SANITY-WEBHOOK-SETUP, SANITY-CI-SECRETS.
  - [x] 🟩 Ensures one place (linked from root README) that enumerates every doc for humans and AI.

- [x] 🟩 **Step 8: Optional – Environment and scripts reference**
  - [x] 🟩 If useful: add a short `docs/ENV-AND-SCRIPTS.md` (or a section in ARCHITECTURE or README) listing `.env.local` vars and `package.json` scripts with one-line purpose, so “how do I run X?” is answerable in one place. Mark as optional so we don’t over-document; can be merged into ARCHITECTURE or BUILD if that’s clearer.

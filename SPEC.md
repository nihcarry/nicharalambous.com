# Spec: Podcast Promotion Page (RSS-driven) — `/podcast`

## Assumptions I’m making (based on your answers + current repo)

1. **Canonical URL**: The podcast landing page will live at **`/podcast`**.
2. **Primary job**: The page is optimized to **drive subscriptions** (Apple/Spotify/etc.) and explain the show (not a full on-site listening experience).
3. **Episode source**: Episodes are pulled from your RSS feed at runtime (freshness favored over build-time stability).
4. **Episode list**: Show the **latest 10** episodes by default, with a lightweight **“Load more”** pattern (pagination or progressive load) if/when needed.
5. **Design**: A **simple, readable content layout** (fast, minimal motion) that matches your typography and section system.
6. **Stack**: Next.js 15 App Router + Tailwind (current repo). No new backend services.
7. **Production build**: This site uses **static export** in production (`next.config.ts`), so anything “runtime” must be implemented in a way that still works with the export + CloudFront/S3 deployment model (see “Open Questions”).

If any of these are wrong, I’ll update the spec before we plan/implement.

---

## Objective

### What we’re building

A dedicated **podcast promotion page** that:

- Explains **what the show is** and who it’s for
- Makes it extremely easy to **subscribe/follow** on major platforms
- Shows the **latest episodes** (title + date + duration + short summary) for credibility and recency

### Target user

- A new visitor who hears about the podcast and wants to decide, quickly, if it’s worth subscribing.

### Success looks like

- A visitor can understand the show in **< 30 seconds**, then click a subscription CTA in **one click**.
- The page has clean SEO metadata, canonical URL, and sharable unfurl data.
- The episode list loads reliably and doesn’t break the site’s production deployment model.

### Acceptance criteria

- [ ] Route exists at **`/podcast`** with an H1 and clear show description
- [ ] Above-the-fold includes **Subscribe / Listen on** CTAs (Apple + Spotify minimum)
- [ ] “Latest episodes” section shows **10 most recent** episodes (title, publish date, duration)
- [ ] Each episode card links to the episode’s canonical URL (from RSS) in a new tab (or to an internal detail page if we later add it)
- [ ] Includes structured data (at minimum `PodcastSeries`; optionally `PodcastEpisode` for the 10 shown)
- [ ] `npm run lint` and `npm run build` succeed

---

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind (existing design tokens/utilities)
- **RSS parsing (planned)**: `rss-parser` (small, common library) or a lightweight XML parser. (Ask-first dependency.)
- **Structured data**: Existing `JsonLd` component (`components/json-ld`) and metadata helpers (pattern used on `/media`)
- **Deployment**: Static export to S3 + CloudFront (current)

---

## Commands

```bash
# Local dev (port 3001)
npm run dev

# Lint
npm run lint

# Production build (must work for S3/CloudFront export)
npm run build

# Redirect safety check (if we change legacy redirects)
npm run validate:redirects
```

---

## Project Structure

New/updated areas (proposed):

```
app/podcast/page.tsx              → Podcast landing page (promotion + latest episodes)
lib/podcast/rss.ts                → RSS fetch + parse + normalization (server-side utility)
lib/podcast/types.ts              → Episode + show types used by the page
components/podcast/*              → EpisodeList, EpisodeCard, SubscribeButtons (optional)
infra/cloudfront-url-rewrite.js   → (Optional) redirect /its-not-over → /podcast
scripts/validate-redirects.ts     → (Optional) keep redirects rule consistent with owned routes
```

Non-goals for initial scope:

- A full internal episode archive
- On-site streaming player UX (we can add later)
- Guest pages / deep internal linking

---

## Code Style

Follow existing patterns:

- **Server components by default** for pages in `app/`
- Small utilities in `lib/` with explicit types
- Use existing layout primitives like `Section`, `CTAButton`, and your typography classes

Example shape (illustrative):

```tsx
type Episode = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  durationSeconds: number | null;
  summary: string | null;
};

export default async function PodcastPage() {
  const { show, episodes } = await getPodcastData({ limit: 10 });
  return (
    <>
      <Hero show={show} />
      <SubscribeButtons links={show.links} />
      <LatestEpisodes episodes={episodes} />
    </>
  );
}
```

---

## Testing Strategy

- **Automated**: `npm run lint` and `npm run build`
- **Manual**:
  - Validate `/podcast` renders correctly on mobile + desktop
  - Verify all subscribe buttons open correct destinations
  - Simulate RSS outage (temporarily break URL) and ensure the page fails gracefully (fallback message, not a hard crash)
  - Confirm metadata + canonical are correct

Optional (not required for v1):

- Add a small unit test for RSS normalization if we introduce non-trivial parsing logic.

---

## Boundaries

### Always

- Keep the page **fast and readable** (simple layout, minimal motion).
- Handle RSS failures gracefully (timeouts, non-200 responses, invalid XML).
- Treat RSS description/content as **untrusted HTML**: strip/sanitize before rendering, or render as plain text excerpts.
- Keep CTAs explicit and consistent (“Listen on Apple Podcasts”, “Listen on Spotify”).

### Ask first

- Adding new npm dependencies (e.g. `rss-parser`, XML sanitizers)
- Changing production routing/redirect behavior in `infra/cloudfront-url-rewrite.js`
- Introducing internal episode detail pages or new IA (e.g. `/podcast/[slug]`)

### Never

- Commit secrets (RSS tokens, private URLs, etc.)
- Render raw RSS HTML unsafely (avoid XSS vectors)

---

## Success Criteria (measurable)

1. **CTA clarity**: Subscribe CTAs are visible above the fold and repeated near the episode list.
2. **Reliability**: RSS fetch/parse failures do not break the page render; user sees a friendly fallback and core subscribe CTAs still work.
3. **SEO**: Unique title + description + canonical `https://www.nicharalambous.com/podcast`; structured data present.
4. **Quality gates**: `npm run lint` and `npm run build` are green.

---

## Open Questions (blockers to planning/implementation)

1. **Static export vs “runtime RSS”**: This repo uses `output: "export"` in production builds. Do you want:
   - A) RSS fetched at build time (freshness via redeploy), or
   - B) A small server-side runtime component (requires changing deployment approach), or
   - C) A client-side fetch from the browser (works with export, but exposes CORS/availability constraints)?
2. **Legacy URL**: What should happen to **`/its-not-over`** (currently redirected to `/media`)?
   - Redirect `/its-not-over` → `/podcast`?
   - Keep it as-is?
3. **Platform links**: Confirm the canonical subscribe URLs you want promoted (Apple, Spotify, YouTube, etc.). The RSS content sometimes contains links inside episode descriptions, but for CTAs we should use a fixed, curated set.
4. **Episode click behavior**: Should episode cards link to:
   - the episode page on RSS.com (from `<link>`), or
   - the audio file (`<enclosure>`), or
   - Riverside hosting pages (if available)?

---

## Status

| Phase | State |
| --- | --- |
| Specify | **Draft — awaiting your review** |
| Plan | Blocked |
| Tasks | Blocked |
| Implement | Blocked |

Next: once you approve this spec (and we resolve the “static export vs runtime RSS” question), I’ll produce a short implementation plan and task breakdown.

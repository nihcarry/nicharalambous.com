# Blog content and publishing

How blog posts are stored, how to publish from Sanity vs from Cursor (content pipeline), and how URLs work.

## Where blog content lives

- **CMS**: All blog posts are **Sanity documents** of type `post` (schema: `sanity/schemas/documents/post.ts`).
- **Status**: Each post has a `contentStatus` field: `archived` | `ai-draft` | `in-review` | `published`.
- **Visibility**:
  - **Published** → shown on `/blog` and at **`/blog/[slug]`**.
  - **Archived** → shown only at **`/archive/[slug]`** (not on the main blog listing).
  - Draft states (`ai-draft`, `in-review`) are not shown on the live site until set to `published`.

Slug comes from the post's `slug` field in Sanity (usually derived from title). Queries: `lib/sanity/queries.ts` (e.g. `blogPostsListQuery`, `blogPostSlugListQuery`).

## Publishing from Sanity (Studio)

1. Open **Sanity Studio** at **`/studio`** (or the Studio URL you use).
2. Go to **Blog Posts** and create a new post or open an existing one.
3. Fill in title, slug, body, excerpt, featured image, topics, etc. Set **Content Status** to **Published**.
4. Click **Publish**.
5. **Deploy** — see below. Your post only appears on the live site after a successful build and deploy.

### How deploy-on-publish works

The site does **not** auto-deploy when you click Publish. Deploy only runs when something triggers the **Build & Deploy** GitHub Action (`.github/workflows/deploy.yml`).

**When the Sanity → GitHub webhook is configured and enabled** (setup: [SANITY-WEBHOOK-SETUP.md](SANITY-WEBHOOK-SETUP.md)):

1. You click **Publish** in Studio.
2. Sanity sends a `POST` to `https://api.github.com/repos/nihcarry/nicharalambous.com/dispatches` with body `{"event_type": "sanity-content-update"}` (using a GitHub PAT in the `Authorization` header).
3. GitHub receives a `repository_dispatch` event and starts the **Build & Deploy** workflow (the workflow is triggered by `repository_dispatch` with type `sanity-content-update`).
4. The workflow runs: checkout → install → verify Sanity API → build → deploy to S3 → invalidate CloudFront.
5. When the run completes, the live site has the new content.

**When the webhook is not set up or is disabled:**

- No deploy runs. The live site is unchanged until you trigger a deploy yourself: **push to `main`** (any commit triggers the same workflow) or in GitHub go to **Actions → Build & Deploy → Run workflow**.

**How to check whether the webhook is working:** Make a small change in Studio and click Publish. Open **GitHub → Actions** for this repo and look for a new **Build & Deploy** run whose trigger is **repository_dispatch** (or `sanity-content-update`). If that run appears and succeeds, the webhook is working. If not, the webhook is missing, disabled, or misconfigured — follow [SANITY-WEBHOOK-SETUP.md](SANITY-WEBHOOK-SETUP.md) to set it up or fix it (e.g. PAT expired, wrong URL, or webhook disabled in Sanity Manage → API → Webhooks).

## Publishing from Cursor (content pipeline)

When you have source content (e.g. Medium or Substack exports) and want to bring it into the site as posts:

1. **Parse** source HTML into structured JSON:
   - Medium: put HTML in `Legacy Content/Medium Articles/`, then run `npm run parse:medium`. Output: `scripts/output/medium/`.
   - Substack: run `npm run parse:substack` (paths per script). Output: `scripts/output/substack/`.
   - Both: `npm run parse:all`. Then `npm run inventory` to generate inventory; full parse pipeline: `npm run import:parse`.
2. **Enrich** (optional): run `npm run enrich` to process parsed articles into enriched JSON in `scripts/output/enriched/` (e.g. for AI/SEO fields).
3. **Import into Sanity**: Run `npm run import:sanity`. Requires `SANITY_WRITE_TOKEN` in `.env.local` (token with write access in Sanity). Imports create or update `post` documents; they are created in a draft state (e.g. `contentStatus` set per script logic).
4. **Publish in Studio**: Open Studio → Blog Posts, find the imported post(s), set **Content Status** to **Published**, and click **Publish**.
5. **Deploy**: Same as "How deploy-on-publish works" above — webhook triggers deploy if configured; otherwise deploy manually (push to `main` or Run workflow in Actions).

**Useful npm scripts:**

| Script | Purpose |
|--------|---------|
| `parse:medium` | Parse Medium HTML → `scripts/output/medium/`. |
| `parse:substack` | Parse Substack HTML → `scripts/output/substack/`. |
| `parse:all` | Run both parsers. |
| `inventory` | Generate inventory from parsed output. |
| `import:parse` | `parse:all` + `inventory`. |
| `enrich` | Enrich parsed articles → `scripts/output/enriched/`. |
| `enrich:sample` | Enrich a sample (e.g. 5) for testing. |
| `import:sanity` | Import enriched articles into Sanity (production dataset). |
| `import:sanity:staging` | Import into staging dataset. |
| `import:sanity:dry-run` | Preview import without writing. |
| `import:full` | Parse + inventory + enrich + import in one go. |

## Slug and URLs

- **Slug** is stored on the post in Sanity (`slug.current`). It must be unique among published posts.
- **Published**: `https://nicharalambous.com/blog/<slug>`.
- **Archived**: `https://nicharalambous.com/archive/<slug>`.

Changing a post's slug after publish changes its URL; set up redirects in Sanity or at the host if you need to preserve old URLs.

## See also

- [CONTENT-PAGES.md](CONTENT-PAGES.md) — Which pages are CMS-driven (including blog listing and Most Popular).
- [DEPLOY.md](DEPLOY.md) — How deploys are triggered after publishing.
- Post schema: `sanity/schemas/documents/post.ts`. GROQ: `lib/sanity/queries.ts`.

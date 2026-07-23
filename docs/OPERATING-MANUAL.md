# Operating Manual — nicharalambous.com

> **This is the doc you want.** If you're editing site content (not code), everything you need is here. For engineering details, see the other docs in this folder.

---

## The 30-second mental model

- **Sanity** is where your content lives — blog posts, keynotes, books, topics, testimonials, businesses, media appearances, and the speaker page.
- **The site is static.** Every page is pre-built HTML. When you publish in Sanity, a deploy rebuilds the entire site (takes ~3–5 min) and uploads it.
- **Two things trigger a deploy:**
  1. **Publishing in Sanity** — the webhook fires and GitHub Actions rebuilds.
  2. **Pushing code to `main`** — GitHub Actions rebuilds.
- **What does NOT trigger a deploy:** saving drafts in Sanity, editing locally without pushing, or just visiting Studio.

---

## Quick reference — "I want to do X"

| I want to… | Where to go | What I need |
|---|---|---|
| Write a new blog post | Studio → Blog Posts → + | Title, slug, body (Portable Text or raw HTML), topics, excerpt |
| Edit an existing blog post | Studio → Blog Posts → find the post | Just hit Publish when done |
| Preview a post before publishing | Studio → Presentation tool (top nav) | `npm run dev` running locally on port 3001 |
| Add a testimonial | Studio → Testimonials → + | Quote, author name, title, company |
| Add a media appearance | Studio → Media Appearances → + | Title, URL, outlet, date |
| Add a business | Studio → Businesses → + | Name, description, role, dates |
| Update a keynote | Studio → Keynotes → select it | Edit fields, Publish |
| Update the speaker page | Studio → Speaker Page | Edit fields, Publish |
| Update a topic hub | Studio → Topic Hubs → select it | Edit fields, Publish |
| Update a book | Studio → Books → select it | Edit fields, Publish |
| Update the homepage, about, or contact page | Edit code in `app/page.tsx`, `app/about/page.tsx`, or `app/contact/page.tsx` | Push to `main` |
| Add a legacy redirect | Edit `infra/cloudfront-url-rewrite.js` | Push to `main` (needs a CloudFront deploy) |
| Check if a deploy is running | Studio → open any doc → "View build status" action | Opens GitHub Actions |
| Jump to the live page for a doc | Studio → open the doc → "View on site" action | Doc must be published with a slug |
| Manually trigger a rebuild | GitHub → Actions → Build & Deploy → Run workflow | GitHub access |

---

## Step-by-step workflows

### Writing and publishing a new blog post

1. Open **Studio** at `https://nicharalambous.com/studio` (or `localhost:3001/studio` locally).
2. Go to **Blog Posts** → click **+** to create a new post.
3. Fill in: **Title**, **Slug** (URL-safe, e.g. `my-new-post`), **Excerpt**, **Body** (write in Portable Text), **Topics** (select at least one), **Published At** date.
4. **Preview locally**: Run `npm run dev` on your machine. In Studio, click the **Presentation** tool in the top navigation bar. The site renders inside Studio at your post's URL. Click any field on the page to jump to it in the editor.
5. When happy, click **Publish** in Studio.
6. The Sanity webhook fires → GitHub Actions rebuilds → you get an **ntfy notification** on your phone when it's done.
7. Click **"View on site"** from the document actions menu to see the live post.

### Editing an existing blog post

1. Open Studio → **Blog Posts** → find and open the post.
2. Make your changes. Use **Presentation** to preview live if `npm run dev` is running.
3. Click **Publish**.
4. Wait for the ntfy notification. Done.
5. To revert: in Studio, click the post's **History** tab (clock icon) → select a previous version → **Restore**.

### Adding a testimonial

1. Studio → **Testimonials** → **+**.
2. Fill in: **Quote**, **Author Name**, **Author Title**, **Company**.
3. **Publish**. Testimonials appear on the speaker page and related keynote pages.

### Adding a media appearance

1. Studio → **Media Appearances** → **+**.
2. Fill in: **Title**, **URL**, **Outlet**, **Date**, **Type** (podcast, article, etc.).
3. **Publish**.

### Adding a business

1. Studio → **Businesses** → **+**.
2. Fill in the fields. **Publish**.

### Updating the speaker page

1. Studio → **Speaker Page** (singleton at the top of the content list).
2. Edit: FAQ, testimonials, client logos, CTA text, "how virtual works" section.
3. **Publish**. The hero copy and keynote topic cards are code-driven — to change those, edit `app/speaker/page.tsx`.

### Updating a keynote / topic / book

1. Studio → **Keynotes** / **Topic Hubs** / **Books** → select the item.
2. Edit fields, **Publish**.

### Adding a legacy redirect

1. Edit `infra/cloudfront-url-rewrite.js` — add the redirect rule to the function.
2. Commit and push to `main`.
3. This requires a separate CloudFront Function deploy (not just the site deploy).

### Updating the homepage, about page, or contact page

1. These are code-driven. Edit `app/page.tsx`, `app/about/page.tsx`, or `app/contact/page.tsx`.
2. Run `npm run dev` to preview.
3. Commit and push to `main`. CI deploys automatically.

---

## Per-route reference

Every URL on the site, what drives it, and how to edit it.

| URL | CMS-driven? | Sanity doc / Code file | How to edit |
|---|---|---|---|
| `/` | Partial | Layout: `app/page.tsx`. Some data (keynotes, "as seen at") from Sanity. | Edit code → push to `main` |
| `/about` | No | `app/about/page.tsx` | Edit code → push to `main` |
| `/speaker` | Partial | Singleton: `speaker` (doc ID: `speakerPage`). Hero and keynote cards: `app/speaker/page.tsx`. | CMS fields: Studio → Speaker Page → Publish. Code fields: edit file → push. |
| `/contact` | No | `app/contact/page.tsx` | Edit code → push to `main` |
| `/blog` | Yes | Listing of `post` docs, ordered by `publishedAt` | Publish/unpublish posts in Studio |
| `/blog/[slug]` | Yes | `post` doc with matching slug | Studio → Blog Posts → edit → Publish |
| `/archive/[slug]` | Yes | `post` docs with `contentStatus: "archived"` | Studio → Blog Posts → Archived |
| `/keynotes` | Yes | Listing of `keynote` docs | Publish/unpublish keynotes in Studio |
| `/keynotes/[slug]` | Yes | `keynote` doc with matching slug | Studio → Keynotes → edit → Publish |
| `/topics/[slug]` | Yes | `topicHub` doc with matching slug | Studio → Topic Hubs → edit → Publish |
| `/books` | Yes | Listing of `book` docs | Publish/unpublish books in Studio |
| `/books/[slug]` | Yes | `book` doc with matching slug | Studio → Books → edit → Publish |
| `/media` | Yes | `mediaAppearance` docs | Studio → Media Appearances |
| `/businesses` | Yes | `business` docs | Studio → Businesses |
| `/studio` | N/A | Sanity Studio (client-side app, not part of the static export) | N/A |

---

## Deploys, demystified

### Two ways a deploy happens

1. **Sanity publish** — you hit Publish in Studio. The Sanity webhook sends a request to GitHub, which starts a build. Takes ~3–5 minutes.
2. **Code push to `main`** — you (or an agent) push code. GitHub Actions starts the same workflow.

### How to check if a deploy is running

- **From Studio**: open any document → click **"View build status"** in the action menu. This opens the GitHub Actions workflow runs page.
- **From GitHub**: go to the repo → **Actions** tab → **Build & Deploy** workflow.

### What happens when a deploy finishes

- **Success**: you get an ntfy push notification with the commit SHA and a link to the run. The live site updates within ~1 minute (CloudFront invalidation).
- **Failure**: you get a high-priority ntfy notification (vibration + banner) with a link to the failed run.

### Manual rebuild

GitHub → Actions → **Build & Deploy** → **Run workflow** → click the green button. Useful when the webhook didn't fire or you just want to force a fresh build.

---

## Troubleshooting

### "I published but the site isn't updated"

**Blog posts require two steps in Studio:**

1. Set **Content Status → Published** (not AI Draft).
2. Click Sanity's **Publish** button.

**Then a site rebuild must run** (static site — Publish alone does not update the live HTML):

1. Check if **Build & Deploy** started: Studio → "View build status" or [GitHub Actions](https://github.com/nihcarry/nicharalambous.com/actions/workflows/deploy.yml). Look for trigger **repository_dispatch**.
2. If **no run started**, the Sanity → GitHub webhook is broken (usually an expired GitHub token). See [SANITY-WEBHOOK-SETUP.md](SANITY-WEBHOOK-SETUP.md). Until fixed, run **Build & Deploy** manually from GitHub Actions.
3. If the run **completed** but the site looks stale, hard-refresh (Cmd+Shift+R) or try incognito.
4. If the run **failed**, open the run log or check your ntfy notification for the error.

### "Something looks wrong on the live site"

1. Check the latest deploy in GitHub Actions — did it succeed?
2. Open Studio and verify the content looks right in the editor.
3. If the content is correct in Studio but wrong on the site, trigger a manual rebuild.
4. If the issue is layout/design, it's a code problem — check the relevant `app/` file.

### "I want to undo a published edit"

1. Open the document in Studio.
2. Click the **History** tab (clock icon in the top bar).
3. Select the version you want to restore → click **Restore**.
4. **Publish** the restored version. A new deploy will fire.

### "The build failed — what now?"

1. Click the link in the ntfy failure notification to see the GitHub Actions run log.
2. Common causes:
   - **Sanity API unreachable**: check `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` secrets in GitHub → Settings → Secrets.
   - **No content for a required doc type**: the build now throws (no fallbacks) if Sanity returns no slugs for blog posts, keynotes, books, topics, or archive posts. Make sure at least one published document of each type exists.
   - **Code error**: a syntax or type error in the codebase. Check the error message in the build log.
3. If you can't fix it, trigger a manual rebuild after addressing the root cause, or ask for help.

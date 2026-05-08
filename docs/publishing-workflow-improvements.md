# Publishing Workflow Improvements (Phase 0)

> **Status**: Active plan.
> **Replaces (for now)**: the full SSR migration in [`/migrate-spec.md`](../migrate-spec.md) + [`migrate-plan-and-tasks.md`](migrate-plan-and-tasks.md), which are **parked** until publish frequency or workflow pain justifies them.

## Goal

Make publishing through Sanity feel **seamless** without changing the deployment architecture. Stay on static export → S3 → CloudFront. Fix the workflow friction (preview, feedback, wait time) instead.

## Why this approach over the SSR migration

The SSR migration solves "publish in seconds, not minutes" by re-platforming everything. The pain that triggered the conversation isn't really about minutes — it's about:

1. **Lack of feedback** during the rebuild wait ("did it work? is it building? did it fail?").
2. **No comfortable preview** before hitting publish.
3. **Friction** moving from Studio → live URL.

Each of those is solvable with small, surgical changes. Total effort: roughly **half a day**, no infra changes, no new failure modes, no monthly cost.

If, after a few weeks of using this, the 3-minute publish wait still feels like the bottleneck *in practice*, the SSR plan is ready to pick up.

---

## Scope (in)

1. **Studio document actions** — "View on site" + "View build status" buttons on every CMS-driven document type.
2. **Build-completion notifications** — push notification to your phone via **ntfy.sh** when a deploy finishes.
3. **Faster builds** — cache `.next/cache` in CI to roughly halve build time for incremental changes.
4. **Local visual preview** — Sanity Presentation tool wired up against `npm run dev` for click-to-edit preview.
5. **Cleanup**: drop `FALLBACK_SLUGS` / `FALLBACK_POSTS` (small refactor that's been waiting).
6. **Operator's manual** — single canonical doc (`docs/OPERATING-MANUAL.md`) written from the editor's POV, covering every workflow, every per-route CMS/code split, and what triggers a deploy. Written **last** so it documents reality, not theory.

## Scope (out)

- Anything that requires runtime Next.js (SSR, ISR, route handlers in production).
- Any change to CloudFront, S3, DNS, or the `output: "export"` config.
- New Sanity schema or query changes.

---

## Task list

Order matters only loosely; **2** depends on having a notifications channel; **4** depends on `presentationTool` being installable (already available from `sanity` ^3.72).

### Task 1 — Studio document actions

Add two actions to every CMS-driven document type:

- **View on site** → opens the public URL for the doc in a new tab. Disabled (with a tooltip) when there's no slug yet or doc is unpublished.
- **View build status** → opens the GitHub Actions runs page (`https://github.com/<owner>/<repo>/actions/workflows/deploy.yml`) in a new tab.

**Document types to cover**: `post`, `keynote`, `topicHub`, `book`, `mediaAppearance`, `business`, `speaker` (singleton), `siteSettings` (singleton — only "View build status").

**Implementation outline** (don't execute yet):
- Create `sanity/actions/view-on-site.ts` and `sanity/actions/view-build-status.ts` — each exports a Sanity `DocumentActionComponent`.
- Register both via `document.actions` in `sanity/sanity.config.ts`. Use a per-`schemaType` switch to compute the public URL (`/blog/<slug>` for `post`, `/keynotes/<slug>` for `keynote`, etc.).
- For singletons (`speaker`, `siteSettings`), URL is fixed.

**Acceptance**:
- Opening any `post` doc shows both actions in the action menu (… overflow or pinned).
- "View on site" opens the right URL; gracefully disabled when slug is empty.
- "View build status" opens the deploy workflow run list.
- Same actions present on the other document types listed above.

---

### Task 2 — Build-completion notifications

Get a push to your phone (or a Slack DM) when `Build & Deploy` finishes — success or failure — so you stop refreshing the site to check.

**Recommended default**: [ntfy.sh](https://ntfy.sh).
- Free, no signup. Install the iOS/Android app, subscribe to a private random topic name (e.g. `nic-deploy-7Hx2k4`), and receive push notifications.
- GitHub Actions sends to it via a one-line `curl`.

**Alternative channels** (pick whichever you'll actually look at):
- Slack incoming webhook.
- Pushover ($5 one-time per platform; very reliable iOS push).
- Discord webhook.
- Email via SendGrid/Mailgun (slower, more friction).

**Implementation outline**:
- Add `NTFY_TOPIC_URL` (or `SLACK_WEBHOOK_URL`) as a GitHub Actions secret.
- Add a final step in `.github/workflows/deploy.yml` that runs on both success and failure (`if: always()`):
  - Title: `✅ nicharalambous.com deployed` or `❌ deploy failed`.
  - Body: commit SHA, Sanity-trigger flag (if `repository_dispatch`), and a link to the run.

**Acceptance**:
- After any successful deploy, a notification arrives on the chosen channel within ~30s.
- After any failed deploy, the same channel gets a clearly-labelled failure notification with a link to the run.
- Includes commit SHA + workflow run URL.

---

### Task 3 — Faster builds via `.next/cache`

Add Next.js build cache to GitHub Actions. Halves typical incremental build times.

**Implementation outline**:
- In `.github/workflows/deploy.yml`, before the build step, add `actions/cache@v4` keyed on `${{ runner.os }}-nextjs-${{ hashFiles('package-lock.json') }}-${{ hashFiles('**/*.[jt]s?(x)') }}`, with restore key `${{ runner.os }}-nextjs-${{ hashFiles('package-lock.json') }}-`.
- Path: `.next/cache`.

**Acceptance**:
- A second consecutive deploy run (no code changes) shows a cache hit in the Actions log.
- The "Build" step on that second run is **at least 30% faster** than a from-scratch build (target: 30–50% faster).
- Build output is correct (homepage renders, blog list renders, a recent post renders).

---

### Task 4 — Local visual preview via Sanity Presentation tool

Wire Sanity's Presentation tool to a local dev server. You get click-to-edit visual editing against `http://localhost:3001` — no production infra changes needed.

**Implementation outline**:
- In `sanity/sanity.config.ts`, add the `presentationTool` plugin:
  ```ts
  import { presentationTool } from "sanity/presentation";
  // ...
  plugins: [
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_PREVIEW_ORIGIN || "http://localhost:3001",
        preview: "/",
      },
    }),
    structureTool({ /* existing */ }),
    visionTool(),
  ],
  ```
- Configure `resolve.locations` mapping doc types to public URLs (`post` → `/blog/<slug>`, `keynote` → `/keynotes/<slug>`, etc.) so Presentation knows where to open each doc.
- Drafts are already visible in dev (the existing `*DevQuery` variants serve drafts when `NODE_ENV === "development"`), so click-to-edit will show drafts immediately.

**Workflow this enables**:
1. Run `npm run dev` (port 3001) when editing.
2. In Studio, click the Presentation icon. Site renders inside Studio with the doc's preview.
3. Click any field on the page → Studio jumps to that field. Edit. See change live.
4. When happy, hit Publish in Studio. Webhook fires the build. Phone notifies on success.

**Acceptance**:
- With `npm run dev` running, opening Studio → Presentation displays the local site embedded.
- Clicking an editable field on a blog post opens the corresponding field in Studio.
- Switching documents from inside Presentation navigates the embedded site to the right URL.
- No production deploy or infra change required.

---

### Task 5 — Drop `FALLBACK_SLUGS` / `FALLBACK_POSTS`

Small cleanup. The fallbacks were added when the Sanity dataset was empty (so `generateStaticParams` had at least one slug). With 178+ posts they never trigger and they hide build failures.

**Files affected**:
- `app/blog/[slug]/page.tsx` — `FALLBACK_SLUGS`, `FALLBACK_POSTS`.
- `app/keynotes/[slug]/page.tsx` — `FALLBACK_SLUGS`, `FALLBACK_KEYNOTES`.
- (Any other dynamic `[slug]` route with similar fallbacks — quick audit before edit.)

**Implementation outline**:
- Delete the constants and the merge/return-fallback branches.
- In `getPostSlugs()` and equivalents: on Sanity failure, throw — don't silently return placeholder slugs. A build that can't reach Sanity should fail loudly.

**Acceptance**:
- `npm run build` passes against the current Sanity dataset.
- Removed code paths show no usages anywhere (`rg FALLBACK_SLUGS` returns nothing).
- Manual check: trigger a build with bogus Sanity creds and confirm it now fails clearly instead of producing a broken site.

---

### Task 6 — Operator's Manual (`docs/OPERATING-MANUAL.md`)

Written **last**, after tasks 1–5 are shipped, so it documents the actual workflow (Presentation tool, ntfy notifications, Studio actions, faster builds) — not aspirational fiction.

**Audience**: Nic, six months from now, half-asleep, trying to remember how to publish a blog post or fix a typo on the homepage. Not engineers.

**Implementation outline** (write this doc when tasks 1–5 are done):
- New file: `docs/OPERATING-MANUAL.md`.
- Linked from the project README as the **first** doc to read for editors.
- Each existing engineering doc (`ARCHITECTURE.md`, `BUILD.md`, `DEPLOY.md`, `CONTENT-PAGES.md`, `CONTENT-BLOG.md`, `ENV-AND-SCRIPTS.md`) gets a one-line top-of-page note: *"If you're editing the site, not the code, read OPERATING-MANUAL.md instead."*

**Required sections**:

1. **The 30-second mental model**
   - What Sanity is (database for content) and isn't (layout designer, deploy system).
   - What triggers a deploy: publishing in Sanity, or pushing code to `main`.
   - What doesn't trigger a deploy: saving drafts, editing locally, visiting Studio.

2. **Quick reference table** — "I want to do X → I go to Y."
   - Every common task gets one row.
   - Columns: Task / Where (Studio path or file path) / What you'll need.

3. **Step-by-step workflows**, each ending with "you'll know it worked when the ntfy notification arrives":
   - Writing and publishing a new blog post (open Studio → fill fields → preview locally via Presentation → Publish → ntfy notification → "View on site" from Studio).
   - Editing an existing blog post (incl. how to use Sanity history to revert).
   - Adding a testimonial.
   - Adding a media appearance.
   - Adding a business.
   - Updating the speaker page (which sections are CMS, which are code).
   - Updating a keynote / topic / book.
   - Adding a legacy redirect (code change → push → deploy).
   - Updating the homepage, about page, or contact page (code changes → push → deploy).

4. **Per-route reference table** — every URL on the site listed with:
   - URL pattern.
   - What's CMS-driven (which Sanity doc + fields).
   - What's code-driven (which file).
   - "How to edit this page" pointer.

5. **Deploys, demystified**
   - The two ways a deploy happens (Sanity publish, code push to main).
   - How to check if a deploy is running (Studio "View build status" action, or GH Actions UI).
   - What to do when a deploy fails (link from ntfy notification → run logs → escalation).
   - Manual rebuild path (GH Actions → Run workflow).

6. **Troubleshooting**
   - "I published but the site isn't updated."
   - "Something looks wrong on the live site."
   - "I want to undo a published edit."
   - "The build failed — what now?"

**Acceptance**:
- A non-engineer can land on the doc and, within 30 seconds, know what to do for any common task.
- Every workflow terminates with a clear success signal (the ntfy notification).
- Every public route on the site appears in the per-route table.
- README links to it as the primary editor entry point.
- Each existing engineering doc has the one-line "edit-not-engineer? read this instead" pointer at the top.

---

## Success criteria (Phase 0 done)

- [ ] You can preview an unpublished post **visually** with click-to-edit, before hitting Publish.
- [ ] You get an **ntfy push notification** on your phone when each deploy finishes (success or failure).
- [ ] From Studio, you can jump to the live URL or the build status with one click.
- [ ] Average build time drops by ≥30% on incremental runs.
- [ ] No more `FALLBACK_SLUGS` cruft in the dynamic routes.
- [ ] `docs/OPERATING-MANUAL.md` exists, is linked from the README, and describes every common workflow + the per-route CMS/code split.

After two to four weeks of using this, evaluate:

- How many publishes per week am I doing?
- How often is the 3–8 min wait actually annoying?
- Did Presentation + notifications kill the "is it live yet?" anxiety?

If the wait is still the dominant pain → unfreeze the SSR migration.
If not → keep this and move on.

---

## When to revisit the SSR migration

Specifically reopen [`/migrate-spec.md`](../migrate-spec.md) if any of these become true:

- Publishing more than **2× a week** consistently.
- More than one editor publishing concurrently (queueing on a single GHA workflow becomes painful).
- Adding a feature that needs runtime data (gated content, scheduled banners, personalization, etc.).
- Total build time regularly exceeds **5 minutes** as the post count grows.
- Notifications + Presentation aren't enough — you want changes live in seconds, not minutes.

Until then, the parked docs are intentionally untouched.

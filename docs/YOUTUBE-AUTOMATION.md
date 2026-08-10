# YouTube → blog automation

New YouTube videos become published blog posts automatically. A scheduled
GitHub Action runs daily and, for each **new** video:

1. Creates a post — video embed at the top, plus body copy from the transcript
   (under a **Video Transcript** heading).
2. Writes a meaningful **TL;DR** with Claude.
3. **Auto-publishes** the post, which fires the Sanity webhook → deploy → live.

Once the one-time setup below is done, there is nothing to run by hand.

---

## One-time setup (add 2 API keys)

Everything else already runs in the cloud. The only reason we need keys is that
a scheduled robot can't do two things a laptop can: fetch YouTube transcripts
from a datacenter IP, and write a good TL;DR. Two keys solve both.

### 1. Supadata (transcripts)

YouTube blocks transcript requests from GitHub's servers. Supadata fetches them
server-side (with a Whisper fallback for videos without captions).

- Sign up at <https://supadata.ai> — **free tier is 100/month, no credit card**.
- Copy the API key from the dashboard.

The importer only calls Supadata for videos that are brand-new or still missing
a transcript body. Posts that already have a `Video Transcript` section are
skipped (no API call), so a daily run costs ~1 request per new upload — well
inside the free tier.

### 2. Anthropic / Claude (TL;DR)

- Create a key at <https://console.anthropic.com>.
- Cost is tiny: ~$0.0025 per TL;DR with `claude-haiku-4-5` (a few cents/month).

### 3. Add them as GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|--------|-------|
| `SUPADATA_API_KEY` | your Supadata key |
| `ANTHROPIC_API_KEY` | your Anthropic key |
| `ANTHROPIC_MODEL` | *(optional)* defaults to `claude-haiku-4-5` |

These must already exist (they power other steps): `SANITY_WRITE_TOKEN`,
`YOUTUBE_CHANNEL_ID`, `NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`.

That's it. The daily run (`.github/workflows/youtube-import.yml`) handles the rest.

---

## Guarantees / safety

- **No blank posts.** If a transcript can't be fetched for a *brand-new* video,
  the post is left as a draft and never auto-published — it's retried on the
  next run.
- **No quota burn.** Already-imported posts with a transcript body are skipped
  entirely (no Supadata call).
- **No clobbering.** If a transcript fetch fails for an existing post, the
  importer leaves that post untouched — it will never replace a good transcript
  with a description stub.
- **Your drafts are safe.** Auto-publish only touches posts the TL;DR step just
  completed. Existing drafts you're holding back are not published, and
  hand-written Portable Text bodies / excerpts are never overwritten.
- **You stay in control.** You can edit or unpublish any auto-published post in
  Sanity at any time (set `contentStatus` back to `ai-draft`/`archived`).

---

## Running it manually

- **Trigger the cloud run now:** Actions tab → *YouTube Import* → *Run workflow*.
- **Locally** (transcripts work from your home IP without Supadata):

  ```bash
  npm run import:youtube            # new videos + backfill missing transcripts
  npm run import:youtube -- --force # re-fetch even when a transcript exists
  npm run tldr                      # write TL;DRs (Claude if ANTHROPIC_API_KEY
                                    # is in .env.local, else queues for review)
  npm run tldr -- --auto-publish    # …and publish the ones it just completed
  ```

See `.env.example` for the full list of variables.

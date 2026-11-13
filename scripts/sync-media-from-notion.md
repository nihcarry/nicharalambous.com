# Re-sync media coverage from Notion

The browsable page at `/media` reads `data/media-coverage.json` at build time. It does not query Sanity, and this sync must not write to Sanity or commit a Notion token.

Source database: https://app.notion.com/p/f99b123b29344fd3ac21c951ae7a16cc

## Replace the file

1. Open the database while signed in to Notion. Do not paste an integration token into the repo, a script, or a commit.
2. Export a replacement `data/media-coverage.json` with the same shape: a top-level `items` array. Each item needs `notionId`, `title`, `outlet`, `type` (`Press`, `Podcast`, `TV`, `Radio`, `Video` or `Talk`), `date` (ISO date or `null`), `url`, `archiveUrl`, `summary`, `thumbnailUrl`, `hidden`, `featured` and `linkStatus` (`Live`, `Dead` or `Archive only`).
3. Keep `hidden: true` for anything that should disappear from the page, the JSON-LD and the counts. The three old unverified titles stay out through `HIDDEN_MEDIA` in `lib/media-coverage.ts` even if they are not in this file.
4. Items with `linkStatus` of `Dead` or `Archive only` are linked to `archiveUrl` and labelled Archived.
5. `featured: true` is the Featured row. Leave Nic's confirmed picks as they are unless he changes them.

## Posters

`thumbnailUrl` may be a YouTube thumbnail. The page never requests it. After the JSON changes, download the files into the repo:

```bash
node scripts/fetch-media-posters.mjs
```

That writes `public/media/posters/<video-id>.jpg`. Commit those files with the JSON. If a download fails, that card renders without a poster rather than loading the thumbnail from YouTube.

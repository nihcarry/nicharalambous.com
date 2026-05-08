# Agent Handover — Publishing Workflow Improvements

> **For the next agent picking up this work.** Read this first, then [`docs/publishing-workflow-improvements.md`](publishing-workflow-improvements.md) for the actual plan.

## TL;DR

Nic asked for "near-instant Sanity publishing". Initial plan was a full Next.js SSR migration to AWS Amplify. After review, that scope was deemed disproportionate to the actual pain. **A smaller, no-infra-change plan was agreed instead** — five workflow improvements + a final operator's manual.

**Status**: All decisions made. Nothing executed yet. ntfy.sh notification channel verified working. Awaiting Nic's "go" to start Task 1.

## What was decided (do not re-litigate)

1. **The full SSR migration is parked** — see banners on [`/migrate-spec.md`](../migrate-spec.md) and [`docs/migrate-plan-and-tasks.md`](migrate-plan-and-tasks.md). They're well-thought-through and ready if needed, but only revisit if the criteria in `publishing-workflow-improvements.md` § "When to revisit the SSR migration" are met. Don't touch `output: "export"`, CloudFront, S3, or DNS.
2. **Active plan is** [`docs/publishing-workflow-improvements.md`](publishing-workflow-improvements.md). Six tasks, ~half a day of work total.
3. **Notification channel**: ntfy.sh, topic `https://ntfy.sh/nic-deploy-5shj0h5`. Two test pings already sent and confirmed received by Nic. Priority pairing chosen:
   - **Successful deploys**: `Priority: default` (quiet, calm)
   - **Failed deploys**: `Priority: high` (vibration + heads-up banner)
   - Wire as GitHub Actions secret `NTFY_TOPIC_URL` when reaching Task 4.
4. **Order of execution**: agent's call. Suggested sequence in `publishing-workflow-improvements.md` is: Task 5 (cleanup) → Task 3 (faster CI builds) → Task 1 (Studio actions) → Task 2 (notifications) → Task 4 (Presentation tool) → Task 6 (operator's manual). Task 6 must run **last** so it documents reality, not theory.

## What Nic cares about

- **Less infra churn, more workflow polish.** He explicitly asked "is the juice worth the squeeze?" on the SSR migration and chose to park it. Stay in that frame: small, surgical, no production risk.
- **One canonical operator's manual at the end.** Task 6. Written *from his POV*, not from an engineer's POV. Covers: how to publish a blog post, how to update each page, what's Sanity vs code, what triggers a deploy. Existing `docs/*.md` engineering files become reference material; the manual is the front door.
- **Notifications, not minutes saved.** He doesn't actually need 5-second publishes. He needs (a) to know when a deploy finishes, (b) to preview before publishing, (c) one-click access to live URL and build status from Studio. That's most of the perceived pain.

## What you should NOT do

- Don't reopen the SSR migration unless Nic explicitly asks.
- Don't change `next.config.ts` `output: "export"`.
- Don't modify CloudFront, S3, DNS, or the GitHub Actions deploy workflow's deploy steps. Adding a final notification step to `deploy.yml` is fine; restructuring the workflow is not.
- Don't touch the Sanity schema. Schema work is out of scope.
- Don't commit any secrets. The ntfy topic URL is a GitHub secret (`NTFY_TOPIC_URL`); never paste it into committed files.

## Operating norms (from workspace rules)

- After making code changes, **run `npm run dev` yourself** to start a dev server — don't ask Nic to do it. See `.cursor/rules/dev-server.mdc`.
- Build/deploy steps are documented in the `build-deploy` skill (`.cursor/skills/build-deploy/SKILL.md`). Only run a deploy when Nic explicitly asks ("/build-deploy" or similar).
- Don't proactively create `*.md` docs unless explicitly required. Task 6 (operator's manual) is required. Other docs need a reason.

## Key files for orientation

| File | Why |
|---|---|
| [`docs/publishing-workflow-improvements.md`](publishing-workflow-improvements.md) | **The active plan.** Six tasks with acceptance criteria. |
| [`migrate-spec.md`](../migrate-spec.md) | Parked SSR migration spec. Read for context only. |
| [`docs/migrate-plan-and-tasks.md`](migrate-plan-and-tasks.md) | Parked SSR migration plan. Read for context only. |
| [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) | How the static-export site works today. Still accurate. |
| [`docs/DEPLOY.md`](DEPLOY.md) | How CI deploys (GitHub Actions → S3 → CloudFront invalidation). |
| [`docs/CONTENT-PAGES.md`](CONTENT-PAGES.md) | Per-page CMS-vs-code split. Useful reference for Task 6. |
| [`docs/SANITY-WEBHOOK-SETUP.md`](SANITY-WEBHOOK-SETUP.md) | Current Sanity → GitHub Actions webhook (publish triggers rebuild). Still in effect. |
| [`infra/cloudfront-url-rewrite.js`](../infra/cloudfront-url-rewrite.js) | CloudFront Function — apex→www, redirects, `.html` rewrite. Still in production. **Do not touch.** |
| [`sanity/sanity.config.ts`](../sanity/sanity.config.ts) | Studio config. Edited in Tasks 1, 4. |
| [`lib/sanity/client.ts`](../lib/sanity/client.ts) | Sanity fetch wrapper. Don't change without a reason — it's specifically static-export-friendly. |

## Where to start

1. Read [`docs/publishing-workflow-improvements.md`](publishing-workflow-improvements.md) end-to-end.
2. Confirm with Nic that he's ready to start (he may say "go" without naming a task — start with Task 5 in that case, per the suggested order).
3. Work one task at a time. Verify acceptance criteria before moving on.
4. After each task, push the change and confirm with Nic that he's seeing what he expects.
5. Task 6 is the closer — write the operator's manual after every other task is complete and tested in the real workflow.

## Open items

- Nic has not yet given the explicit "start Task 1" go-ahead. Confirm before editing code.
- `NTFY_TOPIC_URL` GitHub secret needs to be added to the repo before Task 2 can ship. Nic can add it via GitHub UI; the value is `https://ntfy.sh/nic-deploy-5shj0h5`.

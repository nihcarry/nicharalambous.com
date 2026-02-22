# Documentation index

Project docs for nicharalambous.com. Use this as the single list of all docs (for humans and AI).

| Doc | Description |
|-----|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the site is built: static export, Sanity at build time, route types, content model, key files. |
| [BUILD.md](BUILD.md) | What `npm run build` does, prerequisites, how to verify output, Sanity client cache requirement. |
| [DEPLOY.md](DEPLOY.md) | CI vs local deploy, triggers, GitHub secrets, Step 7 (commit & push after local deploy). |
| [CONTENT-BLOG.md](CONTENT-BLOG.md) | Blog posts in Sanity; publishing from Studio vs Cursor (parse → enrich → import); slugs and URLs. |
| [CONTENT-PAGES.md](CONTENT-PAGES.md) | How to update page content: CMS-driven (Speaker, keynotes, books, etc.) vs code-driven (About, homepage). |
| [SANITY-WEBHOOK-SETUP.md](SANITY-WEBHOOK-SETUP.md) | Configure Sanity “deploy on publish” webhook (GitHub PAT, webhook URL, request body). |
| [SANITY-CI-SECRETS.md](SANITY-CI-SECRETS.md) | Sanity env in GitHub Actions; why Speaker (or other CMS content) might not update after deploy. |
| [ENV-AND-SCRIPTS.md](ENV-AND-SCRIPTS.md) | `.env.local` vars and `package.json` scripts (dev, build, content pipeline, verify). |
| [SANITY-VS-SITE-AUDIT.md](SANITY-VS-SITE-AUDIT.md) | What’s in Studio vs what the site uses; no "Home" in Studio; Site Settings unused; gaps. |

**Build/deploy in detail**: For full local deploy steps and troubleshooting (CI stomping, webhook storms, S3 sync), see the build-deploy skill: `.cursor/skills/build-deploy/SKILL.md`.

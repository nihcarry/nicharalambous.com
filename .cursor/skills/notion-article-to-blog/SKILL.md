---
name: notion-article-to-blog
description: Pulls an article from Notion by URL, runs grammar/spell check (suggestions for approval), adds SEO/GEO metadata without changing the author's content, and creates a Sanity blog post. Use when the user wants to publish a Notion article to the blog, pull a Notion page and add SEO then publish, or turn a Notion post into a blog post with SEO/GEO.
---

# Notion Article to Blog

Publish a Notion article to nicharalambous.com with SEO/GEO metadata and optional grammar/spell fixes. **Your wording is never changed** except by user-approved grammar/spell corrections.

## When to use

- User says: "Publish my Notion article to the blog", "Pull this Notion page and add SEO then publish", "Turn my Notion post into a blog post", or provides a Notion page URL and asks to publish it.
- User has a finished article in Notion and wants it on the blog with metadata only (no content rewrite).

## Prerequisites

- Notion MCP enabled (project `.cursor/mcp.json` includes Notion).
- For creating the post in Sanity: `SANITY_WRITE_TOKEN` in `.env.local` (create at sanity.io/manage → API → Tokens).
- Optional: `marked` for Markdown→HTML (`npm install marked` if not present); optional grammar script `scripts/check-grammar-spell.ts`.

## Workflow

### 1. Fetch the Notion page

- If user provided a **URL or page ID**: use Notion MCP **notion-fetch** with that `id`.
- If not: use **notion-search** (query e.g. "article to publish" or user description), then **notion-fetch** the chosen page.
- From the response, extract: **title**, **body** (enhanced Markdown). Notion returns Markdown; preserve it for the next steps.

### 2. Grammar and spell check

- Run **basic** grammar and spell check on the article body (plain text or Markdown).
  - **Option A**: If available, run `npx tsx scripts/check-grammar-spell.ts` (stdin or file path); it outputs a list of suggestions (offset, original, replacement, rule).
  - **Option B**: Review the text yourself and propose corrections in this format:
    - For each issue: `[context sentence]` → suggested fix + brief reason (e.g. "spelling" / "grammar").
- **Surface all suggestions to the user.** Do not apply any change until the user approves.
- User may say "apply all", "apply these [list]", or "skip". Apply **only** the approved fixes to the body. This is the **only** step that may change body text.

### 3. Convert body to HTML

- Convert the (optionally corrected) Markdown body to HTML. Do not alter wording; only format.
  - Use `marked` (e.g. `marked.parse(markdown)`) or run `npx tsx scripts/notion-markdown-to-html.ts` with stdin/file. Output is the HTML to store as `rawHtmlBody`.
- **Before converting**, ensure the Markdown has correct structure for the published layout (see [Structure and formatting](#structure-and-formatting) below). Without this, sections can render as single long paragraphs with poor readability.

### 4. Generate SEO/GEO metadata (no body change)

From the **plain text** of the article (and title), generate the same fields as the existing enrich pipeline. Use [reference.md](reference.md) for topic keywords and topic→keynote mapping.

- **excerpt**: 2–3 sentences, max 200 characters. Pull from first substantive paragraph; AI models use this (GEO).
- **seoTitle**: Cleaned title, max 70 characters.
- **seoDescription**: Meta description, max 160 characters (first sentence + context).
- **topics**: 1–3 topic hub slugs. Use keyword scoring from [scripts/enrich-articles.ts](scripts/enrich-articles.ts) (see [reference.md](reference.md)). Allowed slugs: `curiosity`, `innovation`, `entrepreneurship`, `focus`, `ai`, `agency`, `failure`.
- **relatedKeynote**: One keynote slug from topic→keynote map in [reference.md](reference.md): `reclaiming-focus`, `breakthrough-product-teams`, `curiosity-catalyst`.
- **targetKeywords**: 3–5 long-tail keywords from title and headings.
- **estimatedReadTime**: `Math.ceil(wordCount / 225)` (225 wpm).
- **faq**: Up to 5 Q&A pairs. Derive from headings + following paragraph context (same idea as enrich); turn headings into questions where needed. Targets "People Also Ask" and GEO.

**Slug**: From title — lowercase, hyphenated, unique. Sanity document ID for Notion imports: `imported-notion-{slug}`.

**publishedAt**: Use Notion page "created" or "last edited" date if available; otherwise today in ISO 8601.

### 5. Create the post in Sanity

- Resolve **topic hub** and **keynote** references by querying Sanity (same GROQ as in [scripts/import-to-sanity.ts](scripts/import-to-sanity.ts)): `*[_type == "topicHub"]{ _id, "slug": slug.current }`, `*[_type == "keynote"]{ _id, "slug": slug.current }`.
- Build the post document in the **same shape** as the import script (see [scripts/import-to-sanity.ts](scripts/import-to-sanity.ts) `buildSanityDocument`): `_id`, `_type: "post"`, `title`, `slug`, `publishedAt`, `excerpt`, `rawHtmlBody`, `estimatedReadTime`, `contentStatus`, `topics`, `relatedKeynote`, `faq`, `targetKeywords`, `seo: { seoTitle, seoDescription }`. Use `createOrReplace` so re-runs don’t duplicate.
- **contentStatus**: Default `ai-draft` or `in-review`. If the user asked to "publish" immediately, set `published`.
- Call Sanity Data API: `POST https://<PROJECT_ID>.api.sanity.io/v<API_VERSION>/data/mutate/<dataset>` with `Authorization: Bearer SANITY_WRITE_TOKEN` and body `{ "mutations": [ { "createOrReplace": { ... } } ] }`. Load `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_WRITE_TOKEN` from `.env.local`.

### 6. After create

- Tell the user the post is in Sanity and the slug (e.g. `/blog/<slug>` when published).
- If status is not `published`: "Open Studio → Blog Posts → find the post → set Content Status to Published → Publish. Then deploy (webhook or manual)."

## Structure and formatting

So the published post has clear paragraph spacing and scannable sections (not walls of text):

- **Paragraph breaks in Markdown:** `marked` only starts a new `<p>` when there is a **blank line** between blocks. If the Notion body has multiple logical paragraphs separated only by single newlines, they will become one long HTML paragraph. **Before step 3 (Convert body to HTML)**, ensure the Markdown has a blank line between every logical paragraph. That way the HTML will have separate `<p>` tags and the blog template’s paragraph spacing will apply.
- **Lists:** Put a blank line **after** any list (bullets or numbers) so the following paragraph is not parsed as part of the last list item. Otherwise the next paragraph can be swallowed into the final `<li>` and not appear as its own block.
- **Section headings:** The blog template styles `rawHtmlBody` with H1, H2, H3, H4 and generous margins. Using `# 1. Section title` (H1) for main sections is supported and will render with clear top/bottom spacing. No need to change Notion’s heading level for numbered sections.

## Constraints

- **Do not rewrite or paraphrase** the article body. Only add metadata, convert format (Markdown→HTML), and apply **user-approved** grammar/spell fixes.
- If using an LLM for metadata: summarize and derive only; never change the original prose.
- Grammar/spell: present suggestions clearly; apply changes only after the user approves ("apply all", "apply these", or "skip").

## References

- Topic keywords and topic→keynote map: [reference.md](reference.md)
- Enrich logic (topics, FAQ, keywords): [scripts/enrich-articles.ts](scripts/enrich-articles.ts)
- Sanity document shape and mutation pattern: [scripts/import-to-sanity.ts](scripts/import-to-sanity.ts)
- Post schema: [sanity/schemas/documents/post.ts](sanity/schemas/documents/post.ts)
- SEO/GEO strategy: [nicharalambous-seo-strategy.md](nicharalambous-seo-strategy.md)

## Optional later

- **Featured image**: If Notion page has a cover, document downloading and uploading to Sanity asset API, then set `featuredImage`.
- **Notion database**: If articles live in a database, use notion-search with `data_source_url` or fetch the database and iterate pages.

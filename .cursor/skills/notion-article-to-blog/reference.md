# Notion-to-Blog: Topic Keywords & SEO/GEO Reference

Use this when generating SEO/GEO metadata for a Notion article. Source: [scripts/enrich-articles.ts](scripts/enrich-articles.ts).

## Topic hub slugs (exactly 7)

`curiosity` | `innovation` | `entrepreneurship` | `focus` | `ai` | `agency` | `failure`

## Topic keyword scoring

Score article text against each topic: **primary** keywords count 3 points each, **secondary** 1 point. Take top 1–3 topics by score. If no matches, default to `curiosity`.

| Topic | Primary keywords | Secondary keywords |
|-------|------------------|---------------------|
| curiosity | curiosity, curious, question, wonder, explore, discovery, learn | experiment, interest, investigate, ask, unknown, surprise, new idea, open mind |
| innovation | innovation, innovate, disrupt, breakthrough, invent, creative, build | technology, product, iterate, prototype, design, ship, launch, create, maker |
| entrepreneurship | entrepreneur, startup, business, founder, company, venture | hustle, customer, revenue, profit, market, growth, scale, pivot, investor, funding, bootstrapp |
| focus | focus, distraction, attention, screen time, digital, mindful, present | phone, social media, scroll, productivity, deep work, concentration, boredom, habit, discipline, addiction |
| ai | artificial intelligence, ai , machine learning, chatgpt, llm, generative | algorithm, automat, neural, model, prompt, robot, copilot, claude, openai, gpt |
| agency | agency, autonomy, choice, control, decision, ownership, empower | action, proactive, initiative, self-determin, independen, accountab, responsib, intention |
| failure | failure, fail, mistake, wrong, error, setback, loss | resilience, bounce back, lesson, recover, overcome, persist, grit, tough, struggle, adversity |

## Topic → keynote mapping

Use the **primary topic** (first in the sorted list) to pick one keynote:

| Topic | Keynote slug |
|-------|--------------|
| curiosity | curiosity-catalyst |
| innovation | breakthrough-product-teams |
| entrepreneurship | breakthrough-product-teams |
| focus | reclaiming-focus |
| ai | reclaiming-focus |
| agency | reclaiming-focus |
| failure | curiosity-catalyst |

Keynote slugs in Sanity: `reclaiming-focus`, `breakthrough-product-teams`, `curiosity-catalyst`.

## Excerpt and SEO text

- **excerpt**: First 1–2 sentences from the first substantive paragraph; max 200 characters. Used on listing and for GEO (AI citations).
- **seoTitle**: Article title, trimmed to 70 characters if needed.
- **seoDescription**: First sentence(s) from lead; max 160 characters (meta description).

## FAQ extraction

- Prefer **headings (H2/H3/H4)** plus the next 1–2 paragraphs as context.
- Turn heading into a question: if it already ends with `?`, use it; else prefix with "What is …?" or "How does …?" etc.
- Answer = first 1–2 sentences of the context, truncated if long.
- Max 5 FAQ items. Targets "People Also Ask" and GEO.

## Target keywords

- From **title**: 2–4 content words (skip stopwords), one phrase.
- From **headings**: phrases of 2–5 words.
- From **body**: frequent bigrams (2-word phrases appearing 2+ times), filtered by length and stopwords.
- Deduplicate; return up to 5. No generic words (see enrich script for stopword list if needed).

## Estimated read time

`Math.ceil(wordCount / 225)` minutes (225 words per minute).

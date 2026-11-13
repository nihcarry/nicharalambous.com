# r12 responsive audit

Script: `docs/qa/r12/audit.mjs`

```bash
node docs/qa/r12/audit.mjs --out docs/qa/r12/before.json
node docs/qa/r12/audit.mjs --out docs/qa/r12/after.json
```

One page per template, at 360, 390 and 768. Raw rows are in `before.json` and `after.json`.

Inline links inside article, archive and about prose are not counted as tap targets. Off-screen controls (the skip link and the enquiry honeypot) are not counted. Decorative carets are not counted as text.

## Totals across 12 pages and 3 widths

| Check | Before | After |
|---|---|---|
| Pages with horizontal overflow | 0 | 0 |
| Tap targets under 44px | 1147 | 715 |
| Text nodes under 14px | 275 | 0 |
| Images wider than their container or the viewport | 0 | 0 |

The remaining 715 tap hits are text links: footer and legal links, and a few section links such as "Read the blog". They are inline text, not buttons, and they were left as text. Nothing in that set was clipped or overlapping.

## What changed

- Nav logo, Book button, menu button, consent buttons, topic chips, tags, pager numbers, media filters, FAQ questions and the cookie-settings control now have a 44px target.
- Footer headings, legal text, price notes, card labels and the sticky book line are at least 14px.
- The in-person keynote price wraps at 360px instead of sticking out of the card.
- Archive note sits under the title, in a cream box with a hairline border. Topic chips on articles and archive posts sit with the date, under the H1. Archive paragraphs use the same gap as article paragraphs. Double line breaks in archive HTML become paragraphs at render time.

The eyebrow check fails if an article header has any element before the H1.

# Businesses Canonical URL Policy

## Purpose

Define a single outbound URL recommendation per business record so `/businesses` links stay consistent and maintainable.

## Policy Rules

1. **Active businesses** must have one canonical public URL.
2. **Past startups (exits)** should have one canonical historical/public reference URL where possible.
3. **Deadpool businesses** intentionally have no canonical outbound URL and remain non-clickable in UI.
4. Canonical URL selection priority:
   - Official product homepage
   - Official company/about page
   - App root URL
5. Do not add multiple competing URLs to one record. If multiple links are valid, keep only the strongest canonical destination in `url`.

## Draft Canonical URL Recommendations (Review Before Publish)

| Business | Category | Current `url` | Recommended canonical URL | Notes |
| --- | --- | --- | --- | --- |
| Professional Speaker | Active | `/speaker` | `https://nicharalambous.com/speaker` | Use absolute canonical URL in Sanity for consistency. |
| Nic Harry | Past startup | `null` | `TBD (official archived company page)` | Confirm best historical public destination. |
| Resolve Mobile | Past startup | `null` | `TBD (official company/about page)` | Confirm legacy canonical reference. |
| Motribe | Past startup | `null` | `TBD (official historical page)` | Confirm surviving public destination. |

## Sanity Authoring Guidance

- Add canonical URLs for active and past records only.
- Keep deadpool entries with `url: null`.
- Prefer HTTPS URLs.
- Re-check that each URL resolves before publishing.

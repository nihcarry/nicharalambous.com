---
name: linkedin-outreach
description: Daily LinkedIn connection outreach for The Lekker Network Netherlands chapter. Morning sync checks acceptances and DM replies in LinkedIn and updates Notion. Then finds prospects and sends up to 15-20 personalized invites via browser. Use when the user says run outreach, TLN outreach, morning sync, sync pipeline, send today's invites, or daily LinkedIn connections.
---

# TLN LinkedIn Outreach

Nic is Chapter Head of **The Lekker Network (TLN) Netherlands**. This skill drives daily connection requests to South African expats in the Netherlands.

> **CRITICAL: LinkedIn modals use shadow DOM.** Standard `browser_fill` and `browser_type` do NOT work on the invitation note textbox. You MUST use `browser_cdp` with `Runtime.evaluate` to access `document.getElementById('interop-outlet').shadowRoot.querySelector('textarea')`. See Phase 3 for the exact code. Ignoring this will waste hours debugging.

## Hard rules

### 1. Netherlands location only (highest priority)

Wrong country is a **hard stop**. TLN Netherlands chapter outreach targets **SA expats living in the Netherlands**. Inviting someone in the UK, South Africa, or anywhere else is unacceptable.

**Forbidden:**
- Never build LinkedIn search URLs with `geoUrn` or guessed location IDs.
- Never invite if the location filter is not **Netherlands**.
- Never invite if the person's profile location is outside the Netherlands (e.g. Cape Town, Gauteng, Watford, England).

**Required — LinkedIn UI only:**
1. Go to People search: `South African Netherlands`
2. Click **Locations** → check **Netherlands** → **Show results**
3. Before the first invite, confirm in snapshot: filter shows Netherlands; each prospect's location line says Netherlands (or a Dutch city/region)
4. If filter shows UK, another country, or "No results" from a bad filter: **stop**, reset, re-apply Netherlands via UI

**Per-prospect check:** Even with Netherlands filter, skip recruiters and profiles clearly based in South Africa only.

### 2. Message template is sacred (never change without approval)

The connection message template below is **locked**. The agent must:
- Use the **exact wording** from the template section below
- **NEVER** modify, rephrase, "improve", or substitute the message
- **NEVER** change the message without **explicit written approval** from the user first
- Only replace `{FirstName}` with the prospect's actual first name

Changing the message without permission is a **critical failure**. If the agent is unsure about the message, it must **stop and ask** before sending any invites.

### 3. Resilience rule (skip and continue)

Never let a single prospect stall the entire run. If an individual invite fails after **2 attempts**, skip that person and move to the next immediately.

**During a run:**
- Try each prospect up to 2 times (modal not appearing, element unclickable, etc.)
- On second failure, log the name and move on — do not stop to report
- Keep going until 20 invites are sent (or the prospect list is exhausted)
- Only stop for **actual blockers**: logged out of LinkedIn, rate-limited by LinkedIn, or page completely broken

**After the run:**
- Report any skipped prospects at the end with the reason (e.g. "Connect button missing", "modal kept closing")
- Never stop mid-run to ask about UI friction on a single person

This rule exists because LinkedIn's UI is inconsistent — some profiles glitch. Stopping to report every glitch derails the whole run.

### 4. Other hard rules

- **20 connection requests per day maximum** when the user requests the upper batch (default target 15; count Invited Date = today in Notion).
- **Always include a personalized note** on every connection request.
- **Never use em dashes** in any message or copy.
- **Notion is the source of truth** for prospect status.

## Notion Prospect Pipeline

- Database: [Prospect Pipeline](https://app.notion.com/p/15200dd4e117499ba59b3a45faa52ab3)
- Data source ID: `e5d1aba2-940e-444f-a6bb-34dd67a4cf25`
- **Daily Outreach view**: TLN Status = Identified, sorted by Next Action Date ascending
- **LinkedIn Follow-up view**: board grouped by LinkedIn Status for nurturing warm leads

### Key fields

| Field | Use |
|-------|-----|
| Name | Prospect full name |
| LinkedIn URL | Profile URL (prefer this over search) |
| **TLN Status** | Chapter funnel: Identified → Invited → Attended → Applied → Member |
| **LinkedIn Status** | LinkedIn relationship: Pending → Connected → Responded → Warm → Stalled |
| Next Action | e.g. "Send connection request", "Await acceptance", "Follow up on DM" |
| Invited Date | Set when invite is sent |
| Notes | Context, role, how they were found |

### LinkedIn Status progression

| Stage | When to set |
|-------|-------------|
| *(empty)* | Not yet contacted on LinkedIn |
| **Pending** | Connection invite sent, awaiting accept |
| **Connected** | Accepted your connection request (no DM yet) |
| **Responded** | They sent at least one direct message |
| **Warm** | Active back-and-forth (2+ message exchanges) |
| **Stalled** | Accepted but conversation went quiet; worth a nudge later |

TLN Status and LinkedIn Status are independent. Someone can be TLN Status = Invited and LinkedIn Status = Responded at the same time.

## Connection message template

Use first name only in `{FirstName}`. **Must be under 200 characters.**

```
Hi {FirstName}, fellow South African here in NL! I run The Lekker Network in NL connecting SA expats. Would love to connect and see you at our next event: https://luma.com/orh5t2uq
```

Character count: ~181 (varies by name length). Do NOT add signatures or extra text.

## Daily workflow

Default morning order: **Morning sync → New invites**. When the user says **"Run today's TLN outreach"**, run Phase 0 (sync) first unless they explicitly skip it.

### Phase 0: Morning sync (LinkedIn → Notion)

**Goal:** Automate status detection. **Do not** draft or send DM replies. Nic handles all message replies and adds detailed context in Notion Notes himself.

**Who to check:** Query Notion for rows where `TLN Status = Invited` and `LinkedIn Status` is **Pending** or **Connected** (optionally include **Responded** if checking for upgrade to Warm). Use LinkedIn URL from Notion; fall back to name search with Netherlands filter if URL missing.

**How to check (browser, interactive session):**

1. **Accepted (Pending → Connected)**
   - Open their profile from Notion LinkedIn URL.
   - Signals: shows **1st** connection, **Message** button without Pending/Withdraw, or invitation no longer pending.
   - Update Notion: `LinkedIn Status = Connected`, `Next Action = Follow up or await DM` (keep brief).

2. **Replied (Connected or Pending → Responded)**
   - Open **Messaging** and search or scan for threads with pipeline names.
   - If **they** sent at least one message after the invite (even a short "sounds good"): `LinkedIn Status = Responded`.
   - Do **not** copy full thread into Notes unless the user asked. Add a one-line system note only if useful, e.g. "DM received 2026-07-03".
   - Nic adds detailed context (event interest, tone, next step) in **Notes** manually.

3. **Warm**
   - Only set **Warm** if the thread clearly shows **2+ back-and-forth exchanges** without Nic's manual input. When unsure, leave as **Responded** and flag for Nic.

4. **Stalled**
   - Do not auto-set Stalled during morning sync unless the user asked. That is a manual nurture decision.

**After sync, post a summary table:**

| Name | Was | Now | Evidence | Notion updated |
|------|-----|-----|----------|----------------|

List anyone who needs Nic's attention: new **Responded** rows where a reply is owed, or **Connected** with no DM yet worth a nudge.

**Limits:** Cannot run without an interactive session and logged-in LinkedIn. Inbox scan may miss threads; report confidence. If messaging overlay blocks navigation, press Escape and retry.

### Phase 1: Discover on LinkedIn (when Notion queue is short)

**Do not repeat the same search from page 1.** That wastes time on already-seen profiles. Rotate queries and resume pagination.

#### Search cursor file

Read and update `.cursor/skills/linkedin-outreach/search-cursors.json` every discovery run.

- **Key format:** `{keywords}|{locationFilterLabel}` (e.g. `South African|Amsterdam`, `South African Netherlands|Netherlands`)
- **`lastPage`:** highest page number browsed for that query (not invites sent)
- **Start page:** `lastPage + 1` on the next run. If `lastPage >= 10` and results are still thin, rotate to a different query instead of paging deeper on the same one.
- **Never** re-open page 1 of a query unless the cursor was reset (new month, user asked, or filter changed).

After discovery, write back `lastPage` and `lastRun` (today's date) for each query used.

#### Rotate queries: country + cities

Use **LinkedIn UI location filter only** (never `geoUrn` in URLs). Alternate across:

| Keywords | Location filter (UI) |
|----------|----------------------|
| `South African Netherlands` | Netherlands |
| `South African` | Amsterdam |
| `South African` | Rotterdam |
| `South African` | The Hague |
| `South African` | Utrecht |
| `South African` | Eindhoven |
| `South African` | Haarlem |
| `South African` | Leiden |

**Pick order:** start with the query whose `lastPage` is lowest (fresh surface). If today's country-wide query already has `lastPage >= 4`, skip straight to city queries or `lastPage + 1` — do not scan pages 1–3 again.

Navigate directly to the start page: use LinkedIn's pagination (`page=5`, `page=10`, etc.) **after** the location filter is applied in the UI, or click the page number in the results footer.

#### Discovery steps

1. Read `search-cursors.json`; choose query + start page.
2. Run People search with keywords + location filter via UI; verify filter pill in snapshot.
3. Jump to start page (not page 1 unless cursor is 0).
4. Skip anyone already in Notion, already Pending/Connected on LinkedIn, recruiters, diplomats, or profiles outside the Netherlands.
5. Open promising profiles; confirm SA + NL fit before inviting.
6. Add to Notion when inviting.
7. Update `search-cursors.json` with the highest page reached.

### Phase 2: Queue (Notion)

1. Query the Daily Outreach view for TLN Status = Identified prospects.
2. Count rows where Invited Date = today. If already 15, stop and report daily cap reached.
3. Take up to `(15 - today's count)` prospects from the queue.
4. Skip any with Next Action = "verify before outreach" unless the user explicitly overrides.
5. Confirm each prospect has a valid LinkedIn URL; flag missing or 404 URLs.

### Phase 3: Send (browser, interactive session only)

LinkedIn sends require the browser MCP in an interactive Agents session. Scheduled Cursor Automations cannot drive the browser.

**Use all-in-one CDP script for each invite.** This is the most reliable method - it handles Connect, Add note, fill message, and Send in a single JavaScript execution, avoiding shadow DOM issues.

#### All-in-one CDP invite script

Call via `browser_cdp` with `Runtime.evaluate`, `awaitPromise: true`, and `returnByValue: true`:

```javascript
new Promise(async (resolve) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const firstName = 'FIRST_NAME_HERE';
  const note = `Hi ${firstName}, fellow South African here in NL! I run The Lekker Network in NL connecting SA expats. Would love to connect and see you at our next event: https://luma.com/orh5t2uq`;
  
  // Find and click Connect button
  const invite = [...document.querySelectorAll('a, button')].find(el => {
    const t = (el.getAttribute('aria-label') || el.textContent || '').trim();
    return t.includes('Invite ' + firstName) && t.includes('connect');
  });
  if (!invite) return resolve({ok: false, step: 'connect', msg: 'no button'});
  invite.click();
  await wait(1500);
  
  // Click "Add a note" if present
  const addNote = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Add a note');
  if (addNote) { addNote.click(); await wait(1000); }
  
  // Find textarea and fill it
  const ta = document.querySelector('textarea');
  if (!ta) return resolve({ok: false, step: 'textarea', msg: 'not found'});
  ta.focus();
  ta.value = note;
  ta.dispatchEvent(new Event('input', {bubbles: true}));
  ta.dispatchEvent(new Event('change', {bubbles: true}));
  await wait(500);
  
  // Click Send invitation
  const send = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Send invitation' && !b.disabled);
  if (!send) return resolve({ok: false, step: 'send', msg: 'button disabled or not found'});
  send.click();
  await wait(2000);
  
  // Verify success
  const pending = [...document.querySelectorAll('button, a')].find(el => 
    (el.getAttribute('aria-label') || el.textContent || '').includes('Pending')
  );
  resolve({ok: !!pending, step: 'done', pending: !!pending});
})
```

Replace `FIRST_NAME_HERE` with the prospect's first name. The script returns `{ok: true}` on success.

#### Send workflow (per prospect from search results)

1. Take a snapshot to identify prospects with "Invite {Name} to connect" buttons
2. For each prospect: run the all-in-one CDP script with their first name
3. Verify result is `{ok: true}` - if not, skip after 2 attempts per resilience rule
4. Update Notion after each batch (or at end of run)

**Work from search results** - no need to navigate to individual profiles. The CDP script finds the Connect button by name.

Morning sync should catch most acceptances and replies automatically. When the user reports something sync missed, update **LinkedIn Status** and let them enrich **Notes**.

### Common friction

- **Wrong location filter**: Stop all sends. Locations → Netherlands → Show results. Never use geoUrn in URLs.
- **Messaging overlay**: Press Escape or close the open conversation if Connect clicks fail.
- **404 profile URLs**: Search LinkedIn by name with Netherlands filter applied, verify identity, update Notion LinkedIn URL.
- **Header nav blocking Connect**: Click the Connect link in the profile card area instead.
- **"Cannot read properties of undefined"** or **"Failed to focus textarea"**: You forgot to use the CDP shadow DOM workaround. Never use browser_fill or browser_type on LinkedIn modals.
- **"undefined" appearing in text fields**: Same cause - shadow DOM issue. Use CDP.

### LinkedIn limits

- **Weekly connection limits**: LinkedIn may throttle if you send too many invites too fast. Space them out and don't exceed ~100/week.
- **Daily target**: 15-20 invites per session is sustainable.

## After the full morning run

Post two summaries if both sync and sends ran:

1. **Sync:** status changes (accepts, replies detected)
2. **Sends:** Name, LinkedIn URL, Sent/Failed, Notion updated Y/N

## Division of labour

| Task | Who |
|------|-----|
| Detect accepts + DMs, update LinkedIn Status in Notion | Agent (morning sync) |
| Write and send DM replies | Nic |
| Detailed Notes (what they said, event interest, next step) | Nic |
| Mark **Warm** / **Stalled** when relationship is clear | Nic (agent may suggest) |
| Find prospects + send connection invites | Agent (after sync) |

## Morning trigger phrases

- **"Run today's TLN outreach"** — sync, then invites (full morning)
- **"Sync TLN pipeline"** — sync only, no new invites
- **"Send today's TLN invites"** — invites only if sync already done today or user says skip sync

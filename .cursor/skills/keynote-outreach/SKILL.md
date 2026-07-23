---
name: keynote-outreach
description: Send LinkedIn connection requests to discovered contacts for Interrupt Apathy keynote. Navigates to profiles, sends personalized connection notes, updates Notion. Use when user says send outreach, keynote outreach, connect with leads, or run daily outreach.
---

# Keynote Outreach

This skill sends LinkedIn connection requests to contacts already discovered and stored in Notion. It does NOT discover contacts - that's handled by the separate discovery skill.

## Pre-requisites

- Contacts must exist in Notion with Record Type = "Contact"
- Contacts must have LinkedIn URL filled
- Contacts must have LinkedIn Status = NULL or "Pending"
- User must be logged into LinkedIn in the browser

## Connection Message Template

```
Hi {FirstName}, {Company} looks properly remote-centric, love that. It's a big part of my world too. My work looks at why smart, capable people stop showing up in teams like yours. Would love to connect. Nic
```

**Character count:** ~200 characters (within 300 char LinkedIn Premium limit)

**Template variables:**
- `{FirstName}` - Person's first name (extract from Name field)
- `{Company}` - Company Name field

## Notion Database

- **Database:** [Interrupt Apathy — Outreach Leads](https://app.notion.com/p/0b9ecfb65c7e42f38acf3727b5b666f8)
- **Data source ID:** `collection://a29903c4-e094-4717-b1e0-c500220aea54`

### Query for Contacts Ready for Outreach

```sql
SELECT * FROM "collection://a29903c4-e094-4717-b1e0-c500220aea54"
WHERE "Record Type" = 'Contact'
AND "userDefined:LinkedIn URL" IS NOT NULL
AND ("LinkedIn Status" IS NULL OR "LinkedIn Status" = 'Pending')
ORDER BY CASE Priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END
LIMIT 30
```

## Workflow

### Phase 1: Queue Contacts

1. Query Notion for up to 30 contacts ready for outreach
2. Build queue with: Name, Company Name, LinkedIn URL

### Phase 2: Send Connection Requests

For each contact:

1. **Navigate to profile** - `browser_navigate` to their LinkedIn URL

2. **Take snapshot** - Check page state:
   - Look for "Connect" button
   - Skip if already connected ("Message" primary button)
   - Skip if "Pending" already shown
   - Skip if profile not accessible

3. **Click Connect** - Use browser_click on the Connect button ref

4. **Add note** - When modal appears:
   - Click "Add a note" button
   - Fill textarea with personalized message
   - Click "Send invitation"

5. **Verify** - Check for "Pending" state or success indicator

6. **Update Notion** - Set LinkedIn Status = "Pending", Last Touch = today

### Phase 3: Handle Errors

If connection request fails:
- Already connected → Set LinkedIn Status = "Connected"
- Profile restricted → Add to Notes "Profile restricted"
- Button not found → Skip, note issue
- Rate limited → STOP immediately, report how many succeeded

## CDP Script for Connection Request

```javascript
new Promise(async (resolve) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const firstName = 'FIRST_NAME_HERE';
  const company = 'COMPANY_HERE';
  const note = `Hi ${firstName}, ${company} looks properly remote-centric, love that. It's a big part of my world too. My work looks at why smart, capable people stop showing up in teams like yours. Would love to connect. Nic`;
  
  // Find and click Connect button
  const connectBtn = [...document.querySelectorAll('button')].find(b => 
    b.textContent.includes('Connect') && !b.textContent.includes('Message')
  );
  if (!connectBtn) return resolve({ok: false, step: 'connect', msg: 'no Connect button'});
  connectBtn.click();
  await wait(1500);
  
  // Click "Add a note"
  const addNote = [...document.querySelectorAll('button')].find(b => 
    b.textContent.trim() === 'Add a note'
  );
  if (addNote) { addNote.click(); await wait(1000); }
  
  // Find textarea and fill
  const ta = document.querySelector('textarea');
  if (!ta) return resolve({ok: false, step: 'textarea', msg: 'not found'});
  ta.focus();
  ta.value = note;
  ta.dispatchEvent(new Event('input', {bubbles: true}));
  ta.dispatchEvent(new Event('change', {bubbles: true}));
  await wait(500);
  
  // Click Send
  const send = [...document.querySelectorAll('button')].find(b => 
    b.textContent.trim() === 'Send invitation' && !b.disabled
  );
  if (!send) return resolve({ok: false, step: 'send', msg: 'button disabled or not found'});
  send.click();
  await wait(2000);
  
  // Verify
  const pending = [...document.querySelectorAll('button, span')].find(el => 
    (el.textContent || '').includes('Pending')
  );
  resolve({ok: !!pending, step: 'done', pending: !!pending});
})
```

## Notion Update After Send

```json
{
  "LinkedIn Status": "Pending",
  "date:Last Touch:start": "2026-07-17"
}
```

## Session Output

After the run, report:

| # | Name | Company | Result |
|---|------|---------|--------|
| 1 | Sarah Chen | GitLab | ✓ Sent |
| 2 | John Doe | Deel | ✓ Sent |
| 3 | Jane Smith | Zapier | ⚠ Already connected |
| 4 | Bob Wilson | Buffer | ✗ No Connect button |

**Summary:** 25/30 sent, 3 already connected, 2 skipped

## Trigger Phrases

- **"Run keynote outreach"**
- **"Send connection requests"**
- **"Connect with leads"**
- **"Run daily outreach"**
- **"Send 30 connections"**

## Hard Rules

1. **Max 30 per session** - Stay under LinkedIn's daily limits
2. **Stop on rate limit** - If LinkedIn shows any warning, stop immediately
3. **Always update Notion** - Every contact processed must have status updated
4. **Never re-contact** - Skip anyone with LinkedIn Status != NULL/Pending
5. **3-second minimum between requests** - Pace to avoid detection
6. **Report all outcomes** - Success, skip, or failure must be tracked

## Two-Phase Outreach Strategy

This skill handles **Phase 1: Connection request**.

**Phase 2: Follow-up DM** (after connection accepted) is manual - you pitch the 10-minute talk in the DM. The message template:

> Thanks for connecting {FirstName}! I run virtual sessions for remote teams on interrupting apathy - the thing where capable people quietly disengage. 
>
> Would your team be open to a free 10-minute morning or lunch session? It's energising and practical. Happy to share more if useful.

This follow-up is NOT automated - do it yourself when you see "Connected" status.

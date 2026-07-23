---
name: keynote-discovery
description: Discover contacts at target companies for Interrupt Apathy keynote outreach. Searches LinkedIn for Internal Comms, People Experience, and Employee Engagement roles. Creates Contact records in Notion with LinkedIn URLs. Use when user says discover contacts, find contacts, keynote discovery, or build contact list.
---

# Keynote Discovery

This skill discovers relevant contacts at target companies and populates Notion with their details. It does NOT send connection requests - that's handled by the separate outreach skill.

## Target Roles (Priority Order)

1. **Internal Communications Manager/Specialist** - owns all-hands and team rituals
2. **People Experience / Culture Manager** - "how the team feels" is their job
3. **Employee Engagement Manager**

Also acceptable: Head of L&D, Learning & Development Lead, Employee Experience Manager

## Notion Database

- **Database:** [Interrupt Apathy — Outreach Leads](https://app.notion.com/p/0b9ecfb65c7e42f38acf3727b5b666f8)
- **Data source ID:** `collection://a29903c4-e094-4717-b1e0-c500220aea54`

### Schema

| Field | Type | Use |
|-------|------|-----|
| Name | title | Person's full name (for Contact records) |
| Company Name | text | Company they work at |
| Title | text | Job title |
| LinkedIn URL | url | Profile URL |
| Record Type | select | "Company" or "Contact" |
| LinkedIn Status | select | Pending, Connected, Responded, Warm, Stalled |
| Status | status | Not started, In progress, Done |
| Priority | select | High, Medium, Low |
| Region | select | Geographic grouping |
| Sector | select | Industry |
| Notes | text | Context |

### Record Types

- **Company** - Source records containing target companies (existing data). Name = company name, Company Name = empty.
- **Contact** - Discovered people to contact. Name = person's name, Company Name = company they work at.

## Workflow

### Phase 1: Get Companies to Search

Query Notion for Company records that need discovery:

```sql
SELECT * FROM "collection://..." 
WHERE ("Record Type" = 'Company' OR "Record Type" IS NULL)
AND "Status" = 'Not started'
ORDER BY CASE Priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END
LIMIT 10
```

### Phase 2: Discover Contacts (per company)

For each company:

1. **Search LinkedIn** - Go to company's People page with keyword filters:
   - First try: `internal communications`
   - If no results: `people experience`
   - If no results: `employee engagement`
   - If no results: `learning development`

2. **Evaluate results** - Look for people with target role titles. Skip:
   - Recruiters
   - Generic HR (unless specifically People Experience)
   - Executives (CEO, VP) unless company is small
   - Sales, Marketing (unless Internal Comms specifically)

3. **Capture up to 3 contacts per company** with:
   - Full name
   - Job title
   - LinkedIn profile URL

### Phase 3: Create Contact Records

For each discovered person, create a NEW Notion row:

```json
{
  "Name": "Sarah Chen",
  "Company Name": "GitLab",
  "Title": "Head of Internal Communications",
  "userDefined:LinkedIn URL": "https://www.linkedin.com/in/sarah-chen-123/",
  "Record Type": "Contact",
  "Status": "Not started",
  "Priority": "[inherit from company]",
  "Region": "[inherit from company]",
  "Sector": "[inherit from company]"
}
```

### Phase 4: Update Company Record

After discovering contacts for a company:
- Set `Status = "Done"` on the Company record
- This marks it as fully discovered

## LinkedIn Search Tips

### Company People Page

Navigate to: `https://www.linkedin.com/company/{company-slug}/people/?keywords={search-term}`

The company slug is usually the company name lowercased with hyphens (e.g., `culture-amp`, `elastic-co`).

### Search Queries to Try

| Keywords | Finds |
|----------|-------|
| `internal communications` | Comms managers, specialists |
| `people experience` | Culture, employee experience roles |
| `employee engagement` | Engagement managers |
| `learning development` | L&D leads |
| `people operations` | People ops managers |

### Evaluating Results

**Good matches:**
- "Internal Communications Manager"
- "Head of People Experience"
- "Employee Engagement Lead"
- "Senior Lead, Learning & Organizational Development"

**Skip:**
- "Recruiter" (wrong function)
- "HR Business Partner" (too generic)
- "VP of People" (too senior, won't book speakers)
- "Marketing Manager" (wrong function)

## Output

After the run, report:

| Company | Contacts Found | Names | Status |
|---------|----------------|-------|--------|
| GitLab | 3 | Sarah Chen, John Doe, Jane Smith | ✓ Created |
| Deel | 0 | (no suitable roles found) | ✗ Skipped |

## Trigger Phrases

- **"Run keynote discovery"**
- **"Discover contacts"**
- **"Find contacts for keynote"**
- **"Build contact list"**

## Hard Rules

1. **Max 3 contacts per company** - Don't overwhelm with too many from same org
2. **Target roles only** - Don't create contacts for random employees
3. **Always inherit Priority/Region/Sector** from the source Company record
4. **Don't send connection requests** - This skill only discovers and creates records

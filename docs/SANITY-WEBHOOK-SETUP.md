# Sanity → GitHub Actions webhook setup

When you **publish** content in Sanity Studio, this webhook triggers a full rebuild and deploy so the live site updates automatically.

## How it works

```
Sanity Studio (Publish)
    → Sanity webhook POST
    → api.github.com/repos/nihcarry/nicharalambous.com/dispatches
    → GitHub Actions "Build & Deploy" (repository_dispatch)
    → S3 + CloudFront update (~3–5 min)
```

The GitHub workflow listens for `event_type: sanity-content-update` (see `.github/workflows/deploy.yml`).

---

## Diagnosing a broken webhook

**Symptoms:** You publish in Studio (and set Content Status → Published for blog posts), but the live site never updates and no **Build & Deploy** run appears in GitHub Actions.

**Check GitHub Actions history:**

1. Open [Build & Deploy runs](https://github.com/nihcarry/nicharalambous.com/actions/workflows/deploy.yml).
2. Look for runs triggered by **repository_dispatch**.
3. If the most recent `repository_dispatch` run is weeks or months old, the webhook is broken.

**Common causes:**

| Cause | How to confirm | Fix |
|-------|----------------|-----|
| **Expired GitHub PAT** | Sanity Manage → API → Webhooks → Delivery log shows **401** | Create a new token, update webhook header |
| **Wrong token scope** | Delivery log shows **403** or **404** | Use correct scopes (see below) |
| **Webhook disabled** | Webhook status is Disabled in Sanity Manage | Re-enable it |
| **Webhook never re-enabled after bulk import** | No deliveries since import day | Re-enable + update token |
| **Blog post still `ai-draft`** | Post not visible even after deploy | Set **Content Status → Published** in Studio, then Publish |

**Test a new token locally before updating Sanity:**

```bash
GITHUB_PAT=ghp_your_token_here npx tsx scripts/test-github-dispatch.ts
GITHUB_PAT=ghp_your_token_here npx tsx scripts/test-github-dispatch.ts --trigger
```

The second command starts a real **Build & Deploy** run. Use it to verify the token works, then paste the same token into the Sanity webhook.

---

## 1. Create a GitHub Personal Access Token (PAT)

### Option A — Classic token (simplest)

1. Go to [GitHub → Settings → Developer settings → Tokens (classic)](https://github.com/settings/tokens).
2. **Generate new token (classic)**.
3. **Note:** e.g. `Sanity webhook – nicharalambous.com`
4. **Expiration:** No expiration (or set a calendar reminder to rotate).
5. **Scopes:** check **`public_repo`** (this repo is public). `repo` also works.
6. **Generate** and copy the token (`ghp_…`).

> **Important:** `Contents: Read` alone is **not enough** for `repository_dispatch`. The migration plan once documented the wrong scope for fine-grained tokens.

### Option B — Fine-grained token

1. Go to [Fine-grained tokens](https://github.com/settings/personal-access-tokens).
2. Repository access: **Only select repositories** → `nihcarry/nicharalambous.com`
3. Permissions:
   - **Contents:** Read and write
   - **Metadata:** Read-only (auto-selected)

---

## 2. Add or fix the webhook in Sanity

1. Go to **[Sanity Manage](https://www.sanity.io/manage)** → your project → **API** → **Webhooks**.
2. Edit **Deploy on publish** (or create it).

| Field | Value |
|--------|--------|
| **Name** | `Deploy on publish` |
| **URL** | `https://api.github.com/repos/nihcarry/nicharalambous.com/dispatches` |
| **HTTP method** | `POST` |
| **Trigger on** | **Create**, **Update**, **Delete** |
| **Dataset** | `production` |
| **Filter** (optional but recommended) | `_type in ["speaker", "keynote", "topicHub", "post", "book", "testimonial", "mediaAppearance", "business", "siteSettings"]` |
| **Status** | **Enabled** |

**HTTP headers:**

| Name | Value |
|------|--------|
| `Authorization` | `Bearer ghp_YOUR_TOKEN_HERE` |
| `Accept` | `application/vnd.github.v3+json` |

**Request body (JSON):**

```json
{"event_type": "sanity-content-update"}
```

3. **Save** the webhook.

---

## 3. Confirm it works

1. Run the test script with `--trigger` (see above), **or** publish a small change in Studio.
2. Within ~30 seconds, check [GitHub Actions](https://github.com/nihcarry/nicharalambous.com/actions/workflows/deploy.yml) for a new **Build & Deploy** run with trigger **repository_dispatch**.
3. When the run completes (~3–5 min), verify the live site.

---

## Bulk imports — disable webhook first

Importing many documents fires one webhook per document, which can spawn hundreds of builds.

1. **Disable** the webhook in Sanity Manage before bulk imports.
2. Run the import.
3. **Re-enable** the webhook and update the PAT if needed.
4. Trigger **one** manual **Build & Deploy** from GitHub Actions.

---

## Manual deploy (when webhook is broken)

GitHub → **Actions** → **Build & Deploy** → **Run workflow**.

This rebuilds the entire site from the latest Sanity content. Use this until the webhook PAT is fixed.

---

## Troubleshooting delivery log

In Sanity Manage → API → Webhooks → your webhook → **Delivery log**:

| HTTP status | Meaning |
|-------------|---------|
| **401** | PAT expired or invalid — create a new one |
| **403** | PAT lacks `public_repo` / Contents write permission |
| **404** | Wrong repo URL in webhook config |
| **204** | Success — GitHub accepted the dispatch; check Actions for the workflow run |

If deliveries show **204** but no workflow runs, confirm the workflow listens for `sanity-content-update` in `.github/workflows/deploy.yml`.

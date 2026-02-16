# Sanity → GitHub Actions webhook setup

When you **publish** content in Sanity Studio, this webhook triggers a full rebuild and deploy so the live site updates automatically.

---

## 1. Create a GitHub Personal Access Token (PAT)

1. Go to **GitHub** → **Settings** (your profile, not repo) → **Developer settings** → **Personal access tokens** → [Tokens (classic)](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. **Note:** e.g. `Sanity webhook – nicharalambous.com`
4. **Expiration:** 90 days or “No expiration” (you can rotate later).
5. **Scopes:** check **`repo`** (full control of private repositories).
6. **Generate token** and **copy the token** (starts with `ghp_`). You won’t see it again.

---

## 2. Add the webhook in Sanity

1. Go to **[Sanity Manage](https://www.sanity.io/manage)** → select your project → **API** → **Webhooks**.
2. Click **Create webhook** (or edit an existing “Deploy on publish” one).

Use these values:

| Field | Value |
|--------|--------|
| **Name** | `Deploy on publish` (or any name) |
| **URL** | `https://api.github.com/repos/nihcarry/nicharalambous.com/dispatches` |
| **HTTP method** | `POST` |
| **Trigger on** | **Create**, **Update**, **Delete** (so any publish triggers a deploy) |
| **Projection** | Leave empty (optional). |
| **HTTP headers** | Add two headers: |

**Headers to add:**

| Name | Value |
|------|--------|
| `Authorization` | `Bearer ghp_YOUR_TOKEN_HERE` (paste your PAT) |
| `Accept` | `application/vnd.github.v3+json` |

**Request body:**

| Name | Value |
|------|--------|
| **Body** | Raw body, type JSON: `{"event_type": "sanity-content-update"}` |

3. **Save** the webhook and leave it **Enabled**.

---

## 3. Confirm it works

1. In Sanity Studio, make a small change (e.g. edit and re-publish a post or a singleton).
2. On GitHub go to **Actions** for `nihcarry/nicharalambous.com` and check that a **Build & Deploy** run started (triggered by `repository_dispatch`).
3. When the run completes, check the live site; your Studio change should be visible.

---

## Troubleshooting

- **Webhook doesn’t trigger:** Check Sanity webhook **Delivery log** for failed requests. If you see 401, the PAT is wrong or expired. If 404, the repo URL or `event_type` may be wrong.
- **Too many builds:** If you do a bulk import in Sanity, temporarily **disable** this webhook, run the import, then re-enable and trigger one manual deploy from GitHub Actions.

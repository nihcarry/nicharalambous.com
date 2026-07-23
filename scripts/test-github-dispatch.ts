/**
 * Test (and optionally fire) the Sanity → GitHub repository_dispatch webhook.
 *
 * Sanity's "Deploy on publish" webhook POSTs to GitHub's dispatches API using a
 * Personal Access Token stored in the webhook Authorization header. If that token
 * expires or has the wrong scope, publishes in Studio won't trigger builds.
 *
 * Usage:
 *   GITHUB_PAT=ghp_xxx npx tsx scripts/test-github-dispatch.ts
 *   GITHUB_PAT=ghp_xxx npx tsx scripts/test-github-dispatch.ts --trigger
 *
 * --trigger  Actually dispatch the event (starts Build & Deploy). Without this
 *            flag, only validates the token and prints setup instructions.
 */

const REPO = "nihcarry/nicharalambous.com";
const EVENT_TYPE = "sanity-content-update";
const DISPATCH_URL = `https://api.github.com/repos/${REPO}/dispatches`;

async function main(): Promise<void> {
  const token = process.env.GITHUB_PAT;
  const shouldTrigger = process.argv.includes("--trigger");

  if (!token) {
    console.error(
      "❌ GITHUB_PAT not set.\n\n" +
        "Create a GitHub token, then run:\n" +
        "  GITHUB_PAT=ghp_xxx npx tsx scripts/test-github-dispatch.ts\n\n" +
        "See docs/SANITY-WEBHOOK-SETUP.md for token scopes."
    );
    process.exit(1);
  }

  console.log(`🔍 Testing GitHub dispatch token for ${REPO}`);
  console.log(`   Event type: ${EVENT_TYPE}`);
  console.log(`   Trigger deploy: ${shouldTrigger ? "yes" : "no (dry run)"}\n`);

  // Validate token can read the repo (basic sanity check)
  const repoRes = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (repoRes.status === 401) {
    console.error("❌ Token rejected (401 Bad credentials). Create a new PAT.");
    process.exit(1);
  }
  if (!repoRes.ok) {
    console.error(`❌ Repo check failed: ${repoRes.status} ${await repoRes.text()}`);
    process.exit(1);
  }

  const repo = (await repoRes.json()) as { full_name: string; private: boolean };
  console.log(`✅ Token can access ${repo.full_name}`);

  if (!shouldTrigger) {
    console.log("\nDry run complete. To fire a real deploy:");
    console.log("  GITHUB_PAT=ghp_xxx npx tsx scripts/test-github-dispatch.ts --trigger");
    console.log("\nAfter a successful trigger, update the Sanity webhook Authorization header");
    console.log("with the same token. See docs/SANITY-WEBHOOK-SETUP.md");
    return;
  }

  const dispatchRes = await fetch(DISPATCH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event_type: EVENT_TYPE }),
  });

  if (dispatchRes.status === 204) {
    console.log("\n✅ repository_dispatch sent successfully.");
    console.log("   Check GitHub Actions → Build & Deploy (trigger: repository_dispatch)");
    console.log(
      `   https://github.com/${REPO}/actions/workflows/deploy.yml`
    );
    console.log("\nNext: paste this same token into Sanity Manage → API → Webhooks →");
    console.log('Authorization header: Bearer <token>');
    return;
  }

  const body = await dispatchRes.text();
  console.error(`\n❌ Dispatch failed: HTTP ${dispatchRes.status}`);
  console.error(body);

  if (dispatchRes.status === 403 || dispatchRes.status === 422) {
    console.error(
      "\nLikely cause: token lacks permission for repository_dispatch.\n" +
        "Classic PAT: enable 'public_repo' (or 'repo') scope.\n" +
        "Fine-grained PAT: Contents → Read and write on this repository.\n" +
        "See docs/SANITY-WEBHOOK-SETUP.md"
    );
  }

  process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

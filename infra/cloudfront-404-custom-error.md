# Missing pages: return the site 404, not an S3 403

This is a CloudFront distribution setting. It is not in the Next.js app, and `deploy.yml` does not update the distribution config. Do not run these commands from the deploy workflow, and do not run them until someone has reviewed this pull request.

Checked against the live site on 4 November 2026, before this change:

- `https://www.nicharalambous.com/this-page-does-not-exist-seo-audit` returned `HTTP/2 403` with `content-type: application/xml` and this body: `<Error><Code>AccessDenied</Code><Message>Access Denied</Message></Error>`. `server: AmazonS3`.
- `https://www.nicharalambous.com/404.html` returned `HTTP/2 200` and `text/html`. The static export already writes that file from `app/not-found.tsx`. The page copy includes "Page not found".
- `/decision-trackr`, `/decision-trackr/`, `/decision-trackr/privacy`, and `/decision-trackr/privacy/` each returned `HTTP/2 200` and a small HTML file (about 500 bytes) that sends the browser to `decisiontrackr.com`. Those are not 403s.

The origin is the S3 REST API. A missing key comes back as `403 AccessDenied` because the bucket does not allow listing. CloudFront currently forwards that 403. A custom error response is what turns it into `404` and the HTML in `/404.html`.

`infra/cloudfront-url-rewrite.js` cannot do this. A viewer-request function runs before the origin, so it does not know the object is missing, and it cannot fetch `/404.html` (that file is about 42 KB, above the function size limit). Leave the function as it is. It still rewrites extensionless paths to `.html`, and the Decision Trackr files must stay in place:

- `public/decision-trackr.html`
- `public/decision-trackr/index.html`
- `public/decision-trackr/privacy.html`

A custom error response only replaces 403 and 404 responses. It does not change a 200 or a 301, so those redirects keep working.

## Before you start

Distribution id, from `infra/README.md`: `E1ACQY3898IZF9`.

Confirm that id is the GitHub secret `CLOUDFRONT_DISTRIBUTION_ID` before you continue. The commands need `cloudfront:GetDistributionConfig` and `cloudfront:UpdateDistribution`. The deploy role is only shown calling `s3 sync` and `cloudfront create-invalidation`. Use an operator profile that can update the distribution, not the GitHub deploy job.

```bash
export AWS_PROFILE=your-operator-profile
export AWS_REGION=us-east-1
export DIST_ID=E1ACQY3898IZF9

aws sts get-caller-identity
aws cloudfront get-distribution --id "$DIST_ID" \
  --query 'Distribution.{Id:Id,Domain:DomainName,Status:Status,Aliases:DistributionConfig.Aliases.Items}' \
  --output json
```

Stop if the aliases are not `nicharalambous.com` and `www.nicharalambous.com`.

## Apply

This reads the live config, changes only `CustomErrorResponses`, and sends that config back. Every other field is copied from the live distribution.

```bash
mkdir -p "$HOME/cf-404-backup"
aws cloudfront get-distribution-config --id "$DIST_ID" \
  > "$HOME/cf-404-backup/distribution-config.json"

ETAG=$(python3 -c 'import json; print(json.load(open("'"$HOME/cf-404-backup/distribution-config.json"'"))["ETag"])')
echo "ETag $ETAG"
cp "$HOME/cf-404-backup/distribution-config.json" \
  "$HOME/cf-404-backup/distribution-config.rollback.json"

python3 << 'PY'
import json, os, sys
home = os.environ["HOME"]
src = os.path.join(home, "cf-404-backup", "distribution-config.json")
with open(src) as f:
    payload = json.load(f)
cfg = payload["DistributionConfig"]
current = cfg.get("CustomErrorResponses") or {"Quantity": 0}
print("Current CustomErrorResponses:")
print(json.dumps(current, indent=2))

items = list(current.get("Items") or [])
kept = []
for item in items:
    code = int(item["ErrorCode"])
    if code in (403, 404):
        path = item.get("ResponsePagePath")
        response = str(item.get("ResponseCode"))
        if path not in (None, "/404.html") or response not in ("404", "None"):
            sys.exit(
                f"Refusing to replace existing {code} error response: {item}"
            )
        continue
    kept.append(item)

desired = [
    {
        "ErrorCode": 403,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 10,
    },
    {
        "ErrorCode": 404,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 10,
    },
]
cfg["CustomErrorResponses"] = {
    "Quantity": len(kept) + len(desired),
    "Items": kept + desired,
}
out = os.path.join(home, "cf-404-backup", "distribution-config.update.json")
with open(out, "w") as f:
    json.dump(cfg, f)
print("Wrote", out)
PY

aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$ETAG" \
  --distribution-config "file://$HOME/cf-404-backup/distribution-config.update.json"

aws cloudfront wait distribution-deployed --id "$DIST_ID"
```

`ErrorCachingMinTTL` is 10 seconds. A longer cache would keep a 404 for a URL that is published a moment later. The deploy already invalidates `/*`, and 10 seconds limits the window if someone requests a path before the object exists. A genuine 403 on this public site is the same missing-key case, so it is mapped to the same page.

## Check

Wait until the distribution status is `Deployed`, then:

```bash
curl -sI "https://www.nicharalambous.com/this-page-does-not-exist-seo-audit"
curl -s "https://www.nicharalambous.com/this-page-does-not-exist-seo-audit" | grep -F "Page not found"

curl -sI "https://www.nicharalambous.com/decision-trackr"
curl -s "https://www.nicharalambous.com/decision-trackr" | grep -F "decisiontrackr.com/pricing/"
curl -sI "https://www.nicharalambous.com/decision-trackr/"
curl -sI "https://www.nicharalambous.com/decision-trackr/privacy"
curl -s "https://www.nicharalambous.com/decision-trackr/privacy" | grep -F "decisiontrackr.com/privacy/"
curl -sI "https://www.nicharalambous.com/about"
```

Expect:

- The missing path: `HTTP/2 404`, `content-type: text/html`, and a body that contains `Page not found`. It must not be `AccessDenied` XML.
- Decision Trackr pricing and privacy: `HTTP/2 200`, and a body that still points at `decisiontrackr.com`. They must not show the site 404 page.
- `/about`: still `HTTP/2 200`.

## Rollback

Use the file saved before the update. Fetch a new ETag first. The ETag from the apply step is stale after `update-distribution`.

```bash
NEW_ETAG=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query 'ETag' --output text)

python3 << 'PY'
import json, os
home = os.environ["HOME"]
src = os.path.join(home, "cf-404-backup", "distribution-config.rollback.json")
with open(src) as f:
    payload = json.load(f)
out = os.path.join(home, "cf-404-backup", "distribution-config.rollback-body.json")
with open(out, "w") as f:
    json.dump(payload["DistributionConfig"], f)
print("Wrote", out)
PY

aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$NEW_ETAG" \
  --distribution-config "file://$HOME/cf-404-backup/distribution-config.rollback-body.json"

aws cloudfront wait distribution-deployed --id "$DIST_ID"
```

Then repeat the missing-path curl. It should be `403` and `AccessDenied` again, which is the previous behaviour. Repeat the Decision Trackr curls as well.

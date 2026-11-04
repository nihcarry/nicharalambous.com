# Infrastructure

## CloudFront Function: `cloudfront-url-rewrite.js`

Viewer-request function for distribution `E1ACQY3898IZF9`. Handles:

- Apex → www redirect (`nicharalambous.com` → `www.nicharalambous.com`)
- Exact-match redirects (old Squarespace URLs)
- Pattern redirect for dated blog URLs
- URL rewriting (extensionless paths → `.html`)

### Publish the function

The viewer-request function is already associated with distribution `E1ACQY3898IZF9`. Publishing a new version does not call `UpdateDistribution`. The association keeps pointing at the function name, and the new LIVE stage is what CloudFront runs.

`.github/workflows/deploy.yml` uploads the site and creates a cache invalidation. It does not publish this function unless the repository variable `CLOUDFRONT_PUBLISH_FUNCTION` is the string `true`. That variable stays unset until the deploy role has the IAM actions below. A failed publish must not be the normal result of every push to `main`.

The GitHub deploy role is `arn:aws:iam::962990061157:role/nicharalambous-com-github-deploy`. The workflow only calls S3 sync and `cloudfront:CreateInvalidation` with it. Publishing needs extra actions. These are an IAM change. Attach them to an operator user for the one-off publish, and to the deploy role only if you want the workflow to publish later:

- `cloudfront:GetDistributionConfig` (find the viewer-request function on `E1ACQY3898IZF9`)
- `cloudfront:DescribeFunction`
- `cloudfront:GetFunction`
- `cloudfront:UpdateFunction`
- `cloudfront:TestFunction`
- `cloudfront:PublishFunction`

CloudFront function APIs do not accept a function ARN in `Resource` for several of these actions. Scope the statement as tightly as IAM allows, which for these actions is often `"Resource": "*"`. Do not add `cloudfront:UpdateDistribution` or `cloudfront:CreateFunction`. The script refuses to create a function or change the distribution.

Run this with an operator profile, not from the GitHub job, until that policy is in place. Use region `us-east-1` (the script sets it). CloudFront's control plane is there even though the bucket is in `eu-central-1`.

```bash
export AWS_PROFILE=your-operator-profile
export AWS_REGION=us-east-1
npm run validate:redirects

# Read-only: writes a backup under ~/cf-function-backup/<timestamp>/ and prints the diff.
infra/publish-cloudfront-function.sh

# After you have read the diff. Updates DEVELOPMENT, runs TestFunction, then publishes LIVE.
infra/publish-cloudfront-function.sh --publish
```

Check:

```bash
curl -sI https://www.nicharalambous.com/keynotes/escaping-the-apathy-trap | head -n 15
curl -sI https://www.nicharalambous.com/meet-nic-haralambous | head -n 15
curl -sI https://www.nicharalambous.com/decision-trackr/privacy | head -n 15
curl -sI https://www.nicharalambous.com/about | head -n 15
```

Expect `301` to `/keynotes/output-paradox-reengage-teams`, `/about`, and `https://decisiontrackr.com/privacy/`. `/about` stays `200`.

Rollback uses the backup directory the script printed. It republishes that LIVE code. It does not use the repo file.

```bash
infra/publish-cloudfront-function.sh --rollback "$HOME/cf-function-backup/<timestamp>"
```

If DEVELOPMENT had unpublished edits, the script stops unless you pass `--overwrite-development`. Those edits are not in git. Read them before you overwrite them.

Once the IAM actions are on the deploy role, set the repository variable `CLOUDFRONT_PUBLISH_FUNCTION` to `true`. The workflow then publishes only when a push to `main` changes `infra/cloudfront-url-rewrite.js`, or when you run the workflow by hand and tick "Publish the CloudFront URL rewrite function". Sanity rebuilds do not publish it. The site deploy job does not wait on this, and a publish failure does not roll the site back.

## Missing URLs (403 from S3)

A path that is not in the bucket comes back as S3 `403 AccessDenied`. The site 404 page is `404.html`, but CloudFront does not serve it for that error until the distribution has a custom error response. Steps, checks, and rollback: `cloudfront-404-custom-error.md`. Do not fold that change into the GitHub deploy.

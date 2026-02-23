# Infrastructure

## CloudFront Function: `cloudfront-url-rewrite.js`

Viewer-request function for distribution `E1ACQY3898IZF9`. Handles:

- Apex → www redirect (`nicharalambous.com` → `www.nicharalambous.com`)
- Exact-match redirects (old Squarespace URLs)
- Pattern redirect for dated blog URLs
- URL rewriting (extensionless paths → `.html`)

### Deploy to CloudFront

1. **AWS Console:** CloudFront → Functions → select the function associated with the distribution → Publish
2. **Or via CLI:** Create/update the function, then associate with the distribution's default cache behavior

```bash
# Get the current function config
aws cloudfront get-function --name <function-name> --query 'ETag'

# Update: AWS Console is simplest — edit the function code and Publish
```

The function is associated with the **viewer-request** event. After editing `cloudfront-url-rewrite.js`:

1. Run `npm run validate:redirects` — fails if any redirect source is a live app route
2. Copy the contents into the CloudFront console and publish

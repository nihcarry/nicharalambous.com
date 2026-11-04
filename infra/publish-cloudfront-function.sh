#!/usr/bin/env bash
# Publish infra/cloudfront-url-rewrite.js to the LIVE CloudFront Function
# already associated with distribution E1ACQY3898IZF9.
#
# This does not create a function and it does not call UpdateDistribution.
# Redirect targets come from the file. This script does not edit them.
#
# The GitHub deploy role is not granted the actions below unless you add
# them yourself. Do not point this at that role until infra/README.md says
# the repository variable may be turned on.
#
# Required IAM actions (an operator profile for the one-off, or the deploy
# role if you later enable the workflow):
#   cloudfront:GetDistributionConfig
#   cloudfront:DescribeFunction
#   cloudfront:GetFunction
#   cloudfront:UpdateFunction
#   cloudfront:TestFunction
#   cloudfront:PublishFunction
#
# Usage, from the repo root or from anywhere:
#   export AWS_PROFILE=your-operator-profile
#   npm run validate:redirects
#   infra/publish-cloudfront-function.sh
#   infra/publish-cloudfront-function.sh --publish
#   infra/publish-cloudfront-function.sh --rollback "$HOME/cf-function-backup/<timestamp>"
#
# The default (no flag) only reads AWS. It writes a backup and prints the diff.
# --publish updates the DEVELOPMENT stage, runs TestFunction, then publishes.
# If a test fails, DEVELOPMENT is put back and LIVE is left as it was.
#
# Environment:
#   AWS_PROFILE                 operator credentials (do not use the GitHub role until IAM is updated)
#   CLOUDFRONT_DISTRIBUTION_ID  default E1ACQY3898IZF9
#   CLOUDFRONT_FUNCTION_NAME    skip discovery when you already know the name
#   CF_FUNCTION_BACKUP_ROOT     default $HOME/cf-function-backup

set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
FILE="$ROOT/infra/cloudfront-url-rewrite.js"
DIST_ID="${CLOUDFRONT_DISTRIBUTION_ID:-E1ACQY3898IZF9}"
BACKUP_ROOT="${CF_FUNCTION_BACKUP_ROOT:-$HOME/cf-function-backup}"
REGION="us-east-1"
MODE="plan"
OVERWRITE_DEV=0
ROLLBACK_DIR=""
restore_needed=0
UPDATED_ETAG=""
FUNC_NAME=""
BACKUP=""

usage() {
  awk 'NR>1 && /^[^#]/ { exit } NR>1 { sub(/^# ?/, ""); print }' "${BASH_SOURCE[0]}"
}

while [ $# -gt 0 ]; do
  case "$1" in
    --publish) MODE="publish" ;;
    --rollback)
      MODE="rollback"
      ROLLBACK_DIR="${2:-}"
      if [ -z "$ROLLBACK_DIR" ]; then
        echo "Missing backup directory after --rollback" >&2
        exit 1
      fi
      shift
      ;;
    --overwrite-development) OVERWRITE_DEV=1 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

if [ "$MODE" = "publish" ] && [ -n "$ROLLBACK_DIR" ]; then
  echo "Use either --publish or --rollback, not both." >&2
  exit 1
fi

for cmd in aws python3 curl; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Required command not found: $cmd" >&2
    exit 1
  fi
done

if [ ! -f "$FILE" ]; then
  echo "Missing $FILE" >&2
  exit 1
fi

bytes="$(wc -c < "$FILE" | tr -d ' ')"
if [ "$bytes" -gt 10240 ]; then
  echo "Function file is ${bytes} bytes. CloudFront Functions must be 10 KB or smaller." >&2
  exit 1
fi
if grep -qF '?.' "$FILE"; then
  echo "Function file contains optional chaining. The published runtime rejected that syntax." >&2
  exit 1
fi

aws_cf() {
  aws cloudfront "$@" --region "$REGION"
}

die() {
  echo "$1" >&2
  exit 1
}

restore_development() {
  if [ "$restore_needed" != "1" ]; then
    return 0
  fi
  restore_needed=0
  echo "Putting the backup code back on the DEVELOPMENT stage. LIVE was not published."
  if [ -z "$UPDATED_ETAG" ] || [ -z "$BACKUP" ]; then
    echo "Cannot restore automatically. LIVE was not published. Backup: ${BACKUP:-unknown}" >&2
    return 1
  fi
  aws_cf update-function \
    --name "$FUNC_NAME" \
    --if-match "$UPDATED_ETAG" \
    --function-config "file://${BACKUP}/function-config.json" \
    --function-code "fileb://${BACKUP}/live.js" \
    > "${BACKUP}/restore-development.json" \
    || echo "Automatic restore failed. Update DEVELOPMENT by hand from ${BACKUP}/live.js. Do not publish the failed code." >&2
}

on_err() {
  local status=$?
  trap - ERR
  restore_development || true
  exit "$status"
}
trap on_err ERR

write_function_config() {
  local describe_json="$1"
  local out="$2"
  python3 - "$describe_json" "$out" << 'PY'
import json, sys
src, dest = sys.argv[1], sys.argv[2]
with open(src) as f:
    payload = json.load(f)
cfg = payload["FunctionSummary"]["FunctionConfig"]
kvs = cfg.get("KeyValueStoreAssociations") or {}
if not kvs.get("Quantity"):
    cfg.pop("KeyValueStoreAssociations", None)
with open(dest, "w") as f:
    json.dump(cfg, f)
print(cfg.get("Runtime", ""))
print(cfg.get("Comment", ""))
PY
}

discover_function() {
  if [ -n "${CLOUDFRONT_FUNCTION_NAME:-}" ]; then
    FUNC_NAME="$CLOUDFRONT_FUNCTION_NAME"
    echo "Using CLOUDFRONT_FUNCTION_NAME=$FUNC_NAME"
    return 0
  fi
  echo "Reading viewer-request function from distribution $DIST_ID"
  aws_cf get-distribution-config --id "$DIST_ID" > "$BACKUP/distribution-config.json"
  FUNC_NAME="$(python3 - "$BACKUP/distribution-config.json" << 'PY'
import json, sys
with open(sys.argv[1]) as f:
    payload = json.load(f)
cfg = payload["DistributionConfig"]
behaviours = [cfg["DefaultCacheBehavior"]]
behaviours += (cfg.get("CacheBehaviors") or {}).get("Items") or []
names = []
for behaviour in behaviours:
    associations = (behaviour.get("FunctionAssociations") or {}).get("Items") or []
    for item in associations:
        if item.get("EventType") != "viewer-request":
            continue
        arn = item.get("FunctionARN") or ""
        marker = ":function/"
        if marker not in arn:
            sys.exit("viewer-request association is not a CloudFront Function: " + arn)
        names.append(arn.split(marker, 1)[1])
unique = list(dict.fromkeys(names))
if len(unique) != 1:
    sys.stderr.write("Expected one viewer-request CloudFront Function, found: %s\n" % (unique or "(none)"))
    sys.exit(2)
print(unique[0])
PY
)"
  echo "Function name: $FUNC_NAME"
}

backup_live() {
  mkdir -p "$BACKUP"
  echo "Backing up LIVE to $BACKUP"
  aws_cf get-function --name "$FUNC_NAME" --stage LIVE "$BACKUP/live.js" > "$BACKUP/get-live.json"
  aws_cf describe-function --name "$FUNC_NAME" --stage LIVE > "$BACKUP/describe-live.json"
  aws_cf get-function --name "$FUNC_NAME" --stage DEVELOPMENT "$BACKUP/development.js" > "$BACKUP/get-development.json"
  aws_cf describe-function --name "$FUNC_NAME" --stage DEVELOPMENT > "$BACKUP/describe-development.json"
  write_function_config "$BACKUP/describe-live.json" "$BACKUP/function-config.json" > "$BACKUP/runtime.txt"
  cat > "$BACKUP/ROLLBACK.txt" << EOF
Rollback command (republishes this backup, not the repo file):

  $(basename "$0" >/dev/null; printf '%s' "$ROOT/infra/publish-cloudfront-function.sh") --rollback "$BACKUP"

Distribution: $DIST_ID
Function: $FUNC_NAME
Taken: $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
  echo "Wrote $BACKUP/ROLLBACK.txt"
}

assert_development_matches_live() {
  if cmp -s "$BACKUP/live.js" "$BACKUP/development.js"; then
    return 0
  fi
  if [ "$OVERWRITE_DEV" = "1" ]; then
    echo "DEVELOPMENT differs from LIVE. --overwrite-development is set, so the repo file will replace it."
    return 0
  fi
  die "DEVELOPMENT differs from LIVE. Someone has unpublished edits in the console. They are saved at $BACKUP/development.js. Re-run with --overwrite-development only after you have read that file. Nothing was published."
}

update_development_from() {
  local code_file="$1"
  local describe_json="${2:-$BACKUP/describe-development.json}"
  local etag
  etag="$(python3 - "$describe_json" << 'PY'
import json, sys
print(json.load(open(sys.argv[1]))["ETag"])
PY
)"
  aws_cf update-function \
    --name "$FUNC_NAME" \
    --if-match "$etag" \
    --function-config "file://${BACKUP}/function-config.json" \
    --function-code "fileb://${code_file}" \
    > "$BACKUP/update.json"
  UPDATED_ETAG="$(python3 - "$BACKUP/update.json" << 'PY'
import json, sys
print(json.load(open(sys.argv[1]))["ETag"])
PY
)"
  restore_needed=1
}

run_cases() {
  local cases_file="$1"
  local label="$2"
  python3 - "$cases_file" "$FILE" "$label" << 'PY'
import json, re, sys
dest, source, label = sys.argv[1], sys.argv[2], sys.argv[3]
cases = []
if label == "publish":
    text = open(source).read()
    match = re.search(r"var redirects = \{([^}]+)\}", text, re.S)
    if not match:
        sys.exit("Could not read the redirect map")
    for line in match.group(1).splitlines():
        found = re.match(r"\s*'([^']+)':\s*'([^']*)'", line)
        if found:
            cases.append({
                "kind": "redirect",
                "uri": found.group(1),
                "host": "www.nicharalambous.com",
                "accept": "text/html",
                "expect": found.group(2),
            })
    cases.extend([
        {"kind": "redirect", "uri": "/blog/2020/01/15/the-brutality-of-burnout", "host": "www.nicharalambous.com", "accept": "text/html", "expect": "/blog/the-brutality-of-burnout"},
        {"kind": "redirect", "uri": "/", "host": "nicharalambous.com", "accept": "text/html", "expect": "https://www.nicharalambous.com"},
        {"kind": "rewrite", "uri": "/about", "host": "www.nicharalambous.com", "accept": "text/html", "expect": "/about.html"},
        {"kind": "rewrite", "uri": "/_next/static/chunks/example.js", "host": "www.nicharalambous.com", "accept": "text/html", "expect": "/_next/static/chunks/example.js"},
        {"kind": "rewrite", "uri": "/decision-trackr", "host": "www.nicharalambous.com", "accept": "text/html", "expect": "/decision-trackr.html"},
    ])
else:
    # Smoke checks the backup must still pass. These are the behaviours
    # confirmed on the live site before this publish. The apathy-trap
    # redirect is intentionally absent: a rollback should restore the old code.
    cases.extend([
        {"kind": "redirect", "uri": "/meet-nic-haralambous", "host": "www.nicharalambous.com", "accept": "text/html", "expect": "/about"},
        {"kind": "redirect", "uri": "/blog/2020/01/15/the-brutality-of-burnout", "host": "www.nicharalambous.com", "accept": "text/html", "expect": "/blog/the-brutality-of-burnout"},
        {"kind": "redirect", "uri": "/", "host": "nicharalambous.com", "accept": "text/html", "expect": "https://www.nicharalambous.com"},
        {"kind": "rewrite", "uri": "/about", "host": "www.nicharalambous.com", "accept": "text/html", "expect": "/about.html"},
    ])
with open(dest, "w") as f:
    json.dump(cases, f)
print(len(cases))
PY
}

assert_test_output() {
  local result_json="$1"
  local kind="$2"
  local expect="$3"
  python3 - "$result_json" "$kind" "$expect" << 'PY'
import json, sys
path, kind, expect = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path) as f:
    payload = json.load(f)
result = payload.get("TestResult") or payload
message = (result.get("FunctionErrorMessage") or "").strip()
if message:
    sys.exit("TestFunction error: " + message)
util = int(result.get("ComputeUtilization") or 0)
if util > 80:
    sys.exit("Compute utilization %s is too high to publish" % util)
raw = result.get("FunctionOutput")
if not raw:
    sys.exit("TestFunction returned no FunctionOutput")
body = json.loads(raw)
if isinstance(body, dict) and isinstance(body.get("response"), dict) and "statusCode" not in body and "uri" not in body:
    body = body["response"]
if kind == "redirect":
    location = ((body.get("headers") or {}).get("location") or {}).get("value")
    if body.get("statusCode") != 301 or location != expect:
        sys.exit("Expected 301 %s, got %s %s" % (expect, body.get("statusCode"), location))
elif kind == "rewrite":
    if body.get("statusCode"):
        sys.exit("Expected a rewrite to %s, got status %s" % (expect, body.get("statusCode")))
    if body.get("uri") != expect:
        sys.exit("Expected uri %s, got %s" % (expect, body.get("uri")))
else:
    sys.exit("Unknown test kind " + kind)
print("ok utilization=%s" % util)
PY
}

test_development() {
  local label="$1"
  local cases_file="$BACKUP/cases.json"
  local count idx kind uri host accept expect
  count="$(run_cases "$cases_file" "$label")"
  echo "Running $count TestFunction cases ($label)"
  while IFS=$'\t' read -r idx kind uri host accept expect; do
    URI="$uri" HOST="$host" ACCEPT="$accept" python3 - << 'PY' > "$BACKUP/event.json"
import json, os
print(json.dumps({
    "version": "1.0",
    "context": {"eventType": "viewer-request"},
    "viewer": {"ip": "198.51.100.11"},
    "request": {
        "method": "GET",
        "uri": os.environ["URI"],
        "querystring": {},
        "headers": {
            "host": {"value": os.environ["HOST"]},
            "accept": {"value": os.environ["ACCEPT"]},
        },
        "cookies": {},
    },
}))
PY
    if ! aws_cf test-function \
      --name "$FUNC_NAME" \
      --if-match "$UPDATED_ETAG" \
      --stage DEVELOPMENT \
      --event-object "fileb://${BACKUP}/event.json" \
      > "$BACKUP/test-result.json"; then
      echo "TestFunction command failed for $uri" >&2
      return 1
    fi
    if ! assert_test_output "$BACKUP/test-result.json" "$kind" "$expect"; then
      echo "Case failed: $kind $uri" >&2
      return 1
    fi
    echo "  $kind $uri"
  done < <(python3 - "$cases_file" << 'PY'
import json, sys
cases = json.load(open(sys.argv[1]))
for i, case in enumerate(cases):
    print("\t".join([
        str(i),
        case["kind"],
        case["uri"],
        case["host"],
        case["accept"],
        case["expect"],
    ]))
PY
)
}

publish_live() {
  aws_cf publish-function \
    --name "$FUNC_NAME" \
    --if-match "$UPDATED_ETAG" \
    > "$BACKUP/publish.json"
  restore_needed=0
  echo "Published LIVE. ETag $(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["ETag"])' "$BACKUP/publish.json")"
}

verify_redirect() {
  local url="$1"
  local expect="$2"
  local attempt code loc
  for attempt in 1 2 3 4 5 6 7 8; do
    code="$(curl -sI -o "$BACKUP/live-headers.txt" -w "%{http_code}" --max-redirs 0 "$url" || true)"
    loc="$(grep -i '^location:' "$BACKUP/live-headers.txt" | head -n 1 | cut -d' ' -f2- | tr -d '\r' || true)"
    if [ "$code" = "301" ] && [ "$loc" = "$expect" ]; then
      echo "Live ok: $url -> $loc"
      return 0
    fi
    sleep 5
  done
  echo "Live check failed for $url (last status ${code:-none}, location ${loc:-none})." >&2
  echo "The function may still be propagating. Curl it again before you roll back." >&2
  echo "Rollback: $ROOT/infra/publish-cloudfront-function.sh --rollback $BACKUP" >&2
  return 1
}

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="${BACKUP_ROOT}/${STAMP}"

if [ "$MODE" = "rollback" ]; then
  ROLLBACK_DIR="$(cd "$ROLLBACK_DIR" && pwd)"
  [ -f "$ROLLBACK_DIR/live.js" ] || die "No live.js in $ROLLBACK_DIR"
  [ -f "$ROLLBACK_DIR/function-config.json" ] || die "No function-config.json in $ROLLBACK_DIR"
  [ -f "$ROLLBACK_DIR/describe-live.json" ] || die "No describe-live.json in $ROLLBACK_DIR"
  BACKUP="$ROLLBACK_DIR"
  FUNC_NAME="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["FunctionSummary"]["Name"])' "$BACKUP/describe-live.json")"
  echo "Rollback will republish $BACKUP/live.js as function $FUNC_NAME"
  # Fresh DEVELOPMENT etag. Keep the original describe-development.json in the backup.
  aws_cf describe-function --name "$FUNC_NAME" --stage DEVELOPMENT > "$BACKUP/describe-development-before-rollback.json"
  update_development_from "$BACKUP/live.js" "$BACKUP/describe-development-before-rollback.json"
  if ! test_development "rollback"; then
    trap - ERR
    restore_development
    die "Rollback tests failed. LIVE was not changed."
  fi
  publish_live
  echo "Rollback published. Check a known redirect:"
  verify_redirect "https://www.nicharalambous.com/meet-nic-haralambous" "/about"
  exit 0
fi

mkdir -p "$BACKUP"
discover_function
backup_live

if cmp -s "$BACKUP/live.js" "$FILE"; then
  echo "LIVE already matches $FILE. Nothing to publish."
  echo "Backup kept at $BACKUP"
  exit 0
fi

echo "LIVE differs from the repo file. Diff (backup first, repo second):"
diff -u "$BACKUP/live.js" "$FILE" || true

if [ "$MODE" = "plan" ]; then
  echo
  echo "No update was sent. Backup: $BACKUP"
  echo "To publish this file:"
  echo "  $ROOT/infra/publish-cloudfront-function.sh --publish"
  exit 0
fi

assert_development_matches_live
update_development_from "$FILE"
if ! test_development "publish"; then
  trap - ERR
  restore_development
  die "Tests failed. LIVE was not published. Backup: $BACKUP"
fi
publish_live
verify_redirect "https://www.nicharalambous.com/keynotes/escaping-the-apathy-trap" "/keynotes/output-paradox-reengage-teams"
verify_redirect "https://www.nicharalambous.com/meet-nic-haralambous" "/about"
verify_redirect "https://www.nicharalambous.com/decision-trackr/privacy" "https://decisiontrackr.com/privacy/"
echo "Published. Backup for rollback: $BACKUP"

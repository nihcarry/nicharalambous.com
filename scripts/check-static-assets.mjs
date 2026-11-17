/**
 * Fails if a local file referenced from the static export is missing.
 * Routes without a file extension are pages, not assets, and are skipped.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const OUT = "out";
const ASSET = /\.(?:css|js|mjs|map|woff2?|ttf|otf|png|jpe?g|gif|webp|svg|ico|avif|mp4|webm|pdf)(?:$)/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "studio") continue;
      walk(path, out);
    } else if (name.endsWith(".html") || name.endsWith(".css")) {
      out.push(path);
    }
  }
  return out;
}

function refs(text) {
  const found = [];
  const re = /(?:src|href)=["']([^"']+)["']|url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  let match;
  while ((match = re.exec(text))) found.push(match[1] || match[2]);
  return found;
}

function localAsset(raw) {
  if (!raw) return null;
  const clean = raw.split("#")[0].split("?")[0].trim();
  if (!clean || clean.startsWith("data:") || clean.startsWith("mailto:") || clean.startsWith("tel:") || clean.startsWith("javascript:")) {
    return null;
  }
  if (/^(?:https?:)?\/\//i.test(clean)) return null;
  if (!ASSET.test(clean)) return null;
  return clean;
}

if (!statSync(OUT, { throwIfNoEntry: false })) {
  console.error("No out/ directory. Build first.");
  process.exit(1);
}

const missing = [];
for (const file of walk(OUT)) {
  for (const raw of refs(readFileSync(file, "utf8"))) {
    const asset = localAsset(raw);
    if (!asset) continue;
    let decoded = asset;
    try {
      decoded = decodeURIComponent(asset);
    } catch {
      decoded = asset;
    }
    const target = decoded.startsWith("/") ? join(OUT, decoded) : resolve(dirname(file), decoded);
    if (!existsSync(target)) missing.push(`${file}: ${raw}`);
  }
}

if (missing.length) {
  console.error(`Missing local assets (${missing.length})`);
  for (const line of missing.slice(0, 40)) console.error(`  ${line}`);
  process.exit(1);
}
console.log("OK: every local asset referenced from out/ exists.");

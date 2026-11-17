/**
 * Fails if a code-owned page still shows a TBC or a build note.
 * Blog and archive HTML is Sanity content and is skipped.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const MARKERS = [
  [/\bTBC\b/, "TBC"],
  [/design note/i, "Design note"],
  [/build note/i, "build note"],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "studio" || name === "_next" || name === "blog" || name === "archive") continue;
      walk(path, out);
    } else if (name.endsWith(".html")) out.push(path);
  }
  return out;
}

function visible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

if (!statSync(OUT, { throwIfNoEntry: false })) {
  console.error("No out/ directory. Build first.");
  process.exit(1);
}

const hits = [];
for (const file of walk(OUT)) {
  const text = visible(readFileSync(file, "utf8"));
  for (const [pattern, name] of MARKERS) {
    if (pattern.test(text)) hits.push(`${file}: ${name}`);
  }
}

if (hits.length) {
  console.error(`TBC or build notes on rendered pages (${hits.length})`);
  for (const line of hits) console.error(`  ${line}`);
  process.exit(1);
}
console.log("OK: no TBC or build notes on code-owned pages.");

/**
 * Nic asked for the hanging eyebrow labels to stay gone.
 * Fails if a page reintroduces the eyebrow style or the keynote-version label.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components"];
const BANNED = [
  /className=["'`][^"'`]*\beyebrow\b/,
  /\.eyebrow\b/,
  /Want the Keynote Version/i,
  /WANT THE KEYNOTE/,
];

function filesIn(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      filesIn(path, out);
    } else if (/\.(tsx|css)$/.test(name)) {
      out.push(path);
    }
  }
  return out;
}

const failures = [];
for (const root of ROOTS) {
  for (const file of filesIn(root)) {
    const text = readFileSync(file, "utf8");
    for (const pattern of BANNED) {
      if (pattern.test(text)) failures.push(`${file} matches ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error("Eyebrow labels must not come back:");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("OK: no eyebrow labels.");

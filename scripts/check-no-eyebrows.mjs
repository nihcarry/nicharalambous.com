/**
 * Nic asked for the hanging eyebrow labels to stay gone.
 * Fails if a page reintroduces the eyebrow style, a keynote-version label,
 * or a small mono / uppercase label sitting above a heading, list or card.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components"];
const BANNED = [
  /className=["'`][^"'`]*\beyebrow\b/,
  /\.eyebrow\b/,
  /section-kicker/,
  /Want the Keynote Version/i,
  /WANT THE KEYNOTE/,
  /Teams and stages I have spoken to/,
];

const NEXT_BLOCK = "h[1-3]|ul|ol|LogoStrip|a|div";
const MONO_ABOVE = new RegExp(
  `<span[^>]*className=["'\`][^"'\`]*\\bmono\\b[^"'\`]*["'\`][^>]*>\\s*([^<{][^<]*?)\\s*<\\/span>\\s*<(?:${NEXT_BLOCK})\\b`,
  "g",
);
const UPPER_ABOVE = new RegExp(
  `<(?:p|span)[^>]*className=["'\`][^"'\`]*(?:uppercase|tracking-widest|tracking-wider)[^"'\`]*["'\`][^>]*>\\s*([^<{][^<]*?)\\s*<\\/(?:p|span)>\\s*<(?:h[1-3]|ul|ol)\\b`,
  "g",
);

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

function isNumericLabel(value) {
  return /^[\d€$]+$/.test(value.replace(/\s/g, ""));
}

const failures = [];
for (const root of ROOTS) {
  for (const file of filesIn(root)) {
    const text = readFileSync(file, "utf8");
    for (const pattern of BANNED) {
      if (pattern.test(text)) failures.push(`${file} matches ${pattern}`);
    }
    if (!file.endsWith(".tsx")) continue;
    for (const pattern of [MONO_ABOVE, UPPER_ABOVE]) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text))) {
        const label = match[1].replace(/\s+/g, " ").trim();
        if (!label || isNumericLabel(label) || label.includes("{")) continue;
        failures.push(`${file} has a hanging label above a heading, list or card: ${label}`);
      }
    }
  }
}

if (failures.length) {
  console.error("Eyebrow labels must not come back:");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("OK: no eyebrow labels.");

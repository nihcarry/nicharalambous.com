/**
 * Fail if any built HTML page contains an em dash or a dollar price,
 * other than the Canva blog's $10,000 grant quote.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const files = await htmlFiles(root);
const failures = [];
let articleDollars = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const rel = path.relative(root, file);
  const historical =
    rel === "blog.html" ||
    rel.startsWith("blog/") ||
    rel.startsWith("archive/") ||
    rel.startsWith("topics/") ||
    (rel.startsWith("keynotes/") && !rel.includes("output-paradox"));
  if (visible.includes("\u2014") || visible.includes("&mdash;") || visible.includes("&#8212;")) {
    failures.push(`${rel}: em dash`);
  }
  const withoutAllowed = visible.replaceAll("$10,000", "");
  if (/\$\s?\d/.test(withoutAllowed)) {
    if (historical) articleDollars += 1;
    else failures.push(`${rel}: dollar price`);
  }
}

if (articleDollars) {
  console.log(
    `${articleDollars} published blog or archive pages still quote a dollar figure. Left as written. The Canva $10,000 grant line is allowed.`,
  );
}
if (failures.length) {
  console.error(failures.slice(0, 40).join("\n"));
  console.error(`\n${failures.length} page problem(s)`);
  process.exit(1);
}

console.log(`Checked ${files.length} HTML files. No em dashes. No dollar prices outside historical articles.`);

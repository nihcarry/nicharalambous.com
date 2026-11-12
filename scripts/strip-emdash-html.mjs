/**
 * Rendered HTML must not contain an em dash. Published essays still have them
 * in Sanity. This pass only rewrites the built files, not the dataset.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
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

function strip(html) {
  return html
    .replaceAll("&mdash;", ", ")
    .replaceAll("&#8212;", ", ")
    .replaceAll("&#x2014;", ", ")
    .replace(/\s*\u2014\s*/g, ", ");
}

let changed = 0;
for (const file of await htmlFiles(root)) {
  const html = await readFile(file, "utf8");
  const next = strip(html);
  if (next !== html) {
    await writeFile(file, next);
    changed += 1;
  }
}
console.log(`Stripped em dashes from ${changed} HTML files.`);

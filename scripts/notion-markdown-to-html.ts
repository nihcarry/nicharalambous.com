/**
 * Convert Notion-style Markdown to HTML for Sanity rawHtmlBody.
 * Used by the Notion-to-blog skill. No content change — format only.
 *
 * Usage:
 *   npx tsx scripts/notion-markdown-to-html.ts < content.md
 *   npx tsx scripts/notion-markdown-to-html.ts path/to/file.md
 */

import * as fs from "fs";
import * as path from "path";

async function main(): Promise<void> {
  const { marked } = await import("marked");

  let md: string;
  if (process.argv[2]) {
    const p = path.resolve(process.argv[2]);
    if (!fs.existsSync(p)) {
      console.error("File not found:", p);
      process.exit(1);
    }
    md = fs.readFileSync(p, "utf-8");
  } else {
    md = await readStdin();
  }

  if (!md || !md.trim()) {
    console.error("No Markdown to convert. Provide via stdin or file path.");
    process.exit(1);
  }

  // Sanity/site expects semantic HTML; marked outputs sensible defaults
  const html = await marked.parse(md);
  process.stdout.write(typeof html === "string" ? html : String(html));
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

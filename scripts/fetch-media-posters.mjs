/**
 * Save YouTube thumbnails from data/media-coverage.json into
 * public/media/posters so the media page does not request a third party.
 * No Notion or Sanity credentials.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readFileSync } from "node:fs";

const root = process.cwd();
const raw = JSON.parse(readFileSync(path.join(root, "data/media-coverage.json"), "utf8"));
const dir = path.join(root, "public/media/posters");
await mkdir(dir, { recursive: true });

let saved = 0;
for (const item of raw.items || []) {
  const url = item.thumbnailUrl;
  if (!url) continue;
  const match = String(url).match(/\/vi\/([^/]+)\//);
  if (!match) {
    console.warn("Skipped, no video id:", item.title);
    continue;
  }
  const file = path.join(dir, `${match[1]}.jpg`);
  const response = await fetch(url);
  if (!response.ok) {
    console.warn("Skipped, download failed:", match[1], response.status);
    continue;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 500) {
    console.warn("Skipped, file too small:", match[1]);
    continue;
  }
  await writeFile(file, bytes);
  saved += 1;
}

console.log(`Saved ${saved} posters to public/media/posters`);

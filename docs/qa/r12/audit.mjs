/**
 * Responsive audit for one page per template.
 * Run from the repo root against the static preview:
 *   node docs/qa/r12/audit.mjs
 *   node docs/qa/r12/audit.mjs --out docs/qa/r12/after.json
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const outFlag = process.argv.indexOf("--out");
const outPath = outFlag >= 0 ? process.argv[outFlag + 1] : "docs/qa/r12/before.json";

const pages = [
  ["home", "/"],
  ["about", "/about"],
  ["media", "/media"],
  ["blog", "/blog"],
  ["article", "/blog/10-things-i-learned-from-casey-neistat-s-daily-vlog"],
  ["topic", "/topics/ai"],
  ["book", "/books/do-fail-learn-repeat"],
  ["keynote", "/keynotes/output-paradox-reengage-teams"],
  ["session", "/session"],
  ["building", "/building"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
];
const widths = [360, 390, 768];

function summarise(findings) {
  const lines = [];
  for (const row of findings) {
    const bits = [];
    if (row.overflow.length) bits.push(`overflow ${row.overflow.length}`);
    if (row.taps.length) bits.push(`taps ${row.taps.length}`);
    if (row.type.length) bits.push(`type ${row.type.length}`);
    if (row.images.length) bits.push(`images ${row.images.length}`);
    lines.push(`${row.page} @ ${row.width}: ${bits.length ? bits.join(", ") : "clean"}`);
  }
  return lines.join("\n");
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const findings = [];

for (const [name, path] of pages) {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    const status = response?.status() ?? 0;
    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const describe = (el) => {
        const id = el.id ? `#${el.id}` : "";
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
            : "";
        return `${el.tagName.toLowerCase()}${id}${cls}`;
      };

      const scroll = document.documentElement.scrollWidth - vw;
      const overflowNodes = scroll > 1
        ? [...document.querySelectorAll("body *")].filter((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 1 || rect.height < 1) return false;
            return rect.right > vw + 1 || rect.left < -1;
          })
        : [];
      const overflow = overflowNodes
        .filter((el) => ![...el.children].some((child) => overflowNodes.includes(child)))
        .slice(0, 8)
        .map(describe);

      const proseSelector = ".prose-col a, .archive-body a, .prose-imported a, .story a";
      const taps = [];
      for (const el of document.querySelectorAll("a, button, input, select, textarea")) {
        if (el.matches(proseSelector) && el.tagName === "A" && !el.classList.contains("btn")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) continue;
        if (rect.top < 0 || rect.bottom <= 0) continue;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") continue;
        if (el.classList.contains("hp") || el.closest(".hp")) continue;
        if (el.getAttribute("type") === "hidden" || el.tabIndex === -1) continue;
        if (rect.width < 44 || rect.height < 44) {
          taps.push({ name: describe(el), w: Math.round(rect.width), h: Math.round(rect.height) });
        }
      }

      const type = [];
      const seenType = new Set();
      for (const el of document.querySelectorAll("body *")) {
        if (!el.childNodes.length) continue;
        const text = [...el.childNodes]
          .filter((node) => node.nodeType === 3)
          .map((node) => node.textContent.trim())
          .join("");
        if (!text || /^[▾▴›·]+$/.test(text)) continue;
        if (el.classList.contains("caret")) continue;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const size = parseFloat(style.fontSize);
        if (size >= 14) continue;
        const key = `${describe(el)} ${size}`;
        if (seenType.has(key)) continue;
        seenType.add(key);
        type.push(`${describe(el)} ${size}px`);
      }

      const images = [];
      for (const img of document.querySelectorAll("img")) {
        const rect = img.getBoundingClientRect();
        if (rect.width < 1) continue;
        const parent = img.parentElement?.getBoundingClientRect();
        const widerThanParent = parent && rect.width > parent.width + 1;
        const widerThanViewport = rect.width > vw + 1;
        if (widerThanParent || widerThanViewport) {
          images.push(
            `${describe(img)} ${Math.round(rect.width)}px${widerThanViewport ? " > viewport" : ""}${widerThanParent ? " > parent" : ""}`,
          );
        }
      }

      return {
        scroll,
        overflow,
        taps,
        tapCount: taps.length,
        type: type.slice(0, 12),
        typeCount: type.length,
        images: images.slice(0, 8),
      };
    });
    findings.push({ page: name, path, width, status, ...report });
    await page.close();
  }
}

await browser.close();
writeFileSync(outPath, JSON.stringify(findings, null, 2));
console.log(summarise(findings));
console.log(`wrote ${outPath}`);

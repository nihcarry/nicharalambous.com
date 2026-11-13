/**
 * Reshoot the r15 testimonial section after webfonts have swapped in.
 *
 *   node scripts/preview-static.mjs --skip-build --port 4173
 *   node scripts/shoot-r15.mjs
 *
 * The closed state used to be captured on DOMContentLoaded, while Unbounded
 * and Geist were still showing their Arial fallbacks. Every shot now waits
 * for document.fonts.ready and a short settle.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const shotDir = path.join(root, "docs/qa/r15");
const base = process.env.BASE || "http://127.0.0.1:4173";

const pages = [
  ["home", "/"],
  ["output-paradox", "/keynotes/output-paradox-reengage-teams"],
  ["session", "/session"],
];
const widths = [1440, 360];

function faceReport(faces, family, weight) {
  return faces
    .filter((face) => face.family === family && (weight == null || face.weight === weight))
    .map((face) => face.status);
}

async function fontState(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 250));
    const h2 = document.querySelector("#what-people-say h2");
    const card = document.querySelector("#what-people-say .say-card p");
    const faces = [...document.fonts].map((face) => ({
      family: face.family,
      weight: face.weight,
      status: face.status,
    }));
    const check = (spec) => document.fonts.check(spec);
    return {
      h2: h2 ? getComputedStyle(h2).fontFamily : null,
      card: card ? getComputedStyle(card).fontFamily : null,
      checks: {
        "1em Unbounded": check("1em Unbounded"),
        "1em Geist": check("1em Geist"),
        "700 1em unbounded": check("700 1em unbounded"),
        '400 17px "NH Geist"': check('400 17px "NH Geist"'),
      },
      faces,
    };
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
await mkdir(shotDir, { recursive: true });
const rows = [];

try {
  for (const [name, route] of pages) {
    for (const width of widths) {
      const height = width === 360 ? 800 : 900;
      for (const consent of [false, true]) {
        const context = await browser.newContext({ viewport: { width, height } });
        if (consent) {
          await context.addInitScript(() => {
            localStorage.setItem(
              "nh-consent",
              JSON.stringify({ choice: "accepted", expiresAt: Date.now() + 15552000000 }),
            );
          });
        }
        const page = await context.newPage();
        await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.locator("#what-people-say").waitFor();
        const state = await fontState(page);
        const unbounded700 = faceReport(state.faces, "unbounded", "700");
        const geist = faceReport(state.faces, "NH Geist");
        if (!unbounded700.includes("loaded") || !geist.includes("loaded")) {
          throw new Error(
            `${name} ${width} ${consent ? "consent" : "no-consent"} fonts not ready: unbounded 700 ${unbounded700.join(",") || "missing"}, NH Geist ${geist.join(",") || "missing"}`,
          );
        }
        const label = consent ? "consent" : "no-consent";
        const file = `${name}-${width}-${label}.png`;
        if (!consent) {
          await page.locator("#what-people-say .tt-more").waitFor();
          await page.locator("#what-people-say").screenshot({ path: path.join(shotDir, file) });
        } else {
          await page.locator("#what-people-say iframe").waitFor({ state: "attached" });
          await page.evaluate(() => {
            document.documentElement.style.scrollBehavior = "auto";
            const wall = document.querySelector("#what-people-say .tt-wall");
            window.scrollTo(0, Math.max(0, wall.getBoundingClientRect().top + window.scrollY - 80));
          });
          let frame = null;
          for (let i = 0; i < 40 && !frame; i += 1) {
            frame = page.frames().find((item) => item.url().includes("testimonial.to"));
            if (!frame) await page.waitForTimeout(250);
          }
          if (!frame) throw new Error(`no testimonial frame for ${file}`);
          await frame.waitForFunction(
            () => {
              const text = document.body && document.body.innerText;
              return typeof text === "string" && text.length > 40;
            },
            null,
            { timeout: 20000 },
          );
          await page.waitForTimeout(400);
          await page.evaluate(() => {
            document.documentElement.style.scrollBehavior = "auto";
            const section = document.getElementById("what-people-say");
            const wall = section.querySelector(".tt-wall");
            const nav = window.innerWidth < 700 ? 64 : 90;
            const y =
              window.innerWidth >= 1000
                ? section.getBoundingClientRect().top + window.scrollY - nav
                : wall.getBoundingClientRect().top + window.scrollY - 240;
            window.scrollTo(0, Math.max(0, y));
          });
          await page.screenshot({ path: path.join(shotDir, file) });
        }
        rows.push({
          file,
          route,
          width,
          consent: label,
          h2: state.h2,
          card: state.card,
          checks: state.checks,
          unbounded700,
          geist: geist.includes("loaded") ? "loaded" : geist.join(",") || "missing",
        });
        console.log(
          file,
          "Unbounded",
          state.checks["1em Unbounded"],
          "Geist",
          state.checks["1em Geist"],
          "unbounded700",
          unbounded700.join(","),
          "NH Geist",
          rows.at(-1).geist,
        );
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

const lines = [
  "# r15 screenshots",
  "",
  "Native quote cards in the cream \"What people say\" section. No-consent shots are the whole section. Consent shots are the viewport, scrolled so the cards and the top of the wall are both in frame.",
  "",
  "Each shot waits for `document.fonts.ready` and 250ms. The H2 family is `unbounded` (next/font's name for Unbounded). Card text is `NH Geist`. `document.fonts.check('1em Unbounded')` is false because that exact family name is not registered. `document.fonts.check('1em Geist')` is not the face the cards use.",
  "",
];
for (const row of rows) {
  lines.push(`- ${row.route} at ${row.width}, ${row.consent}: docs/qa/r15/${row.file}`);
  lines.push(`  - H2: \`${row.h2}\`. unbounded 700: ${row.unbounded700.join(", ")}. check('1em Unbounded') ${row.checks["1em Unbounded"]}. check('700 1em unbounded') ${row.checks["700 1em unbounded"]}.`);
  lines.push(`  - Card: \`${row.card}\`. NH Geist: ${row.geist}. check('1em Geist') ${row.checks["1em Geist"]}. check('400 17px \"NH Geist\"') ${row.checks['400 17px "NH Geist"']}.`);
}
lines.push("");
await writeFile(path.join(shotDir, "INDEX.md"), lines.join("\n"));
console.log("wrote", path.join(shotDir, "INDEX.md"));

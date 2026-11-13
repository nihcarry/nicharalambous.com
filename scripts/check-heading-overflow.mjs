/**
 * Fails when a main template overflows horizontally, or when any heading
 * word is wider than its own box. Also checks the home H1 stays within
 * five lines at 360px, and that Unbounded is self-hosted as woff2 with
 * only the hero weight (800) preloaded.
 *
 *   npm run build
 *   npm run check:overflow
 */
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "out");
const shotDir = path.join(root, "docs/qa/r14");
const port = 4173;
const base = `http://127.0.0.1:${port}`;

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function htmlSlug(dir, preferred) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((name) => name.endsWith(".html") && name !== "index.html");
  if (files.length === 0) return null;
  const ranked = [...files].sort((a, b) => {
    const score = (name) => {
      const html = readFileSync(path.join(dir, name), "utf8");
      if (/<h[1-6][^>]*>[^<]{0,240}(Accountability|entrepreneurship)/i.test(html)) return 0;
      if (name === preferred) return 1;
      return 2;
    };
    return score(a) - score(b);
  });
  return ranked[0].replace(/\.html$/, "");
}

function fontFaces(css) {
  const faces = [];
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@font-face", i);
    if (at === -1) break;
    const brace = css.indexOf("{", at);
    if (brace === -1) break;
    let depth = 0;
    let j = brace;
    for (; j < css.length; j++) {
      if (css[j] === "{") depth += 1;
      else if (css[j] === "}") {
        depth -= 1;
        if (depth === 0) {
          j += 1;
          break;
        }
      }
    }
    const block = css.slice(brace + 1, j - 1);
    const family = block.match(/font-family:\s*([^;]+)/)?.[1]?.replace(/["']/g, "").trim();
    const weight = block.match(/font-weight:\s*([^;]+)/)?.[1]?.trim();
    const display = block.match(/font-display:\s*([^;]+)/)?.[1]?.trim();
    const urls = [...block.matchAll(/url\(([^)]+)\)/g)].map((match) =>
      match[1].replace(/["']/g, "").trim().split("?")[0],
    );
    if (family) faces.push({ family, weight, display, urls });
    i = j;
  }
  return faces;
}

function assertFonts(problems) {
  const source = ["app", "components", "scripts/inline-critical-css.mjs"]
    .flatMap((entry) => {
      const full = path.join(root, entry);
      if (!existsSync(full)) return [];
      return statSync(full).isDirectory() ? walk(full) : [full];
    })
    .filter((file) => /\.(tsx|css|mjs)$/.test(file));
  for (const file of source) {
    const text = readFileSync(file, "utf8");
    if (/Bricolage|font-bricolage/i.test(text)) {
      problems.push(`Bricolage still referenced in ${path.relative(root, file)}`);
    }
  }

  const css = walk(path.join(outDir, "_next"))
    .filter((file) => file.endsWith(".css"))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  if (/Bricolage/i.test(css)) problems.push("built CSS still names Bricolage");
  const faces = fontFaces(css);
  const byFamily = new Map();
  for (const face of faces) {
    const list = byFamily.get(face.family) || [];
    list.push(face);
    byFamily.set(face.family, list);
  }
  const unbounded = [...byFamily.values()].find((list) => {
    const weights = new Set(list.map((face) => face.weight));
    return weights.has("600") && weights.has("700") && weights.has("800") && weights.size === 3;
  });
  if (!unbounded) {
    problems.push("Unbounded woff2 faces for weights 600, 700 and 800 were not found");
    return { heroUrls: [] };
  }
  for (const face of unbounded) {
    if (face.display !== "swap") problems.push(`Unbounded ${face.weight} is not font-display: swap`);
    if (!face.urls.some((url) => url.endsWith(".woff2"))) {
      problems.push(`Unbounded ${face.weight} is not a woff2 file`);
    }
  }
  const heroUrls = unbounded.filter((face) => face.weight === "800").flatMap((face) => face.urls);
  const html = walk(outDir)
    .filter((file) => file.endsWith(".html"))
    .slice(0, 8)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  const preloads = [...html.matchAll(/<link\b[^>]*rel="preload"[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => /as="font"/.test(tag))
    .map((tag) => tag.match(/\bhref="([^"]+)"/)?.[1]?.split("?")[0])
    .filter(Boolean);
  const unique = [...new Set(preloads)];
  if (unique.length === 0) problems.push("no font preload in the built HTML");
  for (const href of unique) {
    const matchesHero = heroUrls.some((url) => href === url || href.endsWith(url) || url.endsWith(href));
    if (!matchesHero) problems.push(`font preload is not Unbounded 800: ${href}`);
  }
  if (!unique.some((href) => heroUrls.some((url) => href.endsWith(url) || url.endsWith(href)))) {
    problems.push("Unbounded 800 is not preloaded");
  }
  return { heroUrls, preloads: unique };
}

function pages() {
  const article = htmlSlug(path.join(outDir, "blog"), "10-things-i-learned-from-casey-neistat-s-daily-vlog.html");
  const archive = htmlSlug(path.join(outDir, "archive"), "everyone-can-build-their-own-apps.html");
  const list = [
    ["home", "/"],
    ["about", "/about"],
    ["media", "/media"],
    ["blog", "/blog"],
    ["article", article ? `/blog/${article}` : null],
    ["archive", archive ? `/archive/${archive}` : null],
    ["topic", "/topics/entrepreneurship"],
    ["book", "/books/do-fail-learn-repeat"],
    ["output-paradox", "/keynotes/output-paradox-reengage-teams"],
    ["session", "/session"],
    ["building", "/building"],
    ["contact", "/contact"],
  ];
  return list;
}

async function startServer() {
  const child = spawn("node", ["scripts/preview-static.mjs", "--skip-build", "--port", String(port)], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const ready = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("preview server did not start")), 20000);
    const onData = (chunk) => {
      if (String(chunk).includes("Static site:")) {
        clearTimeout(timer);
        resolve();
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`preview server exited ${code}`));
    });
  });
  await ready;
  return child;
}

async function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const pageOverflow = doc.scrollWidth - doc.clientWidth;
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;top:0;white-space:nowrap;visibility:hidden;pointer-events:none;";
    document.body.appendChild(probe);
    const words = [];
    for (const heading of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      const cs = getComputedStyle(heading);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const rect = heading.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      const pad = Number.parseFloat(cs.paddingLeft) + Number.parseFloat(cs.paddingRight);
      const content = heading.clientWidth - pad;
      if (content < 2) continue;
      probe.style.font = cs.font;
      probe.style.letterSpacing = cs.letterSpacing;
      probe.style.fontKerning = cs.fontKerning;
      probe.style.fontFeatureSettings = cs.fontFeatureSettings;
      probe.style.fontVariationSettings = cs.fontVariationSettings;
      probe.style.textTransform = cs.textTransform;
      const text = (heading.innerText || "").replace(/\s+/g, " ").trim();
      for (const word of text.split(" ").filter(Boolean)) {
        probe.textContent = word;
        const width = probe.getBoundingClientRect().width;
        if (width > content + 1) {
          words.push({
            word,
            width: Math.round(width),
            content: Math.round(content),
            tag: heading.tagName.toLowerCase(),
            text: text.slice(0, 90),
          });
        }
      }
    }
    probe.remove();
    const home = document.querySelector(".hero.home h1");
    let homeLines = null;
    let homeSize = null;
    if (home) {
      const range = document.createRange();
      range.selectNodeContents(home);
      const tops = [];
      for (const rect of range.getClientRects()) {
        if (rect.width < 1) continue;
        if (!tops.length || Math.abs(tops[tops.length - 1] - rect.top) > 1) tops.push(rect.top);
      }
      homeLines = tops.length;
      homeSize = getComputedStyle(home).fontSize;
    }
    const h1 = document.querySelector("h1");
    const h2 = document.querySelector("h2");
    const sample = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        size: cs.fontSize,
        family: cs.fontFamily,
        tracking: cs.letterSpacing,
        lineHeight: cs.lineHeight,
        weight: cs.fontWeight,
      };
    };
    return { pageOverflow, words, homeLines, homeSize, h1: sample(h1), h2: sample(h2) };
  });
}

const problems = [];
if (!existsSync(outDir)) {
  console.error("No out/ directory. Run npm run build first.");
  process.exit(1);
}
const fontReport = assertFonts(problems);
const routes = pages();
for (const [name, route] of routes) {
  if (!route) problems.push(`${name} template was not in the static export`);
}

const server = await startServer();
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const shots = [];
const summary = [];

try {
  for (const [name, route] of routes) {
    if (!route) continue;
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: width === 360 ? 800 : 900 });
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      const status = response?.status() ?? 0;
      if (status >= 400) {
        problems.push(`${route} returned ${status} at ${width}`);
        continue;
      }
      await page.evaluate(() => document.fonts.ready);
      const result = await measure(page);
      summary.push({ name, route, width, ...result, words: result.words.length });
      if (result.pageOverflow > 1) {
        problems.push(`${name} overflows by ${result.pageOverflow}px at ${width}`);
      }
      for (const hit of result.words) {
        problems.push(
          `${name} ${hit.tag} word "${hit.word}" is ${hit.width}px in a ${hit.content}px box at ${width} (${hit.text})`,
        );
      }
      if (name === "home" && width === 360) {
        if (result.homeLines == null) problems.push("home H1 was not found at 360");
        else if (result.homeLines > 5) problems.push(`home H1 is ${result.homeLines} lines at 360 (max 5)`);
        const size = Number.parseFloat(result.homeSize || "0");
        if (size < 34 || size > 38) problems.push(`home H1 is ${result.homeSize} at 360, expected 34 to 38px`);
      }
    }
  }

  await mkdir(shotDir, { recursive: true });
  const captures = [
    ["home", routes.find(([name]) => name === "home")?.[1]],
    ["media", "/media"],
    ["article", routes.find(([name]) => name === "article")?.[1]],
    ["output-paradox", "/keynotes/output-paradox-reengage-teams"],
  ];
  for (const [name, route] of captures) {
    if (!route) continue;
    for (const width of [1440, 360]) {
      await page.setViewportSize({ width, height: width === 360 ? 800 : 900 });
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const file = `${name}-${width}.png`;
      const fullPage = name !== "media";
      await page.screenshot({ path: path.join(shotDir, file), fullPage });
      shots.push({ name, route, width, file });
    }
  }
  const lines = [
    "# r14 Unbounded headings",
    "",
    "Home, media, one article, and the Output Paradox page after switching display headings to self-hosted Unbounded. Media shots are the top of the page. The others are the full page.",
    "",
  ];
  for (const shot of shots) {
    lines.push(`- ${shot.route} at ${shot.width}: docs/qa/r14/${shot.file}`);
  }
  lines.push("");
  await writeFile(path.join(shotDir, "INDEX.md"), lines.join("\n"));
} finally {
  await browser.close();
  server.kill("SIGTERM");
}

console.log(JSON.stringify({ fonts: fontReport, summary, shots, problems }, null, 2));
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("Heading overflow check passed.");

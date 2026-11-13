import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = "/agent/repos/nicharalambous.com";
const outDir = path.join(root, "docs/qa/offer-stack");
const port = 4188;
const base = `http://127.0.0.1:${port}`;
const pages = [
  ["home", "/"],
  ["session", "/session"],
  ["output-paradox", "/keynotes/output-paradox-reengage-teams"],
  ["contact", "/contact"],
  ["workshops", "/workshops"],
  ["team-workshop", "/workshops/team-workflow-upgrade"],
  ["executive-workshop", "/workshops/executive-workflow-upgrade"],
  ["grok-week", "/workshops/my-week-with-grok-bot"],
];
const widths = [1440, 390];

const child = spawn("node", ["scripts/preview-static.mjs", "--skip-build", "--port", String(port)], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"],
});
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("preview did not start")), 20000);
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
    reject(new Error(`preview exited ${code}`));
  });
});

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const problems = [];
const lines = [
  "# Offer stack QA",
  "",
  "Full-page screenshots of the draft offer stack at 1440 and 390. Cookie banner dismissed. No horizontal overflow on these loads.",
  "",
  "Local preview, after `npm run build`:",
  "",
  "```",
  "npm run preview:static",
  "```",
  "",
  "There is no hosted preview. CI uploads a static-site artifact on the pull request and does not deploy.",
  "",
];

try {
  await page.addInitScript(() => {
    localStorage.setItem(
      "nh-consent",
      JSON.stringify({ choice: "rejected", expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30 }),
    );
  });
  for (const [name, route] of pages) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width >= 768 ? 900 : 800 });
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      const status = response?.status() ?? 0;
      if (status >= 400) problems.push(`${route} ${status} at ${width}`);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) problems.push(`${name} overflows by ${overflow}px at ${width}`);
      const file = `${name}-${width}.png`;
      await page.screenshot({ path: path.join(outDir, file), fullPage: true });
      lines.push(`- ${route} at ${width}px: docs/qa/offer-stack/${file}`);
    }
  }
} finally {
  await browser.close();
  child.kill("SIGTERM");
}

lines.push("");
if (problems.length) {
  lines.push("Problems:");
  for (const problem of problems) lines.push(`- ${problem}`);
} else {
  lines.push("No horizontal overflow on these screenshots.");
}
await writeFile(path.join(outDir, "INDEX.md"), lines.join("\n"));
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`Wrote ${pages.length * widths.length} screenshots`);

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = "/agent/repos/nicharalambous.com";
const outDir = path.join(root, "docs/qa/r22b");
const port = 4192;
const base = `http://127.0.0.1:${port}`;
const pages = [
  ["home", "/"],
  ["output-paradox", "/keynotes/output-paradox-reengage-teams"],
  ["workshops", "/workshops"],
  ["my-week", "/workshops/my-week-with-grok-bot"],
  ["team", "/workshops/team-workflow-upgrade"],
  ["exec", "/workshops/executive-workflow-upgrade"],
  ["coaching", "/coaching"],
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

try {
  await page.addInitScript(() => {
    localStorage.setItem(
      "nh-consent",
      JSON.stringify({ choice: "rejected", expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30 }),
    );
  });
  for (const [name, route] of pages) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      const status = response?.status() ?? 0;
      if (status >= 400) problems.push(`${route} ${status} at ${width}`);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 1) problems.push(`${name} overflows by ${overflow}px at ${width}`);
      await page.screenshot({ path: path.join(outDir, `${name}-${width}.png`), fullPage: true });
      console.log(`${name} ${width} overflow=${overflow}`);
    }
  }
} finally {
  await browser.close();
  child.kill("SIGTERM");
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("Wrote docs/qa/r22b");

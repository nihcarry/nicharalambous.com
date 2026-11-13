import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = "http://127.0.0.1:4173";
const pages = [
  ["home", "/index.html"],
  ["output-paradox", "/keynotes/output-paradox-reengage-teams.html"],
  ["contact", "/contact.html"],
  ["privacy", "/privacy.html"],
];
const widths = [360, 390, 768, 1024, 1440];
const out = "/opt/cursor/artifacts";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const problems = [];

for (const [name, path] of pages) {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    if (!response || response.status() >= 400) problems.push(`${path} ${width} status ${response?.status()}`);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    if (overflow > 1) problems.push(`${name} overflows by ${overflow}px at ${width}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${out}/${name}-desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${out}/${name}-mobile.png`, fullPage: true });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/index.html", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Coaching" }).click();
const nbs = page.getByRole("link", { name: "No Bull Ship (8 weeks)" });
const session = page.getByRole("link", { name: "1:1 coaching sessions" });
if ((await nbs.count()) < 1) problems.push("desktop coaching dropdown missing No Bull Ship");
if ((await session.count()) < 1) problems.push("desktop coaching dropdown missing 1:1 sessions");
await page.screenshot({ path: `${out}/nav-coaching-dropdown.png` });
await page.keyboard.press("Escape");

await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Open menu" }).click();
await page.getByRole("button", { name: "Coaching" }).click();
if ((await page.getByRole("link", { name: "1:1 coaching sessions" }).count()) < 1) {
  problems.push("mobile coaching group missing 1:1 sessions");
}
await page.screenshot({ path: `${out}/nav-coaching-mobile.png` });

await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("Screenshots saved. No horizontal overflow at 360, 390, 768, 1024, 1440.");

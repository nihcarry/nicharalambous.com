/**
 * Keep the first screen's CSS in the document, and start the rest of the
 * stylesheets, framework scripts, and below-fold images after load.
 * The painted design is unchanged once those files arrive. Shared CSS files
 * are not rewritten.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Critters = require("critters");
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

const critters = new Critters({
  path: root,
  publicPath: "/",
  preload: "media",
  fonts: false,
  inlineFonts: false,
  pruneSource: false,
  reduceInlineStyles: false,
  logLevel: "warn",
});

const loader = `<script>
(function(){
  var started=false;
  function start(){
    if(started)return;
    started=true;
    document.querySelectorAll("[data-nh-css]").forEach(function(node){
      var link=document.createElement("link");
      link.rel="stylesheet";
      link.href=node.getAttribute("data-nh-css");
      document.head.appendChild(link);
    });
    document.querySelectorAll("script[data-nh-src]").forEach(function(node){
      node.src=node.getAttribute("data-nh-src");
    });
    document.querySelectorAll("img[data-src]").forEach(function(img){
      img.src=img.getAttribute("data-src");
    });
  }
  try{
    var obs=new PerformanceObserver(function(){setTimeout(start,50);});
    obs.observe({type:"largest-contentful-paint",buffered:true});
  }catch(e){}
  setTimeout(start,2500);
})();
</script>`;

function extractMaxWidthMedia(css) {
  const blocks = [];
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@media", i);
    if (at === -1) break;
    const brace = css.indexOf("{", at);
    if (brace === -1) break;
    const header = css.slice(at, brace);
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
    if (/max-width/.test(header)) blocks.push(css.slice(at, j));
    i = j;
  }
  return blocks.join("");
}

async function withMobileLayout(html) {
  const hrefs = [...html.matchAll(/\bhref="(\/_next\/static\/css\/[^"]+\.css)"/g)].map((match) => match[1]);
  const dataHrefs = [...html.matchAll(/data-nh-css="([^"]+)"/g)].map((match) => match[1]);
  const files = [...new Set([...hrefs, ...dataHrefs])];
  let extra = "";
  for (const href of files) {
    const file = path.join(root, href.replace(/^\//, ""));
    try {
      extra += extractMaxWidthMedia(await readFile(file, "utf8"));
    } catch {
      // Stylesheet may not be on disk yet.
    }
  }
  if (!extra || html.includes("/* nh-mobile */")) return html;
  return html.replace("</style>", `/* nh-mobile */${extra}</style>`);
}

function deferPayload(html) {
  const sheets = new Set();
  html = html.replace(/<link\b[^>]*>/g, (tag) => {
    const href = tag.match(/\bhref="([^"]+\.css)"/);
    const isStyle =
      /rel="stylesheet"/.test(tag) ||
      (/rel="preload"/.test(tag) && /as="style"/.test(tag));
    if (href && isStyle) {
      sheets.add(href[1]);
      return "";
    }
    if (/rel="preload"/.test(tag) && /as="script"/.test(tag)) return "";
    return tag;
  });

  html = html.replace(/<script\b([^>]*?)\bsrc="([^"]+)"([^>]*)><\/script>/g, (_all, before, src, after) => {
    const attrs = `${before} ${after}`.replace(/\sasync\b/g, "").replace(/\s+/g, " ").trim();
    return `<script ${attrs} data-nh-src="${src}"></script>`;
  });

  html = html.replace(/<img\b([^>]*?)\sloading="lazy"([^>]*?)>/g, (tag) => {
    if (!/\ssrc="/.test(tag)) return tag;
    return tag.replace(/\ssrc="/, " data-src=\"");
  });

  const placeholders = [...sheets]
    .map((href) => `<link data-nh-css="${href}">`)
    .join("");
  if (!html.includes("data-nh-css") && placeholders) {
    html = html.replace("</head>", `${placeholders}${loader}</head>`);
  } else if (!html.includes("window.addEventListener(\"load\"")) {
    html = html.replace("</head>", `${loader}</head>`);
  }
  return html;
}

function fontFaceBlocks(css) {
  const blocks = [];
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
    blocks.push(css.slice(brace + 1, j - 1));
    i = j;
  }
  return blocks;
}

/** URLs for weight 800, or a variable file whose axis includes 800. */
function heroWeightFontUrls(css) {
  const urls = new Set();
  for (const block of fontFaceBlocks(css)) {
    const weight = block.match(/font-weight:\s*([^;}]+)/);
    if (!weight) continue;
    const value = weight[1].trim();
    const range = value.match(/^(\d+)\s+(\d+)$/);
    const keep =
      value === "800" ||
      (range &&
        Number(range[1]) !== Number(range[2]) &&
        Number(range[1]) <= 800 &&
        Number(range[2]) >= 800);
    if (!keep) continue;
    for (const match of block.matchAll(/url\(([^)]+)\)/g)) {
      const url = match[1].replace(/["']/g, "").trim().split("?")[0];
      if (url.includes(".woff2")) urls.add(url);
    }
  }
  return urls;
}

function keepHeroFontPreload(html, heroUrls) {
  if (heroUrls.size === 0) return html;
  return html.replace(/<link\b[^>]*>/g, (tag) => {
    if (!/rel="preload"/.test(tag) || !/as="font"/.test(tag)) return tag;
    const href = tag.match(/\bhref="([^"]+)"/);
    if (!href) return tag;
    const path = href[1].split("?")[0];
    for (const url of heroUrls) {
      if (path === url || path.endsWith(url) || url.endsWith(path)) return tag;
    }
    return "";
  });
}

function uniqueFontNames(css) {
  return css
    .replaceAll(/(?<!NH )Geist Mono Fallback/g, "NH Geist Mono Fallback")
    .replaceAll(/(?<!NH )Geist Mono/g, "NH Geist Mono")
    .replaceAll(/(?<!NH )Geist Fallback/g, "NH Geist Fallback")
    .replaceAll(/(?<!NH )"Geist"/g, '"NH Geist"')
    .replaceAll(/(?<!NH )font-family:Geist/g, "font-family:NH Geist")
    .replaceAll(/(?<!NH )font-family: Geist/g, "font-family:NH Geist");
}

async function cssFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await cssFiles(full)));
    else if (entry.name.endsWith(".css")) files.push(full);
  }
  return files;
}

const heroFontUrls = new Set();
for (const file of await cssFiles(root)) {
  const original = await readFile(file, "utf8");
  const renamed = uniqueFontNames(original);
  if (renamed !== original) await writeFile(file, renamed);
  for (const url of heroWeightFontUrls(renamed)) heroFontUrls.add(url);
}

let done = 0;
for (const file of await htmlFiles(root)) {
  const original = await readFile(file, "utf8");
  const inlined = await critters.process(original);
  const next = keepHeroFontPreload(await withMobileLayout(deferPayload(inlined)), heroFontUrls);
  if (next !== original) {
    await writeFile(file, next);
    done += 1;
  }
}
console.log(`Inlined critical CSS and deferred the rest on ${done} HTML files.`);

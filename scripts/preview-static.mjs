/**
 * Build the static export and serve it the way CloudFront does:
 * extensionless paths map to .html, and a real HTML file wins over a
 * directory that only holds images.
 *
 *   npm run preview:static
 *   npm run preview:static -- --port 4173
 *   npm run preview:static -- --skip-build
 *
 * Does not deploy, and does not post to Kit, email, or Sanity.
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, statSync, createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
const portFlag = args.indexOf("--port");
const port = Number(portFlag >= 0 ? args[portFlag + 1] : process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

function build() {
  const env = {
    ...process.env,
    NODE_ENV: "production",
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f",
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    NEXT_PUBLIC_ENQUIRY_EMAIL:
      process.env.NEXT_PUBLIC_ENQUIRY_EMAIL || "nic@nharry.com",
  };
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "build"], {
      cwd: root,
      env,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`build exited ${code}`));
    });
  });
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded.replace(/^\/+/, "");
  const candidates = [];
  if (!relative || relative.endsWith("/")) {
    candidates.push(path.join(outDir, relative, "index.html"));
  } else {
    const ext = path.extname(relative);
    if (ext) candidates.push(path.join(outDir, relative));
    else {
      candidates.push(path.join(outDir, `${relative}.html`));
      candidates.push(path.join(outDir, relative, "index.html"));
    }
  }
  for (const file of candidates) {
    const normalized = path.normalize(file);
    if (!normalized.startsWith(outDir)) continue;
    if (existsSync(normalized) && statSync(normalized).isFile()) return normalized;
  }
  return null;
}

function serve() {
  const server = createServer((req, res) => {
    const file = resolveFile(req.url || "/");
    if (!file) {
      const missing = path.join(outDir, "404.html");
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      if (existsSync(missing)) createReadStream(missing).pipe(res);
      else res.end("Not found");
      return;
    }
    const type = types[path.extname(file)] || "application/octet-stream";
    res.writeHead(200, { "content-type": type });
    createReadStream(file).pipe(res);
  });
  server.listen(port, () => {
    console.log(`Static site: http://127.0.0.1:${port}`);
    console.log("Extensionless URLs map to the exported HTML. Ctrl-C to stop.");
  });
}

if (!skipBuild) {
  await build();
} else if (!existsSync(outDir)) {
  console.error("No out/ directory. Run without --skip-build first.");
  process.exit(1);
}
serve();

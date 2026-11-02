// Serves the static export the way GitHub Pages does, for end-to-end tests:
// out/ is mounted at /ati-site/, folders serve their index.html, and unknown
// paths get 404.html with a 404 status.
// Usage: node scripts/serve-pages.mjs [port]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const BASE = "/ati-site";
const ROOT = join(process.cwd(), "out");
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
};

function send(res, status, file) {
  res.writeHead(status, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  if (pathname === BASE) {
    res.writeHead(301, { Location: `${BASE}/` }).end();
    return;
  }
  if (pathname.startsWith(`${BASE}/`)) {
    // normalize() + the prefix check keep requests inside out/.
    let file = normalize(join(ROOT, decodeURIComponent(pathname.slice(BASE.length))));
    if (file.startsWith(ROOT) && existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (file.startsWith(ROOT) && existsSync(file)) return send(res, 200, file);
  }
  send(res, 404, join(ROOT, "404.html"));
}).listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));

#!/usr/bin/env node
/**
 * Renders the link-preview images (1200×630) shown when a page is shared on
 * WhatsApp, Facebook or Messenger, and by Meta when it previews an ad link.
 *
 * Takes the 3D demo's final frame from the built site and sets it beside the
 * headline. Output goes to src/assets/og/{nl,fr,en}.png, which are committed,
 * so the normal build never needs a browser.
 *
 *   node build.mjs && npx -y -p playwright@1.56.1 node scripts/og.mjs
 */

import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import en from "../src/i18n/en.mjs";
import fr from "../src/i18n/fr.mjs";
import nl from "../src/i18n/nl.mjs";
import { clientData, demo, demoData } from "../src/render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const out = join(here, "..", "src/assets/og");

// playwright may come from npx's temp install rather than this folder
let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = createRequire(join(process.cwd(), "x.js"))("playwright")); }

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };
// The demo's final frame is drawn live by demo-render.js (the site itself plays a video)
const pages = new Map();
const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  if (pages.has(path)) return res.writeHead(200, { "Content-Type": types[".html"] }).end(pages.get(path));
  if (path === "/demo-render.js") return res.writeHead(200, { "Content-Type": types[".js"] }).end(await readFile(join(here, "../src/assets/demo-render.js")));
  let p = decodeURIComponent(path);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(dist, p));
    res.writeHead(200, { "Content-Type": types[extname(p)] || "application/octet-stream" }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const fontCss = (await readFile(join(dist, "fonts/newsreader-500.woff2"))).toString("base64");
const markPng = (await readFile(join(dist, "brand/mark.png"))).toString("base64");

const browser = await chromium.launch();
await mkdir(out, { recursive: true });

for (const t of [nl, fr, en]) {
  // 1. the demo's final frame (reduced motion lands on it and holds)
  const landing = await readFile(join(dist, t.code, "index.html"), "utf8");
  const css = landing.match(/<style>([\s\S]*?)<\/style>/)[1];
  const pr = JSON.stringify(clientData(t, { page: "capture", trade: null, demo: demoData(t) })).replace(/</g, "\\u003c");
  pages.set(`/__og/${t.code}`, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style>
<style>body{margin:0;width:480px;background:#fbfbf9}.demo{animation:none}.demo-bar,.demo-big{display:none!important}</style></head>
<body>${demo(t, null, { canvas: true })}<script>window.PR=${pr}</script><script src="/demo-render.js"></script></body></html>`);
  const ctx = await browser.newContext({ viewport: { width: 480, height: 600 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${base}/__og/${t.code}?capture`);
  await page.waitForFunction(() => window.PRDemo);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.PRDemo.seek(10400));
  const shot = await page.locator(".demo-screen").screenshot();
  await ctx.close();

  // 2. compose the card
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await card.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: N; src: url(data:font/woff2;base64,${fontCss}) format("woff2"); }
    * { box-sizing: border-box; margin: 0; }
    body { width: 1200px; height: 630px; background: #fbfbf9; color: #141716; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      display: grid; grid-template-columns: 1fr 520px; align-items: center; gap: 56px; padding: 0 64px 0 72px; }
    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; color: #5a5a5a; }
    .brand img { height: 56px; }
    .brand b { display: block; font: 700 30px/1 system-ui, sans-serif; letter-spacing: .05em; }
    .brand small { display: block; font: 500 13px/1 system-ui, sans-serif; letter-spacing: .42em; margin-top: 6px; }
    .eyebrow { font-size: 17px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #1c5482; margin-bottom: 18px; }
    h1 { font: 500 66px/1.02 N, Georgia, serif; letter-spacing: -0.025em; margin-bottom: 18px; }
    p { font: 500 30px/1.25 N, Georgia, serif; color: #1c5482; text-wrap: balance; }
    h1, .eyebrow { text-wrap: balance; }
    img.shot { width: 520px; border-radius: 26px; box-shadow: 0 40px 70px -40px rgba(14,20,18,.7); }
  </style></head><body>
    <div>
      <div class="brand"><img src="data:image/png;base64,${markPng}"><span><b>PINRANK</b><small>BELGIUM</small></span></div>
      <div class="eyebrow">${t.og.eyebrow}</div>
      <h1>${t.og.title}</h1>
      <p>${t.og.sub}</p>
    </div>
    <img class="shot" src="data:image/png;base64,${shot.toString("base64")}">
  </body></html>`);
  await card.waitForTimeout(200);
  await card.screenshot({ path: join(out, `${t.code}.png`) });
  await card.close();
  console.log(`src/assets/og/${t.code}.png`);
}

await browser.close();
server.close();

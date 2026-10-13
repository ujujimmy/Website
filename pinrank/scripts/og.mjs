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

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const out = join(here, "..", "src/assets/og");

// playwright may come from npx's temp install rather than this folder
let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = createRequire(join(process.cwd(), "x.js"))("playwright")); }

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(dist, p));
    res.writeHead(200, { "Content-Type": types[extname(p)] || "application/octet-stream" }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const fontCss = (await readFile(join(dist, "fonts/newsreader-500.woff2"))).toString("base64");

const browser = await chromium.launch();
await mkdir(out, { recursive: true });

for (const t of [nl, fr, en]) {
  // 1. the demo's final frame (reduced motion lands on it and holds)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/${t.code}/`);
  await page.addStyleTag({ content: ".demo-big{display:none!important}" });
  await page.waitForTimeout(600);
  const shot = await page.locator(".demo-screen").screenshot();
  await ctx.close();

  // 2. compose the card
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await card.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: N; src: url(data:font/woff2;base64,${fontCss}) format("woff2"); }
    * { box-sizing: border-box; margin: 0; }
    body { width: 1200px; height: 630px; background: #fbfbf9; color: #141716; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      display: grid; grid-template-columns: 1fr 520px; align-items: center; gap: 56px; padding: 0 64px 0 72px; }
    .brand { display: flex; align-items: center; gap: 10px; font: 500 34px N, Georgia, serif; letter-spacing: -0.02em; margin-bottom: 44px; }
    .brand svg { width: 30px; height: 30px; color: #1f5c45; }
    .eyebrow { font-size: 17px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #1f5c45; margin-bottom: 18px; }
    h1 { font: 500 66px/1.02 N, Georgia, serif; letter-spacing: -0.025em; margin-bottom: 18px; }
    p { font: 500 30px/1.25 N, Georgia, serif; color: #1f5c45; text-wrap: balance; }
    h1, .eyebrow { text-wrap: balance; }
    img { width: 520px; border-radius: 26px; box-shadow: 0 40px 70px -40px rgba(14,20,18,.7); }
  </style></head><body>
    <div>
      <div class="brand"><svg viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill="currentColor"/><circle cx="12" cy="9" r="2.8" fill="#fbfbf9"/></svg>PinRank</div>
      <div class="eyebrow">${t.og.eyebrow}</div>
      <h1>${t.og.title}</h1>
      <p>${t.og.sub}</p>
    </div>
    <img src="data:image/png;base64,${shot.toString("base64")}">
  </body></html>`);
  await card.waitForTimeout(200);
  await card.screenshot({ path: join(out, `${t.code}.png`) });
  await card.close();
  console.log(`src/assets/og/${t.code}.png`);
}

await browser.close();
server.close();

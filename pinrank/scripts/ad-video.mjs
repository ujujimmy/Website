#!/usr/bin/env node
/**
 * Records the 3D demo as Meta ad videos: MP4 (H.264 Main + silent AAC), 30 fps, 14 s.
 *
 *   4:5  (1080×1350) for Facebook/Instagram feed: one per trade + one general
 *   9:16 (1080×1920) for Stories/Reels: one general
 *
 * The demo is stepped frame by frame (no screen recording), so every video
 * is perfectly smooth regardless of how fast this machine is.
 *
 *   node build.mjs && npx -y -p playwright@1.56.1 node scripts/ad-video.mjs [nl fr]
 * Needs ffmpeg with libx264 on PATH. Output: ads/video/*.mp4
 */

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import config from "../src/config.mjs";
import en from "../src/i18n/en.mjs";
import fr from "../src/i18n/fr.mjs";
import nl from "../src/i18n/nl.mjs";
import { TRADES, demo, landingPath } from "../src/render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const out = join(here, "..", "ads/video");
const FPS = 30;

let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = createRequire(join(process.cwd(), "x.js"))("playwright")); }

const langs = { nl, fr, en };
const pick = process.argv.slice(2).filter((a) => langs[a]);
const todo = (pick.length ? pick : ["nl", "fr"]).map((c) => langs[c]);
const domain = new URL(config.siteUrl).host;

/* ---------- the ad page, composed from the built landing page ---------- */

const pin = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill="currentColor"/><circle cx="12" cy="9" r="2.8" fill="#fbfbf9"/></svg>`;

async function adPage(t, trade) {
  const html = await readFile(join(dist, landingPath(t, trade), "index.html"), "utf8");
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const figure = demo(t, trade ? t.trades[trade] : null, { canvas: true });
  const pr = html.match(/<script>window\.PR=[\s\S]*?<\/script>/)[0];
  const tr = trade ? t.trades[trade] : null;
  return `<!doctype html><html lang="${t.htmlLang}"><head><meta charset="utf-8">
<style>${css}</style>
<style>
  html, body { height: 100%; overflow: hidden; }
  .ad { height: 100%; display: flex; flex-direction: column; gap: 20px; padding: 34px 30px 32px; }
  .ad-brand { display: flex; align-items: center; gap: 8px; font: 500 22px var(--serif); letter-spacing: -0.02em; }
  .ad-brand svg { width: 20px; height: 20px; color: var(--accent); }
  .ad h1 { font: 500 38px/1.06 var(--serif); letter-spacing: -0.02em; margin: 0; text-wrap: balance; }
  .ad .demo { flex: 1; min-height: 0; display: flex; animation: none; }
  .ad .demo-wrap { flex: 1; display: flex; container-type: normal; }
  .ad .demo-screen { flex: 1; aspect-ratio: auto; cursor: default; font-size: 16px; }
  .ad .demo-bar, .ad .demo-big { display: none !important; }
  .ad-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .ad-foot p { margin: 0; font: 500 21px/1.2 var(--serif); color: var(--accent); text-wrap: balance; }
  .ad-cta { flex: none; display: inline-flex; flex-direction: column; align-items: center; gap: 6px; }
  .ad-pill { display: inline-flex; align-items: center; gap: 8px; padding: 13px 22px; border-radius: 999px; background: var(--ink); color: #fff; font-weight: 600; font-size: 16px; }
  .ad-url { font-size: 12px; color: var(--muted); letter-spacing: .02em; }
  .tall .ad { padding: 56px 30px 60px; gap: 26px; }
  .tall .ad h1 { font-size: 44px; }
  .tall .ad-foot { flex-direction: column; align-items: stretch; text-align: center; gap: 18px; }
  .tall .ad-foot p { font-size: 24px; }
</style></head>
<body class="__SHAPE__"><div class="ad">
  <div class="ad-brand">${pin}PinRank</div>
  <h1>${t.adVideo.headline(tr)}</h1>
  ${figure}
  <div class="ad-foot">
    <p>${t.og.sub}</p>
    <span class="ad-cta"><span class="ad-pill">${t.nav.cta} →</span><span class="ad-url">${domain}</span></span>
  </div>
</div>
${pr}
<script src="/demo-render.js"></script>
</body></html>`;
}

/* ---------- local server: the built site plus the composed ad pages ---------- */

const pages = new Map();
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (pages.has(url.pathname)) return res.writeHead(200, { "Content-Type": types[".html"] }).end(pages.get(url.pathname));
  if (url.pathname === "/demo-render.js") return res.writeHead(200, { "Content-Type": types[".js"] }).end(await readFile(join(here, "../src/assets/demo-render.js")));
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith("/")) p += "index.html";
  try { res.writeHead(200, { "Content-Type": types[extname(p)] || "application/octet-stream" }).end(await readFile(join(dist, p))); }
  catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

/* ---------- record ---------- */

const browser = await chromium.launch();
await mkdir(out, { recursive: true });

async function record(t, trade, shape) {
  const [w, h] = shape === "9x16" ? [540, 960] : [540, 675];
  const name = `${t.code}-${trade ? t.trades[trade].slug : "all"}-${shape}`;
  const path = `/__ad/${name}`;
  pages.set(path, (await adPage(t, trade)).replace("__SHAPE__", shape === "9x16" ? "tall" : "feed"));

  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(`${base}${path}?capture`);
  await page.waitForFunction(() => window.PRDemo);
  await page.evaluate(() => document.fonts.ready);
  const dur = await page.evaluate(() => window.PRDemo.dur);

  // Main profile + a silent AAC track: plays in every phone gallery, WhatsApp and Ads Manager
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-map", "0:v", "-map", "1:a", "-shortest",
    "-c:v", "libx264", "-profile:v", "main", "-level", "4.0", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart",
    join(out, `${name}.mp4`)], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((ok, fail) => ff.on("close", (c) => (c ? fail(new Error(`ffmpeg exited ${c}`)) : ok())));

  const frames = Math.round((dur / 1000) * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate((ms) => window.PRDemo.seek(ms), (f * 1000) / FPS);
    const png = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await done;
  await page.close();
  console.log(`ads/video/${name}.mp4`);
}

for (const t of todo) {
  await record(t, null, "4x5");
  await record(t, null, "9x16");
  for (const trade of TRADES) await record(t, trade, "4x5");
}

await browser.close();
server.close();

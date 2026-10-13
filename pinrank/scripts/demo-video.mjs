#!/usr/bin/env node
/**
 * Records the 3D scene the landing page plays in its demo player:
 * src/assets/demo/demo.mp4 (960×1056, 30 fps, 14 s, H.264), a VP9 demo.webm
 * fallback, and poster.jpg.
 *
 * The scene only: no text. The page lays the caption, counters and search
 * bar over it as live text, so this one video serves every language and
 * trade. The demo is stepped frame by frame, so the video is perfectly smooth
 * whatever this machine's speed.
 *
 *   node build.mjs && npx -y -p playwright@1.56.1 node scripts/demo-video.mjs && node build.mjs
 * Needs ffmpeg with libx264 on PATH.
 */

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import nl from "../src/i18n/nl.mjs";
import { clientData, demo, demoData } from "../src/render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const out = join(here, "..", "src/assets/demo");
const FPS = 30, W = 480, H = 528; // CSS px; recorded at 2×

let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = createRequire(join(process.cwd(), "x.js"))("playwright")); }

const landing = await readFile(join(dist, "nl/index.html"), "utf8");
const css = landing.match(/<style>([\s\S]*?)<\/style>/)[1];
const pr = JSON.stringify(clientData(nl, { page: "capture", trade: null, demo: demoData(nl) })).replace(/</g, "\\u003c");
const page = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style><style>
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #0e1412; }
  .demo { animation: none; }
  .demo-screen { border-radius: 0; box-shadow: none; }
  .demo-top, .demo-bottom, .demo-bar, .demo-big { visibility: hidden; }
</style></head><body>${demo(nl, null, { canvas: true })}
<script>window.PR=${pr}</script><script src="/demo-render.js"></script></body></html>`;

const types = { ".js": "text/javascript", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  const p = new URL(req.url, "http://x").pathname;
  if (p === "/capture") return res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(page);
  const file = p === "/demo-render.js" ? join(here, "../src/assets/demo-render.js") : join(dist, p);
  try { res.writeHead(200, { "Content-Type": types[extname(p)] || "application/octet-stream" }).end(await readFile(file)); }
  catch { res.writeHead(404).end(); }
}).listen(0);

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await tab.goto(`http://localhost:${server.address().port}/capture?capture`);
await tab.waitForFunction(() => window.PRDemo);
const dur = await tab.evaluate(() => window.PRDemo.dur);
const clip = { x: 0, y: 0, width: W, height: H };
await mkdir(out, { recursive: true });

// poster: the finished state, shown before the video loads and when autoplay is blocked
await tab.evaluate(() => window.PRDemo.seek(10400));
await tab.screenshot({ path: join(out, "poster.jpg"), type: "jpeg", quality: 82, clip });

const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  "-c:v", "libx264", "-profile:v", "main", "-level", "4.0", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
  "-g", String(FPS * 2), "-movflags", "+faststart", "-an", join(out, "demo.mp4")], { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((ok, fail) => ff.on("close", (c) => (c ? fail(new Error(`ffmpeg exited ${c}`)) : ok())));
for (let f = 0, n = Math.round((dur / 1000) * FPS); f < n; f++) {
  await tab.evaluate((ms) => window.PRDemo.seek(ms), (f * 1000) / FPS);
  if (!ff.stdin.write(await tab.screenshot({ type: "png", clip }))) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
await done;

// VP9 fallback for the few browsers without H.264 (H.264 stays first: every phone decodes it in hardware)
await new Promise((ok, fail) => spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", join(out, "demo.mp4"),
  "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "38", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", join(out, "demo.webm")],
  { stdio: "inherit" }).on("close", (c) => (c ? fail(new Error(`ffmpeg exited ${c}`)) : ok())));

await browser.close();
server.close();
console.log("src/assets/demo/demo.mp4, demo.webm, poster.jpg");

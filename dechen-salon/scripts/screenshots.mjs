/**
 * Captures every route, full page, desktop and mobile.
 *
 *   pnpm build && pnpm preview &
 *   node scripts/screenshots.mjs http://localhost:3200 shots
 */

import { mkdir } from "node:fs/promises";
import { launch } from "./launch.mjs";

const base = process.argv[2] ?? "http://localhost:3200";
const outDir = process.argv[3] ?? "shots";

const ROUTES = [
  ["/", "home"],
  ["/services", "services"],
  ["/services/cuts-and-styling", "service-cuts"],
  ["/services/hair-color", "service-color"],
  ["/services/hair-extensions", "service-extensions"],
  ["/services/treatments", "service-treatments"],
  ["/menu", "menu"],
  ["/about", "about"],
  ["/founder", "founder"],
  ["/team", "team"],
  ["/gallery", "gallery"],
  ["/reviews", "reviews"],
  ["/visit", "visit"],
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function settle(page, ms = 1200) {
  await page.waitForTimeout(ms);
}

/**
 * Scrolls the whole page once before capturing.
 *
 * Content fades in on an IntersectionObserver, and a full-page screenshot
 * resizes the viewport rather than scrolling — so without this every reveal
 * below the fold photographs as empty space, which looks like a bug and isn't.
 *
 * It has to be real wheel input: Lenis drives the scroll and swallows
 * `window.scrollTo`, so a scripted scroll moves nothing and every reveal stays
 * hidden. `mouse.wheel` goes through the same path a person's trackpad does.
 */
async function primeReveals(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(160);
  }
  // Let the last reveals finish their transition, then return to the top.
  await page.waitForTimeout(900);
  await page.mouse.wheel(0, -height - 2000);
  await page.waitForTimeout(500);
}

const browser = await launch();
await mkdir(outDir, { recursive: true });

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Every route, full page.
  for (const [route, name] of ROUTES) {
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    await settle(page, 700);
    await primeReveals(page);
    await page.screenshot({
      path: `${outDir}/${viewport.name}-${name}.png`,
      fullPage: true,
    });
  }

  await context.close();
}

await browser.close();
console.log(`Screenshots written to ${outDir}/`);

/**
 * Captures every act of the scroll story and every route, desktop and mobile.
 *
 *   pnpm build && pnpm start -p 3200 &
 *   node scripts/screenshots.mjs http://localhost:3200 shots
 *
 * The story acts are captured by scrolling to a fraction of the stage rather
 * than to an anchor, so what lands in the file is the mid-transition state the
 * strand is actually in — which is the thing worth looking at.
 */

import { mkdir } from "node:fs/promises";
import { launch } from "./launch.mjs";

const base = process.argv[2] ?? "http://localhost:3200";
const outDir = process.argv[3] ?? "shots";

const ACTS = ["open", "philosophy", "cut", "color", "length", "care", "visit"];

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

  // The seven acts of the story.
  await page.goto(`${base}/`, { waitUntil: "load" });
  // Give the canvas time to pass its idle gate and fade in.
  await settle(page, 3000);

  for (let i = 0; i < ACTS.length; i++) {
    const fraction = i / (ACTS.length - 1);
    await page.evaluate((f) => {
      const stage = document.querySelector(".story-stage");
      if (!stage) return;
      const scrollable = stage.offsetHeight - window.innerHeight;
      window.scrollTo({ top: stage.offsetTop + scrollable * f, behavior: "instant" });
    }, fraction);
    await settle(page, 900);
    await page.screenshot({
      path: `${outDir}/${viewport.name}-act-${i}-${ACTS[i]}.png`,
    });
  }

  // Every route, full page.
  for (const [route, name] of ROUTES) {
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    await settle(page, route === "/" ? 2500 : 700);
    if (route !== "/") await primeReveals(page);
    await page.screenshot({
      path: `${outDir}/${viewport.name}-${name}.png`,
      fullPage: route !== "/",
    });
  }

  await context.close();
}

await browser.close();
console.log(`Screenshots written to ${outDir}/`);

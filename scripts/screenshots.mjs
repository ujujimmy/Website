/**
 * Visual proof of the scroll narrative.
 *
 * Walks the homepage in fixed increments and captures a frame at each one, so
 * every 3D beat has a checked-in reference image. Run against a production
 * server (`pnpm build && pnpm start`) for representative results.
 *
 *   node scripts/screenshots.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = "scripts/screenshots";

const pages = [
  { path: "/", name: "home", scroll: [0, 0.14, 0.28, 0.43, 0.57, 0.72, 0.86, 1] },
  { path: "/services/google-reviews", name: "service-reviews" },
  { path: "/services/seo", name: "service-seo" },
  { path: "/pricing", name: "pricing" },
  { path: "/work", name: "work" },
  { path: "/about", name: "about" },
  { path: "/audit", name: "audit" },
  { path: "/contact", name: "contact" },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await mkdir(OUT, { recursive: true });

// SwiftShader gives us a real (software) WebGL2 context, so the captures show
// the actual particle scene rather than the no-WebGL poster fallback.
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const target of pages) {
    await page.goto(`${BASE}${target.path}`, { waitUntil: "load" });
    // Let the canvas mount, the field fade in, and entrance animations settle.
    await wait(2500);

    const steps = target.scroll ?? [0];
    for (const [i, ratio] of steps.entries()) {
      if (steps.length > 1) {
        await page.evaluate((r) => {
          const max = document.body.scrollHeight - window.innerHeight;
          window.scrollTo({ top: max * r, behavior: "instant" });
        }, ratio);
        // Lenis interpolates, and the particle morph is damped behind it.
        await wait(1600);
      }

      const suffix = steps.length > 1 ? `-${String(i).padStart(2, "0")}` : "";
      const file = `${OUT}/${viewport.name}-${target.name}${suffix}.png`;
      await page.screenshot({ path: file });
      console.log("✓", file);
    }
  }

  await context.close();
}

await browser.close();
console.log("\nDone. Images in", OUT);

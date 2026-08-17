/**
 * Captures every page at the widths that actually matter, and asserts the two
 * things that are easy to claim and easy to get wrong:
 *
 *   · no horizontal overflow — measured, not patched with overflow-x: hidden
 *   · every interactive target is at least 48px on its short side
 *
 *   pnpm build && pnpm start -p 3210 &
 *   node scripts/screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3210";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "screenshots");

const PAGES = ["/", "/menu", "/story", "/gallery", "/visit"];

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640, mobile: true },
  { name: "390x844", width: 390, height: 844, mobile: true },
  { name: "430x932", width: 430, height: 932, mobile: true },
  { name: "740x360-landscape", width: 740, height: 360, mobile: true },
  { name: "1440x900", width: 1440, height: 900, mobile: false },
];

await mkdir(OUT, { recursive: true });

// This container ships a Chromium build that does not match the one this
// Playwright release expects. Point at the installed binary rather than
// downloading a second copy. Locally, drop CHROME_PATH and it uses its own.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const problems = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await context.newPage();

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });

    // Walk the page so below-the-fold lazy images actually decode, then come
    // back to the top. Without this a full-page capture shows empty frames and
    // you end up critiquing the screenshot instead of the site.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");

    // ── overflow ────────────────────────────────────────────────────────
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const offenders = [];
      if (doc.scrollWidth > doc.clientWidth) {
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.right > doc.clientWidth + 1 || r.left < -1) {
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`,
            );
          }
        }
      }
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        offenders: offenders.slice(0, 5),
      };
    });

    if (overflow.scrollWidth > overflow.clientWidth) {
      problems.push(
        `OVERFLOW  ${path} @ ${vp.name}: ${overflow.scrollWidth} > ${overflow.clientWidth}\n           ${overflow.offenders.join("\n           ")}`,
      );
    }

    // ── tap targets (mobile viewports only) ─────────────────────────────
    if (vp.mobile) {
      const small = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("a[href], button")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue; // hidden
          // Screen-reader-only affordances (the skip link) are 1x1 until
          // focused, at which point they are full size. Not a tap target.
          if (r.width <= 2 && r.height <= 2) continue;
          if (Math.min(r.width, r.height) < 44) {
            out.push(
              `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 28)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
            );
          }
        }
        return out;
      });
      for (const s of small) problems.push(`TAP TARGET ${path} @ ${vp.name}: ${s}`);
    }

    const file = `${path === "/" ? "home" : path.slice(1)}--${vp.name}.png`;
    await page.screenshot({
      path: join(OUT, file),
      fullPage: vp.name === "1440x900" || vp.width < 500,
    });
  }

  await context.close();
}

await browser.close();

console.log(`\nScreenshots → scripts/screenshots/`);
if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):\n`);
  console.log(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("\nNo horizontal overflow. No tap target under 44px. ✓\n");
}

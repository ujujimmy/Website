/**
 * Accessibility scan across every route, desktop and mobile.
 *
 *   pnpm build && pnpm start -p 3200 &
 *   node scripts/a11y.mjs http://localhost:3200
 *
 * Scrolls each page first, because content that has not been revealed yet is
 * invisible to axe as well as to the eye, and a page that passes only because
 * half of it was hidden has not passed.
 */

import { AxeBuilder } from "@axe-core/playwright";
import { launch } from "./launch.mjs";

const base = process.argv[2] ?? "http://localhost:3200";

const ROUTES = [
  "/",
  "/services",
  "/services/cuts-and-styling",
  "/services/hair-color",
  "/services/hair-extensions",
  "/services/treatments",
  "/menu",
  "/about",
  "/founder",
  "/team",
  "/gallery",
  "/reviews",
  "/visit",
  "/does-not-exist",
];

const browser = await launch();
let total = 0;

for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    await page.waitForTimeout(600);

    // Real wheel input: Lenis swallows scripted scrolls, so reveals would
    // otherwise stay hidden and be skipped by the scan.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(110);
    }
    await page.waitForTimeout(600);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    for (const violation of results.violations) {
      total += violation.nodes.length;
      console.log(
        `\n[${width}px] ${route}\n  ${violation.id} (${violation.impact}) — ${violation.help}`,
      );
      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`    ${node.target.join(" ")}`);
        const summary = node.failureSummary?.split("\n").slice(1, 3).join(" ");
        if (summary) console.log(`    ${summary.trim()}`);
      }
    }
  }

  await context.close();
}

await browser.close();
console.log(total === 0 ? "\nNo violations." : `\n${total} node(s) with violations.`);
process.exit(total === 0 ? 0 : 1);

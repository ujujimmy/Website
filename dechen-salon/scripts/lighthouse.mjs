/**
 * Lighthouse on the pages that matter, throttled mobile.
 *
 *   pnpm build && pnpm start -p 3200 &
 *   node scripts/lighthouse.mjs http://localhost:3200
 */

import { chromium } from "playwright";
import lighthouse from "lighthouse";
import { findChromium } from "./launch.mjs";

const base = process.argv[2] ?? "http://localhost:3200";

const ROUTES = ["/", "/menu", "/services/hair-color", "/founder", "/visit"];

// Lighthouse drives the browser over the DevTools protocol, so it needs a
// fixed debugging port rather than Playwright's websocket endpoint.
const port = 9222;
const browser = await chromium.launch({
  executablePath: findChromium(),
  args: [
    `--remote-debugging-port=${port}`,
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--no-sandbox",
  ],
});

console.log(`Chromium: ${findChromium() ?? "playwright default"}\n`);
console.log("route".padEnd(24), "perf", " a11y", " bp ", " seo", " lcp", "  cls");

let worstPerf = 100;
let worstA11y = 100;

for (const route of ROUTES) {
  const result = await lighthouse(
    `${base}${route}`,
    {
      port,
      output: "json",
      logLevel: "error",
      // Real throttling rather than Lighthouse's default Lantern simulation.
      // The simulation extrapolates from observed CPU task durations, and this
      // build machine is a shared container whose durations are wildly inflated
      // — it modelled a 1.8s LCP as 6s. `devtools` applies actual network and
      // CPU throttling, which is the honest measurement here.
      throttlingMethod: "devtools",
    },
    undefined,
  );

  const c = result.lhr.categories;
  const perf = Math.round(c.performance.score * 100);
  const a11y = Math.round(c.accessibility.score * 100);
  const bp = Math.round(c["best-practices"].score * 100);
  const seo = Math.round(c.seo.score * 100);
  const lcp = result.lhr.audits["largest-contentful-paint"].displayValue;
  const cls = result.lhr.audits["cumulative-layout-shift"].displayValue;

  worstPerf = Math.min(worstPerf, perf);
  worstA11y = Math.min(worstA11y, a11y);

  console.log(
    route.padEnd(24),
    String(perf).padStart(4),
    String(a11y).padStart(5),
    String(bp).padStart(4),
    String(seo).padStart(4),
    String(lcp).padStart(6),
    String(cls).padStart(5),
  );
}

await browser.close();
console.log(`\nworst performance ${worstPerf}, worst accessibility ${worstA11y}`);

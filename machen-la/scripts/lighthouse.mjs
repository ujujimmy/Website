/**
 * Lighthouse on the mobile preset — 4× CPU throttle, slow 4G — because that is
 * the machine and the connection this site is actually used on.
 *
 *   pnpm build && pnpm start -p 3210 &
 *   node scripts/lighthouse.mjs
 *
 * Honours CHROME_PATH, which this container needs.
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = process.env.BASE_URL ?? "http://localhost:3210";
const PATHS = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/menu"];

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
});

const pad = (s, n) => String(s).padEnd(n);
console.log(
  `\n${pad("PAGE", 10)}${pad("PERF", 7)}${pad("A11Y", 7)}${pad("BP", 7)}${pad("SEO", 7)}${pad("LCP", 10)}${pad("CLS", 8)}${pad("TBT", 8)}`,
);
console.log("─".repeat(64));

for (const path of PATHS) {
  const result = await lighthouse(
    BASE + path,
    { port: chrome.port, output: "json", logLevel: "error" },
    // Default config is the mobile emulation preset.
  );
  const { categories, audits } = result.lhr;
  const pct = (c) => Math.round((c?.score ?? 0) * 100);

  console.log(
    pad(path, 10) +
      pad(pct(categories.performance), 7) +
      pad(pct(categories.accessibility), 7) +
      pad(pct(categories["best-practices"]), 7) +
      pad(pct(categories.seo), 7) +
      pad(audits["largest-contentful-paint"].displayValue ?? "-", 10) +
      pad(audits["cumulative-layout-shift"].displayValue ?? "-", 8) +
      pad(audits["total-blocking-time"].displayValue ?? "-", 8),
  );

  const failed = Object.values(audits).filter(
    (a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === "binary",
  );
  if (failed.length) {
    for (const a of failed.slice(0, 8)) console.log(`           ✗ ${a.title}`);
  }
}

console.log("");
await chrome.kill();

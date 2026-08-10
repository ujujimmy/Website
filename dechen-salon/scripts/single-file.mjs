/**
 * Folds one exported page into a single self-contained HTML file.
 *
 *   pnpm build && node scripts/single-file.mjs out/index.html preview.html
 *
 * Used for sharing a preview somewhere that can only take one file and cannot
 * fetch anything (an Artifact, an email attachment, a USB stick). It inlines the
 * stylesheet, the fonts and every photograph as data URIs, drops the Next.js
 * bundles, and replaces them with a few lines that keep the scroll reveals
 * working.
 *
 * This is a viewing convenience, not a build target. The real site ships from
 * `out/` as normal.
 */

import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const source = process.argv[2] ?? "out/index.html";
const target = process.argv[3] ?? "preview.html";
const root = "out";

let html = await readFile(source, "utf8");

const mime = (file) =>
  ({
    ".woff2": "font/woff2",
    ".webp": "image/webp",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
  })[path.extname(file)] ?? "application/octet-stream";

async function dataUri(urlPath) {
  const file = path.join(root, urlPath.split("?")[0]);
  const buf = await readFile(file);
  return `data:${mime(file)};base64,${buf.toString("base64")}`;
}

/* ---- stylesheet, with its fonts folded in ------------------------------- */
const cssHref = html.match(/href="(\/_next\/static\/[^"]+\.css)"/)?.[1];
if (!cssHref) throw new Error("no stylesheet found in " + source);

let css = await readFile(path.join(root, cssHref), "utf8");

// Next writes font URLs relative to the stylesheet (`url(../media/x.woff2)`),
// not from the site root, so they have to be resolved against the CSS file's
// own directory before they can be read off disk.
const cssDir = path.posix.dirname(cssHref);
// Only the preloaded subsets get embedded. next/font emits a face per unicode
// range — Cyrillic, Greek, Vietnamese — and inlining all thirteen would triple
// the file for glyphs this site never sets.
const preloaded = new Set(
  [...(await readFile(source, "utf8")).matchAll(/\/_next\/static\/media\/([^"?]+\.woff2)/g)].map(
    (m) => m[1],
  ),
);
for (const url of new Set([...css.matchAll(/url\(([^)"']+\.woff2?)\)/g)].map((m) => m[1]))) {
  const file = path.posix.basename(url);
  if (!preloaded.has(file)) {
    // Drop the whole @font-face rule so the browser never tries to fetch it.
    css = css.replace(new RegExp(`@font-face\\{[^}]*${file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^}]*\\}`, "g"), "");
    continue;
  }
  const resolved = path.posix.normalize(path.posix.join(cssDir, url));
  css = css.replaceAll(`url(${url})`, `url(${await dataUri(resolved)})`);
}

html = html.replace(
  new RegExp(`<link[^>]*href="${cssHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "g"),
  `<style>${css}</style>`,
);

/* ---- photographs -------------------------------------------------------- */
for (const src of new Set([...html.matchAll(/"(\/img\/[^"\\]+)"/g)].map((m) => m[1]))) {
  html = html.replaceAll(`"${src}"`, `"${await dataUri(src)}"`);
}
// next/image writes the same paths HTML-escaped inside the flight payload too.
for (const src of new Set([...html.matchAll(/\\"(\/img\/[^\\"]+)\\"/g)].map((m) => m[1]))) {
  html = html.replaceAll(`\\"${src}\\"`, `\\"${await dataUri(src)}\\"`);
}

/* ---- drop the framework, keep the behaviour ------------------------------ */
html = html
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, "")
  .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
  .replace(/<link[^>]*rel="preload"[^>]*>/g, "");

html = html.replace(
  "</body>",
  `<script>
  // Stands in for RevealRoot. Same observer, same attribute, so the CSS in the
  // page drives the entrances exactly as it does on the real site.
  document.documentElement.classList.remove('no-js');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.setAttribute('data-shown', '');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.setAttribute('data-shown', '');
    });
  }
</script></body>`,
);

await writeFile(target, html);
const { size } = await stat(target);
console.log(`${target} — ${Math.round(size / 1024)}KB`);

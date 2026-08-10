/**
 * Folds the whole exported site into a single self-contained HTML file.
 *
 *   pnpm build && node scripts/single-file.mjs preview.html
 *
 * For sharing a working preview somewhere that can only take one file and
 * cannot fetch anything — an Artifact, an email attachment, a USB stick. Every
 * page is included and the navigation works, via hash routing.
 *
 * It inlines the stylesheet, the fonts and every photograph, drops the Next.js
 * bundles, and replaces them with a small script that handles routing, the
 * scroll reveals, the price menu's tier filter and the mobile nav.
 *
 * This is a viewing convenience, not a build target. The real site ships from
 * `out/` as normal, where all of that is React and every page is its own URL.
 */

import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const target = process.argv[2] ?? "preview.html";
const root = "out";

/** Every visitable route. Order sets the nav order in the preview. */
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
];

const fileFor = (route) =>
  path.join(root, route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`);

const mime = (file) =>
  ({
    ".woff2": "font/woff2",
    ".webp": "image/webp",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
  })[path.extname(file)] ?? "application/octet-stream";

async function dataUri(urlPath) {
  const buf = await readFile(path.join(root, urlPath.split("?")[0]));
  return `data:${mime(urlPath)};base64,${buf.toString("base64")}`;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ------------------------------------------------------------------ shell */
const shellSource = await readFile(fileFor("/"), "utf8");
let shell = shellSource;

/* ---- stylesheet, with its fonts folded in -------------------------------- */
const cssHref = shell.match(/href="(\/_next\/static\/[^"]+\.css)"/)?.[1];
if (!cssHref) throw new Error("no stylesheet found");

let css = await readFile(path.join(root, cssHref), "utf8");

// Next writes font URLs relative to the stylesheet (`url(../media/x.woff2)`),
// so they resolve against the CSS file's own directory, not the site root.
// Only the preloaded subsets get embedded: next/font emits a face per unicode
// range, and inlining all thirteen would triple the file for glyphs this site
// never sets.
const cssDir = path.posix.dirname(cssHref);
const preloaded = new Set(
  [...shell.matchAll(/\/_next\/static\/media\/([^"?]+\.woff2)/g)].map((m) => m[1]),
);
for (const url of new Set([...css.matchAll(/url\(([^)"']+\.woff2?)\)/g)].map((m) => m[1]))) {
  const file = path.posix.basename(url);
  if (!preloaded.has(file)) {
    css = css.replace(
      new RegExp(`@font-face\\{[^}]*${escapeRe(file)}[^}]*\\}`, "g"),
      "",
    );
    continue;
  }
  const resolved = path.posix.normalize(path.posix.join(cssDir, url));
  css = css.replaceAll(`url(${url})`, `url(${await dataUri(resolved)})`);
}

shell = shell.replace(
  new RegExp(`<link[^>]*href="${escapeRe(cssHref)}"[^>]*>`, "g"),
  `<style>${css}\n/* preview-only */\n.pv-page[hidden]{display:none}\n</style>`,
);

/* ---- every page's <main>, stacked into one document ---------------------- */
const pages = [];
for (const route of ROUTES) {
  const html = await readFile(fileFor(route), "utf8");
  const main = html.match(/<main id="main"[^>]*>([\s\S]*)<\/main>/)?.[1];
  if (!main) throw new Error("no <main> in " + route);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  pages.push({ route, main, title });
}

const stacked = pages
  .map(
    (p, i) =>
      `<div class="pv-page" data-route="${p.route}" data-title="${p.title.replace(/"/g, "&quot;")}"${i ? " hidden" : ""}>${p.main}</div>`,
  )
  .join("");

shell = shell.replace(
  /<main id="main"[^>]*>[\s\S]*<\/main>/,
  `<main id="main">${stacked}</main>`,
);

/* ---- internal links become hash routes ----------------------------------- */
// Longest first, so /services/hair-color is rewritten before /services.
for (const route of [...ROUTES].sort((a, b) => b.length - a.length)) {
  shell = shell.replaceAll(`href="${route}"`, `href="#${route}"`);
}

/* ---- photographs, stored once and applied at runtime --------------------- */
// Inlining each occurrence would repeat the same picture across pages and take
// the file from ~2MB to well over 10.
const imagePaths = [...new Set([...shell.matchAll(/src="(\/img\/[^"\\]+)"/g)].map((m) => m[1]))];
const imageMap = {};
for (const p of imagePaths) imageMap[p] = await dataUri(p);
for (const p of imagePaths) shell = shell.replaceAll(`src="${p}"`, `data-img="${p}"`);

/* ---- drop the framework, keep the behaviour ------------------------------ */
shell = shell
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, "")
  .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
  .replace(/<link[^>]*rel="preload"[^>]*>/g, "");

const runtime = `
<script>
(function () {
  var IMG = ${JSON.stringify(imageMap)};
  var doc = document;

  doc.documentElement.classList.remove('no-js');

  /* -- photographs ------------------------------------------------------- */
  doc.querySelectorAll('img[data-img]').forEach(function (el) {
    var src = IMG[el.getAttribute('data-img')];
    if (src) el.src = src;
  });

  /* -- scroll reveals ---------------------------------------------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = reduced ? null : new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.setAttribute('data-shown', '');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  function armReveals(scope) {
    scope.querySelectorAll('[data-reveal]:not([data-shown])').forEach(function (el) {
      if (io) io.observe(el); else el.setAttribute('data-shown', '');
    });
  }

  /* -- routing ----------------------------------------------------------- */
  var pages = [].slice.call(doc.querySelectorAll('.pv-page'));

  function show(route) {
    var match = pages.filter(function (p) { return p.dataset.route === route; })[0] || pages[0];
    pages.forEach(function (p) { p.hidden = p !== match; });
    if (match.dataset.title) doc.title = match.dataset.title;

    // Light up the matching nav item.
    doc.querySelectorAll('header a[href^="#/"]').forEach(function (a) {
      var href = a.getAttribute('href').slice(1);
      var on = href === route || (href !== '/' && route.indexOf(href + '/') === 0);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    armReveals(match);
    window.scrollTo(0, 0);
  }

  function route() {
    var hash = location.hash.slice(1);
    // Anything not starting with / is an in-page anchor, not a route.
    if (hash && hash.charAt(0) !== '/') {
      var el = doc.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    show(hash || '/');
  }

  window.addEventListener('hashchange', route);
  route();

  /* -- price menu tier filter -------------------------------------------- */
  doc.querySelectorAll('[data-tier-focus]').forEach(function (group) {
    group.querySelectorAll('[data-tier-button]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        group.setAttribute('data-tier-focus', btn.dataset.tierButton);
        group.querySelectorAll('[data-tier-button]').forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-pressed', String(on));
          b.className = on
            ? 'rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm bg-plum text-petal'
            : 'rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm text-muted hover:bg-petal hover:text-ink';
        });
      });
    });
  });

  /* -- mobile nav --------------------------------------------------------
     The real header renders this panel from React state, so it is not in the
     exported HTML. The preview builds a plain one from the desktop links. */
  var toggle = doc.querySelector('header button[aria-controls="mobile-nav"]');
  if (toggle) {
    var links = [].slice.call(doc.querySelectorAll('header nav[aria-label="Main"] a[href^="#/"]'));
    var seen = {};
    var panel = doc.createElement('nav');
    panel.id = 'mobile-nav';
    panel.setAttribute('aria-label', 'Main');
    panel.hidden = true;
    panel.className = 'max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-petal px-6 pb-10 pt-2 lg:hidden';
    var list = doc.createElement('ul');
    list.className = 'flex flex-col';
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (seen[href]) return;
      seen[href] = 1;
      var li = doc.createElement('li');
      li.className = 'border-b border-line/70';
      var copy = doc.createElement('a');
      copy.href = href;
      copy.className = 'block py-3.5 font-display text-lg text-ink';
      copy.textContent = a.textContent.trim();
      li.appendChild(copy);
      list.appendChild(li);
    });
    panel.appendChild(list);
    toggle.closest('header').appendChild(panel);

    toggle.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
    });
  }
})();
</script>`;

shell = shell.replace("</body>", runtime + "</body>");

await writeFile(target, shell);
const { size } = await stat(target);
console.log(
  `${target} — ${Math.round(size / 1024)}KB, ${pages.length} pages, ${imagePaths.length} images`,
);

/**
 * Builds a single self-contained HTML file of the whole site, for sharing as a
 * preview link before there is a domain to point at.
 *
 * The host page runs under a strict CSP that blocks every external request, so
 * the stylesheet, all three webfonts and every image have to be inlined into
 * one document. Nothing is re-authored: this takes the real server-rendered
 * HTML for each route and swaps its asset references for inline equivalents, so
 * the preview stays honest to what the site actually renders.
 *
 * Each route becomes a panel behind a hash router, and the menu filters are
 * re-implemented in a few lines of vanilla JS — they were always CSS-driven, so
 * there is nothing to reimplement beyond setting one attribute.
 *
 *   pnpm build && pnpm start -p 3210 &
 *   node scripts/build-preview.mjs http://localhost:3210 preview.html
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3210";
const OUT = process.argv[3] ?? "preview.html";

const ROUTES = ["/", "/menu", "/story", "/gallery", "/visit"];

const html = await fetch(BASE).then((r) => r.text());

/* ------------------------------------------------- CSS, with fonts inlined */

const cssHref = html.match(/href="([^"]*\.css[^"]*)"/)?.[1];
if (!cssHref) throw new Error("Could not find the stylesheet link in the page");
let css = await fetch(`${BASE}${cssHref}`).then((r) => r.text());

/**
 * Strip Tailwind's `@layer` wrappers so every rule becomes unlayered.
 *
 * The host page around this preview ships its own unlayered stylesheet, and in
 * the cascade *any* unlayered declaration beats *everything* inside a layer,
 * whatever the specificity. Left wrapped, a host rule as weak as
 * `body { color: #111 }` would override this site's base colour and render the
 * headline near-black on its own dark ground.
 */
function unwrapLayers(source) {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const at = source.indexOf("@layer", i);
    if (at === -1) {
      out += source.slice(i);
      break;
    }
    out += source.slice(i, at);
    let j = at + "@layer".length;
    while (j < source.length && source[j] !== "{" && source[j] !== ";") j++;
    if (source[j] === ";") {
      i = j + 1; // `@layer a, b;` — an ordering statement, no block. Drop it.
      continue;
    }
    let depth = 0;
    let k = j;
    for (; k < source.length; k++) {
      if (source[k] === "{") depth++;
      else if (source[k] === "}" && --depth === 0) break;
    }
    out += source.slice(j + 1, k); // keep the contents, lose the wrapper
    i = k + 1;
  }
  return out;
}

const layerCount = (css.match(/@layer/g) || []).length;
css = unwrapLayers(css);
console.error(`  unwrapped ${layerCount} @layer block(s)`);

// next/font's @font-face rules reference the woff2 files relative to the
// stylesheet (../media/…) as well as absolutely — match both forms.
const fontUrls = [
  ...new Set(
    [...css.matchAll(/url\(([^)"']*media\/[^)"']+\.woff2)\)/g)].map((m) => m[1]),
  ),
];

let inlinedFonts = 0;
for (const url of fontUrls) {
  const filename = url.split("/").pop();
  let buf;
  try {
    buf = await readFile(path.join(".next", "static", "media", filename));
  } catch {
    const res = await fetch(`${BASE}/_next/static/media/${filename}`);
    if (!res.ok) {
      console.error(`  WARNING: could not inline ${filename}`);
      continue;
    }
    buf = Buffer.from(await res.arrayBuffer());
  }
  css = css.replaceAll(
    `url(${url})`,
    `url(data:font/woff2;base64,${buf.toString("base64")})`,
  );
  inlinedFonts++;
}
if (inlinedFonts === 0) {
  throw new Error("No fonts inlined — the preview would fall back to system faces");
}
console.error(`  inlined ${inlinedFonts}/${fontUrls.length} font files`);

// next/font exposes --font-fraunces / --font-karla / --font-jetbrains through
// classes on <html>. The host supplies its own document shell, so those classes
// are lost and the type silently falls back to system sans. Hoist the same
// declarations onto :root.
// Next emits these as `.__variable_fdb222{--font-fraunces:…}` — the hash sits
// after the word, so the pattern has to allow characters on both sides of it.
const varDecls = [...css.matchAll(/\.[A-Za-z0-9_-]*variable[A-Za-z0-9_-]*\s*\{([^}]*)\}/g)]
  .map((m) => m[1].trim())
  .filter(Boolean);
if (!varDecls.length) {
  throw new Error("Could not find next/font variable declarations to hoist");
}
css += `\n:root{${varDecls.join(";")}}\n`;
console.error(`  hoisted ${varDecls.length} font variables onto :root`);

/* ---------------------------------------------------------------- markup */

const stripRuntime = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<template[\s\S]*?<\/template>/g, "")
    .replace(/<link[^>]*>/g, "")
    .replace(/<!--\$-->|<!--\/\$-->|<!--\$\?-->|<!--\/\$\?-->/g, "");

/** Point internal links at the hash router. tel:, mailto: and external URLs
 *  are left alone — the phone and WhatsApp links must stay live in a preview,
 *  since they are the thing being reviewed. */
function rewriteLinks(s) {
  return s.replace(/href="(\/[^"]*)"/g, (m, href) => {
    const clean = href.split("?")[0].replace(/\/$/, "") || "/";
    if (ROUTES.includes(clean)) return `href="#${clean}"`;
    return 'href="#/" data-inert="1"';
  });
}

/**
 * Swap every next/image URL for a data URI of the original file.
 *
 * srcset is dropped rather than inlined at each width: the browser would pick
 * one candidate and the other five would be dead weight in a document that has
 * to be downloaded whole.
 */
const imageCache = new Map();
async function inlineImages(s) {
  const urls = [
    ...new Set(
      [...s.matchAll(/\/_next\/image\?url=([^&"]+)&(?:amp;)?w=\d+&(?:amp;)?q=\d+/g)].map(
        (m) => decodeURIComponent(m[1]),
      ),
    ),
  ];
  for (const url of urls) {
    if (!imageCache.has(url)) {
      const buf = await readFile(path.join("public", url.replace(/^\//, "")));
      const ext = path.extname(url).slice(1).replace("jpg", "jpeg");
      imageCache.set(url, `data:image/${ext};base64,${buf.toString("base64")}`);
      console.error(`  inlined image ${url} (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }
  return s
    // React 19 serialises this as `srcSet`, capital S. A lowercase-only pattern
    // silently misses it and every one of the six candidate widths gets inlined
    // as its own copy of the image — 79 data URIs and a 5 MB file.
    .replace(/\ssrcSet="[^"]*"/gi, "")
    .replace(
      /\/_next\/image\?url=([^&"]+)&(?:amp;)?w=\d+&(?:amp;)?q=\d+/g,
      (m, enc) => imageCache.get(decodeURIComponent(enc)) ?? m,
    );
}

/**
 * The Google Maps embed cannot load here — the host CSP blocks every external
 * origin. Rather than show an empty frame that reads as a broken build, say so.
 */
function replaceMap(s) {
  return s.replace(
    /<iframe[\s\S]*?<\/iframe>|<iframe[^>]*\/?>/g,
    `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;text-align:center"><p class="font-mono text-meta uppercase text-wall-faint">Google map loads on the deployed site<br/>(blocked here by the preview sandbox)</p></div>`,
  );
}

/**
 * The host supplies its own <head>, so we cannot declare a charset. Escaping
 * non-ASCII as numeric entities makes the markup encoding-independent —
 * without it every em dash and curly quote mojibakes.
 */
const toEntities = (s) => s.replace(/[^\x00-\x7F]/g, (ch) => `&#${ch.charCodeAt(0)};`);

const prep = async (s) =>
  toEntities(replaceMap(await inlineImages(rewriteLinks(stripRuntime(s)))));

const grab = (source, tag) => {
  const start = source.indexOf(`<${tag}`);
  const end = source.lastIndexOf(`</${tag}>`);
  if (start === -1 || end === -1) return "";
  return source.slice(start, end + `</${tag}>`.length);
};

// Header, footer and the sticky action bar are identical on every route, so
// they are lifted out of the panels and rendered once.
const header = await prep(grab(html, "header"));
const footer = await prep(grab(html, "footer"));
const stickyStart = html.indexOf('<nav aria-label="Quick actions"');
const stickyEnd = html.indexOf("</nav>", stickyStart);
const sticky =
  stickyStart === -1
    ? ""
    : await prep(html.slice(stickyStart, stickyEnd + "</nav>".length));
if (!header || !footer) throw new Error("Could not extract shared header/footer");
if (!sticky) console.error("  WARNING: sticky action bar not found");

let panels = "";
for (const route of ROUTES) {
  const res = await fetch(`${BASE}${route}`);
  if (!res.ok) {
    console.error(`  WARNING: ${route} returned ${res.status}, skipping`);
    continue;
  }
  const main = grab(await res.text(), "main");
  if (!main) {
    console.error(`  WARNING: no <main> for ${route}, skipping`);
    continue;
  }
  panels += `<div data-route="${route}"${route === "/" ? "" : " hidden"}>${await prep(main)}</div>\n`;
  console.error(`  panel ${route.padEnd(10)} ${(main.length / 1024).toFixed(0)} KB`);
}

// The title has to sit at the very top: a host that scans for it only reads the
// first few KB of the file, and the inlined stylesheet below is far larger.
const page = `<title>Machen La Tibet Kitchen</title>
<style>
${css}

/* ---- preview-only ------------------------------------------------------ */

/* This design commits to one dark world; it is not theme-adaptive and the
   whole palette assumes a near-black ground. Pin it so a light-themed host
   cannot hand the page its own inherited text colour. */
:root { color-scheme: dark; }
:root[data-theme="light"], :root[data-theme="dark"] { color-scheme: dark; }
html, body {
  background-color: var(--color-ink) !important;
  color: var(--color-wall) !important;
}
/* Some host resets colour headings directly, which beats an inherited value. */
h1, h2, h3, h4, h5, h6 { color: inherit !important; }
h1 span, h2 span, h3 span { color: inherit; }
[hidden] { display: none !important; }

.preview-note {
  border-bottom: 1px solid var(--color-rule);
  padding: 0.75rem 1.25rem;
  background: #221b18;
}
</style>

<div class="preview-note">
  <p class="font-mono text-meta uppercase text-butter">
    Preview &#183; every photograph is a placeholder and no price is real &#183; see REPLACE-THESE.md
  </p>
</div>

${header}
<main>
${panels}
</main>
${footer}
${sticky}

<script>
(function () {
  /* ------------------------------------------------------------- router */
  var panels = Array.prototype.slice.call(
    document.querySelectorAll("[data-route]")
  );

  function swap() {
    var want = location.hash.slice(1) || "/";
    var found = false;
    panels.forEach(function (el) {
      var match = el.getAttribute("data-route") === want;
      el.hidden = !match;
      if (match) found = true;
    });
    if (!found) panels.forEach(function (el, i) { el.hidden = i !== 0; });
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", swap);
  swap();

  document.addEventListener("click", function (e) {
    var a = e.target.closest('[data-inert="1"]');
    if (a) e.preventDefault();
  });

  /* ------------------------------------------------------- menu filters */
  /* These were always CSS-driven — the React component only ever set one
     data attribute, so there is nothing else to reimplement. */
  var filterWrap = document.querySelector("[data-filter]");
  var buttons = Array.prototype.slice.call(
    document.querySelectorAll('button[aria-pressed]')
  );
  var LABEL_TO_FILTER = { "EVERYTHING": "all", "VEGETARIAN": "veg", "NOT HOT": "not-hot" };

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.textContent.trim().toUpperCase();
      var value = LABEL_TO_FILTER[key] || "all";
      if (filterWrap) filterWrap.setAttribute("data-filter", value);
      buttons.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-pressed", String(on));
        b.className = b.className
          .replace(/border-butter|text-butter/g, "")
          .replace(/\\s+/g, " ")
          .trim();
        if (on) b.className += " border-butter text-butter";
        else if (!/text-wall-dim/.test(b.className)) b.className += " text-wall-dim";
      });
    });
  });

  /* --------------------------------------------- menu category tab state */
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  if (tabs.length) {
    var sections = tabs
      .map(function (t) { return document.getElementById(t.getAttribute("data-tab")); })
      .filter(Boolean);

    var mark = function (id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-tab") === id;
        t.className = t.className.replace(/text-butter|text-wall-dim/g, "").trim() +
          (on ? " text-butter" : " text-wall-dim");
        var underline = t.querySelector("span");
        if (underline) {
          underline.className = underline.className
            .replace(/scale-x-100|scale-x-0/g, "")
            .trim() + (on ? " scale-x-100" : " scale-x-0");
        }
      });
    };

    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        })[0];
      if (visible) mark(visible.target.id);
    }, { rootMargin: "-96px 0px -60% 0px", threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }
})();
</script>`;

await writeFile(OUT, page, "utf8");
console.error(`\n  wrote ${OUT} — ${(page.length / 1024 / 1024).toFixed(2)} MB\n`);

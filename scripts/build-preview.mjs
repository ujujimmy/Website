/**
 * Builds a single self-contained HTML file of the homepage, for hosting as a
 * shareable preview link.
 *
 * The published page runs under a strict CSP that blocks every external host,
 * so the CSS, both webfonts and the whole three.js scene have to be inlined
 * into one document. Rather than re-authoring the page, this takes the real
 * server-rendered HTML and swaps its asset references for inline equivalents,
 * so the preview stays honest to what the site actually renders.
 *
 *   pnpm build && pnpm start -p 3100
 *   node scripts/build-preview.mjs http://localhost:3100 > preview.html
 */
import { readFile, writeFile } from "node:fs/promises";
import { build } from "esbuild";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3100";
const OUT = process.argv[3] ?? "preview.html";

const html = await fetch(BASE).then((r) => r.text());

/* ------------------------------------------------- CSS, with fonts inlined */

const cssHref = html.match(/href="([^"]*\.css[^"]*)"/)?.[1];
if (!cssHref) throw new Error("Could not find the stylesheet link in the page");

let css = await fetch(`${BASE}${cssHref}`).then((r) => r.text());

/**
 * Strip Tailwind's `@layer` wrappers so every rule becomes unlayered.
 *
 * The host page around this preview ships its own unlayered stylesheet, and
 * in the CSS cascade *any* unlayered declaration beats *everything* in a
 * layer, regardless of specificity. That let a host rule as weak as
 * `body { color: #111 }` override this site's base colour, rendering the
 * headline near-black on its own dark ground. Unwrapping puts the site's
 * rules on equal footing, where ordinary specificity applies and a class
 * utility (0,1,0) comfortably outranks a host element selector (0,0,1).
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

    // `@layer a, b, c;` — an ordering statement with no block. Just drop it.
    if (source[j] === ";") {
      i = j + 1;
      continue;
    }

    let depth = 0;
    let k = j;
    for (; k < source.length; k++) {
      if (source[k] === "{") depth++;
      else if (source[k] === "}" && --depth === 0) break;
    }
    out += source.slice(j + 1, k); // keep the block's contents, lose the wrapper
    i = k + 1;
  }
  return out;
}

const layerCount = (css.match(/@layer/g) || []).length;
css = unwrapLayers(css);
console.error(`  unwrapped ${layerCount} @layer block(s)`);

// next/font's @font-face rules reference the woff2 files *relative* to the
// stylesheet (../media/…), not by absolute path — match both forms.
const fontUrls = [
  ...new Set(
    [...css.matchAll(/url\(([^)"']*media\/[^)"']+\.woff2)\)/g)].map((m) => m[1]),
  ),
];

let inlined = 0;
for (const url of fontUrls) {
  const filename = url.split("/").pop();
  const httpUrl = `/_next/static/media/${filename}`;
  let buf;
  try {
    buf = await readFile(path.join(".next", "static", "media", filename));
  } catch {
    const res = await fetch(`${BASE}${httpUrl}`);
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
  inlined++;
}
if (inlined === 0) throw new Error("No fonts inlined — the page would fall back to system fonts");
console.error(`  inlined ${inlined}/${fontUrls.length} font files`);

// next/font exposes --font-inter / --font-display through classes on <html>.
// The published page supplies its own document shell, so those classes are
// lost and the type silently falls back to system sans. Hoist the same
// declarations onto :root instead.
const varDecls = [...css.matchAll(/\.[A-Za-z0-9_-]*variable\s*\{([^}]*)\}/g)]
  .map((m) => m[1].trim())
  .filter(Boolean);
if (!varDecls.length) {
  throw new Error("Could not find next/font variable declarations to hoist");
}
css += `\n:root{${varDecls.join(";")}}\n`;
console.error(`  hoisted ${varDecls.length} font variables onto :root`);

/* ----------------------------------------------------- the three.js scene */

const bundle = await build({
  entryPoints: ["scripts/preview-scene.js"],
  bundle: true,
  minify: true,
  format: "iife",
  globalName: "PreviewScene",
  target: "es2020",
  write: false,
  legalComments: "none",
});
const sceneJs = bundle.outputFiles[0].text;
console.error(`  bundled scene: ${(sceneJs.length / 1024).toFixed(0)} KB`);

/* ------------------------------------------------------------ page markup */

// Take the rendered body, drop Next's own scripts (there's no React runtime
// here) and the empty canvas mount, then re-add our own.
let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
body = body
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<template[\s\S]*?<\/template>/g, "")
  .replace(/<link[^>]*>/g, "")
  .replace(/<!--\$-->|<!--\/\$-->|<!--\$\?-->|<!--\/\$\?-->/g, "");

// Rewrite internal links: the preview is a single page, so anything pointing
// at another route becomes a no-op rather than a dead 404.
body = body.replace(/href="\/(?!\/)[^"]*"/g, (m) => {
  const href = m.slice(6, -1);
  return href.startsWith("/#") ? `href="${href.slice(1)}"` : 'href="#" data-inert="1"';
});

/**
 * The published page supplies its own <head>, so we can't declare a charset.
 * Escaping every non-ASCII character as a numeric entity makes the markup
 * encoding-independent — without this, em dashes and curly quotes mojibake.
 * Applied to markup only; entities are not decoded inside <script>.
 */
const toEntities = (s) =>
  s.replace(/[^\x00-\x7F]/g, (ch) => `&#${ch.charCodeAt(0)};`);

body = toEntities(body);

const css_ = css;

const page = `<style>
${css_}
/* This design commits to a single dark world — it is not theme-adaptive, and
   the whole palette is built for a near-black ground. Pin it so a light-themed
   host cannot hand the page its own inherited text colour, which is what made
   the headline render black-on-black. */
:root { color-scheme: dark; }
:root[data-theme="light"], :root[data-theme="dark"] { color-scheme: dark; }
html { background-color: var(--color-ink) !important; }
body {
  background-color: var(--color-ink) !important;
  color: var(--color-fg) !important;
}
/* Some host resets colour headings directly, which beats an inherited value.
   Safe to force: the gradient treatment is only ever applied to a <span>
   inside a heading, never to the heading element itself, and a class selector
   still outranks this one. */
h1, h2, h3, h4, h5, h6 { color: inherit !important; }
/* The headline reveal wraps each word in a bare span, so a host span rule
   would recolour the words themselves. Two element selectors (0,0,2) beat a
   host's (0,0,1) while still losing to .text-gradient (0,1,0), which is
   exactly the ordering we want. */
h1 span, h2 span, h3 span { color: inherit; }
/* Preview-only. The page's scroll reveals are motion-driven and ship with an
   inline opacity:0; with no React runtime here to animate them in, they must
   be forced visible or every section below the hero renders blank. */
.reveal { opacity: 1 !important; transform: none !important; }

/* Canvas replaces the React-mounted one. It must sit ABOVE the poster: both
   are negative z-index, and the poster (which paints an opaque bg-ink layer)
   comes later in document order, so at equal z-index it would cover the
   canvas entirely. */
#scene-canvas {
  position: fixed;
  inset: 0;
  z-index: -9;
  pointer-events: none;
  display: block;
  width: 100%;
  height: 100%;
}
.preview-note {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: rgba(15, 18, 29, 0.92);
  color: var(--color-muted);
  font-size: 0.72rem;
  line-height: 1;
  letter-spacing: 0.01em;
}
.preview-note b { color: var(--color-fg); font-weight: 600; }
@media (max-width: 640px) { .preview-note { display: none; } }
</style>

<canvas id="scene-canvas" aria-hidden="true"></canvas>

${body}

<p class="preview-note">
  <b>Preview</b> &mdash; homepage only. Other pages and the audit form are live in the repo.
</p>

<script>${sceneJs}</script>
<script>
(function () {
  var canvas = document.getElementById("scene-canvas");
  function size() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  size();
  window.addEventListener("resize", size);
  try { PreviewScene.startScene(canvas); } catch (e) { console.error(e); }

  // Header solidifies once you scroll past the hero.
  var header = document.querySelector("header");
  if (header) {
    var onScroll = function () {
      var on = window.scrollY > 24;
      header.classList.toggle("border-line/70", on);
      header.classList.toggle("bg-ink/80", on);
      header.classList.toggle("backdrop-blur-xl", on);
      header.classList.toggle("border-transparent", !on);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Currency toggle on the pricing preview.
  var priceEls = document.querySelectorAll("[data-price-usd]");
  document.querySelectorAll('[role="group"][aria-label="Currency"] button').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cur = btn.textContent.trim();
      btn.parentElement.querySelectorAll("button").forEach(function (b) {
        var active = b === btn;
        b.setAttribute("aria-pressed", String(active));
        b.className = active
          ? "rounded-full px-4 py-1.5 text-xs font-medium transition-all bg-linear-to-r from-brand to-brand-2 text-ink"
          : "rounded-full px-4 py-1.5 text-xs font-medium transition-all text-muted hover:text-fg";
      });
      priceEls.forEach(function (el) {
        el.textContent = el.getAttribute(cur === "INR" ? "data-price-inr" : "data-price-usd");
      });
    });
  });

  // Links to other routes don't exist in a one-page preview.
  document.querySelectorAll('[data-inert="1"]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
})();
</script>`;

await writeFile(OUT, page, "utf8");
console.error(`  wrote ${OUT}: ${(page.length / 1024).toFixed(0)} KB`);

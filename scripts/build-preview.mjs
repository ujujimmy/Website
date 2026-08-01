/**
 * Builds a single self-contained HTML file of the whole site, for hosting as
 * a shareable preview link.
 *
 * The published page runs under a strict CSP that blocks every external host,
 * so the CSS, both webfonts and the whole three.js scene have to be inlined
 * into one document. Rather than re-authoring anything, this takes the real
 * server-rendered HTML for each route and swaps its asset references for
 * inline equivalents, so the preview stays honest to what the site renders.
 *
 * Every route is bundled as a panel and a hash router swaps between them, so
 * navigation, the pricing table and the audit form all actually work.
 *
 *   pnpm build && pnpm start -p 3100
 *   pnpm preview http://localhost:3100 preview.html
 */
import { readFile, writeFile } from "node:fs/promises";
import { build } from "esbuild";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3100";
const OUT = process.argv[3] ?? "preview.html";

/** Every route the preview can reach. Order sets the nav fallback. */
const ROUTES = [
  "/",
  "/services",
  "/services/google-reviews",
  "/services/web-design",
  "/services/seo",
  "/work",
  "/pricing",
  "/about",
  "/contact",
  "/audit",
  "/thank-you",
];

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
  inlined++;
}
if (inlined === 0) {
  throw new Error("No fonts inlined — the page would fall back to system fonts");
}
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

const stripRuntime = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<template[\s\S]*?<\/template>/g, "")
    .replace(/<link[^>]*>/g, "")
    .replace(/<!--\$-->|<!--\/\$-->|<!--\$\?-->|<!--\/\$\?-->/g, "");

/**
 * Point internal links at the hash router instead of a server route. Anchors,
 * mailto:, tel: and external URLs are left alone. A query string is dropped —
 * `/audit?plan=growth` and `/audit` are the same panel here.
 */
function rewriteLinks(s) {
  return s.replace(/href="(\/[^"]*)"/g, (m, href) => {
    if (href.startsWith("/#")) return `href="${href.slice(1)}"`;
    const clean = href.split("?")[0].replace(/\/$/, "") || "/";
    if (ROUTES.includes(clean)) return `href="#${clean}"`;
    return 'href="#/" data-inert="1"';
  });
}

/**
 * The published page supplies its own <head>, so we can't declare a charset.
 * Escaping every non-ASCII character as a numeric entity makes the markup
 * encoding-independent — without this, em dashes and curly quotes mojibake.
 * Applied to markup only; entities are not decoded inside <script>.
 */
const toEntities = (s) =>
  s.replace(/[^\x00-\x7F]/g, (ch) => `&#${ch.charCodeAt(0)};`);

const prep = (s) => toEntities(rewriteLinks(stripRuntime(s)));

/** Shared chrome, taken once from the homepage. */
const grab = (source, tag) => {
  const start = source.indexOf(`<${tag}`);
  const end = source.lastIndexOf(`</${tag}>`);
  if (start === -1 || end === -1) return "";
  return source.slice(start, end + `</${tag}>`.length);
};

const header = prep(grab(html, "header"));
const footer = prep(grab(html, "footer"));
if (!header || !footer) throw new Error("Could not extract shared header/footer");

/**
 * Extract one element by walking nested open/close tags.
 *
 * A non-greedy regex is not good enough here: the poster is a <div> with four
 * sibling <div> children, so `[\s\S]*?</div></div>` stops at the first close
 * pair and truncates it. That leaves unbalanced markup, which the parser then
 * re-nests — and the WebGL canvas ended up inside it, invisible.
 */
function grabElement(source, startIndex, tag = "div") {
  const open = new RegExp(`<${tag}[\\s>]`, "g");
  const close = new RegExp(`</${tag}>`, "g");
  let depth = 0;
  let i = startIndex;
  while (i < source.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(source);
    const c = close.exec(source);
    if (!c) return null;
    if (o && o.index < c.index) {
      depth++;
      i = o.index + 1;
    } else {
      depth--;
      i = c.index + `</${tag}>`.length;
      if (depth === 0) return source.slice(startIndex, i);
    }
  }
  return null;
}

// The poster sits behind everything and is identical on every route, so it is
// lifted out of the route panels and rendered once.
const posterStart = html.indexOf(
  '<div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10">',
);
const poster = posterStart === -1 ? "" : grabElement(html, posterStart) ?? "";
if (!poster) console.error("  WARNING: poster not found — background will be flat");
else console.error(`  poster extracted: ${poster.length} bytes`);

// First-visit intro. Lives outside <main>, so it has to be lifted separately.
const introStart = html.indexOf('<div class="intro"');
const intro = introStart === -1 ? "" : toEntities(grabElement(html, introStart) ?? "");
if (!intro) console.error("  WARNING: intro not found");
else console.error(`  intro extracted: ${intro.length} bytes`);

let panels = "";
for (const route of ROUTES) {
  const res = await fetch(`${BASE}${route}`);
  if (!res.ok) {
    console.error(`  WARNING: ${route} returned ${res.status}, skipping`);
    continue;
  }
  const pageHtml = await res.text();
  const main = grab(pageHtml, "main");
  if (!main) {
    console.error(`  WARNING: no <main> found for ${route}, skipping`);
    continue;
  }
  panels += `<div data-route="${route}"${route === "/" ? "" : " hidden"}>${prep(main)}</div>\n`;
  console.error(`  panel ${route.padEnd(26)} ${(main.length / 1024).toFixed(0)} KB`);
}

const page = `<style>
${css}
/* This design commits to a single dark world — it is not theme-adaptive, and
   the whole palette is built for a near-black ground. Pin it so a light-themed
   host cannot hand the page its own inherited text colour, which is what made
   the headline render black-on-black. */
:root { color-scheme: dark; }
:root[data-theme="light"], :root[data-theme="dark"] { color-scheme: dark; }
/* The dark ground lives on <html> ONLY. Setting it on both html and body
   stops body's background being propagated to the root, so body paints it as
   an ordinary element background — which lands ON TOP of the negative
   z-index poster and WebGL canvas and hides the entire particle scene. */
html { background-color: var(--color-ink) !important; }
body {
  background-color: transparent !important;
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
[hidden] { display: none !important; }

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
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: rgba(15, 18, 29, 0.92);
  color: var(--color-muted);
  font-size: 0.72rem;
  line-height: 1;
}
.preview-note b { color: var(--color-fg); font-weight: 600; }
@media (max-width: 640px) { .preview-note { display: none; } }
</style>

<script>
/* Runs during parse, before the intro below is painted, so a visitor who has
   already seen it this session never gets a flash of it. */
try{if(sessionStorage.getItem('nb:intro')==='1')document.documentElement.classList.add('intro-done')}catch(e){}
</script>
${intro}

<canvas id="scene-canvas" aria-hidden="true"></canvas>
${poster}
${header}
<div id="main">
${panels}</div>
${footer}

<p class="preview-note">
  <b>Preview</b> &mdash; fully clickable. The audit form is a demo; it sends nothing.
</p>

<script>${sceneJs}</script>
<script>
(function () {
  /* --------------------------------------------------------------- intro */
  // Matches the CSS: 1020ms delay + 650ms lift, plus slack.
  setTimeout(function () {
    document.documentElement.classList.add("intro-done");
    try { sessionStorage.setItem("nb:intro", "1"); } catch (e) {}
  }, 1750);

  /* ------------------------------------------------------------- 3D scene */
  var canvas = document.getElementById("scene-canvas");
  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);
  try { PreviewScene.startScene(canvas); } catch (e) { console.error(e); }

  /* -------------------------------------------------------------- router */
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-route]"));
  function swap() {
    var want = (location.hash || "#/").slice(1).split("?")[0] || "/";
    var found = false;
    panels.forEach(function (el) {
      var match = el.getAttribute("data-route") === want;
      el.hidden = !match;
      if (match) found = true;
    });
    if (!found) panels.forEach(function (el, i) { el.hidden = i !== 0; });
    window.scrollTo(0, 0);
    // The scene measures the homepage's beat sections; tell it to re-measure
    // now that a different panel is visible.
    window.dispatchEvent(new Event("resize"));
  }

  window.addEventListener("hashchange", swap);
  swap();

  /* --------------------------------------------------------- page chrome */
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

  // Mobile menu.
  var menuBtn = document.querySelector('[aria-controls="mobile-menu"]');
  var menu = document.getElementById("mobile-menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = menu.hasAttribute("hidden");
      if (open) menu.removeAttribute("hidden"); else menu.setAttribute("hidden", "");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest('[data-inert="1"]');
    if (a) e.preventDefault();
  });

  /* ------------------------------------------------------ currency toggle */
  document.querySelectorAll('[role="group"][aria-label="Currency"]').forEach(function (group) {
    group.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cur = btn.textContent.trim();
        group.querySelectorAll("button").forEach(function (b) {
          var active = b === btn;
          b.setAttribute("aria-pressed", String(active));
          b.className = active
            ? "rounded-full px-4 py-1.5 text-xs font-medium transition-all bg-linear-to-r from-brand to-brand-2 text-ink"
            : "rounded-full px-4 py-1.5 text-xs font-medium transition-all text-muted hover:text-fg";
        });
        var scope = group.closest("[data-route]") || document;
        scope.querySelectorAll("[data-price-usd]").forEach(function (el) {
          el.textContent = el.getAttribute(cur === "INR" ? "data-price-inr" : "data-price-usd");
        });
      });
    });
  });

  /* ----------------------------------------------------------- audit form */
  var form = document.querySelector("form");
  if (form) {
    var stepPanels = form.querySelectorAll("[data-step]");
    var headings = form.querySelectorAll("h2");
    var bars = form.querySelectorAll(".flex-1 span:first-child");
    var current = 0;

    function show(n) {
      current = n;
      stepPanels.forEach(function (el, i) { el.hidden = i !== n; });
      headings.forEach(function (el, i) { el.hidden = i !== n; });
      bars.forEach(function (el, i) {
        el.className = "h-0.5 rounded-full transition-all duration-500 " +
          (i <= n ? "bg-linear-to-r from-brand to-brand-2" : "bg-line");
      });
      back.hidden = n === 0;
      next.hidden = n === stepPanels.length - 1;
      submit.hidden = n !== stepPanels.length - 1;
    }

    function invalid(el, msg) {
      var wrap = el.closest("label") || el.parentElement;
      var old = wrap.querySelector(".preview-error");
      if (old) old.remove();
      if (!msg) return false;
      var p = document.createElement("span");
      p.className = "preview-error text-xs text-danger";
      p.setAttribute("role", "alert");
      p.textContent = msg;
      wrap.appendChild(p);
      return true;
    }

    function validate(n) {
      var panel = stepPanels[n];
      var bad = false;
      panel.querySelectorAll("input, select").forEach(function (el) {
        if (el.type === "radio" || el.name === "company_website") return;
        var need = ["business", "name", "email", "country"].indexOf(el.name) !== -1;
        var v = (el.value || "").trim();
        if (need && v.length < 2) {
          bad = invalid(el, "This field is required") || bad;
        } else if (el.name === "email" && v && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(v)) {
          bad = invalid(el, "Please enter a valid email address") || bad;
        } else {
          invalid(el, null);
        }
      });
      return !bad;
    }

    // Rebuild the footer controls: the server rendered only step 1's button.
    var controls = form.querySelector("button").parentElement;
    controls.innerHTML = "";
    var cls = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap h-11 px-6 text-[0.95rem] ";
    var primary = cls + "bg-linear-to-r from-brand to-brand-2 text-ink font-semibold flex-1";
    var back = document.createElement("button");
    back.type = "button";
    back.className = cls + "glass text-fg";
    back.textContent = "Back";
    var next = document.createElement("button");
    next.type = "button";
    next.className = primary;
    next.textContent = "Continue";
    var submit = document.createElement("button");
    submit.type = "button";
    submit.className = primary;
    submit.textContent = "Send me the audit";
    controls.appendChild(back);
    controls.appendChild(next);
    controls.appendChild(submit);

    back.addEventListener("click", function () { show(Math.max(0, current - 1)); });
    next.addEventListener("click", function () {
      if (validate(current)) show(Math.min(stepPanels.length - 1, current + 1));
    });
    submit.addEventListener("click", function () {
      if (!validate(current)) return;
      submit.disabled = true;
      submit.textContent = "Sending\\u2026";
      setTimeout(function () { location.hash = "#/thank-you"; }, 550);
    });

    show(0);
  }
})();
</script>`;

await writeFile(OUT, page, "utf8");
console.error(`  wrote ${OUT}: ${(page.length / 1024).toFixed(0)} KB`);

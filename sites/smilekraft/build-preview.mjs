/**
 * Inlines styles.css and script.js into index.html to produce ONE self-contained
 * HTML file — the version you send a client over WhatsApp or email. It opens by
 * double-click, with no server and no network (bar the embedded map, which needs
 * a connection and simply stays blank without one).
 *
 *   node sites/smilekraft/build-preview.mjs [outfile]
 *
 * Defaults to sites/smilekraft/smilekraft-preview.html.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] || resolve(here, "smilekraft-preview.html"));

const html = readFileSync(resolve(here, "index.html"), "utf8");
const css = readFileSync(resolve(here, "styles.css"), "utf8");
const js = readFileSync(resolve(here, "script.js"), "utf8");

// A literal "</script>" inside JS would close the tag early. Nothing in script.js
// contains one today, but the guard costs nothing and outlives that assumption.
const safeJs = js.replace(/<\/script>/gi, "<\\/script>");

const inlined = html
  .replace(
    '<link rel="stylesheet" href="styles.css" />',
    `<style>\n${css}\n</style>`
  )
  .replace(
    '<script src="script.js" defer></script>',
    `<script>\n${safeJs}\n</script>`
  );

if (inlined.includes('href="styles.css"') || inlined.includes('src="script.js"')) {
  console.error("Could not inline both assets — the tags in index.html changed shape.");
  process.exit(1);
}

writeFileSync(out, inlined);
console.log(`${out}  (${(Buffer.byteLength(inlined) / 1024).toFixed(1)} KB)`);

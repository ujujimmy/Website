#!/usr/bin/env node
/**
 * Builds the static site into dist/. No dependencies — `node build.mjs`.
 *
 * Per language: the generic landing page, one landing page per trade (so each
 * Meta ad can land on a headline naming that trade), a thank-you page and a
 * privacy policy.
 */

import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import config from "./src/config.mjs";
import en from "./src/i18n/en.mjs";
import fr from "./src/i18n/fr.mjs";
import nl from "./src/i18n/nl.mjs";
import { TRADES, landing, landingPath, privacy, privacyPath, root, thanks } from "./src/render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "dist");
const byCode = { nl, fr, en };
const all = config.languages.map((c) => byCode[c]);

const css = (await readFile(join(here, "src/assets/styles.css"), "utf8"))
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>])\s*/g, "$1")
  .trim();
const appJs = await readFile(join(here, "src/assets/app.js"));
const jsHash = createHash("sha1").update(appJs).digest("hex").slice(0, 10);

await rm(out, { recursive: true, force: true });

const write = async (path, html) => {
  const file = join(out, path, path.endsWith(".html") || path.includes(".") ? "" : "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
};

const urls = [];
for (const t of all) {
  await write(landingPath(t), landing(t, all, css, jsHash));
  urls.push(landingPath(t));
  for (const trade of TRADES) {
    await write(landingPath(t, trade), landing(t, all, css, jsHash, trade));
    urls.push(landingPath(t, trade));
  }
  await write(`/${t.code}/${t.slugs.thanks}/`, thanks(t, all, css, jsHash));
  await write(privacyPath(t), privacy(t, all, css, jsHash));
  urls.push(privacyPath(t));
}

await write("/index.html", root(all));
await write("/404.html", root(all)); // unknown URLs land on the visitor's language
// Netlify reads _headers from the publish folder (Vercel uses vercel.json instead)
await writeFile(join(out, "_headers"), `/app.js
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/demo/*
  Cache-Control: public, max-age=604800
/og/*
  Cache-Control: public, max-age=604800
/brand/*
  Cache-Control: public, max-age=604800
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`);
await writeFile(join(out, "app.js"), appJs);
await cp(join(here, "src/assets/brand"), join(out, "brand"), { recursive: true });
// browsers and iOS look for these two at the root
await copyFile(join(here, "src/assets/brand/favicon.ico"), join(out, "favicon.ico"));
await copyFile(join(here, "src/assets/brand/apple-touch-icon.png"), join(out, "apple-touch-icon.png"));
await writeFile(join(out, "site.webmanifest"), JSON.stringify({
  name: "PinRank Belgium", short_name: config.brand, start_url: `/${config.defaultLanguage}/`, display: "browser",
  background_color: "#fbfbf9", theme_color: "#1c5482",
  icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" }],
}, null, 2));
await cp(join(here, "src/assets/fonts"), join(out, "fonts"), { recursive: true });
await cp(join(here, "src/assets/demo"), join(out, "demo"), { recursive: true }).catch(() => console.warn("⚠️  No demo video yet: run scripts/demo-video.mjs"));
await cp(join(here, "src/assets/og"), join(out, "og"), { recursive: true }).catch(() => console.warn("⚠️  No link-preview images yet: run scripts/og.mjs"));
await writeFile(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
await writeFile(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${config.siteUrl}${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);

console.log(`Built ${urls.length + all.length + 1} pages into dist/`);
console.log("\nAd landing pages:");
for (const t of all) {
  console.log(`  ${t.label}  ${landingPath(t)}  ${TRADES.map((k) => landingPath(t, k)).join("  ")}`);
}

// Loud reminders: every one of these is something a visitor or Meta's ad review would notice.
const src = await readFile(join(here, "src/config.mjs"), "utf8");
const todos = src.split("\n").filter((l) => /TODO\([a-z]+\)/.test(l));
if (todos.length) {
  console.log(`\n⚠️  ${todos.length} TODO(s) in src/config.mjs before going live:`);
  for (const l of todos) console.log("   " + l.trim());
}

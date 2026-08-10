import { launch } from "./launch.mjs";

const ROUTES = [
  "/", "/services", "/services/cuts-and-styling", "/services/hair-color",
  "/services/hair-extensions", "/services/treatments", "/menu", "/about",
  "/founder", "/team", "/gallery", "/reviews", "/visit",
];

const b = await launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
p.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
p.on("requestfailed", (r) => console.log("FAILED REQ:", r.url().slice(0, 80)));

await p.goto("http://localhost:3300/dechen-preview.html", { waitUntil: "load" });
await p.waitForTimeout(1000);

let bad = 0;
for (const route of ROUTES) {
  await p.evaluate((r) => { location.hash = r; }, route);
  await p.waitForTimeout(500);
  const info = await p.evaluate(() => {
    const shown = [...document.querySelectorAll(".pv-page")].filter((e) => !e.hidden);
    const el = shown[0];
    const h = el && el.querySelector("h1, h2");
    const imgs = el ? [...el.querySelectorAll("img")] : [];
    return {
      visible: shown.length,
      route: el && el.dataset.route,
      heading: h && h.textContent.trim().slice(0, 44),
      text: el ? el.innerText.trim().length : 0,
      brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      title: document.title.slice(0, 40),
    };
  });
  const ok = info.visible === 1 && info.route === route && info.text > 200 && info.brokenImgs === 0;
  if (!ok) bad++;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${route.padEnd(30)} ${String(info.text).padStart(5)} chars  ${info.heading ?? "-"}`,
  );
}

// Every link in the document must resolve to a page or an external target.
const dangling = await p.evaluate((routes) => {
  const out = [];
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (/^(https?:|tel:|mailto:|#[^/])/.test(href)) return;
    const r = href.startsWith("#") ? href.slice(1) : href;
    if (!routes.includes(r)) out.push(href);
  });
  return [...new Set(out)];
}, ROUTES);
console.log(dangling.length ? "\nDANGLING LINKS: " + dangling.join(", ") : "\nNo dangling links.");

console.log(bad === 0 && dangling.length === 0 ? "\nAll pages good." : `\n${bad} page(s) failed.`);
await b.close();

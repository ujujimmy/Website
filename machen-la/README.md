# MACHEN LA Tibet Kitchen

Website for a Tibetan restaurant at Rabsel House 47, Majnu-ka-Tilla, Delhi.

**Read [REPLACE-THESE.md](./REPLACE-THESE.md) before this goes live.** Every
photograph is a placeholder and no price on the site is real.

---

## The idea the site is built on

Almost every restaurant in Majnu ka Tilla opens at noon. Machen La opens at
**7:30 in the morning**, and MKT is the bus terminus for Dharamsala and the
hills — so travellers come off overnight buses at dawn into a colony that is
still shut. Machen La is the first kitchen open.

Everything on the site serves one moment: someone standing in the lane with a
phone, choosing between this and seven other places within a hundred metres.
That is why the sticky Call / Directions / Reserve bar is the most important
element in the build, why the whole thing is designed at 360px first, and why
the palette is dark enough to read in a dim lane at night.

---

## Running it

```bash
pnpm install
pnpm dev              # http://localhost:3000

pnpm build            # prints every unverified menu field as it goes
pnpm start

pnpm typecheck
pnpm placeholders     # regenerate the placeholder images

# Screenshots + the overflow and tap-target assertions.
# Needs a running server.
pnpm build && pnpm start -p 3210 &
node scripts/screenshots.mjs
```

Node 22, pnpm 10.

In this container Playwright's bundled Chromium is a different build to the one
installed, so pass the binary explicitly:

```bash
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/screenshots.mjs
```

---

## Measured

Lighthouse, mobile preset — 4× CPU throttle, simulated slow 4G — against
`next start` on this machine.

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 97–99 | 100 | 100 | 100 | 2.2–2.6 s | 0 | 40 ms |
| `/menu` | 97–98 | 100 | 100 | 100 | 2.3–2.6 s | 0 | 70–120 ms |
| `/visit` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 40 ms |

Three honest caveats on those numbers:

- **`/visit` was measured without the map ever loading.** The container this was
  built in has no outbound route to `google.com`, so the iframe request failed
  on every run. The aspect-ratio box means CLS stays 0 either way, but the
  network and CPU cost of the embed itself is unmeasured. Re-run
  `node scripts/lighthouse.mjs /visit` against the deployed site before trusting
  that 99.

- **LCP is 2.2 s against a 2.0 s target.** 457 ms of it is TTFB from a local
  Node server; a prerendered page off Vercel's edge answers in a fraction of
  that, which is the whole gap. The rest is font swap-in, already cut from 2.9 s
  by dropping two unused Fraunces axes and preloading Karla. Worth re-measuring
  against the real domain before treating it as a problem.
- **First Load JS is 109 KB gzipped against a 100 KB budget.** 102 KB of that is
  the Next 15 App Router and React baseline — the floor for any page in this
  stack, `/_not-found` included. This site's own code is about 7 KB gzipped:
  the live open/closed strip and the menu tabs, and nothing else. Getting under
  100 KB means leaving the framework the brief specifies, not trimming the site.

Verified separately, by assertion rather than by eye — see
`scripts/screenshots.mjs`:

- no horizontal overflow on any page at 360, 390, 430, 740 (landscape) or 1440,
  measured as `scrollWidth <= clientWidth` rather than patched with
  `overflow-x: hidden`
- no interactive target under 44 px on its short side at any mobile width

## Where things live

```
src/data/          Every fact about the restaurant. Hand-edited, no CMS.
  site.ts            NAP, hours, links, SITE_URL. One source for all of it.
  menu.ts            The menu. Nullable prices, heat and veg — read the header.
  faq.ts             /visit questions AND the FAQPage schema, from one array.
  reviews.ts         Paraphrased Google review lines.
  images.ts          Image slots, with the display cap for each.
src/components/    Primitives. PechaRow is the signature element.
src/lib/seo.ts     All structured data and per-page metadata.
scripts/           Placeholder generation, menu audit, screenshots, Lighthouse.
```

To change a price, an address, an opening hour or a dish, edit `src/data/`.
Nothing else should need touching.

---

## Design decisions worth knowing

**Warm dark, not a bright café template.** Ink `#1A1614` ground, monastery-wall
`#EDE6D8` text, Nyingma maroon and butter-lamp gold carrying the design, thangka
indigo and jade only as small markers on the menu.

**Maroon never carries text.** `--dzong` measures 1.74:1 against the ink ground,
which is unreadable, so it is structural only — frames, rules, fields. Where a
maroon has to carry text there is `--dzong-lit` at 4.6:1, and hairlines use
`--rule` at 2.7:1 so they are actually visible. All of it is documented and
measured in `globals.css`.

**The pecha menu.** The menu is set as a Tibetan loose-leaf scripture folio:
each dish is one folio line, held inside a double maroon rule, name in Fraunces
left and price in mono hard right on the same baseline. The name may wrap; the
price structurally cannot fall beneath it. This is the thing the site is
remembered for and everything else is kept quiet around it.

**Type-led hero.** No full-bleed photograph. The source images are compressed
~1080px Instagram files and stretching one to viewport width would show it. The
type carries the page and one image sits under it in a contained frame.

**Two moments of motion in the whole site** — the hero rule drawing once on
load, and the menu category underline. Nothing fades up on scroll. Both are
removed under `prefers-reduced-motion`.

**The map is embedded, and the action links still come first.** `/visit` carries
a Google Maps iframe (`src/components/MapEmbed.tsx`), placed below the address,
the hours and the three action links. It is lazy-loaded and sits in an
aspect-ratio box that reserves its space, so it neither competes for first paint
nor shifts the page — CLS on the route is 0 with it in. Call, Directions and
WhatsApp stay above it, because an embed shows you where a place is but
turn-by-turn happens in the app holding your GPS. The embed is keyless, so
there is no API key or billing account to maintain.

**Filtering is CSS, not React.** The menu filters set one data attribute and CSS
hides rows, so every dish stays in the server-rendered HTML whatever is
selected — a crawler, and a visitor with JS blocked, always sees the whole menu.

---

## Deploying

Vercel, with the project root set to this folder if it is still inside the
parent repository.

The site is fully static — every route is prerendered at build time and there is
no server logic anywhere. It deliberately does **not** use `output: "export"`,
because an exported build forces `images.unoptimized` and next/image then serves
the original JPEG with no AVIF, no WebP and no responsive srcset. Given the
sources are already compressed, that is the one thing worth keeping the image
pipeline for. If you ever need a portable `out/` folder instead, the switch and
its consequences are documented at the top of `next.config.ts`.

Set nothing. There are no environment variables and no third-party services.

# DECHEN Salon

Website for **DECHEN Salon**, a women-led, Tibetan-owned salon in Majnu-ka-Tilla,
New Delhi, founded by **Dechen Dolkar** — India's first Master Hair Extensions
Trainer and an All-India Educator for Olaplex, Balmain and BBCOS Italy.

Baby pink, gold and deep plum, taken from the salon's own printed catalog.
Thirteen pages, every price published, booking by WhatsApp and phone.

It builds to **plain static HTML** — no server, no serverless functions, no cold
starts. Host it anywhere.

> This directory is self-contained. The app in the repository root is a
> different business and shares nothing with it.

---

## Deploying to Netlify

The whole config lives in `netlify.toml`. There is one setting you must get
right, because this repository contains two different websites.

1. **netlify.com → Add new site → Import an existing project → GitHub**, and
   pick `ujujimmy/Website`.
2. On the settings screen, open **Base directory** and set it to:

   ```
   dechen-salon
   ```

   This is the important one. Leave it blank and Netlify builds the wrong site.

3. Everything else is filled in from `netlify.toml` — build command `pnpm build`,
   publish directory `out`, Node 22. Don't override them.
4. **Deploy.** First build takes a couple of minutes; you get a
   `something.netlify.app` address.
5. To use the real domain: **Domain management → Add a domain**, enter
   `dechensalon.com`, and point the domain's nameservers or DNS records where
   Netlify tells you. HTTPS is issued automatically.

Every push to the branch redeploys. Pull requests get their own preview URL.

### Deploying by hand instead

```bash
cd dechen-salon
pnpm install
pnpm build          # writes ./out
npx netlify-cli deploy --dir=out --prod
```

Or drag the `out` folder onto the Netlify dashboard. It is only static files.

---

## ⚠️ Before it goes live

Two things are still placeholders. Search the codebase for `TODO(salon)`.

| What | Where | Currently |
|---|---|---|
| **Street address** | `content/brand.ts` → `address` | A guess based on the area |
| **Opening hours** | `content/brand.ts` → `hours` | "Every day, 10:00 am – 8:00 pm" |

Both appear in the page footer, on `/visit`, and in the Google structured data,
so a wrong address is a wrong address everywhere.

The phone and WhatsApp number (**+91 97736 71272**) are in and correct. Every
booking link on the site is built from `brand.contact.whatsapp`, which must stay
digits-only with the country code first: `919773671272`.

### Photographs

`content/images.ts` is the manifest — swapping a picture is one edit there.
Everything in `public/img/` was extracted from the salon's catalog PDF. Two are
genuinely the salon's own (Dechen's portrait, the extension bundles); the rest
are the model and reference shots the catalog uses. **Real photographs of
DECHEN's own clients and interior would be a significant upgrade.**

To add one: drop the file into `public/img/`, run `pnpm images` to encode it,
then add or update its entry in `content/images.ts`.

---

## Running it

```bash
pnpm install
pnpm dev                    # http://localhost:3000

pnpm build                  # static export into ./out
pnpm preview                # serve ./out at http://localhost:3200
pnpm typecheck

# One shareable HTML file containing the whole site, for sending to someone
# who just wants to look at it. Navigation works via hash routing.
pnpm preview-file preview.html
pnpm preview-check          # asserts all 13 pages render and no link dangles

# Verification, against a running preview
pnpm shots       http://localhost:3200 shots   # every route, desktop & mobile
pnpm a11y        http://localhost:3200         # axe, WCAG 2.1 AA, non-zero exit on failure
pnpm lighthouse  http://localhost:3200

pnpm images                 # re-encode public/img to WebP
pnpm extract-images <pdf>   # pull photographs out of a new catalog
```

Node 22, pnpm 10.

---

## The pages

| Route | |
|---|---|
| `/` | Hero, philosophy, services, colour, extensions, founder, tiers, lookbook, reviews, visit |
| `/services` + 4 chapters | Cuts & styling, colour, extensions, treatments |
| `/menu` | The complete price list, filterable by stylist tier |
| `/about` | The philosophy and the eight pillars |
| `/founder` | Dechen's story and credentials |
| `/team` | The three stylist tiers |
| `/gallery` | The lookbook and an Olaplex before/after |
| `/reviews` | Both client reviews |
| `/visit` | Address, hours, map, tap-to-call |

Plus a 404 page, `robots.txt`, `sitemap.xml`, a favicon and a social share card.

---

## Content

Nothing on this site is invented. The philosophy, the eight pillars, Dechen's
bio and quote, the three stylist tiers, every price and both client reviews are
transcribed from the salon's catalog.

| File | What it holds |
|---|---|
| `content/brand.ts` | Name, tagline, contact, hours, WhatsApp link builders |
| `content/menu.ts` | **Every service and price**, and the five shade families |
| `content/tiers.ts` | Top Artist / Creative Artist / Creative Director |
| `content/founder.ts` | Dechen's quote, bio and credentials |
| `content/philosophy.ts` | The philosophy and the eight pillars |
| `content/reviews.ts` | The two real reviews |
| `content/images.ts` | Image manifest with dimensions and alt text |

Prices are transcribed exactly. Where the catalog printed a range it is a range,
where it said "onwards" it is a starting price, and where it said "Consult" no
number is shown. A price a client cannot rely on is worse than no price.

Booking is **WhatsApp and phone only** — no form, no scheduler. Every price row
links to WhatsApp with that service already named in the message.

---

## How the motion works

Three entrances, used sparingly, all CSS. `RevealRoot` is the only JavaScript
involved: one shared IntersectionObserver for the whole page that stamps
`data-shown` on elements as they arrive.

| | Where | What |
|---|---|---|
| `Rise` | Above the fold | Plain CSS animation on first paint. Never waits for hydration. |
| `Reveal` | Below the fold | Fade and lift as it scrolls into view. |
| `Reveal variant="mask"` | Section headings | The line rises from behind its own edge. |
| `Reveal variant="image"` | Feature photographs | A wipe up the frame, the picture settling out of a slight push-in. |

Two rules this follows, both learned the hard way:

- **The hero `h1` has no entrance at all.** A transparent element has not been
  painted, so animating the largest-contentful-paint element pushes the metric
  out by seconds on a slow phone.
- **A clip-path reveal clips its own child, never itself.** Clipping an element
  to zero height also shrinks the rectangle IntersectionObserver measures, so a
  self-clipping reveal never becomes visible enough to trigger itself and sits
  there invisible forever.

Everything degrades to its finished state with JavaScript off or
`prefers-reduced-motion` set — both are asserted in the verification below.

---

## Measured

Lighthouse, throttled mobile, real network and CPU throttling
(`throttlingMethod: "devtools"` — the default simulation extrapolates from
observed CPU timings and is wildly pessimistic on a shared build machine).

| Page | Performance | Accessibility | Best practices | SEO | CLS |
|---|---|---|---|---|---|
| `/` | 92 | 100 | 100 | 100 | 0.016 |
| `/menu` | 87 | 100 | 100 | 100 | 0.001 |
| `/services/hair-color` | 96 | 100 | 100 | 100 | 0.019 |
| `/founder` | 89 | 100 | 100 | 100 | 0.002 |
| `/visit` | 96 | 100 | 100 | 100 | 0.030 |

`pnpm a11y` reports **no WCAG 2.1 AA violations** across all 14 routes at 1440px
and 390px. It scrolls each page with real wheel input first, because content
that has not been revealed yet is invisible to axe as well as to the eye.

Also verified: JavaScript disabled (every price, every booking link and every
revealed element still present), `prefers-reduced-motion`, and keyboard-only
navigation.

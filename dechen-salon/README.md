# DECHEN Salon

Website for **DECHEN Salon**, a women-led, Tibetan-owned salon in Majnu-ka-Tilla,
New Delhi, founded by **Dechen Dolkar** — India's first Master Hair Extensions
Trainer and an All-India Educator for Olaplex, Balmain and BBCOS Italy.

Baby pink, gold and deep plum, taken from the salon's own printed catalog. The
homepage is a seven-act scroll story told by one continuous 3D strand of hair.

> This directory is self-contained. The `Northbound` app in the repository root
> is a different business and shares nothing with it.

---

## Running it

```bash
pnpm install
pnpm dev                       # http://localhost:3000

pnpm build && pnpm start -p 3200
pnpm typecheck

# Verification, all against a running server
node scripts/screenshots.mjs http://localhost:3200 shots   # every act + route, desktop & mobile
node scripts/a11y.mjs         http://localhost:3200        # axe, WCAG 2.1 AA, exits non-zero on failure
node scripts/lighthouse.mjs   http://localhost:3200        # throttled mobile

# Re-extract photographs if the catalog PDF changes
python3 scripts/extract-images.py path/to/catalog.pdf public/img
```

Node 22, pnpm 10.

---

## ⚠️ Before this goes live

Contact details could not be verified — dechensalon.com was unreachable from the
build environment — so they are placeholders. Search for `TODO(salon)`.

| What | Where |
|---|---|
| **Phone and WhatsApp number** | `content/brand.ts` → `contact` |
| **Exact street address** | `content/brand.ts` → `address` |
| **Opening hours and weekly off** | `content/brand.ts` → `hours` |
| **Google Maps and reviews links** | `content/brand.ts`, `content/reviews.ts` |
| **Instagram handle** | `content/brand.ts` — currently `@dechensalon` |

The WhatsApp number must be digits only, country code first: `919xxxxxxxxx`.
Every booking link on the site is built from it.

### Photographs

`content/images.ts` is the manifest — swapping an image is one edit there.
Everything currently in `public/img/` came out of the salon's catalog PDF. Two
are genuinely the salon's (Dechen's portrait, the extension bundles); the rest
are the model and reference shots the catalog uses. **Photographs of DECHEN's own
clients and interior would be a significant upgrade.**

---

## Content

Nothing on this site is invented. The philosophy, the eight pillars, Dechen's
bio and quote, the three stylist tiers, every price and both client reviews are
transcribed from the salon's catalog.

| File | What it holds |
|---|---|
| `content/brand.ts` | Name, tagline, contact, hours, WhatsApp link builders |
| `content/menu.ts` | **Every service and price.** Also the five shade families |
| `content/tiers.ts` | Top Artist / Creative Artist / Creative Director |
| `content/founder.ts` | Dechen's quote, bio and credentials |
| `content/philosophy.ts` | The philosophy and the eight pillars |
| `content/reviews.ts` | The two real reviews |
| `content/story.ts` | The seven acts of the homepage |
| `content/images.ts` | Image manifest with dimensions and alt text |

Prices are transcribed exactly. Where the catalog printed a range it is a range,
where it said "onwards" it is a starting price, and where it said "Consult" no
number is shown. A price a client cannot rely on is worse than no price.

Booking is **WhatsApp and phone only** — no form, no scheduler. Every price row
links to WhatsApp with that service already named in the message.

---

## The 3D

`lib/strand/` — the salon sells hair, so the animation is hair. One
`InstancedMesh` of camera-facing ribbons, one draw call, morphing between seven
shapes as you scroll:

| Act | Shape | Ground |
|---|---|---|
| Open | Hair falling either side of the name, curling inward | blush |
| Philosophy | A lotus | blush |
| The cut | Every strand parallel, ending on one level line | rose |
| Colour | A fan carrying the five shade families | plum |
| Length | A curtain growing from 16″ to 30″ | plum |
| Care | Two helices pinching together — bonds knitting | plum |
| Visit | A soft ring, like a mirror to sit in front of | blush |

`/team` reuses the same shader for three ropes plaiting into a braid, one per
stylist tier.

The floor colour eases between those grounds as you scroll, and `--darkness`
(written by `StoryStage` each frame) cross-fades the copy between ink and petal
so text is never caught mid-transition at low contrast.

### Rules the 3D follows

- **The copy is always real DOM.** The canvas renders behind it and carries
  nothing. With WebGL off the site reads and ranks exactly the same.
- **Reduced motion and no-WebGL get a poster**, not a blank space — a hand-drawn
  SVG of the same idea.
- **three.js loads late and conditionally.** It is ~230KB and it is decoration.
  Capable machines get it once the browser goes idle; weaker ones only once the
  visitor scrolls or touches the page. Someone who lands, reads the hero and taps
  Book never pays for it. Loading it eagerly cost 5.6s of blocked main thread on
  a throttled mobile profile.
- **Above the fold never waits for JavaScript.** `Rise` (a server component,
  pure CSS) is used at the top of a page; `Reveal` (an attribute plus one shared
  observer in `RevealRoot`) is used below it. The hero `h1` has no entrance at
  all, because a transparent element has not been painted.

---

## Measured

Lighthouse, throttled mobile, real network and CPU throttling
(`throttlingMethod: "devtools"` — the default Lantern simulation extrapolates
from observed CPU durations and is wildly pessimistic on a shared build machine).

| Page | Performance | Accessibility | Best practices | SEO | CLS |
|---|---|---|---|---|---|
| `/` | 83 | 100 | 100 | 100 | 0 |
| `/menu` | 93 | 100 | 100 | 100 | 0.004 |
| `/founder` | 81 | 100 | 100 | 100 | 0.002 |
| `/services/hair-color` | 73 | 100 | 100 | 100 | 0.023 |
| `/visit` | 95 | 100 | 100 | 100 | 0.038 |

Performance varies by several points run to run on this machine; the pages that
score lowest are the ones whose largest-contentful-paint is a photograph.

`scripts/a11y.mjs` reports **no WCAG 2.1 AA violations** across all 14 routes at
1440px and 390px. It scrolls each page with real wheel input first, because
content that has not been revealed yet is invisible to axe as well as to the eye.

Also verified by hand: JavaScript disabled (all 71 prices and 56 booking links
still present), `prefers-reduced-motion` (poster, no canvas, nothing hidden),
and keyboard-only navigation.

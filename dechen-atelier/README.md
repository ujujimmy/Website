# DECHEN Salon

The website for DECHEN Salon — a women-led, Tibetan-owned salon in
Majnu-ka-Tilla, New Delhi, founded by Dechen Dolkar, India's first Master Hair
Extensions Trainer.

This is the **editorial** build. There is an earlier build of the same business
in `../dechen-salon` (blush and white, soft cards); the two share their facts
and their photographs and nothing else. Deploy one of them, not both.

---

## Deploying to Netlify

### Drag and drop

Run `pnpm build`, then drag the **`out/`** folder onto
<https://app.netlify.com/drop>. That's the whole deploy — `_redirects` and
`_headers` are inside it, so clean URLs, the 404 page and the caching rules all
come with it.

### Connected to git

Point Netlify at this repository and set:

| Setting        | Value            |
| -------------- | ---------------- |
| Base directory | `dechen-atelier` |
| Build command  | `pnpm build`     |
| Publish        | `out`            |

`netlify.toml` already says the last two; the base directory has to be set in
the UI because this repository holds more than one site.

There is no server, no serverless function and no Next.js runtime — every route
is exported to a plain HTML file at build time.

---

## Running it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # writes out/
pnpm preview      # serves out/ on http://localhost:3300
```

Checks, all against `pnpm preview`:

```bash
pnpm typecheck
pnpm a11y         # axe-core across every route, desktop and mobile
pnpm lighthouse   # performance / a11y / best practices / SEO
pnpm shots        # screenshots of every route into shots/
pnpm preview-file # preview.html — the whole site in one shareable file
```

---

## Where things are

| Path                | What's in it                                                      |
| ------------------- | ----------------------------------------------------------------- |
| `content/brand.ts`  | Name, phone, WhatsApp, address, hours, Instagram. **Start here.**  |
| `content/menu.ts`   | Every service and price, transcribed from the printed catalog      |
| `content/tiers.ts`  | The three artist levels                                            |
| `content/copy.ts`   | All the site's own editorial copy, in one place                    |
| `content/founder.ts`| Dechen's quote, bio and credentials — her words, verbatim          |
| `content/philosophy.ts` | The philosophy and the eight pillars — the salon's own text    |
| `content/reviews.ts`| The two client reviews, as printed                                 |
| `content/images.ts` | The image manifest: swap a photograph in one line                  |
| `app/globals.css`   | The whole design system: tokens, type scale, motion, price index   |

Changing a price means editing `content/menu.ts` and nothing else. Changing the
phone number means editing `content/brand.ts` and nothing else — every booking
link on the site is built from it.

---

## Still needed from the salon

These are marked `TODO(salon)` in `content/brand.ts` and show on every page:

1. **The exact street address for each branch** — shop number and street. Both
   currently carry the neighbourhood only, which is accurate but not enough to
   walk to.
2. A **Google Maps share link** for each branch's own listing. Open it in Maps,
   tap Share, and paste the link over `mapsUrl` and `directionsUrl`. Until then
   the directions links search Maps for each branch by name, which lands people
   in the right place but is a search rather than a pin.
3. A **Google reviews link** (`content/reviews.ts`).
4. An **email**, if one should be shown. Leave it empty and the footer drops the
   line by itself.

Photographs of the salon's own work and interior would be the single biggest
upgrade available. Two of the current images are genuinely the salon's — the
founder's portrait and the extension bundles — and the rest came from the
catalog's reference shots. The lookbook says so in as many words and sends
people to Instagram for real client work, which is the honest arrangement, but
real photographs would let it stop apologising. Drop replacements into
`public/img/`, run `pnpm images`, and update the entry in `content/images.ts`.

---

## Design notes

**Palette.** Bone paper, near-black ink, one lacquer red, brass on dark. Every
colour in `@theme` carries its measured contrast ratio in a comment; nothing
else may set a colour.

**Type.** Bodoni Moda for display, Archivo for everything else. Both variable,
which is two font files instead of eight — the headline is the
largest-contentful-paint element on most pages and every extra file delays it.

**Motion.** Four moves and no others: a wipe for images, a line-rise for
headlines, a 14px rise for everything else, and a hairline that draws itself.
All of it is CSS driven by one shared IntersectionObserver, and all of it is
defined under `.js`, so the served HTML shows everything and JavaScript opts
into hiding it. Get that the wrong way round and a blocked bundle means a blank
page.

**The price index.** Every figure shares one right-hand grid — a flat price
spans all three artist columns and right-aligns, a tiered price fills them — so
the right edge never moves. The artist filter is pure CSS on a `data-tier-focus`
attribute, which means all 146 prices stay in the HTML in every state, for
search engines and for anyone without JavaScript.

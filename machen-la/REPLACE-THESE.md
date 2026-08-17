# Replace these before launch

Everything on this list is either a generated placeholder or an unverified fact.
The site is built to render honestly with all of it missing — nothing here breaks
the layout — but none of it should still be here when the site goes live.

Ordered by how much damage it does if left in.

---

## 1. Photography — 6 slots

Every file in `/public/images` is a generated placeholder: a dark card with the
intended subject written on it and `REPLACE ME` in the corner. Overwrite each
file **at the exact pixel dimensions below, keeping the same filename**, and
nothing else needs to change.

Regenerate the placeholders at any time with `pnpm placeholders`.

| # | Filename | Pixels | Ratio | The shot |
|---|---|---|---|---|
| 1 | `interior-evening.jpg` | 1080 × 1350 | 4:5 | Wide view of the room in the evening with the lights on. Shoot from a corner so you get depth, not a flat wall. **This is the hero image.** |
| 2 | `hot-pot-table.jpg` | 1080 × 1080 | 1:1 | Hot pot on a full table, steam visible. Slightly above the table edge, not directly overhead. |
| 3 | `momo-platter-overhead.jpg` | 1080 × 1080 | 1:1 | Momo platter straight down, dipping sauce in frame, plain surface underneath. |
| 4 | `frontage-lane.jpg` | 1080 × 1350 | 4:5 | The front of the restaurant from the lane, so someone walking up recognises it. Include the sign. |
| 5 | `morning-coffee-window.jpg` | 1080 × 1350 | 4:5 | Coffee on a window table in real early-morning light. **This one picture sells the 7:30 opening — it is the most important shot on the list.** |
| 6 | `staff-kitchen.jpg` | 1080 × 1080 | 1:1 | The chef or the floor staff, working, not posed in a line. Ask permission first. |

### Rules for the photographs

- **Instagram exports are fine.** The whole site is designed around ~1080px
  compressed source files. Every slot is capped at half its native width so the
  images stay sharp.
- **Do not upscale anything.** A 600px file blown up to 1080 will look worse than
  the placeholder it replaced.
- **Do not use stock photography.** This site sells one specific room. A generic
  dumpling photo destroys that in one glance.
- **1:1 and 4:5 only.** The layout is built from those two ratios. A panorama has
  nowhere to go.
- Shoot in the light the room actually has. The site applies a warm grade and a
  film grain over everything, so heavily filtered sources fight each other.

### Worth shooting next

Not built into any page yet, so no placeholder exists — `/gallery` can grow into
them: tingmo with the buff and cabbage stir fry · a ramen bowl · pork ribs · the
grapefruit cooler beside the kiwi slush · the outdoor seating · one decor detail.

---

## 2. Prices — every single one

`src/data/menu.ts`. All 16 items are `price: null` and render as an em dash.

No price on this site was invented, deliberately: a wrong price on the web and a
different one on the table is an argument with a customer and a one-star review.
Fill in the numbers as plain rupees (`price: 260`) and they start rendering, in
the menu and in the `MenuItem` structured data, automatically.

`pnpm build` prints the full list of missing prices every time it runs.

---

## 3. Menu items — the card is incomplete

`src/data/menu.ts` contains only the ~16 dishes named in real Google reviews.
It is not the full card, and it does not pretend to be — the bottom of `/menu`
says so in plain words.

Paste the real menu in. The file is typed and commented; copy any row and change
the fields.

---

## 4. Heat levels

Also `src/data/menu.ts`. Dishes with `spice: null` print **ASK** rather than a
guessed level.

This is deliberate and it is worth understanding before you "fix" it. The most
repeated complaint in this restaurant's reviews is food arriving hotter than the
guest asked for. A label that says MILD on a dish that arrives hot causes exactly
that complaint. So heat is only labelled where it is genuinely knowable — dishes
whose name declares chilli, and things that are mild by definition.

When the kitchen confirms real levels, set them (`"MILD" | "MEDIUM" | "HOT"`) and
the labels appear. Same for `veg`, which shows no marker while it is `null`.

---

## 5. The domain

`SITE_URL` in `src/data/site.ts` is `https://machenla.example`.

Canonical URLs, `sitemap.xml`, `robots.txt`, the JSON-LD `@id` and every
`og:image` URL derive from it. Change that one line and all of them follow.

---

## 6. Facts to confirm with the restaurant

These are written into the site and should be checked by someone who works there.

| Where | What to confirm |
|---|---|
| `src/data/faq.ts` — "Do you take cards?" | The answer currently tells people to phone and ask, because the real answer is unknown. Replace it with the actual answer. |
| `src/data/faq.ts` — parking, and the metro | Says parking is on the main road outside the colony and mentions Vidhan Sabha as the nearest metro. Both are true of Majnu ka Tilla generally; confirm they are how you would tell a guest. |
| `src/data/faq.ts` — distance from the bus stand | Deliberately says "a short walk" rather than a number of minutes, because no one has measured it. Put the real figure in if you know it. |
| `src/data/site.ts` — `links.facebook` | `null`. Nothing was supplied, so Instagram is the only profile in `sameAs`. A guessed URL would tell Google that someone else's page belongs to this restaurant. |
| `src/data/menu.ts` — `MENU_NOTES.allergens` | Says some dishes use MSG. Confirm this is what you want stated publicly. |

---

## 7. Tibetan script

There is **no Tibetan (Uchen) script anywhere in this build**, on purpose. Text
generated by a model, or copied off another site, comes out wrong, and wrong
Tibetan on a Tibetan restaurant in a Tibetan settlement is not a small mistake.

There is a commented slot in `src/components/Wordmark.tsx` with instructions.
Supply text written or checked by someone who reads Tibetan and it drops in.

---

## 8. Video

None ships. There is a commented slot in the hero of `src/app/page.tsx` with the
full implementation notes — format, size limits, reduced-motion handling — so a
loop can be added later without a refactor.

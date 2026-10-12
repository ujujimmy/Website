# PinRank funnel

Meta-ads funnel for PinRank (white-label of Merchynt Paige): Google Maps ranking for
electricians, roofers and home service businesses in Belgium. Ends in a booked call or a
WhatsApp conversation.

Static site, zero dependencies, separate from the jigme.agency Next.js app in the repo root.

```bash
node build.mjs          # → dist/
npx serve dist          # preview at http://localhost:3000
```

## The funnel

```
Meta ad ──► trade landing page ──► 4-step qualifier ──► Cal.com calendar ──► thank-you page
            (/nl/elektricien/)     trade · region ·      (prefilled)          (Schedule event)
                                   Google profile ·        │
                                   contact                 └─► or WhatsApp (prefilled with answers)
```

- **One page per trade and language** so the headline repeats what the ad said.
  Point each ad set at its own page:

  | | NL | FR |
  |---|---|---|
  | Electricians | `/nl/elektricien/` | `/fr/electricien/` |
  | Roofers | `/nl/dakwerker/` | `/fr/couvreur/` |
  | Plumbers | `/nl/loodgieter/` | `/fr/plombier/` |
  | Heating / heat pumps | `/nl/verwarming/` | `/fr/chauffagiste/` |
  | Mixed audience | `/nl/` | `/fr/` |

  English (`/en/…`) exists for reviewing the copy. The root `/` sends visitors to their browser language.
- **Qualifier in a popup**, one question per screen, tap-to-answer. On trade pages the trade
  question is skipped. Answers prefill the calendar booking and the WhatsApp message.
- **Every CTA works without JavaScript**: it falls back to a WhatsApp link.
- **Money-back guarantee** is in the hero, a full section, pricing and the FAQ.

## Go-live checklist

All of it is in `src/config.mjs`. The build lists every remaining `TODO(`.

1. **Domain**: set `siteUrl`.
2. **Cal.com**: create a 15-min event and set `calLink` (e.g. `pinrank/gratis-gesprek`). The EU
   instance (cal.eu) is better for GDPR; see the comment in config. Until it's set, the funnel
   ends in WhatsApp only.
3. **WhatsApp**: set `whatsapp`. Currently the jigme.agency (+91) number; a Belgian +32 number
   will convert better with this audience.
4. **Meta Pixel**: set `metaPixelId`. It loads **only after cookie consent**, which is required in the EU.
   The cookie banner appears automatically once an ID is set.
5. **Price**: confirm the €800 period (`month` or `once`) or set `show: false`.
6. **Company details**: legal name, address, KBO/BCE number. Belgian law requires these on the site.
7. **Guarantee terms**: write down how "ranking improved" is measured (keywords, grid, average
   position) before the first sale. The page promises the terms are agreed in writing.
8. **Testimonials**: add real ones to `testimonials` and the section appears.
9. Optional: `leadWebhook` (Make/Zapier/n8n → Google Sheet) to capture everyone who answers the
   questions, so you can follow up those who don't book.

## Meta events

| Event | When | Use |
|---|---|---|
| `PageView` | every page | |
| `StartQuiz` (custom) | qualifier opened | top-of-funnel signal |
| `Lead` | qualifier completed | **optimise campaigns for this first** (more volume) |
| `Contact` | WhatsApp click | |
| `Schedule` | calendar booking done | switch optimisation here once you have ~50/week |

UTM parameters and `fbclid` are kept for the visit and sent with every webhook event.

## Deploy (Vercel)

New Vercel project → import this repo → **Root Directory: `pinrank`**. `vercel.json` sets the
build. Add the domain under Project → Domains. Any static host works too: upload `dist/`.

## Editing copy

`src/i18n/nl.mjs`, `fr.mjs`, `en.mjs`. Same keys in each. Layout is in `src/render.mjs`,
styles in `src/assets/styles.css`, behaviour in `src/assets/app.js`.

# Northbound — 3D scrolling agency website

Marketing site for an agency selling **Google review management, web design and SEO**,
positioned for local businesses in the US, Canada and the UK.

It has two jobs: convert cold foreign traffic into leads, and act as the portfolio
piece you send to prospects ("I can build you something like this"). Those pull in
opposite directions — heavy 3D usually means a slow, badly-indexed site, which is
fatal when SEO is one of the things you sell. So the whole build treats **a fast,
crawlable site with a cinematic 3D layer** as the requirement, not "a 3D site".

Current scores (Lighthouse, throttled mobile — 4× CPU, slow 4G).
The homepage carries the first-visit intro, which costs it ~3 points:

| Page | Performance | Accessibility | SEO | CLS |
|---|---|---|---|---|
| `/` | 92 | 100 | 100 | 0 |
| `/services/*` | 95 | 100 | 100 | 0 |
| `/pricing` | 95 | 100 | 100 | 0 |
| `/audit` | 94 | 100 | 100 | 0 |
| `/work`, `/about`, `/contact` | 95–97 | 100 | 100 | 0 |

---

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck
pnpm shots          # Playwright captures of every scroll beat, desktop + mobile

# One self-contained HTML file of the WHOLE site, for sharing as a preview
# link. Needs a running server; inlines the CSS, both webfonts and the three.js
# scene so the file works with no network at all. Every route is bundled as a
# panel behind a hash router, so navigation, the pricing table and the audit
# form all work. The form is a demo — it sends nothing.
pnpm build && pnpm start -p 3100 &
pnpm preview http://localhost:3100 preview.html
```

Node 22, pnpm 10.

---

## ⚠️ Before you show this to a prospect

Everything below is placeholder. The site's entire job is credibility, and a
prospect who checks one invented number and finds nothing is gone for good.
Search the codebase for `TODO(` to find them all.

| What | Where |
|---|---|
| **Agency name, domain, email, phone** | `content/brand.ts` — single swap point, everything else follows |
| **All stats, client logos, testimonials, case studies** | `content/proof.ts` — every figure is invented |
| **Pricing** | `content/pricing.ts` — sanity-check against what you actually want to charge |
| **Lead storage** | `lib/leads.ts` — writes to a local JSON file, which does not persist on Vercel |
| **Lead email** | Set `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` |

If you only have two or three Indian clients, use those. Real modest numbers
convert far better than impressive invented ones.

### Environment variables

See `.env.example` for the full list. Nothing here is required to run the
site — every integration degrades to a sensible fallback when unset.

```bash
RESEND_API_KEY=re_...          # without this, leads still save + log; email no-ops
LEAD_NOTIFY_EMAIL=you@...      # where lead notifications go
NEXT_PUBLIC_CAL_LINK=...       # Cal.com handle; without it, booking shows email fallback
RAZORPAY_KEY_ID=rzp_test_...   # public, safe in the browser
RAZORPAY_KEY_SECRET=...        # SERVER ONLY — never prefix with NEXT_PUBLIC_
RAZORPAY_WEBHOOK_SECRET=...    # SERVER ONLY
```

---

## Payments

Razorpay Subscriptions, wired but **switched off** until you add plan IDs.
With none configured, each pricing card shows the normal enquiry CTA — which
is usually the right order for work at this price anyway: scope first, card
second.

### Turning it on

1. Create a Razorpay account and complete KYC (PAN, business proof, bank
   account). Only you can do this — it is your legal identity.
2. Dashboard → Subscriptions → Plans. Create one plan **per tier per
   currency**; a Razorpay plan has its amount and currency baked in.
3. Paste the plan IDs into `razorpayPlanId` in `content/pricing.ts`.
4. Set the three env vars above. Use `rzp_test_` keys until you have taken a
   full test payment end to end.
5. Dashboard → Settings → Webhooks → add
   `https://yourdomain.com/api/webhooks/razorpay`, subscribe to
   `subscription.activated`, `subscription.charged`, `subscription.halted`,
   `subscription.cancelled`, `payment.failed`, and paste the signing secret
   into `RAZORPAY_WEBHOOK_SECRET`.

### Security rules — do not relax these

- **The secret is server-only.** `lib/payments/razorpay.ts` imports
  `server-only`; the API route returns the public key id and nothing else.
  Verified by test: the secret appears in no HTML or JSON response.
- **The browser never sends a price or a plan.** It sends a tier id; the
  server maps tier → plan. Otherwise anyone could edit the request and
  subscribe to Authority at Starter's price.
- **A webhook is the only proof of payment.** The browser callback just
  redirects to a thank-you page — anyone can open that URL. The webhook
  verifies an HMAC over the *raw* request bytes using a timing-safe compare,
  and unsigned or wrongly-signed requests are rejected with 401 (tested).
- **Storage is not production-ready yet.** `lib/payments/store.ts` writes to
  disk, which is ephemeral on Vercel. Point it at a database before taking
  real money — you need a durable record of who paid.

### Collecting from US / Canada / UK

Razorpay settles to an Indian bank account and needs international payments
explicitly enabled; approval and per-currency support vary, and export of
services paperwork (FIRC / purpose codes) applies. Worth knowing before you
promise a US client card billing:

| Option | Good for | Watch out for |
|---|---|---|
| **Razorpay** | INR subscriptions, Indian clients | International needs separate activation |
| **PayPal** | Instantly trusted by US/UK buyers | Higher fees, weaker subscription tooling |
| **Wise Business** | Low-fee invoicing in USD/GBP/EUR | Manual — no automatic recurring billing |
| **Paddle / Lemon Squeezy** | Selling subscriptions worldwide | They become merchant of record and handle VAT/sales tax for you; higher % but far less compliance work |

A common setup for a small Indian agency selling abroad: **Razorpay for
Indian clients, and Wise or PayPal invoices for foreign ones** until volume
justifies a merchant-of-record. The integration here is isolated in
`lib/payments/`, so adding a second provider does not touch the pricing UI.

---

## Architecture

```
app/                 routes; every page is server-rendered HTML
components/
  three/             the WebGL layer (Scene → SceneCanvas → ParticleField)
  home/              homepage beats + the scroll tracker
  ui/                Button, Section, Reveal, Stars, StatCounter
  forms/AuditForm    3-step lead capture
content/             ALL copy as typed data — edit here, not in components
lib/
  three/shapes.ts    the seven position buffers
  scroll.ts          mutable scroll state the canvas reads each frame
  device.ts          graphics tier detection
  leads.ts           lead validation + storage (swap the storage here)
  seo.ts             JSON-LD builders
```

### The 3D scroll narrative

One persistent `<Canvas>` behind the whole site holds **a single particle
system** — one `THREE.Points`, one draw call. Each of the seven homepage beats
is just a target position buffer, and the shader lerps between two of them:

| Beat | Shape | Section |
|---|---|---|
| 0 | drifting cloud | Hero |
| 1 | scattered, dimmed | The problem |
| 2 | five gold stars | Google Reviews |
| 3 | browser wireframe | Web design |
| 4 | ranking ladder (#9 → #1) | SEO |
| 5 | wireframe globe | Global reach |
| 6 | converging portal | Free audit CTA |

Add or reorder a beat by editing **three things in step**: `beats` in
`content/site.ts`, `beatShapes`/`beatColors` in `lib/three/shapes.ts`, and the
`data-beat` index on the section.

**Scroll progress comes from measuring the real `[data-beat]` sections**, not
from assuming one viewport per beat. Sections grow past 100vh with long copy or
large text, and any fixed assumption silently desynchronises the copy from the
shape behind it.

### Performance constraints — please don't undo these

These were each measured, and each cost real Lighthouse points when done the
obvious way:

- **Above-the-fold content animates with CSS, never motion.** motion
  server-renders `opacity: 0`, so a JS-driven hero keeps the LCP element
  invisible until hydration (measured 1.9s → 0.27s when converted).
- **The canvas mounts on `requestIdleCallback`**, so three.js never competes
  with hydration. The poster is a complete visual by itself.
- **No `filter: blur()` on large elements, and `backdrop-filter` only on
  desktop.** Radial gradients are already soft and cost nothing to rasterise.
- **Gradient text must animate as one element** (`RevealPhrase`, not
  `RevealWords`): `background-clip: text` cannot paint through a descendant
  carrying a transform, and per-word animation renders the text invisible.
- **The first-visit intro costs ~0.7s of LCP** (`components/layout/Intro.tsx`)
  — measured: 94-97 without it, 92-93 with. That is a deliberate trade for the
  arrival moment, kept bounded by playing once per session. Remove `<Intro />`
  from `app/layout.tsx` to get the points back.

### Graceful degradation

Verified working, not assumed:

- `prefers-reduced-motion` → no canvas, static poster, all animation neutralised
- No WebGL2 → no canvas, static poster
- Low-end device (≤4 cores / touch / narrow) → 1400 particles instead of 4800, no parallax
- **JavaScript disabled entirely → the full page still renders and reads.**
  A `no-js` class on `<html>` (stripped by an inline script) forces the
  motion-driven scroll reveals visible.

---

## Deploying

Built for Vercel. The project is already linked to this repo, so a push is
the whole deploy step.

- **Production branch is `main`.** Pushing there deploys to jigme.agency.
  Every other branch builds a preview URL and leaves production alone — worth
  knowing, because this repo also carries unrelated client sites on their own
  branches (`dechen-salon/`, `machen-la/`, `sites/smilekraft/`), and none of
  them can reach production from where they sit.
- **`brand.url` in `content/brand.ts` is the canonical origin** and feeds the
  canonical tags, the sitemap, the OG image URLs and the JSON-LD `url`. It is
  set to `https://jigme.agency`. If the domain ever moves, that one line is
  the change; nothing else references the origin directly.

After a deploy that changes metadata, run the homepage and one service page
through Google's Rich Results Test to confirm the structured data.

# Northbound — 3D scrolling agency website

Marketing site for an agency selling **Google review management, web design and SEO**,
positioned for local businesses in the US, Canada and the UK.

It has two jobs: convert cold foreign traffic into leads, and act as the portfolio
piece you send to prospects ("I can build you something like this"). Those pull in
opposite directions — heavy 3D usually means a slow, badly-indexed site, which is
fatal when SEO is one of the things you sell. So the whole build treats **a fast,
crawlable site with a cinematic 3D layer** as the requirement, not "a 3D site".

Current scores (Lighthouse, throttled mobile — 4× CPU, slow 4G):

| Page | Performance | Accessibility | SEO | CLS |
|---|---|---|---|---|
| `/` | 94 | 100 | 100 | 0 |
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

# Single self-contained HTML of the homepage, for sharing as a preview link.
# Needs a running server; inlines the CSS, both webfonts and the three.js
# scene so the file works with no network at all.
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
| **Payments** | Razorpay plans must exist in the dashboard before checkout works — see below |

If you only have two or three Indian clients, use those. Real modest numbers
convert far better than impressive invented ones.

### Environment variables

See `.env.example` for the annotated list. Copy it to `.env.local`. Nothing is
required for `pnpm dev` — every integration no-ops and logs when unconfigured.

---

## Payments (Razorpay Subscriptions)

Monthly plans are charged as Razorpay subscriptions, in **INR only**. Razorpay
accounts are INR-native and charging USD needs International Payments
activated separately, so the pricing page displays USD while checkout always
collects the rupee figure. `/subscribe` says so, and offers a manual invoice.

**The prices customers are charged live in the Razorpay dashboard, not in this
repo.** `content/pricing.ts` only controls what the site *displays*. To stop
those drifting apart, `lib/razorpay.ts` fetches the plan before every checkout
and refuses to proceed if the amount, currency or period disagrees with the
tier — so a price edit here fails loudly instead of quietly charging the old
amount.

### Setup

1. **API keys** — Dashboard → Settings → API Keys. Set `RAZORPAY_KEY_ID` and
   `RAZORPAY_KEY_SECRET`. Start with `rzp_test_*`; the checkout page shows a
   "test mode" banner whenever the key isn't `rzp_live_*`.
2. **Plans** — Dashboard → Subscriptions → Plans. Create one **monthly INR**
   plan per tier at the price in `content/pricing.ts` (₹15,000 / ₹45,000 /
   ₹105,000). Paste the IDs into `RAZORPAY_PLAN_STARTER`, `_GROWTH`,
   `_AUTHORITY`. Don't add setup fees to the plan — those ride along as an
   addon on the first invoice, from `tier.setup.INR`.
3. **Webhook** — Dashboard → Settings → Webhooks →
   `https://<domain>/api/razorpay/webhook`. Subscribe to `subscription.activated`,
   `subscription.charged`, `subscription.halted`, `subscription.cancelled` and
   `payment.failed`. Put the webhook's secret in `RAZORPAY_WEBHOOK_SECRET` —
   without it every webhook is rejected, because nothing can be verified.
4. **Redeploy.** The "pay now" links on `/pricing` and the homepage are gated
   on the plan IDs being present, and those pages are statically prerendered —
   so the env vars must be set *at build time*, not just at runtime.

A tier with no plan ID configured is simply not purchasable: no link renders,
and `/subscribe?plan=…` for it falls back to a "we'll invoice you" panel
instead of a broken checkout.

### How it flows

```
/pricing → /subscribe?plan=growth   details form, shows first charge
  POST /api/razorpay/subscription   creates the subscription, returns its id
  Razorpay Checkout (browser)       customer authorises the mandate
  POST /api/razorpay/verify         checks the callback signature → success page
  POST /api/razorpay/webhook        Razorpay confirms — the authoritative record
```

The verify endpoint exists to show the customer a truthful success page. The
**webhook** is what tells you money actually moved: browsers close, networks
drop, and the callback can be forged. Both funnel into
`recordSubscriptionEvent` (`lib/subscriptions.ts`), which emails you and
appends to `.data/subscriptions.json` — same ephemeral-storage caveat as
leads, so Razorpay's dashboard stays the system of record until that's on a
real database.

Signature note for anyone maintaining this: subscriptions sign
`payment_id|subscription_id`, the reverse of the one-time-order flow's
`order_id|payment_id`. It looks like a bug and isn't.

### Testing before launch

With test keys, run a payment through with Razorpay's test card
(`4111 1111 1111 1111`, any future expiry/CVV). To exercise the webhook
locally, tunnel port 3000 (`ngrok http 3000`) and point a test-mode webhook at
`https://<tunnel>/api/razorpay/webhook`.

---

## Architecture

```
app/                 routes; every page is server-rendered HTML
components/
  three/             the WebGL layer (Scene → SceneCanvas → ParticleField)
  home/              homepage beats + the scroll tracker
  ui/                Button, Section, Reveal, Stars, StatCounter
  forms/AuditForm    3-step lead capture
  checkout/          Razorpay subscription form
content/             ALL copy as typed data — edit here, not in components
lib/
  three/shapes.ts    the seven position buffers
  scroll.ts          mutable scroll state the canvas reads each frame
  device.ts          graphics tier detection
  leads.ts           lead validation + storage (swap the storage here)
  razorpay.ts        subscription creation + signature verification
  subscriptions.ts   payment event log (swap the storage here)
  notify.ts          shared Resend sender
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

Built for Vercel: push the repo, import it, set the environment variables
above. Set `brand.url` in `content/brand.ts` to the real domain first — it
feeds canonical URLs, the sitemap, OG tags and JSON-LD.

After the first deploy, run the homepage and one service page through Google's
Rich Results Test to confirm the structured data.

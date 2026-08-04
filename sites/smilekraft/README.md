# Smilekraft Dental Clinic — website

A static, single-page site for **Smilekraft Dental Clinic**, 308B Ram Nagar, Dharamshala (HP).
Three files, no build step, no dependencies, no server code — drop the folder on any host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, or plain shared hosting) and it works.

```
sites/smilekraft/
├── index.html    markup + SEO tags + JSON-LD structured data
├── styles.css    design tokens and layout
├── script.js     mobile menu, scroll reveals, open/closed badge, WhatsApp booking
└── assets/       put photos and og.jpg here
```

**Preview locally**

```bash
cd sites/smilekraft
python3 -m http.server 8080     # → http://localhost:8080
```

---

## What's on the page

Hero with the Google rating → appointment form → trust strip → nine treatments →
why-choose-us → three Google review quotes → clinic photos → six FAQs → address, hours
and map → closing call to action → footer. A sticky Call / WhatsApp / Book bar appears
on phones.

**The booking form needs no backend.** It validates the name and phone, then opens
WhatsApp with the enquiry pre-written to `+91 97368 31214`. That keeps the whole site
static while still producing real leads. If a proper form handler is wanted later, swap the
`window.open(...)` call at the end of `script.js` for a `fetch()` to Formspree, Web3Forms
or a small API route.

---

## Confirm before this goes live

Everything factual on the page came from the clinic's Google Business Profile —
name, address, phone (097368 31214), the 4.8 rating, the 50-review count and the three
review quotes. These details need a check by the clinic:

| Item | Currently | Where to change |
|---|---|---|
| **Opening hours** | Mon–Sat 10:00–18:00, Sun closed | Hours table in `index.html`, `openingHoursSpecification` in the JSON-LD, the top bar, and `OPEN_HOUR`/`CLOSE_HOUR` in `script.js` — all four |
| **Domain** | `https://smilekraftdental.in/` placeholder | `canonical`, the `og:` tags and the JSON-LD `url` / `@id` / `image` |
| **Map coordinates** | 32.2190, 76.3234 (Dharamshala centre) | `geo` in the JSON-LD — take the exact pin from Google Maps |
| **Dentist name(s), qualifications, years in practice** | not stated anywhere | worth adding to the "Why us" section — it is the single biggest trust signal a clinic page can carry |
| **Photos** | dashed placeholders | see below |
| **Prices / offers** | none quoted | deliberate — add only what the clinic will honour |

Only the Google-sourced facts above are asserted as specifics. The service descriptions,
FAQ answers and the "why us" copy are ordinary clinic claims (sterilisation between
patients, digital X-rays, written estimates, same-day emergency slots). **Read them and
delete anything the clinic does not actually do** — a claim that isn't true does more harm
than a thinner page.

## Adding the photos

The four boxes in the "Inside the clinic" section and the tall one beside "Why us" are
placeholders. Put real images in `assets/` and replace each `<figure class="ph" …>` with:

```html
<figure class="shot">
  <img src="assets/reception.jpg" alt="Reception at Smilekraft Dental Clinic" width="800" height="600" loading="lazy" />
</figure>
```

Then add to `styles.css`:

```css
.shot { margin: 0; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); }
.shot img { display: block; width: 100%; height: 100%; object-fit: cover; }
```

Export at roughly 1200px wide, compressed (WebP if possible). Also drop a 1200×630
`assets/og.jpg` in for link previews on WhatsApp and Facebook — that share card is how
most patients will first see the site.

## After launch

1. Add the website URL to the Google Business Profile — it feeds the same listing the
   4.8 rating comes from, and it's the top source of traffic for a local clinic.
2. Verify the domain in Google Search Console and submit it.
3. Check the structured data at [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
   Note that Google generally ignores an `aggregateRating` a business marks up about
   itself; it stays in the file because it's accurate, but don't expect stars in search
   results from it. Remove the block if the clinic prefers not to carry it at all.
4. Keep asking happy patients for Google reviews. Fifty at 4.8 is already strong; volume
   and recency are what move the local pack ranking from here.

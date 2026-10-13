/**
 * HTML for every page. Plain template strings, no framework: the pages are
 * static, the audience arrives on a phone through Meta's in-app browser, and
 * the fastest page is the one with nothing to hydrate.
 *
 * i18n strings are authored HTML and go in raw. Anything from config or the
 * visitor is escaped.
 */

import config from "./config.mjs";

export const TRADES = ["electrician", "roofer", "plumber", "heating"];

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const icon = {
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill="currentColor"/><circle cx="12" cy="9" r="2.8" fill="var(--pin-dot, #fff)"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cross: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8.6c.2-.4.5-.4.8-.4h.5c.2 0 .4 0 .5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.4.9 1.2 1.7 2.1 2.1l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.4.8-.5.3-1.2.5-2 .3-1.9-.5-4.2-2.8-4.7-4.7-.2-.8 0-1.5.1-2.2z" fill="currentColor"/></svg>`,
  star: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="currentColor"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  arrow: `<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>`,
};

const logo = `<span class="logo-mark">${icon.pin}</span><span class="logo-word">PinRank</span>`;

/** Wrap each word for the headline's load-in. Leaves tags (the <em>) intact. */
function splitWords(html) {
  let i = 0;
  return html
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith("<")
        ? part
        : part
            .split(/(\s+)/)
            .map((w) => (!w ? "" : /^\s+$/.test(w) ? " " : `<span class="w"><span style="--i:${i++}">${w}</span></span>`))
            .join(""),
    )
    .join("");
}

/* ---------- URLs ---------- */

export const landingPath = (t, trade) => `/${t.code}/${trade ? `${t.trades[trade].slug}/` : ""}`;
export const thanksPath = (t) => `/${t.code}/${t.slugs.thanks}/`;
export const privacyPath = (t) => `/${t.code}/${t.slugs.privacy}/`;

const waHref = (msg) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- Shell ---------- */

function layout({ t, all, title, description, pathFor, body, css, js, pr, noindex = false }) {
  const path = pathFor(t);
  const alternates = all
    .map((l) => `<link rel="alternate" hreflang="${l.htmlLang.slice(0, 2)}" href="${config.siteUrl}${pathFor(l)}">`)
    .join("\n");
  const langSwitch = all
    .map((l) =>
      l.code === t.code
        ? `<span aria-current="true">${l.label}</span>`
        : `<a href="${pathFor(l)}" hreflang="${l.htmlLang.slice(0, 2)}" lang="${l.htmlLang}">${l.label}</a>`,
    )
    .join("");
  const json = JSON.stringify(pr).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${config.siteUrl}${path}">\n${alternates}\n<link rel="alternate" hreflang="x-default" href="${config.siteUrl}${pathFor(all.find((l) => l.code === config.defaultLanguage))}">`}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${config.siteUrl}${path}">
<meta property="og:locale" content="${t.ogLocale}">
<meta property="og:site_name" content="${esc(config.brand)}">
<meta property="og:image" content="${config.siteUrl}/og/${t.code}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.og.title + " " + t.og.sub)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fbfbf9">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add("js")</script>
<link rel="preload" href="/fonts/newsreader-500.woff2" as="font" type="font/woff2" crossorigin>
<style>${css}</style>
</head>
<body>
<header class="top">
  <div class="wrap top-in">
    <a class="logo" href="${landingPath(t, pr.trade)}" aria-label="${esc(config.brand)}">${logo}</a>
    <nav class="lang" aria-label="${t.nav.langLabel}">${langSwitch}</nav>
    ${pr.isLanding ? `<a class="btn btn-primary btn-sm top-cta" href="${waHref(t.wa.generic)}" data-open-quiz>${t.nav.cta}</a>` : ""}
  </div>
</header>
${body}
${footer(t)}
${cookieBanner(t)}
<script>window.PR=${json}</script>
<script src="/app.js?v=${js}" defer></script>
</body>
</html>`;
}

function footer(t) {
  const c = config.company;
  const year = new Date().getFullYear();
  return `<footer class="foot">
  <div class="wrap foot-in">
    <a class="logo" href="/${t.code}/">${logo}</a>
    <div>
      <p>© ${year} ${esc(c.name)}${c.address ? ` · ${esc(c.address)}` : ""}${c.vat ? ` · ${t.footer.vat} ${esc(c.vat)}` : ""} · <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>
      <p><a href="${privacyPath(t)}">${t.footer.privacy}</a>${config.metaPixelId ? ` · <a href="#" data-cookie-settings>${t.cookie.settings}</a>` : ""}</p>
      <p class="fine">${t.footer.disclaimer}</p>
    </div>
  </div>
</footer>`;
}

function cookieBanner(t) {
  if (!config.metaPixelId) return "";
  return `<div class="cookie" id="cookie" role="region" aria-label="Cookies" hidden>
  <p>${t.cookie.text} <a href="${privacyPath(t)}">${t.footer.privacy}</a></p>
  <div class="cookie-btns">
    <button type="button" class="btn btn-line btn-sm" data-consent="no">${t.cookie.decline}</button>
    <button type="button" class="btn btn-primary btn-sm" data-consent="yes">${t.cookie.accept}</button>
  </div>
</div>`;
}

/* ---------- Data shared by the 3D demo and the 2D grids ---------- */

const BEFORE = [
  [21, 16, 14, 18, 21],
  [13, 9, 8, 11, 17],
  [12, 7, 3, 6, 15],
  [15, 10, 8, 12, 18],
  [21, 17, 13, 19, 21],
];
const AFTER = [
  [6, 4, 3, 5, 8],
  [3, 2, 1, 2, 4],
  [2, 1, 1, 1, 3],
  [4, 2, 1, 2, 5],
  [7, 4, 3, 5, 9],
];

/** Data the demo (and its recording) needs in window.PR. */
export const demoData = (t) => ({ before: BEFORE.flat(), after: AFTER.flat(), captions: t.demo.captions });

/** The subset of config and copy the browser needs. */
export function clientData(t, extra) {
  return {
    lang: t.code,
    locale: t.htmlLang,
    brand: config.brand,
    whatsapp: config.whatsapp,
    pixel: config.metaPixelId,
    webhook: config.leadWebhook,
    cal: config.calLink ? { link: config.calLink, origin: config.calOrigin, js: config.calEmbedJs } : null,
    thanksUrl: thanksPath(t),
    trades: Object.fromEntries(Object.entries(t.trades).map(([k, v]) => [k, { label: v.label, plural: v.plural }])),
    q: {
      progress: t.quiz.progress,
      errors: t.quiz.errors,
      resultTitle: t.quiz.resultTitle,
      resultBody: config.calLink ? t.quiz.resultBody : t.quiz.resultBodyNoCal,
    },
    wa: t.wa,
    ...extra,
  };
}

/* ---------- Landing ---------- */

function rankGrid(rows, label) {
  const cells = rows
    .flat()
    .map((n, i) => {
      const cls = n <= 3 ? "g" : n <= 10 ? "m" : "b";
      return `<span class="cell ${cls}${i === 12 ? " home" : ""}">${n > 20 ? "20+" : n}</span>`;
    })
    .join("");
  return `<figure class="rank">
    <figcaption>${label}</figcaption>
    <div class="rank-map" role="img" aria-label="${esc(label)}">${cells}</div>
  </figure>`;
}

/**
 * The 3D demo: a recorded video of the scene (assets/demo/) with the caption,
 * counters and search bar as live text on top. `canvas: true` is the version
 * the recording scripts draw live with demo-render.js.
 */
export function demo(t, tr, { canvas = false } = {}) {
  const d = t.demo;
  const stage = canvas
    ? `<canvas aria-hidden="true"></canvas>`
    : `<video muted playsinline loop preload="none" poster="/demo/poster.jpg" aria-hidden="true" disablepictureinpicture disableremoteplayback><source src="/demo/demo.mp4" type="video/mp4"><source src="/demo/demo.webm" type="video/webm"></video>`;
  return `<figure class="demo" data-demo>
  <div class="demo-wrap"><div class="demo-screen">
    ${stage}
    <button type="button" class="demo-big" data-bigplay aria-label="${d.play}">${icon.play}<span>${d.play}</span></button>
    <div class="demo-top">
      <span class="demo-search">${icon.search}<span>${tr ? tr.search : t.trades.electrician.search}</span></span>
      <span class="demo-tag">${d.label}</span>
    </div>
    <div class="demo-bottom">
      <p class="demo-caption" data-caption>${d.captions[0].t}</p>
      <dl class="demo-hud">
        <div><dt>${d.week}</dt><dd data-week>0</dd></div>
        <div><dt>${d.avg}</dt><dd data-avg>–</dd></div>
        <div><dt>${d.top3}</dt><dd data-top3>–</dd></div>
      </dl>
    </div>
  </div></div>
  <div class="demo-bar">
    <button type="button" class="demo-play" data-play aria-label="${d.pause}" data-label-play="${d.play}" data-label-pause="${d.pause}"><span class="i-pause">${icon.pause}</span><span class="i-play">${icon.play}</span></button>
    <div class="demo-track" data-track role="slider" tabindex="0" aria-label="${d.week}" aria-valuemin="0" aria-valuemax="12" aria-valuenow="0"><span data-progress></span><i data-knob></i></div>
    <span class="demo-time" data-time>0:00</span>
  </div>
  <figcaption class="sr-only">${d.alt}</figcaption>
</figure>`;
}

function mock(t, tr) {
  const m = t.mock;
  const n = (x) => x.toLocaleString(t.htmlLang, { minimumFractionDigits: 1 });
  const row = (pos, name, rating, count, you) => `<div class="mock-card${you ? " you" : ""}">
      <span class="mock-pos">${pos}</span>
      <div class="mock-info"><b>${name}</b>
        <span class="mock-rating">${rating} <i class="stars">${icon.star.repeat(5)}</i> (${count})</span>
        <span class="mock-open">${m.open}</span></div>
      <div class="mock-actions"><span>${m.call}</span><span>${m.route}</span></div>
    </div>`;
  return `<figure class="mock-wrap">
    <div class="mock" aria-hidden="true">
      <div class="mock-search">${icon.search}<span>${tr ? tr.search : t.trades.electrician.search}</span></div>
      <div class="mock-map">
        <span class="mpin p1">${icon.pin}</span>
        <span class="mpin p2">${icon.pin}</span>
        <span class="mpin p3">${icon.pin}</span>
      </div>
      <div class="mock-list">
        ${row(1, m.you, n(4.9), 58, true)}
        ${row(2, m.rivalA, n(4.6), 31)}
        ${row(3, m.rivalB, n(4.2), 12)}
      </div>
    </div>
    <figcaption>${m.label} · ${m.caption}</figcaption>
  </figure>`;
}

function seal(t) {
  const g = t.guarantee;
  return `<div class="seal" aria-hidden="true">
    <svg viewBox="0 0 200 200">
      <defs><path id="seal-ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" stroke-width="1"/>
      <text class="seal-text"><textPath href="#seal-ring" textLength="500" lengthAdjust="spacing">${g.ring}${g.ring}</textPath></text>
    </svg>
    <span class="seal-c"><b>3</b><span>${g.months}</span></span>
  </div>`;
}

function quizDialog(t, trade) {
  const q = t.quiz;
  const tradeOptions = [...TRADES, "other"]
    .map(
      (k) =>
        `<button type="button" class="opt" data-choice="trade" value="${k}" aria-pressed="${k === trade}"><span>${t.trades[k].label}</span>${icon.check}</button>`,
    )
    .join("");
  const gbpOptions = Object.entries(q.gbp)
    .map(([k, v]) => `<button type="button" class="opt" data-choice="gbp" value="${k}" aria-pressed="false"><span>${v}</span>${icon.check}</button>`)
    .join("");
  const field = (name, type, autocomplete, inputmode = "") => `<label class="field">
      <span>${q.fields[name]}</span>
      <input id="q-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" ${inputmode ? `inputmode="${inputmode}"` : ""} required>
      <small class="err" aria-live="polite"></small>
    </label>`;

  return `<dialog class="quiz" id="quiz" aria-labelledby="quiz-title">
  <form id="quiz-form" novalidate>
    <div class="quiz-head">
      <button type="button" class="quiz-back" data-back hidden>← ${q.back}</button>
      <p class="quiz-progress" data-progress></p>
      <button type="button" class="quiz-close" data-close aria-label="${q.close}">${icon.cross}</button>
    </div>
    <div class="quiz-bar"><span data-bar></span></div>
    <h2 class="sr-only" id="quiz-title">${q.title}</h2>

    <fieldset data-step>
      <legend>${q.q1}</legend>
      <div class="opts">${tradeOptions}</div>
    </fieldset>

    <fieldset data-step hidden>
      <legend>${q.q2}</legend>
      <label class="field">
        <span class="sr-only">${q.q2}</span>
        <input id="q-region" name="region" type="text" autocomplete="address-level2" placeholder="${esc(q.q2Placeholder)}" required>
        <small class="err" aria-live="polite"></small>
      </label>
      <button type="button" class="btn btn-primary btn-block" data-next>${q.next} ${icon.arrow}</button>
    </fieldset>

    <fieldset data-step hidden>
      <legend>${q.q3}</legend>
      <div class="opts">${gbpOptions}</div>
    </fieldset>

    <fieldset data-step hidden>
      <legend>${q.q4}</legend>
      ${field("name", "text", "name")}
      ${field("company", "text", "organization")}
      ${field("phone", "tel", "tel", "tel")}
      ${field("email", "email", "email", "email")}
      <button type="submit" class="btn btn-primary btn-block">${q.submit} ${icon.arrow}</button>
      <p class="quiz-privacy">${q.privacy} <a href="${privacyPath(t)}" target="_blank">${q.privacyLink}</a></p>
    </fieldset>

    <div data-step data-result hidden>
      <div class="result-head">
        <span class="result-icon">${icon.check}</span>
        <h3 data-result-title></h3>
        <p data-result-body></p>
      </div>
      ${config.calLink ? `<div class="cal" id="cal"></div><p class="or"><span>${q.or}</span></p>` : ""}
      <a class="btn btn-wa btn-block" href="${waHref(t.wa.generic)}" data-wa target="_blank" rel="noopener">${icon.chat} ${config.calLink ? q.wa : q.waPrimary}</a>
    </div>
  </form>
</dialog>`;
}

export function landing(t, all, css, js, trade = null) {
  const tr = trade ? t.trades[trade] : null;
  const wa = waHref(t.wa.generic);
  const cta = (label, extra = "") =>
    `<a class="btn btn-primary btn-lg ${extra}" href="${wa}" data-open-quiz>${label} ${icon.arrow}</a>`;
  const p = config.price;
  const price = new Intl.NumberFormat(t.htmlLang, { style: "currency", currency: p.currency, maximumFractionDigits: 0 }).format(p.amount);

  const testimonials = config.testimonials.length
    ? `<section class="sec"><div class="wrap">
        <h2 class="h2 reveal">${t.proof.title}</h2>
        <div class="quotes">${config.testimonials
          .map(
            (q) => `<figure class="quote reveal"><i class="stars">${icon.star.repeat(5)}</i><blockquote>“${esc(q.quote)}”</blockquote>
            <figcaption><b>${esc(q.name)}</b> · ${esc(q.business)}, ${esc(q.city)}</figcaption></figure>`,
          )
          .join("")}</div>
      </div></section>`
    : "";

  const body = `<main>
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow">${icon.pin}<span>${t.hero.eyebrow(tr)}</span></p>
      <h1>${splitWords(t.hero.title(tr))}</h1>
      <p class="lead">${t.hero.sub}</p>
      <div class="hero-ctas" data-hero-cta>
        ${cta(t.hero.cta)}
        <p class="cta-note">${t.hero.ctaNote}</p>
      </div>
      <a class="link-wa" href="${wa}" data-wa target="_blank" rel="noopener">${icon.chat}<span>${t.hero.wa}</span></a>
      <ul class="trust">${t.hero.trust.map((x) => `<li>${icon.check}${x}</li>`).join("")}</ul>
    </div>
    ${demo(t, tr)}
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="reveal">
      <h2 class="h2">${t.problem.title}</h2>
      <p class="body-lg">${t.problem.body}</p>
      <ol class="points">
        ${t.problem.points.map((x) => `<li><h3>${x.t}</h3><p>${x.d}</p></li>`).join("")}
      </ol>
    </div>
    <div class="reveal">${mock(t, tr)}</div>
  </div>
</section>

<section class="sec tint">
  <div class="wrap split split-rev">
    <div class="reveal">
      <h2 class="h2">${t.grid.title}</h2>
      <p class="body-lg">${t.grid.body}</p>
      <ul class="legend">
        <li><span class="dot g"></span>${t.grid.legend[0]}</li>
        <li><span class="dot m"></span>${t.grid.legend[1]}</li>
        <li><span class="dot b"></span>${t.grid.legend[2]}</li>
      </ul>
    </div>
    <div class="reveal">
      <div class="ranks">
        ${rankGrid(BEFORE, t.grid.before)}
        <span class="ranks-arrow">${icon.arrow}</span>
        ${rankGrid(AFTER, t.grid.after)}
      </div>
      <p class="caption">${t.grid.caption}</p>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <h2 class="h2 reveal">${t.how.title}</h2>
    <ol class="steps" data-inview>
      ${t.how.steps.map((s, i) => `<li class="reveal"><span class="step-n">${i + 1}</span><h3>${s.t}</h3><p>${s.d}</p></li>`).join("")}
    </ol>
    ${cta(t.hero.cta)}
  </div>
</section>

<section class="sec tint">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2 class="h2">${t.features.title}</h2>
      <p class="body-lg">${t.features.sub}</p>
    </div>
    <ul class="feats">
      ${t.features.items.map((f) => `<li class="reveal">${icon.check}<div><h3>${f.t}</h3><p>${f.d}</p></div></li>`).join("")}
    </ul>
  </div>
</section>

${testimonials}

<section class="sec">
  <div class="wrap guarantee reveal">
    ${seal(t)}
    <div>
      <h2 class="h2">${t.guarantee.title}</h2>
      <p class="body-lg">${t.guarantee.body}</p>
      <p class="caption">${t.guarantee.note}</p>
    </div>
  </div>
</section>

<section class="sec tint">
  <div class="wrap">
    <h2 class="h2 reveal">${t.fit.title}</h2>
    <div class="fit">
      <div class="fit-col yes reveal"><h3>${t.fit.yesTitle}</h3><ul>${t.fit.yes.map((x) => `<li>${icon.check}${x}</li>`).join("")}</ul></div>
      <div class="fit-col no reveal"><h3>${t.fit.noTitle}</h3><ul>${t.fit.no.map((x) => `<li>${icon.cross}${x}</li>`).join("")}</ul></div>
    </div>
  </div>
</section>

${
  p.show
    ? `<section class="sec">
  <div class="wrap price-wrap">
    <div class="reveal">
      <h2 class="h2">${t.pricing.title}</h2>
      <p class="body-lg">${t.pricing.note}</p>
    </div>
    <div class="price-card reveal">
      <p class="price-name">${t.pricing.name}</p>
      <p class="price"><b>${price}</b><span>${t.pricing.period[p.period]}<br>${t.pricing.vat}</span></p>
      <ul>${t.pricing.includes.map((x) => `<li>${icon.check}${x}</li>`).join("")}</ul>
      ${cta(t.pricing.cta, "btn-block")}
    </div>
  </div>
</section>`
    : ""
}

<section class="sec ${p.show ? "tint" : ""}">
  <div class="wrap faq-wrap">
    <h2 class="h2 reveal">${t.faq.title}</h2>
    <div class="faq">
      ${t.faq.items.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}
    </div>
  </div>
</section>

<section class="final">
  <div class="wrap final-in reveal">
    <h2 class="h2">${t.final.title}</h2>
    <p class="body-lg">${t.final.body}</p>
    <div class="final-ctas">
      <a class="btn btn-light btn-lg" href="${wa}" data-open-quiz>${t.final.cta} ${icon.arrow}</a>
      <a class="link-wa" href="${wa}" data-wa target="_blank" rel="noopener">${icon.chat}<span>WhatsApp</span></a>
    </div>
  </div>
</section>
</main>

<div class="sticky" data-sticky aria-hidden="true">
  <a class="btn btn-primary" href="${wa}" data-open-quiz tabindex="-1">${t.sticky.cta} ${icon.arrow}</a>
  <a class="btn btn-wa btn-icon" href="${wa}" data-wa target="_blank" rel="noopener" tabindex="-1" aria-label="WhatsApp">${icon.chat}</a>
</div>

${quizDialog(t, trade)}`;

  return layout({
    t,
    all,
    title: t.meta.title(tr),
    description: t.meta.description(tr),
    pathFor: (l) => landingPath(l, trade),
    body,
    css,
    js,
    pr: clientData(t, {
      page: "landing",
      trade,
      isLanding: true,
      demo: demoData(t),
    }),
  });
}

/* ---------- Thank you ---------- */

export function thanks(t, all, css, js) {
  const body = `<main class="simple">
  <div class="wrap narrow">
    <span class="result-icon big">${icon.check}</span>
    <h1 class="h1-simple">${t.thanks.title}</h1>
    <p class="body-lg">${t.thanks.body}</p>
    <div class="prep-box">
      <h2 class="h3">${t.thanks.prepTitle}</h2>
      <ol class="prep">${t.thanks.prep.map((x) => `<li>${x}</li>`).join("")}</ol>
    </div>
    <p><a class="btn btn-wa" href="${waHref(t.wa.generic)}" data-wa target="_blank" rel="noopener">${icon.chat} ${t.thanks.wa}</a></p>
    <p><a class="back" href="/${t.code}/">← ${t.thanks.back}</a></p>
  </div>
</main>`;
  return layout({
    t,
    all,
    title: t.thanks.meta,
    description: t.thanks.body,
    pathFor: thanksPath,
    body,
    css,
    js,
    noindex: true,
    pr: clientData(t, { page: "thanks", trade: null, isLanding: false }),
  });
}

/* ---------- Privacy ---------- */

export function privacy(t, all, css, js) {
  const date = new Intl.DateTimeFormat(t.htmlLang, { dateStyle: "long" }).format(new Date());
  const body = `<main class="simple prose">
  <div class="wrap narrow">
    <h1 class="h1-simple">${t.privacy.title}</h1>
    <p class="caption">${t.privacy.updated}: ${date}</p>
    ${t.privacy
      .sections({ name: esc(config.company.name), address: esc(config.company.address), vat: esc(config.company.vat), email: esc(config.company.email) })
      .map((s) => `<h2 class="h3">${s.h}</h2><p>${s.p}</p>`)
      .join("")}
  </div>
</main>`;
  return layout({
    t,
    all,
    title: t.privacy.meta,
    description: t.privacy.title,
    pathFor: privacyPath,
    body,
    css,
    js,
    pr: clientData(t, { page: "privacy", trade: null, isLanding: false }),
  });
}

/* ---------- Root: send the visitor to their language ---------- */

export function root(all) {
  const codes = all.map((l) => l.code);
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(config.brand)}</title>
<link rel="canonical" href="${config.siteUrl}/${config.defaultLanguage}/">
${all.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${config.siteUrl}/${l.code}/">`).join("\n")}
<script>
(function(){var c=${JSON.stringify(codes)},d=${JSON.stringify(config.defaultLanguage)},l=navigator.languages||[navigator.language||""];
for(var i=0;i<l.length;i++){var k=String(l[i]).slice(0,2).toLowerCase();if(c.indexOf(k)>-1){d=k;break}}
location.replace("/"+d+"/"+location.search+location.hash)})();
</script>
<style>body{font:16px system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#fbfbf9;color:#141716}a{margin:0 .5em;color:#1f5c45}</style>
</head>
<body><p>${all.map((l) => `<a href="/${l.code}/">${l.label}</a>`).join("")}</p></body>
</html>`;
}

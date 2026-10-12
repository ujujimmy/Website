/* PinRank funnel. No dependencies. Every page gets this; it no-ops the parts a page doesn't have.
 *
 * Funnel: CTA → 4-step qualifier (dialog) → calendar (Cal.com) or WhatsApp → /thank-you.
 * Meta events: PageView, StartQuiz (custom), Lead, Contact (WhatsApp), Schedule (on the thank-you page).
 */
(function () {
  "use strict";
  var PR = window.PR || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fill = function (tpl, o) { return String(tpl).replace(/\{(\w+)\}/g, function (_, k) { return o[k] == null ? "" : o[k]; }); };
  var ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} },
  };
  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- Attribution: keep UTMs for the whole visit ---------- */
  var utm = {};
  try { utm = JSON.parse(ss.get("pr_utm") || "{}"); } catch (e) {}
  var params = new URLSearchParams(location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach(function (k) {
    if (params.get(k)) utm[k] = params.get(k);
  });
  ss.set("pr_utm", JSON.stringify(utm));

  /* ---------- Consent + Meta Pixel ---------- */
  var pixelOn = false;
  function loadPixel() {
    if (!PR.pixel || pixelOn) return;
    /* Meta's standard loader */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PR.pixel);
    window.fbq("track", "PageView");
    pixelOn = true;
  }
  function track(name, data, custom) {
    if (pixelOn && window.fbq) window.fbq(custom ? "trackCustom" : "track", name, data || {});
  }

  var banner = $("#cookie");
  function setConsent(v) {
    ls.set("pr_consent", v);
    if (banner) banner.hidden = true;
    if (v === "yes") loadPixel();
    else if (pixelOn && window.fbq) window.fbq("consent", "revoke");
  }
  if (PR.pixel) {
    var c = ls.get("pr_consent");
    if (c === "yes") loadPixel();
    else if (!c && banner) banner.hidden = false;
  }
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () { setConsent(b.getAttribute("data-consent")); });
  });
  $$("[data-cookie-settings]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); if (banner) banner.hidden = false; });
  });

  /* ---------- Lead webhook (optional) ---------- */
  var state = { trade: PR.trade || "", region: "", gbp: "", name: "", company: "", phone: "", email: "" };
  function send(event) {
    if (!PR.webhook) return;
    var body = JSON.stringify(Object.assign({ event: event, lang: PR.lang, page: location.pathname, at: new Date().toISOString() }, state, utm));
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(PR.webhook, new Blob([body], { type: "text/plain" }))) return;
      fetch(PR.webhook, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" }, body: body });
    } catch (e) {}
  }

  /* ---------- WhatsApp ---------- */
  function tradeLabel() { var t = PR.trades && PR.trades[state.trade]; return t ? t.label : ""; }
  function refreshWa() {
    var msg = state.name ? fill(PR.wa.quiz, Object.assign({}, state, { trade: tradeLabel() })) : PR.wa.generic;
    var href = "https://wa.me/" + PR.whatsapp + "?text=" + encodeURIComponent(msg);
    $$("[data-wa]").forEach(function (a) { a.href = href; });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-wa]");
    if (!a) return;
    track("Contact", { content_name: "whatsapp" });
    send("whatsapp_click");
  });

  /* ---------- Thank-you page ---------- */
  if (PR.page === "thanks" && ss.get("pr_booked")) {
    try { Object.assign(state, JSON.parse(ss.get("pr_lead") || "{}")); } catch (e) {}
    refreshWa();
    track("Schedule", { content_category: state.trade });
    ss.del("pr_booked");
  }

  /* ---------- Sticky mobile CTA: appears once the hero CTA scrolls away ---------- */
  var sticky = $("[data-sticky]");
  var heroCta = $("[data-hero-cta]");
  if (sticky && heroCta && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var on = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      sticky.classList.toggle("on", on);
      sticky.setAttribute("aria-hidden", on ? "false" : "true");
      $$("a", sticky).forEach(function (a) { a.tabIndex = on ? 0 : -1; });
    }).observe(heroCta);
  }

  /* ---------- Qualifier ---------- */
  var dlg = $("#quiz");
  var form = $("#quiz-form");
  if (!dlg || !form || typeof dlg.showModal !== "function") return; // no dialog support → CTAs fall through to WhatsApp

  var steps = $$("[data-step]", form);
  var QUESTIONS = steps.length - 1; // the last step is the result
  var current = 0;
  var started = false;
  var finished = false;

  function show(n) {
    current = n;
    steps.forEach(function (s, i) { s.hidden = i !== n; });
    var isResult = n === QUESTIONS;
    $("[data-back]", form).hidden = n === 0 || isResult;
    $("[data-progress]", form).textContent = isResult ? "" : fill(PR.q.progress, { n: n + 1, total: QUESTIONS });
    $("[data-bar]", form).style.width = (isResult ? 100 : (n / QUESTIONS) * 100) + "%";
    var focusable = $("input", steps[n]) || $(".opt[aria-pressed='true']", steps[n]) || $(".opt", steps[n]);
    if (focusable && !isResult) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 30);
    dlg.scrollTop = 0;
  }

  function open(e) {
    e.preventDefault();
    if (!dlg.open) dlg.showModal();
    if (!started) {
      started = true;
      track("StartQuiz", { content_category: state.trade }, true);
      show(state.trade ? 1 : 0); // trade pages already know the trade
    }
  }
  $$("[data-open-quiz]").forEach(function (a) { a.addEventListener("click", open); });
  $("[data-close]", form).addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); // backdrop
  $("[data-back]", form).addEventListener("click", function () { if (current > 0) show(current - 1); });

  // Choice buttons answer and advance in one tap.
  $$("[data-choice]", form).forEach(function (b) {
    b.addEventListener("click", function () {
      var key = b.getAttribute("data-choice");
      state[key] = b.value;
      $$("[data-choice='" + key + "']", form).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      setTimeout(function () { show(current + 1); }, 160);
    });
  });

  function setErr(input, msg) {
    var err = input.parentNode.querySelector(".err");
    if (err) err.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function validate(step) {
    var firstBad = null;
    $$("input", step).forEach(function (input) {
      var v = input.value.trim();
      var msg = "";
      if (!v) msg = PR.q.errors.required;
      else if (input.type === "tel" && v.replace(/\D/g, "").length < 9) msg = PR.q.errors.phone;
      else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = PR.q.errors.email;
      setErr(input, msg);
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  $$("input", form).forEach(function (input) {
    input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") setErr(input, ""); });
  });

  $("[data-next]", form).addEventListener("click", function () {
    if (validate(steps[current])) show(current + 1);
  });
  // Enter in the region field moves on instead of submitting the form.
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.name === "region") { e.preventDefault(); $("[data-next]", form).click(); }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate(steps[current])) return;
    ["region", "name", "company", "phone", "email"].forEach(function (k) { state[k] = form.elements[k].value.trim(); });
    finish();
  });

  function finish() {
    var firstName = state.name.split(/\s+/)[0];
    var trade = PR.trades[state.trade] || PR.trades.other;
    $("[data-result-title]", form).textContent = fill(PR.q.resultTitle, { name: firstName });
    $("[data-result-body]", form).textContent = fill(PR.q.resultBody, { plural: trade.plural, region: state.region });
    refreshWa();
    show(QUESTIONS);
    ss.set("pr_lead", JSON.stringify(state));
    if (!finished) {
      finished = true;
      track("Lead", { content_category: state.trade });
      send("lead");
      mountCal();
    }
  }

  /* ---------- Cal.com inline booking ---------- */
  function mountCal() {
    if (!PR.cal) return;
    /* Cal.com's standard loader */
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
      if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || [];
        if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; }
      p(cal, ar); }; })(window, PR.cal.js, "init");

    var trade = PR.trades[state.trade] || PR.trades.other;
    var notes = [state.company, trade.label, state.region, "GBP: " + state.gbp, state.phone].join(" · ");
    window.Cal("init", "pinrank", { origin: PR.cal.origin });
    window.Cal.ns.pinrank("inline", {
      elementOrSelector: "#cal",
      calLink: PR.cal.link,
      layout: "month_view",
      config: { name: state.name, email: state.email, notes: notes, layout: "month_view" },
    });
    var booked = false;
    var onBooked = function () {
      if (booked) return;
      booked = true;
      send("booked");
      ss.set("pr_booked", "1");
      setTimeout(function () { location.href = PR.thanksUrl; }, 400);
    };
    window.Cal.ns.pinrank("on", { action: "bookingSuccessful", callback: onBooked });
    window.Cal.ns.pinrank("on", { action: "bookingSuccessfulV2", callback: onBooked });
  }
})();

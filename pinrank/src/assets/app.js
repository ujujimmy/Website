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

  /* ---------- Header hairline once the page scrolls ---------- */
  var top = $(".top");
  if (top) {
    var onScroll = function () { top.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll (one-shot) ---------- */
  var revealEls = $$(".reveal, [data-inview]");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
    document.documentElement.classList.add("io");
  } else revealEls.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Google Maps scene ----------
   * One loop (~10 s): the search types itself, rival pins drop in, the
   * business sits at "position 7", then climbs to #1, its pin lands and a
   * call comes in. On the general page each loop types the next trade. Only
   * classes and a CSS variable change, so the browser animates it all on the
   * compositor. Runs only while on screen; reduced motion keeps the final frame.
   */
  try { (function maps() {
    var root = $("[data-maps]");
    if (!root || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var queries = JSON.parse(root.getAttribute("data-queries") || "[]");
    var typed = $("[data-typed]", root);
    var rows = {};
    $$("[data-row]", root).forEach(function (r) { rows[r.getAttribute("data-row")] = r; });
    var timers = [], running = false, qi = 0;
    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function place(order) { // order: row keys from position 1 down; the 4th slot is "further down"
      order.forEach(function (k, i) {
        var r = rows[k];
        r.style.setProperty("--pos", i);
        r.classList.toggle("low", i === 3);
        r.classList.toggle("top", k === "you" && i === 0);
        $("[data-rank]", r).textContent = k === "you" && i === 3 ? 7 : i + 1;
      });
    }
    function cycle() {
      var q = queries[qi++ % queries.length] || "";
      root.classList.remove("ring", "top", "drop");
      root.classList.add("before", "typing");
      place(["a", "b", "c", "you"]);
      typed.textContent = "";
      for (var i = 1; i <= q.length; i++) (function (n) { later(250 + n * 45, function () { typed.textContent = q.slice(0, n); }); })(i);
      var t = 250 + q.length * 45 + 250;
      later(t, function () { root.classList.remove("typing"); void root.offsetWidth; root.classList.add("drop"); });
      later(t + 1500, function () { place(["you", "a", "b", "c"]); root.classList.remove("before"); });
      later(t + 2500, function () { root.classList.add("top"); });
      later(t + 3300, function () { root.classList.add("ring"); });
      later(t + 6800, function () { root.classList.remove("ring"); });
      later(t + 7600, cycle);
    }
    function start() { if (running) return; running = true; cycle(); }
    function stop() { running = false; timers.forEach(clearTimeout); timers = []; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }, { threshold: 0.35 }).observe(root);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); });
  })(); } catch (err) { if (window.console) console.error(err); }

  /* ---------- ROI calculator ---------- */
  try { (function calc() {
    var root = $("[data-calc]");
    if (!root || !PR.calc) return;
    var C = PR.calc, job = $("[data-job]", root), extra = $("[data-extra]", root);
    var money = new Intl.NumberFormat(PR.locale, { style: "currency", currency: C.currency, maximumFractionDigits: 0 });
    function update() {
      var v = C.steps[+job.value], n = +extra.value, be = Math.ceil(C.price / v);
      $("[data-out-job]", root).textContent = money.format(v);
      $("[data-out-extra]", root).textContent = n;
      $("[data-out-rev]", root).textContent = money.format(v * n);
      $("[data-out-be]", root).textContent = (be === 1 ? C.one : C.many).replace("{n}", be);
    }
    job.addEventListener("input", update);
    extra.addEventListener("input", update);
  })(); } catch (err) { if (window.console) console.error(err); }

  /* ---------- 3D demo (video) ----------
   * The 3D scene is a pre-recorded video (scripts/demo-video.mjs): phones
   * decode video in hardware, so it plays smoothly where drawing it live
   * would stutter. The caption, counters and search bar are live text over
   * the video, driven by its playback time, so one video serves every
   * language and trade.
   */
  try { (function demo() {
    var root = $("[data-demo]");
    var v = root && $("video", root);
    if (!v || !PR.demo) return;
    var elWeek = $("[data-week]", root), elAvg = $("[data-avg]", root), elTop = $("[data-top3]", root);
    var elCap = $("[data-caption]", root), elProg = $("[data-progress]", root), elKnob = $("[data-knob]", root), elTime = $("[data-time]", root);
    var btn = $("[data-play]", root), big = $("[data-bigplay]", root), track = $("[data-track]", root), screen = $(".demo-screen", root);
    var quiz = $("#quiz");

    // Same timeline as the recording (demo-render.js)
    var B = PR.demo.before, A = PR.demo.after, CAPS = PR.demo.captions;
    var N = 5, T_IN = 1600, T_GROW = 10400, DUR = 14000;
    var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
    var ease = function (x) { x = clamp(x, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var DIST = [];
    for (var di = 0; di < N * N; di++) { var r0 = Math.floor(di / N) - 2, c0 = (di % N) - 2; DIST.push(Math.sqrt(r0 * r0 + c0 * c0) / 2.83); }
    var rankAt = function (i, p) { return B[i] + (A[i] - B[i]) * ease((p - DIST[i] * 0.35) / 0.65); };
    var nf = new Intl.NumberFormat(PR.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    var lastWeek = -1, lastCap = elCap.textContent, lastAvg = "", lastTop = "", lastSec = -1;
    var started = false; // until playback starts, the overlay shows the poster's finished state
    function sync(ms) {
      var t = ms != null ? ms : v.currentTime * 1000, p = clamp((t - T_IN) / (T_GROW - T_IN), 0, 1);
      var week = Math.round(p * 12), sum = 0, top3 = 0;
      for (var i = 0; i < N * N; i++) { var r = rankAt(i, p); sum += Math.min(r, 20); if (Math.round(r) <= 3) top3++; }
      var avg = nf.format(sum / (N * N)), tops = top3 + "/25";
      if (avg !== lastAvg) { lastAvg = avg; elAvg.textContent = avg; }
      if (tops !== lastTop) { lastTop = tops; elTop.textContent = tops; }
      if (week !== lastWeek) {
        lastWeek = week;
        elWeek.textContent = week;
        track.setAttribute("aria-valuenow", week);
        var cap = CAPS[0].t;
        CAPS.forEach(function (c) { if (week >= c.w) cap = c.t; });
        if (cap !== lastCap) {
          lastCap = cap;
          elCap.classList.add("swap");
          setTimeout(function () { elCap.textContent = cap; elCap.classList.remove("swap"); }, 220);
        }
      }
      var sec = Math.floor(t / 1000);
      if (sec !== lastSec) { lastSec = sec; elTime.textContent = "0:" + (sec < 10 ? "0" : "") + sec + " / 0:" + DUR / 1000; }
    }
    // The progress bar is a CSS animation the compositor runs on its own; we
    // only line it up with the video when playback starts, jumps or loops.
    // Text updates ride the video's own timeupdate (~4 a second). Driving
    // either from JS every frame cost ~20x more than playing the video.
    function anims() {
      return [elProg, elKnob].map(function (el) { return el.getAnimations ? el.getAnimations()[0] : null; });
    }
    function align() {
      var ms = v.currentTime * 1000, list = anims();
      if (list[0] && list[1]) { list[0].currentTime = ms; list[1].currentTime = ms; return; }
      var d = -v.currentTime + "s"; // no Web Animations API: restart from the offset instead
      [elProg, elKnob].forEach(function (el) {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
        el.style.animationDelay = d;
      });
    }
    v.addEventListener("timeupdate", function () {
      var a = anims()[0];
      if (!a || Math.abs(((a.currentTime || 0) % DUR) - v.currentTime * 1000) > 120) align(); // drifted or looped
      if (started) sync();
    });
    // Stop the bar while the video waits for data, so the two never drift apart
    v.addEventListener("waiting", function () { root.classList.remove("playing"); });
    function setPausedUI(paused) {
      root.classList.toggle("is-paused", paused);
      btn.setAttribute("aria-label", btn.getAttribute(paused ? "data-label-play" : "data-label-pause"));
    }
    v.addEventListener("playing", function () { started = true; setPausedUI(false); align(); root.classList.add("playing"); sync(); });
    v.addEventListener("pause", function () { setPausedUI(true); root.classList.remove("playing"); align(); if (started) sync(); });
    v.addEventListener("seeked", function () { align(); if (started || wantEnd) sync(); });
    v.addEventListener("loadedmetadata", function () { if (wantEnd) v.currentTime = T_GROW / 1000; sync(); });

    // The visitor's choice wins over autoplay: once they pause, we stay paused.
    var userPaused = !!reduce, visible = false, wantEnd = !!reduce;
    function play() {
      v.muted = true; // required for autoplay everywhere
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () { setPausedUI(true); }); // e.g. iOS Low Power Mode blocks autoplay
    }
    function update() {
      var should = visible && !userPaused && !document.hidden && !(quiz && quiz.open);
      if (should && v.paused) play();
      else if (!should && !v.paused) v.pause();
    }
    function toggle() {
      if (v.paused) { userPaused = false; wantEnd = false; play(); }
      else { userPaused = true; v.pause(); }
    }
    btn.addEventListener("click", toggle);
    big.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    screen.addEventListener("click", toggle);

    function seek(e) {
      var rect = track.getBoundingClientRect();
      var k = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      if (v.duration) v.currentTime = k * v.duration;
      sync();
    }
    track.addEventListener("pointerdown", function (e) {
      track.setPointerCapture(e.pointerId);
      started = true; userPaused = true; v.pause(); seek(e);
      var move = function (ev) { seek(ev); };
      var up = function () { track.removeEventListener("pointermove", move); track.removeEventListener("pointerup", up); };
      track.addEventListener("pointermove", move);
      track.addEventListener("pointerup", up);
    });
    track.addEventListener("keydown", function (e) {
      var step = (T_GROW - T_IN) / 12000;
      if (e.key === "ArrowRight") v.currentTime = Math.min(v.duration || 14, v.currentTime + step);
      else if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - step);
      else return;
      e.preventDefault(); started = true; userPaused = true; v.pause();
    });

    // Start loading just before it scrolls into view; play only while visible.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting && v.preload !== "auto") { v.preload = "auto"; v.load(); }
        visible = en[0].intersectionRatio > 0.2;
        update();
      }, { rootMargin: "200px 0px", threshold: [0, 0.2, 0.5] }).observe(root);
    } else { visible = true; v.preload = "auto"; }
    document.addEventListener("visibilitychange", update);
    if (quiz) new MutationObserver(update).observe(quiz, { attributes: true, attributeFilter: ["open"] });

    setPausedUI(true);
    sync(T_GROW); // match the poster (the finished state) until playback starts
    update();
  })(); } catch (err) { if (window.console) console.error(err); } // the funnel works without the demo
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
  // Hero trade picker: one tap answers the first question and opens the
  // qualifier on the next. Without the dialog the chips are links to the trade pages.
  $$("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var k = a.getAttribute("data-pick");
      state.trade = k;
      $$("[data-choice='trade']", form).forEach(function (o) { o.setAttribute("aria-pressed", String(o.value === k)); });
      if (!dlg.open) dlg.showModal();
      if (!started) { started = true; track("StartQuiz", { content_category: k }, true); }
      show(1);
    });
  });
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

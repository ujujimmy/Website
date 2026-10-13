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

  /* ---------- 3D demo ----------
   * A tilted map with a 5×5 grid of columns, one per measuring point. Column
   * height and colour follow the business's rank at that point; over a
   * 12-week timeline every point moves from the "before" to the "after"
   * grid, centre first (the area nearest the business improves first).
   * Drawn on a 2D canvas with a small projection: no 3D library, ~0 KB extra.
   */
  (function demo() {
    var root = $("[data-demo]");
    if (!root || !PR.demo) return;
    var cv = $("canvas", root);
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    var screen = $("[data-tilt]", root);
    var elWeek = $("[data-week]", root), elAvg = $("[data-avg]", root), elTop = $("[data-top3]", root);
    var elCap = $("[data-caption]", root), elProg = $("[data-progress]", root), elTime = $("[data-time]", root);
    var btn = $("[data-play]", root), track = $("[data-track]", root);

    var B = PR.demo.before, A = PR.demo.after, CAPS = PR.demo.captions;
    var N = 5, DUR = 14000, T_IN = 1600, T_GROW = 10400; // ms: intro, growth ends, then hold
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var playing = !reduce, visible = true, t = reduce ? T_GROW : 0, clock = 0, last = 0, raf = 0;
    var W = 0, H = 0, S = 1, cx = 0, cy = 0;
    var SIN_E = Math.sin(0.62), COS_E = Math.cos(0.62); // camera elevation
    var FONT = getComputedStyle(document.body).fontFamily;
    var nf = new Intl.NumberFormat(PR.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    var C = {
      good: [92, 184, 138], mid: [226, 172, 74], bad: [214, 104, 76],
      plane: "#1f2b27", road: "rgba(255,255,255,0.07)", dot: "rgba(255,255,255,0.10)",
    };
    var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
    var ease = function (x) { x = clamp(x, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var mix = function (a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; };
    function rankColor(r) {
      if (r <= 3) return C.good;
      if (r <= 6) return mix(C.good, C.mid, (r - 3) / 3);
      if (r <= 10) return C.mid;
      if (r <= 14) return mix(C.mid, C.bad, (r - 10) / 4);
      return C.bad;
    }
    var rgb = function (c, k) { k = k == null ? 1 : k; return "rgb(" + (c[0] * k | 0) + "," + (c[1] * k | 0) + "," + (c[2] * k | 0) + ")"; };

    function growth() { return clamp((t - T_IN) / (T_GROW - T_IN), 0, 1); }
    function rankAt(i, p) {
      var r = Math.floor(i / N) - 2, c = (i % N) - 2;
      var dist = Math.sqrt(r * r + c * c) / 2.83;           // 0 at the business, 1 at the corners
      var k = ease((p - dist * 0.35) / 0.65);
      return B[i] + (A[i] - B[i]) * k;
    }

    function resize() {
      var rect = cv.getBoundingClientRect();
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width; H = rect.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // fit the scene between the search chip and the caption/stats overlay
      var topPad = 58, band = H - topPad - Math.max(118, H * 0.28);
      S = Math.min(W / 7, band / 4.9);
      cx = W / 2; cy = topPad + 3.2 * S;
      draw();
    }

    function proj(x, y, z, cs, sn) {
      var X = x * cs - y * sn, Y = x * sn + y * cs;
      return { x: cx + X * S, y: cy + Y * S * SIN_E - z * S * COS_E, d: Y };
    }
    function poly(pts, fill) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }

    function draw() {
      if (!W) return;
      var yaw = Math.PI / 4 + Math.sin(clock / 5200) * 0.16;
      var cs = Math.cos(yaw), sn = Math.sin(yaw);
      var intro = ease(t / T_IN);
      var p = growth();
      ctx.clearRect(0, 0, W, H);

      // Ground plane, streets and measuring dots
      ctx.globalAlpha = intro;
      var E = 2.85;
      poly([proj(-E, -E, 0, cs, sn), proj(E, -E, 0, cs, sn), proj(E, E, 0, cs, sn), proj(-E, E, 0, cs, sn)], C.plane);
      ctx.strokeStyle = C.road; ctx.lineWidth = Math.max(1, S * 0.05);
      [-1.5, -0.5, 0.5, 1.5].forEach(function (v, k) {
        ctx.lineWidth = Math.max(1, S * (k === 1 ? 0.12 : 0.04));
        var a = proj(v, -E, 0, cs, sn), b = proj(v, E, 0, cs, sn);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        a = proj(-E, v, 0, cs, sn); b = proj(E, v, 0, cs, sn);
        ctx.lineWidth = Math.max(1, S * (k === 2 ? 0.12 : 0.04));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });

      // Pulse ring around the business
      var pulse = (clock % 2400) / 2400;
      ctx.strokeStyle = "rgba(92,184,138," + (0.5 * (1 - pulse) * intro) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (var a = 0; a <= 32; a++) {
        var ang = (a / 32) * Math.PI * 2, rr = 0.4 + pulse * 1.3;
        var q = proj(Math.cos(ang) * rr, Math.sin(ang) * rr, 0, cs, sn);
        a ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
      }
      ctx.stroke();

      // Columns, far to near
      var cells = [];
      for (var i = 0; i < N * N; i++) {
        var gx = (i % N) - 2, gy = Math.floor(i / N) - 2;
        var r = rankAt(i, p);
        cells.push({ i: i, x: gx, y: gy, r: r, d: proj(gx, gy, 0, cs, sn).d });
      }
      cells.sort(function (m, n) { return m.d - n.d; });

      var w = 0.26;
      var normals = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      cells.forEach(function (c) {
        var rise = ease((t - 200 - c.d * 60 - 300) / 1100);   // columns grow in during the intro
        var h = (0.12 + (21 - clamp(c.r, 1, 21)) / 20 * 1.5) * rise;
        var col = rankColor(c.r);
        var base = [[c.x - w, c.y - w], [c.x + w, c.y - w], [c.x + w, c.y + w], [c.x - w, c.y + w]];
        var lo = base.map(function (b) { return proj(b[0], b[1], 0, cs, sn); });
        var hi = base.map(function (b) { return proj(b[0], b[1], h, cs, sn); });

        // soft contact shadow
        ctx.globalAlpha = 0.35 * intro;
        poly(base.map(function (b) { return proj(b[0] + 0.12, b[1] + 0.12, 0, cs, sn); }), "#000");
        ctx.globalAlpha = intro;

        for (var s = 0; s < 4; s++) {
          var nx = normals[s][0], ny = normals[s][1];
          var nY = nx * sn + ny * cs, nX = nx * cs - ny * sn;
          if (nY <= 0) continue;
          var shade = 0.58 + 0.22 * nX;
          poly([lo[s], lo[(s + 1) % 4], hi[(s + 1) % 4], hi[s]], rgb(col, shade));
        }
        poly(hi, rgb(col, 1.04));

        // rank number on the top face
        var tc = proj(c.x, c.y, h, cs, sn);
        var label = c.r >= 20.5 ? "20+" : String(Math.round(c.r));
        ctx.fillStyle = "rgba(14,20,18,0.85)";
        ctx.font = "600 " + Math.max(9, S * 0.2).toFixed(1) + "px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (rise > 0.6) ctx.fillText(label, tc.x, tc.y + 0.5);

        // the business itself: a pin floating over the centre column
        if (c.i === 12) {
          var pz = h + 0.55 + Math.sin(clock / 500) * 0.06;
          var pp = proj(c.x, c.y, pz, cs, sn), pr = Math.max(7, S * 0.2);
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(pp.x, pp.y + pr * 2.1);
          ctx.bezierCurveTo(pp.x - pr * 0.4, pp.y + pr * 1.2, pp.x - pr, pp.y + pr * 0.7, pp.x - pr, pp.y);
          ctx.arc(pp.x, pp.y, pr, Math.PI, 0);
          ctx.bezierCurveTo(pp.x + pr, pp.y + pr * 0.7, pp.x + pr * 0.4, pp.y + pr * 1.2, pp.x, pp.y + pr * 2.1);
          ctx.fill();
          ctx.fillStyle = rgb(C.good);
          ctx.beginPath(); ctx.arc(pp.x, pp.y, pr * 0.42, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      hud(p);
    }

    var lastWeek = -1, lastCap = "";
    function hud(p) {
      var week = Math.round(p * 12), sum = 0, top3 = 0;
      for (var i = 0; i < N * N; i++) { var r = rankAt(i, p); sum += Math.min(r, 20); if (Math.round(r) <= 3) top3++; }
      var avg = nf.format(sum / (N * N));
      if (elAvg.textContent !== avg) elAvg.textContent = avg;
      if (elTop.textContent !== top3 + "/25") elTop.textContent = top3 + "/25";
      if (week !== lastWeek) {
        lastWeek = week;
        elWeek.textContent = week;
        track.setAttribute("aria-valuenow", week);
        var cap = CAPS[0].t;
        CAPS.forEach(function (c) { if (week >= c.w) cap = c.t; });
        if (cap !== lastCap) {
          lastCap = cap;
          elCap.classList.add("swap");
          setTimeout(function () { elCap.textContent = cap; elCap.classList.remove("swap"); }, 250);
        }
      }
      elProg.style.width = (t / DUR) * 100 + "%";
      var sec = Math.floor(t / 1000), tot = Math.round(DUR / 1000);
      elTime.textContent = "0:" + (sec < 10 ? "0" : "") + sec + " / 0:" + tot;
    }

    function frame(now) {
      raf = 0;
      var dt = last ? Math.min(50, now - last) : 16;
      last = now;
      if (playing) {
        t += dt; clock += dt;
        if (t >= DUR) { t = 0; lastWeek = -1; }
      }
      draw();
      schedule();
    }
    function schedule() {
      if (playing && visible && !document.hidden && !raf) raf = requestAnimationFrame(frame);
      if (!playing || !visible) last = 0;
    }
    function setPlaying(v) {
      playing = v;
      btn.classList.toggle("paused", !v);
      btn.setAttribute("aria-label", btn.getAttribute(v ? "data-label-pause" : "data-label-play"));
      schedule();
    }
    btn.addEventListener("click", function () {
      if (!playing && t >= DUR - 50) t = 0;
      setPlaying(!playing);
    });

    // Scrub: drag or tap the track; arrow keys step a week
    function seek(e) {
      var rect = track.getBoundingClientRect();
      t = clamp((e.clientX - rect.left) / rect.width, 0, 1) * DUR;
      draw();
    }
    track.addEventListener("pointerdown", function (e) {
      track.setPointerCapture(e.pointerId);
      setPlaying(false); seek(e);
      var move = function (ev) { seek(ev); };
      var up = function () { track.removeEventListener("pointermove", move); track.removeEventListener("pointerup", up); };
      track.addEventListener("pointermove", move);
      track.addEventListener("pointerup", up);
    });
    track.addEventListener("keydown", function (e) {
      var step = (T_GROW - T_IN) / 12;
      if (e.key === "ArrowRight") t = Math.min(DUR, t + step);
      else if (e.key === "ArrowLeft") t = Math.max(0, t - step);
      else return;
      e.preventDefault(); setPlaying(false); draw();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; schedule(); }).observe(root);
    }
    document.addEventListener("visibilitychange", schedule);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(cv); else window.addEventListener("resize", resize);

    // A gentle 3D tilt toward the pointer (mouse only)
    if (screen && !reduce && matchMedia("(hover: hover)").matches) {
      screen.addEventListener("pointermove", function (e) {
        var rect = screen.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5, py = (e.clientY - rect.top) / rect.height - 0.5;
        screen.style.setProperty("--ry", (px * 6).toFixed(2) + "deg");
        screen.style.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
      });
      screen.addEventListener("pointerleave", function () {
        screen.style.setProperty("--ry", "0deg"); screen.style.setProperty("--rx", "0deg");
      });
    }

    setPlaying(playing);
    resize();
  })();

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

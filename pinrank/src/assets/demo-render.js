/* PinRank 3D demo renderer — used only by scripts/demo-video.mjs and
 * scripts/ad-video.mjs to record the demo videos frame by frame. It is not
 * shipped to visitors: the site plays the recorded video instead, which a
 * phone decodes in hardware.
 *
 * Exposes window.PRDemo = { dur, seek(ms) } on pages opened with ?capture.
 */
(function () {
  "use strict";
  var PR = window.PR || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var params = new URLSearchParams(location.search);
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
    var ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;
    var elWeek = $("[data-week]", root), elAvg = $("[data-avg]", root), elTop = $("[data-top3]", root);
    var elCap = $("[data-caption]", root), elProg = $("[data-progress]", root), elKnob = $("[data-knob]", root), elTime = $("[data-time]", root);
    var btn = $("[data-play]", root), big = $("[data-bigplay]", root), track = $("[data-track]", root), screen = $(".demo-screen", root);
    var quiz = $("#quiz");

    var B = PR.demo.before, A = PR.demo.after, CAPS = PR.demo.captions;
    var N = 5, DUR = 14000, T_IN = 1600, T_GROW = 10400; // ms: intro, growth ends, then hold
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ?capture: scripts/ad-video.mjs steps the demo frame by frame to record the ad videos
    var capture = /[?&]capture\b/.test(location.search);
    var playing = false, visible = true, t = reduce ? T_GROW : 0, clock = 0, last = 0, raf = 0;
    var W = 0, H = 0, S = 1, cx = 0, cy = 0, trackW = 0, lastSec = -1;
    // Fixed camera: 45° yaw, ~36° elevation. Fixed means the ground and every
    // column footprint can be computed once per resize instead of every frame.
    var CS = Math.SQRT1_2, SN = Math.SQRT1_2, SIN_E = Math.sin(0.62), COS_E = Math.cos(0.62);
    var nf = new Intl.NumberFormat(PR.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    var C = { good: [92, 184, 138], mid: [226, 172, 74], bad: [214, 104, 76] };
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
    var rgb = function (c, k) { return "rgb(" + (c[0] * k | 0) + "," + (c[1] * k | 0) + "," + (c[2] * k | 0) + ")"; };

    // Each point's progress is staggered: the area nearest the business improves first.
    var DIST = [];
    for (var di = 0; di < N * N; di++) { var rr0 = Math.floor(di / N) - 2, cc0 = (di % N) - 2; DIST.push(Math.sqrt(rr0 * rr0 + cc0 * cc0) / 2.83); }
    function growth() { return clamp((t - T_IN) / (T_GROW - T_IN), 0, 1); }
    function rankAt(i, p) { return B[i] + (A[i] - B[i]) * ease((p - DIST[i] * 0.35) / 0.65); }

    function proj(x, y) { // ground point (z = 0)
      var X = x * CS - y * SN, Y = x * SN + y * CS;
      return { x: cx + X * S, y: cy + Y * S * SIN_E, d: Y };
    }

    // Precomputed per resize
    var ground = null, cells = [], faces = [], ZK = 1;
    function build() {
      var dpr = cv.width / W;
      ground = document.createElement("canvas");
      ground.width = cv.width; ground.height = cv.height;
      var g = ground.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var E = 2.85, c4 = [proj(-E, -E), proj(E, -E), proj(E, E), proj(-E, E)];
      g.beginPath(); g.moveTo(c4[0].x, c4[0].y); for (var k = 1; k < 4; k++) g.lineTo(c4[k].x, c4[k].y); g.closePath();
      g.fillStyle = "#1f2b27"; g.fill();
      g.strokeStyle = "rgba(255,255,255,0.07)";
      [-1.5, -0.5, 0.5, 1.5].forEach(function (v, k) {
        var a = proj(v, -E), b = proj(v, E);
        g.lineWidth = Math.max(1, S * (k === 1 ? 0.12 : 0.04));
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        a = proj(-E, v); b = proj(E, v);
        g.lineWidth = Math.max(1, S * (k === 2 ? 0.12 : 0.04));
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      });
      // contact shadows are static too
      g.fillStyle = "rgba(0,0,0,0.35)";
      var w = 0.26;
      for (var i = 0; i < N * N; i++) {
        var gx = (i % N) - 2 + 0.12, gy = Math.floor(i / N) - 2 + 0.12;
        var sh = [proj(gx - w, gy - w), proj(gx + w, gy - w), proj(gx + w, gy + w), proj(gx - w, gy + w)];
        g.beginPath(); g.moveTo(sh[0].x, sh[0].y); for (k = 1; k < 4; k++) g.lineTo(sh[k].x, sh[k].y); g.closePath(); g.fill();
      }

      // Column footprints, far to near. With a fixed 45° yaw only the two
      // front faces (+x and +y) are ever visible.
      cells = [];
      for (i = 0; i < N * N; i++) {
        var x = (i % N) - 2, y = Math.floor(i / N) - 2;
        cells.push({ i: i, lo: [proj(x - w, y - w), proj(x + w, y - w), proj(x + w, y + w), proj(x - w, y + w)], c: proj(x, y) });
      }
      cells.sort(function (m, n) { return m.c.d - n.c.d; });
      faces = [[1, 2, 0.58 + 0.22 * CS], [2, 3, 0.58 - 0.22 * SN]]; // [corner a, corner b, shade]
      ZK = S * COS_E; // screen pixels per unit of height
    }

    function resize() {
      var rect = cv.getBoundingClientRect();
      if (!rect.width) return;
      W = rect.width; H = rect.height;
      // Cap the backing store: past ~0.4 MP the extra sharpness is invisible on
      // flat shapes and the fill cost is what drops frames on phones.
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      if (W * H * dpr * dpr > 420000) dpr = Math.sqrt(420000 / (W * H));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var topPad = 58, band = H - topPad - Math.max(118, H * 0.28);
      S = Math.min(W / 7, band / 4.9);
      cx = W / 2; cy = topPad + 3.2 * S;
      trackW = track.clientWidth;
      build();
      draw();
    }

    function quad(a, b, c, d, fill) {
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
    }

    function draw() {
      if (!ground) return;
      var intro = ease(t / T_IN), p = growth();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalAlpha = intro;
      ctx.drawImage(ground, 0, 0);
      var dpr = cv.width / W;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // pulse ring around the business (an ellipse in screen space)
      var pulse = (clock % 2400) / 2400, rr = (0.4 + pulse * 1.3) * S;
      ctx.strokeStyle = "rgba(92,184,138," + (0.5 * (1 - pulse)).toFixed(3) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * SIN_E, 0, 0, Math.PI * 2); ctx.stroke();

      ctx.font = "600 " + Math.max(9, S * 0.2).toFixed(1) + "px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var n = 0; n < cells.length; n++) {
        var c = cells[n], r = rankAt(c.i, p);
        var rise = ease((t - 500 - c.c.d * 60) / 1100);
        var dz = (0.12 + (21 - clamp(r, 1, 21)) / 20 * 1.5) * rise * ZK;
        var col = rankColor(r), lo = c.lo;
        var hi = [{ x: lo[0].x, y: lo[0].y - dz }, { x: lo[1].x, y: lo[1].y - dz }, { x: lo[2].x, y: lo[2].y - dz }, { x: lo[3].x, y: lo[3].y - dz }];
        for (var f = 0; f < 2; f++) {
          var a = faces[f][0], b = faces[f][1];
          quad(lo[a], lo[b], hi[b], hi[a], rgb(col, faces[f][2]));
        }
        quad(hi[0], hi[1], hi[2], hi[3], rgb(col, 1.04));
        if (rise > 0.6) {
          ctx.fillStyle = "rgba(14,20,18,0.85)";
          ctx.fillText(r >= 20.5 ? "20+" : String(Math.round(r)), c.c.x, c.c.y - dz + 0.5);
        }
        if (c.i === 12) { // the business: a pin floating over the centre column
          var pr = Math.max(7, S * 0.2), px = c.c.x, py = c.c.y - dz - (0.55 + Math.sin(clock / 500) * 0.06) * ZK;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.moveTo(px, py + pr * 2.1);
          ctx.bezierCurveTo(px - pr * 0.4, py + pr * 1.2, px - pr, py + pr * 0.7, px - pr, py);
          ctx.arc(px, py, pr, Math.PI, 0);
          ctx.bezierCurveTo(px + pr, py + pr * 0.7, px + pr * 0.4, py + pr * 1.2, px, py + pr * 2.1);
          ctx.fill();
          ctx.fillStyle = rgb(C.good, 1);
          ctx.beginPath(); ctx.arc(px, py, pr * 0.42, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      hud(p);
    }

    var lastWeek = -1, lastCap = "", lastAvg = "", lastTop = "";
    function hud(p) {
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
        if (cap !== lastCap && capture) { lastCap = cap; elCap.textContent = cap; }
        else if (cap !== lastCap) {
          lastCap = cap;
          elCap.classList.add("swap");
          setTimeout(function () { elCap.textContent = cap; elCap.classList.remove("swap"); }, 250);
        }
      }
      // transforms only: no layout work per frame
      var k = t / DUR;
      elProg.style.transform = "scaleX(" + k.toFixed(4) + ")";
      elKnob.style.transform = "translateX(" + (k * trackW).toFixed(1) + "px)";
      var sec = Math.floor(t / 1000);
      if (sec !== lastSec) { lastSec = sec; elTime.textContent = "0:" + (sec < 10 ? "0" : "") + sec + " / 0:" + Math.round(DUR / 1000); }
    }

    // If a device can't hold 60 fps, settle at a steady 30 rather than
    // stuttering between the two. Motion is time-based either way.
    var avgDt = 16.7, half = false, odd = false;
    function frame(now) {
      raf = 0;
      var dt = last ? Math.min(50, now - last) : 16;
      last = now;
      t += dt; clock += dt;
      if (t >= DUR) { t = 0; lastWeek = -1; }
      avgDt += (dt - avgDt) * 0.05;
      if (!half && avgDt > 22) half = true;
      odd = !odd;
      if (!half || odd) draw();
      schedule();
    }
    function canRun() { return playing && visible && !document.hidden && !(quiz && quiz.open); }
    function schedule() {
      if (canRun()) { if (!raf) raf = requestAnimationFrame(frame); }
      else { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
    }
    function setPlaying(v) {
      playing = v;
      root.classList.toggle("is-paused", !v);
      btn.setAttribute("aria-label", btn.getAttribute(v ? "data-label-pause" : "data-label-play"));
      schedule();
    }
    function toggle() {
      if (!playing && t >= DUR - 50) t = 0;
      setPlaying(!playing);
    }
    btn.addEventListener("click", toggle);
    big.addEventListener("click", toggle);
    screen.addEventListener("click", function (e) { if (!e.target.closest("button")) toggle(); });

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
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; schedule(); }, { threshold: 0.15 }).observe(root);
    }
    document.addEventListener("visibilitychange", schedule);
    if (quiz) {
      new MutationObserver(schedule).observe(quiz, { attributes: true, attributeFilter: ["open"] });
    }
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(cv); else window.addEventListener("resize", resize);

    // Autoplay, unless the visitor asked their device for less motion: then
    // show the finished state with a big play button and let them choose.
    resize();
    if (capture) {
      window.PRDemo = { dur: DUR, seek: function (ms) { t = clamp(ms, 0, DUR - 1); clock = ms; draw(); } };
      setPlaying(false);
    } else setPlaying(!reduce);
  })();

})();

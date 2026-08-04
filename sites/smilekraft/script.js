/* Smilekraft Dental Clinic — small progressive-enhancement layer.
   Nothing here is required for the page to be readable or bookable:
   the phone links, WhatsApp links and map all work with JS disabled. */

(function () {
  "use strict";

  var WHATSAPP = "919736831214"; // country code + number, digits only

  /* ── Mobile menu ─────────────────────────────────────────── */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }

  /* ── Header shadow once scrolled ─────────────────────────── */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ── Reveal sections as they enter the viewport ──────────── */
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ── Current year in the footer ──────────────────────────── */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── "Open now" / "Closed" badge in the top bar ──────────── */
  // Clinic hours: Mon–Sat 10:00–18:00, Sunday closed. Keep in sync with
  // the hours table in index.html and the JSON-LD openingHoursSpecification.
  var OPEN_HOUR = 10, CLOSE_HOUR = 18;
  var hoursEl = document.getElementById("hours-now");
  if (hoursEl) {
    // Clinic is in IST; read the visitor's clock in Asia/Kolkata so the badge
    // is right for someone browsing from another timezone.
    var parts;
    try {
      parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", hour12: false
      }).formatToParts(new Date());
    } catch (err) {
      parts = null;
    }
    if (parts) {
      var day = "", hour = NaN;
      parts.forEach(function (p) {
        if (p.type === "weekday") day = p.value;
        if (p.type === "hour") hour = parseInt(p.value, 10);
      });
      var isOpen = day !== "Sun" && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
      var badge = document.createElement("strong");
      badge.textContent = isOpen ? "Open now" : "Closed now";
      badge.style.color = isOpen ? "#7ce0cd" : "#f3b7a8";
      badge.style.marginRight = "6px";
      hoursEl.insertBefore(badge, hoursEl.querySelector(".topbar__hours"));
    }
  }

  /* ── Appointment form → pre-filled WhatsApp message ──────── */
  var form = document.getElementById("apptForm");
  var errorEl = document.getElementById("formError");

  function fail(message, field) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      Array.prototype.forEach.call(form.elements, function (el) {
        el.removeAttribute("aria-invalid");
      });

      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var treatment = form.elements.treatment.value;
      var when = form.elements.when.value.trim();

      if (name.length < 2) {
        return fail("Please enter your name so we know who to call back.", form.elements.name);
      }
      var digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        return fail("Please enter a valid phone number we can reach you on.", form.elements.phone);
      }

      var lines = [
        "Hello Smilekraft, I'd like to book an appointment.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Treatment: " + treatment
      ];
      if (when) lines.push("Preferred time: " + when);

      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }
})();

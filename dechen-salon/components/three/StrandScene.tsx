"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDeviceTier } from "@/lib/device";
import { StrandPoster } from "./StrandPoster";

const StrandCanvas = dynamic(() => import("./StrandCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * Decides whether the visitor gets the WebGL strand or the poster, and — just
 * as importantly — *when*.
 *
 * three.js is by a wide margin the heaviest thing on this site, and it is
 * decoration. Parsing and compiling it costs a mid-range phone several seconds
 * of blocked main thread, during which taps on "Book" do nothing. Measured on a
 * throttled mobile profile it was 5.6s of total blocking time and it dragged
 * largest-contentful-paint from 1s to 7s.
 *
 * So the rule is: capable devices get it once the browser goes idle; weaker
 * ones get it only after the visitor has shown intent by scrolling or touching
 * the page. Someone who lands, reads the hero and taps Book never pays for it —
 * and never notices, because the poster underneath is a complete visual.
 */
export function StrandScene() {
  const { tier, ready } = useDeviceTier();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!ready || tier === "off") return;

    let idleHandle: number | undefined;
    const arm = () => setArmed(true);

    // Any sign that the visitor is engaging with the page. `scroll` is the one
    // that matters here — the homepage is a scroll story, so in practice this
    // fires within a second or two for anyone who is actually reading.
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    for (const event of events) {
      window.addEventListener(event, arm, { once: true, passive: true });
    }

    // Machines with headroom don't need to wait to be asked.
    if (tier === "high") {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(arm, { timeout: 1600 });
      } else {
        idleHandle = window.setTimeout(arm, 1200);
      }
    }

    return () => {
      for (const event of events) window.removeEventListener(event, arm);
      if (idleHandle === undefined) return;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
  }, [ready, tier]);

  const showCanvas = ready && tier !== "off" && armed;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Always present. The canvas fades in on top of it. */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: showCanvas ? 0 : 1 }}
      >
        <StrandPoster />
      </div>

      {showCanvas && <StrandCanvas tier={tier} />}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Plays a short reveal whenever the route changes.
 *
 * Deliberately does NOT run on first load. An overlay covering the hero at
 * initial paint would delay the LCP element, and mobile Lighthouse was hard
 * won — a transition is worth nothing if it costs the performance story the
 * site is meant to demonstrate. So the first render arms a ref and returns;
 * only subsequent navigations animate.
 *
 * The animation itself is CSS (see .route-transition in globals.css). This
 * component only toggles the attribute that starts it and clears it when the
 * animation ends, so an interrupted transition can never leave the overlay
 * covering the page.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setActive(true);
    // Matches the 620ms CSS animation, with a little slack. A timer rather
    // than animationend so a dropped frame or a backgrounded tab can't strand
    // the overlay in the visible state.
    const timer = window.setTimeout(() => setActive(false), 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className="route-transition"
      aria-hidden="true"
      {...(active ? { "data-active": "" } : {})}
    >
      <span className="rt-panel rt-top" />
      <span className="rt-panel rt-bottom" />
      <span className="rt-seam" />
    </div>
  );
}

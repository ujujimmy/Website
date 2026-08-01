"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling.
 *
 * Loaded dynamically and only for visitors who have not asked for reduced
 * motion — hijacking the scroll of someone who explicitly requested less motion
 * is exactly the wrong thing to do, and native scrolling is perfectly good.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        // Slightly longer than the default. The story is the product here, and
        // it wants to be scrolled through rather than flicked past.
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        // Touch devices keep their native scrolling, which always feels better
        // than anything we could simulate.
        syncTouch: false,
      });

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      destroy = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      if (destroy) destroy();
      else cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

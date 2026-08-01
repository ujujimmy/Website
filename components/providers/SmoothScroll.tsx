"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useDeviceProfile } from "@/lib/device";

/**
 * Lenis smooth scrolling, mounted once in the root layout.
 *
 * Disabled entirely for reduced-motion visitors and on touch devices — mobile
 * browsers already have good native inertia, and hijacking it there costs
 * performance while feeling worse.
 */
export function SmoothScroll() {
  const { reducedMotion, ready } = useDeviceProfile();

  useEffect(() => {
    if (!ready || reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [ready, reducedMotion]);

  return null;
}

"use client";

import { useEffect, useState } from "react";

export type GraphicsTier = "off" | "low" | "high";

export type DeviceProfile = {
  /** Resolved rendering tier for the WebGL layer. */
  tier: GraphicsTier;
  reducedMotion: boolean;
  /** True once detection has run — before this, render the poster. */
  ready: boolean;
};

/**
 * Decides how much 3D this device gets. The site must stay fast on a mid-range
 * Android phone, because that is what a lot of small business owners are
 * actually browsing on — and because a slow site is unsellable when SEO is
 * one of the things we're selling.
 *
 *   off  — no WebGL, or the user asked for reduced motion → static poster
 *   low  — mobile / few cores → fewer particles, no post-processing
 *   high — desktop with WebGL2 → the full scene
 */
function detect(): Omit<DeviceProfile, "ready"> {
  if (typeof window === "undefined") return { tier: "off", reducedMotion: false };

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return { tier: "off", reducedMotion: true };

  // No WebGL2 at all — bail to the poster rather than shipping a broken canvas.
  let hasWebGL2 = false;
  try {
    const canvas = document.createElement("canvas");
    hasWebGL2 = !!canvas.getContext("webgl2");
  } catch {
    hasWebGL2 = false;
  }
  if (!hasWebGL2) return { tier: "off", reducedMotion: false };

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 1024;

  const lowEnd = cores <= 4 || (memory !== undefined && memory <= 4);
  if (lowEnd || coarsePointer || narrow) {
    return { tier: "low", reducedMotion: false };
  }

  return { tier: "high", reducedMotion: false };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>({
    tier: "off",
    reducedMotion: false,
    ready: false,
  });

  useEffect(() => {
    setProfile({ ...detect(), ready: true });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setProfile({ ...detect(), ready: true });
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return profile;
}

/** Particle counts per tier. Tuned so `low` stays comfortably at 60fps. */
export const particleCount: Record<GraphicsTier, number> = {
  off: 0,
  low: 1400,
  high: 4800,
};

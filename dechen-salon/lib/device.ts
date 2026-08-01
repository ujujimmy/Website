"use client";

import { useEffect, useState } from "react";

/**
 * How much 3D this device should be asked to do.
 *
 * "off" covers three cases that all deserve the static poster instead: the
 * visitor asked for reduced motion, WebGL is unavailable, or the machine is too
 * weak to render sixty frames without making the page feel worse than it would
 * with no animation at all.
 */
export type Tier = "high" | "low" | "off";

/** Strand count per tier. The shape stays legible all the way down to 18. */
export const strandCount: Record<Exclude<Tier, "off">, number> = {
  high: 56,
  low: 24,
};

/** Segments along each strand. Fewer means blockier curves, not fewer strands. */
export const strandSegments: Record<Exclude<Tier, "off">, number> = {
  high: 28,
  low: 16,
};

function detect(): Tier {
  if (typeof window === "undefined") return "off";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "off";
  }

  // A real context, not just the constructor existing — some browsers expose
  // WebGLRenderingContext and then refuse to create a context.
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return "off";
  } catch {
    return "off";
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  // `deviceMemory` is Chromium-only; absent elsewhere, which is why it only
  // downgrades when it is present and low.
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;

  if (cores <= 4 || (memory !== undefined && memory <= 4)) return "low";
  if (window.matchMedia("(max-width: 640px)").matches) return "low";
  return "high";
}

/**
 * `ready` exists so the first render never guesses. Rendering the poster and
 * then swapping it for a canvas one frame later would count as layout shift;
 * the poster stays put and the canvas fades in over it.
 */
export function useDeviceTier() {
  const [state, setState] = useState<{ tier: Tier; ready: boolean }>({
    tier: "off",
    ready: false,
  });

  useEffect(() => {
    setState({ tier: detect(), ready: true });

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setState({ tier: detect(), ready: true });
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return state;
}

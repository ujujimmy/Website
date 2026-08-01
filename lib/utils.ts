/** Minimal class joiner — avoids pulling in clsx/tailwind-merge for this. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Clamp a number into a range. */
export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

/**
 * Map a value from one range to another and clamp to 0–1.
 * Used constantly to turn global scroll progress into per-beat progress.
 */
export const mapRange = (v: number, inMin: number, inMax: number) =>
  clamp((v - inMin) / (inMax - inMin));

/** Smoothstep easing for scroll-driven transitions. */
export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

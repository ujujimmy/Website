import { twMerge } from "tailwind-merge";

/**
 * Join class names, with later ones actually beating earlier ones.
 *
 * This used to be `parts.filter(Boolean).join(" ")`, on the reasoning that a
 * plain join avoids a dependency. It doesn't avoid the problem the dependency
 * exists for: two Tailwind utilities from the same group both survive the
 * join, they have identical specificity, and the winner is decided by their
 * order in the generated stylesheet — not by the order you passed them.
 *
 * That shipped two real bugs. `<Button className="hidden sm:inline-flex">`
 * kept Button's own `inline-flex` and stayed visible, so the header CTA
 * appeared on every phone and pushed the layout past 320px. `<LogoMark
 * className="w-8">` kept a base `w-full` and the logo expanded to fill the
 * header bar. Both looked like CSS mysteries; both were this function.
 *
 * twMerge resolves conflicts by group, so the last value wins the way every
 * caller already assumed it did.
 */
export function cn(...parts: (string | false | null | undefined)[]) {
  return twMerge(parts.filter(Boolean).join(" "));
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

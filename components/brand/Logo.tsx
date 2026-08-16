import { brand } from "@/content/brand";
import { cn } from "@/lib/utils";

/**
 * The jigme.io identity.
 *
 * Five stars climbing left to right, each larger and higher than the last —
 * the rating we manage and the growth we sell in one shape. The mark carried
 * over from the previous name unchanged: it says something about the work
 * rather than about the word, so a rename doesn't invalidate it. The brand
 * rules from the original identity sheet still hold and are load-bearing,
 * not decoration:
 *
 *   - the stars only ever climb left to right; never mirrored, never
 *     levelled out, never re-ordered by size
 *   - clear space on all sides equals the width of the largest star
 *   - below ~150px wide the lockup is dropped for the mark alone
 *
 * The star geometry is lifted verbatim from the supplied identity sheet so
 * the proportions and the opacity ramp (0.45 → 1.0) match exactly.
 *
 * The wordmark is real text rather than SVG paths: it stays selectable and
 * searchable, it inherits the site's own webfont so there's no second font
 * to load, and it scales with the user's text-size preference. The identity
 * sheet specifies Inter 500/700/800, which is the stack this site already
 * ships.
 */

/**
 * Star polygons from the identity sheet, in a 100×52 box.
 *
 * Exported because the first-visit loader draws the same five stars — it
 * sweeps gold across them, which only reads as the logo if the geometry is
 * literally the same. One copy, so the two can never drift.
 */
export const STARS = [
  { points: "5.13,40.91 6.40,44.56 10.27,44.64 7.18,46.98 8.30,50.68 5.13,48.47 1.96,50.68 3.08,46.98 -0.01,44.64 3.86,44.56", opacity: 0.45 },
  { points: "20.41,31.34 22.04,36.00 26.98,36.10 23.04,39.09 24.47,43.82 20.41,40.99 16.36,43.82 17.79,39.09 13.85,36.10 18.79,36.00", opacity: 0.59 },
  { points: "38.74,21.47 40.76,27.29 46.92,27.41 42.01,31.13 43.79,37.03 38.74,33.51 33.69,37.03 35.47,31.13 30.56,27.41 36.72,27.29", opacity: 0.73 },
  { points: "60.67,11.03 63.19,18.26 70.85,18.42 64.75,23.05 66.96,30.38 60.67,26.01 54.39,30.38 56.60,23.05 50.50,18.42 58.16,18.26", opacity: 0.86 },
  { points: "86.98,0.00 90.08,8.93 99.53,9.12 92.00,14.83 94.74,23.88 86.98,18.48 79.22,23.88 81.96,14.83 74.43,9.12 83.88,8.93", opacity: 1.0 },
];

/**
 * The climbing-stars mark on its own.
 *
 * `currentColor` rather than a baked hex, so it reverses to white on the dark
 * lockup and stays gold everywhere else without a second copy of the paths.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 52"
      /* Callers own the sizing — the mark appears at very different scales
         (header lockup, favicon, OG card) and there is no sensible default. */
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {STARS.map((star) => (
        <polygon key={star.points} points={star.points} opacity={star.opacity} />
      ))}
    </svg>
  );
}

/**
 * The full lockup: mark plus wordmark.
 *
 * The name carries the weight and the TLD sits back, so "jigme" is what
 * reads at a glance and ".io" is context rather than a competing word.
 */
export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName ?? "h-5 w-10 shrink-0 text-gold"} />
      {/* aria-hidden: the accessible name comes from the link that wraps
          this, so screen readers hear "jigme.io home" once rather
          than the wordmark and the label back to back. */}
      <span
        aria-hidden="true"
        className="whitespace-nowrap leading-none tracking-tight"
      >
        <span className="font-extrabold">jigme</span>
        <span className="text-[0.7em] font-semibold text-muted">.io</span>
      </span>
    </span>
  );
}

/** Plain-text form, for places that can't take markup. */
export const logoText = brand.name;

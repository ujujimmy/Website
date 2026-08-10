/**
 * Reveals content as it enters the viewport.
 *
 * This is a **server** component — it ships no JavaScript. All it does is stamp
 * `data-reveal` and a CSS custom property; a single client component mounted in
 * the root layout (`RevealRoot`) watches every one of them with one shared
 * IntersectionObserver.
 *
 * That split matters. As a client component this was ~30 separate hydration
 * boundaries on the homepage alone, each with its own effect, for an animation
 * that is pure decoration.
 *
 * The finished state is the default in CSS when JavaScript never runs (see the
 * `.no-js` rules in globals.css), so nothing here can leave the page blank.
 *
 * For content that is above the fold, use `Rise` instead — see its notes.
 */

export type RevealVariant =
  /** Fade and lift. The default, and right for almost everything. */
  | "fade"
  /** A line of type rising from behind its own edge. Headings only. */
  | "mask"
  /** A wipe up the frame with the photograph settling. Big pictures only. */
  | "image";

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  variant = "fade",
  className,
}: {
  children: React.ReactNode;
  /** Seconds. Stagger siblings by passing 0.06, 0.12, … */
  delay?: number;
  as?: "div" | "li" | "span" | "p" | "figure";
  variant?: RevealVariant;
  className?: string;
}) {
  return (
    <Tag
      data-reveal={variant === "fade" ? "" : variant}
      className={className}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties)
          : undefined
      }
    >
      {/* The mask variant animates its child, not itself — it needs something
          to slide behind the clipped edge. */}
      {variant === "mask" ? <span>{children}</span> : children}
    </Tag>
  );
}

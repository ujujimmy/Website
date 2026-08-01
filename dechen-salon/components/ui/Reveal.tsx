/**
 * Fades content up as it enters the viewport.
 *
 * This is a **server** component — it ships no JavaScript. All it does is stamp
 * `data-reveal` and a CSS custom property; a single client component mounted in
 * the root layout (`RevealRoot`) observes every one of them with one shared
 * IntersectionObserver.
 *
 * That split matters. As a client component this was ~30 separate hydration
 * boundaries on the homepage alone, each with its own effect, for an animation
 * that is pure decoration.
 *
 * The visible state is the default in CSS when JavaScript never runs (see the
 * `.no-js` rule in globals.css), so nothing here can leave the page blank.
 *
 * For content that is above the fold, use `Rise` instead — see its notes.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  /** Seconds. Stagger siblings by passing 0.06, 0.12, … */
  delay?: number;
  as?: "div" | "li" | "span" | "p";
  className?: string;
}) {
  return (
    <Tag
      data-reveal=""
      className={className}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}

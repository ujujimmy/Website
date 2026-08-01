/**
 * The above-the-fold counterpart to `Reveal`.
 *
 * Same look, no JavaScript: a plain CSS animation that runs on first paint
 * rather than an IntersectionObserver that has to wait for hydration. Use this
 * for anything visible when the page loads, and `Reveal` for everything below.
 *
 * The distinction is not stylistic. A hero headline wrapped in `Reveal` starts
 * at `opacity: 0`, and the browser does not count a transparent element as
 * painted — which put the homepage's largest-contentful-paint at 7.7s on
 * throttled mobile until this existed.
 *
 * Server component: it renders no client JavaScript at all.
 */
export function Rise({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  /** Seconds. Stagger siblings with 0.06, 0.12, … */
  delay?: number;
  as?: "div" | "p" | "span" | "li";
  className?: string;
}) {
  return (
    <Tag
      className={`rise ${className}`}
      style={
        delay ? ({ "--rise-delay": `${delay}s` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}

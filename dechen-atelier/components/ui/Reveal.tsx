import type { ElementType, ReactNode } from "react";

type Variant = "rise" | "wipe" | "line" | "draw";

/**
 * Marks an element for the shared scroll observer (components/providers/
 * RevealRoot.tsx). This is a server component — a reveal costs one attribute
 * and no JavaScript boundary, which is what makes it safe to use freely.
 *
 * Variants:
 *   rise  the default; 14px and a fade
 *   wipe  an image uncovering itself from the bottom edge
 *   line  a line of display type rising out of its own overflow
 *   draw  a hairline drawing itself from the left
 *
 * `line` wraps its children in a span, because the CSS moves the child rather
 * than the element — the element is the window it moves behind.
 */
export function Reveal({
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  className = "",
  children,
}: {
  as?: ElementType;
  variant?: Variant;
  /** Seconds. Staggering a group by 0.06 reads as one gesture; 0.3 reads as a queue. */
  delay?: number;
  className?: string;
  /** Optional, because `draw` reveals a hairline that has no content of its own. */
  children?: ReactNode;
}) {
  const style = delay ? { "--delay": `${delay}s` } : undefined;

  return (
    <Tag
      data-reveal={variant}
      className={className}
      style={style as React.CSSProperties}
    >
      {variant === "line" ? <span>{children}</span> : children}
    </Tag>
  );
}

/**
 * A display headline whose lines rise independently, each a beat behind the
 * one above. Pass the lines as separate strings — deliberately, so the break
 * points are a typographic decision rather than whatever the container width
 * happens to produce.
 */
export function RevealLines({
  lines,
  className = "",
  delay = 0,
  step = 0.09,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  step?: number;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <Reveal as="span" variant="line" key={line} delay={delay + i * step}>
          {line}
        </Reveal>
      ))}
    </span>
  );
}

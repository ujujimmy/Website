/**
 * A continuous horizontal ticker.
 *
 * Two identical tracks sit side by side and each translates by exactly its own
 * width, so the loop has no seam. The duplicate is hidden from screen readers —
 * a credential list read out twice is a bug, not a flourish.
 *
 * Under reduced motion the CSS stops the animation, drops the duplicate and
 * turns the strip into an ordinary horizontal scroller, which is the honest
 * fallback: the content is all still there and still reachable.
 */
export function Marquee({
  items,
  speed = 46,
  className = "",
}: {
  items: readonly string[];
  /** Seconds for one full pass. Longer is calmer. */
  speed?: number;
  className?: string;
}) {
  const style = { "--speed": `${speed}s` } as React.CSSProperties;

  return (
    <div className={`marquee ${className}`}>
      <Track items={items} style={style} />
      <Track items={items} style={style} hidden />
    </div>
  );
}

function Track({
  items,
  style,
  hidden = false,
}: {
  items: readonly string[];
  style: React.CSSProperties;
  hidden?: boolean;
}) {
  return (
    <div className="marquee-track" style={style} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="micro flex shrink-0 items-center">
          <span className="px-6">{item}</span>
          <span aria-hidden="true" className="text-lacquer">
            &#9679;
          </span>
        </span>
      ))}
    </div>
  );
}

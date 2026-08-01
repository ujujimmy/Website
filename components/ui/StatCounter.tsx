"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts up the numeric part of a stat while preserving whatever prefix and
 * suffix it carries ("4.8★", "+310%", "6×", "12,000+"), so the content file
 * can keep human-readable strings instead of split numeric fields.
 */
export function StatCounter({
  value,
  className,
  duration = 1600,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numeric = match ? parseFloat(match[2].replace(/,/g, "")) : null;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2].includes(".") ? 1 : 0;
  const grouped = match?.[2].includes(",") ?? false;

  const [display, setDisplay] = useState(reduced || numeric === null ? numeric ?? 0 : 0);

  useEffect(() => {
    if (!inView || numeric === null || reduced) return;

    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast start, long settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(numeric * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, duration, reduced]);

  // Non-numeric values ("3.8 → 4.9", "Top 3", "<2s") render as-is.
  if (numeric === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const shown = decimals
    ? display.toFixed(1)
    : grouped
      ? Math.round(display).toLocaleString("en-US")
      : Math.round(display).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

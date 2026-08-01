"use client";

import { useEffect, useRef } from "react";
import { scrollState, setScrollProgress } from "@/lib/scroll";
import { beats } from "@/content/site";

/**
 * Wraps the homepage's seven scroll beats and converts scroll position into
 * the normalized progress that drives the 3D scene.
 *
 * Progress is derived from where the viewport's centre sits relative to the
 * measured centre of each `[data-beat]` section — *not* from a fixed
 * viewport-height-per-beat assumption. Sections grow taller than 100vh with
 * long copy, at large text sizes, or on narrow screens, and any fixed
 * assumption silently desynchronises the copy from the shape behind it.
 * Measuring the real elements keeps them locked together by construction.
 *
 * Reading positions in a rAF loop (rather than on scroll events) keeps this in
 * sync with Lenis's interpolated position, which scroll events lag behind.
 */
export function Narrative({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    scrollState.total = beats.length;

    /** Document-space centre of each beat section. */
    let centers: number[] = [];

    const measure = () => {
      const sections = Array.from(
        el.querySelectorAll<HTMLElement>("[data-beat]"),
      );
      centers = sections.map((s) => {
        const rect = s.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2;
      });
    };

    measure();
    // Re-measure once webfonts have settled, since they reflow section heights.
    document.fonts?.ready.then(measure).catch(() => {});

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    let frame = 0;
    let lastProgress = 0;
    let active = true;

    const tick = () => {
      if (active && centers.length > 1) {
        const viewCenter = window.scrollY + window.innerHeight / 2;
        const last = centers.length - 1;

        let beatFloat: number;
        if (viewCenter <= centers[0]) {
          beatFloat = 0;
        } else if (viewCenter >= centers[last]) {
          beatFloat = last;
        } else {
          let i = 0;
          while (i < last && viewCenter > centers[i + 1]) i++;
          const span = centers[i + 1] - centers[i];
          beatFloat = i + (span > 0 ? (viewCenter - centers[i]) / span : 0);
        }

        const progress = beatFloat / last;
        setScrollProgress(progress, progress - lastProgress);
        lastProgress = progress;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // Park the loop's work whenever the narrative is off screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}

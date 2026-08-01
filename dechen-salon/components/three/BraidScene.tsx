"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useDeviceTier } from "@/lib/device";

const BraidCanvas = dynamic(() => import("./BraidCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * The team braid.
 *
 * Same idea as the homepage strand and the same shader, but driven by how far
 * this one section has travelled up the viewport rather than by the whole page:
 * three separate ropes at the bottom of the screen, fully plaited by the time
 * the section is centred.
 *
 * Behind it is a static SVG of the finished braid, which is what reduced-motion
 * visitors and anyone without WebGL see instead.
 */
export function BraidScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });
  const { tier, ready } = useDeviceTier();
  const [idle, setIdle] = useState(false);

  // Same rule as the homepage strand: capable devices get it on a short timer,
  // weaker ones only once the visitor has started scrolling. See StrandScene
  // for why — three.js costs a mid-range phone seconds of blocked main thread.
  useEffect(() => {
    if (!ready || tier === "off") return;

    const arm = () => setIdle(true);
    const events = ["scroll", "pointerdown", "touchstart"] as const;
    for (const event of events) {
      window.addEventListener(event, arm, { once: true, passive: true });
    }

    const handle =
      tier === "high" ? window.setTimeout(arm, 800) : undefined;

    return () => {
      for (const event of events) window.removeEventListener(event, arm);
      if (handle !== undefined) window.clearTimeout(handle);
    };
  }, [ready, tier]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    let running = false;

    const frame = () => {
      const rect = wrap.getBoundingClientRect();
      // 0 when the section's top is at the bottom of the viewport, 1 once it
      // has risen to the middle.
      const travelled =
        (window.innerHeight - rect.top) / (window.innerHeight * 0.85);
      progressRef.current.value = Math.min(1, Math.max(0, travelled));
      if (running) raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "25% 0px" },
    );
    observer.observe(wrap);

    return () => {
      observer.disconnect();
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const showCanvas = ready && tier !== "off" && idle;

  return (
    <div ref={wrapRef} className="relative h-[26rem] w-full sm:h-[32rem]" aria-hidden="true">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: showCanvas ? 0 : 1 }}
      >
        <BraidPoster />
      </div>
      {showCanvas ? (
        <BraidCanvas tier={tier} progress={progressRef.current} />
      ) : null}
    </div>
  );
}

/** The still: three ropes already plaited, drawn as interleaved sine paths. */
function BraidPoster() {
  const ropes = [0, 1, 2].map((rope) => {
    const points: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const angle = t * Math.PI * 2 * 2.6 + (rope / 3) * Math.PI * 2;
      const width = 52 * (1 - t * 0.42);
      points.push(`${(100 + Math.sin(angle) * width).toFixed(1)},${(20 + t * 360).toFixed(1)}`);
    }
    return points.join(" ");
  });

  const colors = ["#9e6b7d", "#78475f", "#4a2a3d"];

  return (
    <svg viewBox="0 0 200 400" className="h-full w-full" focusable="false">
      {ropes.map((points, i) => (
        <polyline
          key={i}
          points={points}
          fill="none"
          stroke={colors[i]}
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
    </svg>
  );
}

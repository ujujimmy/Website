"use client";

import { useEffect } from "react";
import { brand } from "@/content/brand";

/** Key for the once-per-session guard. Also referenced by the inline head script. */
export const INTRO_KEY = "nb:intro";
/** Must match the CSS: 1020ms delay + 650ms lift, plus a little slack. */
const INTRO_MS = 1750;

function StarRow({ fill }: { fill: boolean }) {
  return (
    <svg
      viewBox="0 0 188 34"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${i * 38}, 0) scale(1.35)`}
          d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35 6.19 20.4l1.11-6.47L2.6 9.35l6.5-.95L12 2.5z"
          fill={fill ? "var(--color-gold)" : "none"}
          stroke={fill ? "none" : "var(--color-line)"}
          strokeWidth={fill ? 0 : 1.5}
        />
      ))}
    </svg>
  );
}

/**
 * First-visit intro.
 *
 * The loader is the product rather than a generic spinner: five stars fill
 * with gold and the rating lands on 4.9, so a prospect understands what this
 * agency sells before the page appears.
 *
 * It costs LCP — the hero is behind an opaque panel for ~1.2s — which is a
 * deliberate, measured trade for the arrival moment. Two things keep the cost
 * bounded: it plays once per session (an inline head script hides it before
 * paint on repeat views, so there is no flash), and it is removed from the DOM
 * afterwards so it can never intercept a click.
 *
 * To switch it off entirely, drop <Intro /> from app/layout.tsx.
 */
export function Intro() {
  useEffect(() => {
    const done = () => {
      document.documentElement.classList.add("intro-done");
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        /* private mode — the intro just plays again next time */
      }
    };

    // Already seen this session, or reduced motion: nothing to wait for.
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }

    const timer = window.setTimeout(done, INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-inner">
        <p className="intro-mark">{brand.name}</p>
        <span className="intro-stars">
          <StarRow fill={false} />
          {/* Wrapper carries the clip; the glow lives on the SVG inside it. */}
          <span className="intro-stars-fill">
            <StarRow fill />
          </span>
        </span>
        <span className="intro-sweep" />
        <p className="intro-rating">
          <b>4.9</b> average client rating
        </p>
      </div>
    </div>
  );
}

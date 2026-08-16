"use client";

import { useEffect } from "react";
import { brand } from "@/content/brand";
import { STARS } from "@/components/brand/Logo";

/** Key for the once-per-session guard. Also referenced by the inline head script. */
export const INTRO_KEY = "nb:intro";
/** Must match the CSS: 1020ms delay + 650ms lift, plus a little slack. */
const INTRO_MS = 1750;

/**
 * The logo's five climbing stars, drawn twice and stacked: an outline row and
 * a gold row that a left-to-right clip reveals.
 *
 * Geometry is imported rather than re-typed so the loader and the logo are
 * the same shape by construction. The gold row keeps the identity's opacity
 * ramp (0.45 at the small end, 1.0 at the large) so what lands at the end of
 * the sweep is exactly the mark in the header.
 */
function StarRow({ fill }: { fill: boolean }) {
  return (
    <svg viewBox="0 0 100 52" aria-hidden="true">
      {STARS.map((star) => (
        <polygon
          key={star.points}
          points={star.points}
          fill={fill ? "var(--color-gold)" : "none"}
          opacity={fill ? star.opacity : 1}
          stroke={fill ? "none" : "var(--color-line)"}
          strokeWidth={fill ? 0 : 0.7}
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
        {/* The lockup's weight ramp, not brand.name uppercased — the
            logotype is lowercase and grows across the word, and setting it
            in tracked-out caps threw away the one thing it does. */}
        <p className="intro-mark">
          <span className="intro-mark-name">jigme</span>
          <span className="intro-mark-tld">.io</span>
        </p>
        <span className="intro-stars">
          <StarRow fill={false} />
          {/* Wrapper carries the clip; the glow lives on the SVG inside it. */}
          <span className="intro-stars-fill">
            <StarRow fill />
          </span>
        </span>
        <span className="intro-sweep" />
        {/*
          This said "4.9 average client rating". Nothing measured it — there
          is no client-rating average anywhere in the data, and it was the
          first thing a visitor saw on a site whose entire argument is that
          its numbers are checkable. Replaced with what we do, which needs
          no evidence because it isn't a claim.
        */}
        <p className="intro-rating">{brand.tagline}</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { clamp } from "./utils";

/**
 * A single mutable scroll state that the WebGL layer reads every frame.
 *
 * This is deliberately NOT React state. The canvas samples `scrollState`
 * inside useFrame, so scrolling drives the 3D scene without triggering a
 * single React render. Components that genuinely need to re-render (the nav's
 * active section, the progress rail) subscribe explicitly and are throttled to
 * meaningful changes only.
 */
export const scrollState = {
  /** 0–1 across the whole homepage narrative. */
  progress: 0,
  /** Index of the current beat. */
  beat: 0,
  /** 0–1 within the current beat. */
  beatProgress: 0,
  /** Continuous position in beat-space, e.g. 2.4 = 40% from beat 2 to 3. */
  beatFloat: 0,
  /** Scroll velocity, used for subtle motion smear in the shader. */
  velocity: 0,
  /** Total beats in the narrative. */
  total: 7,
};

type Listener = (beat: number) => void;
const listeners = new Set<Listener>();

export function setScrollProgress(progress: number, velocity: number) {
  const p = clamp(progress);
  const spans = scrollState.total - 1; // transitions between beats
  const beatFloat = p * spans;
  const beat = Math.round(beatFloat);

  scrollState.progress = p;
  scrollState.beatFloat = beatFloat;
  scrollState.beatProgress = beatFloat - Math.floor(beatFloat);
  scrollState.velocity = velocity;

  if (beat !== scrollState.beat) {
    scrollState.beat = beat;
    listeners.forEach((fn) => fn(beat));
  }
}

/** Re-renders only when the active beat changes, not on every scroll frame. */
export function useActiveBeat() {
  const [beat, setBeat] = useState(scrollState.beat);
  useEffect(() => {
    setBeat(scrollState.beat);
    listeners.add(setBeat);
    return () => {
      listeners.delete(setBeat);
    };
  }, []);
  return beat;
}

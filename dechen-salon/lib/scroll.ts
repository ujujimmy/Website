/**
 * Shared scroll state.
 *
 * A plain mutable object rather than React state on purpose: the 3D strand
 * reads this every frame, and routing scroll position through React would
 * re-render the tree sixty times a second for no reason.
 *
 * `act` is a float. 2.5 means "halfway between act 2 and act 3", which is
 * exactly what the strand needs to blend two shapes.
 */
export const scrollState = {
  /** Continuous position through the story, 0 → acts.length - 1. */
  act: 0,
  /** Normalised scroll velocity, used to smear the strand while flicking. */
  velocity: 0,
  /** 0 → 1 progress through the whole story section. */
  progress: 0,
};

/** Clamp helper, used in a few places where the maths can overshoot. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Frame-rate independent easing toward a target. The naive `current +=
 * (target - current) * 0.1` moves twice as fast at 120fps as at 60, which makes
 * the strand feel different on different machines.
 */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

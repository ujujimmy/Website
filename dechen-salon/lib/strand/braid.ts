/**
 * The team braid: three ropes of hair, one per stylist tier, plaiting together.
 *
 * It starts as three separate falls and finishes as a braid, and the page eases
 * between the two — which is the point being made. The three tiers are three
 * different levels of experience and they are one salon.
 */

import { makeRng, type Spine, type ShapeGen } from "./shapes";

const TAU = Math.PI * 2;

function set(out: Spine, strand: number, seg: number, s: number, x: number, y: number, z: number) {
  const i = (strand * s + seg) * 3;
  out[i] = x;
  out[i + 1] = y;
  out[i + 2] = z;
}

/** Which of the three ropes a strand belongs to. */
export function ropeOf(k: number) {
  return k % 3;
}

/** BEFORE — three separate falls, side by side and not yet touching. */
export const looseRopes: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(311);

  for (let k = 0; k < n; k++) {
    const rope = ropeOf(k);
    const spread = (rng() - 0.5) * 0.5;
    const centre = (rope - 1) * 1.65 + spread;
    const depth = (rng() - 0.5) * 0.6;
    const phase = rng() * TAU;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      set(
        out, k, j, s,
        centre + Math.sin(t * 2.0 + phase) * 0.16 * t,
        2.9 - t * 5.6,
        depth + Math.cos(t * 1.7 + phase) * 0.14 * t,
      );
    }
  }
  return out;
};

/**
 * AFTER — the plait.
 *
 * Each rope travels a sine in x and a cosine in z, offset by a third of a turn
 * from its neighbours. That is geometrically what a three-strand braid is, and
 * it reads correctly from any angle, which a hand-faked zigzag does not.
 */
export const braid: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(313);
  const turns = 2.6;

  for (let k = 0; k < n; k++) {
    const rope = ropeOf(k);
    const ropePhase = (rope / 3) * TAU;
    // Strands within a rope sit slightly apart, so a rope is a rope and not a
    // single thick line.
    const jitterR = 0.14 + rng() * 0.22;
    const jitterA = rng() * TAU;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      const angle = t * TAU * turns + ropePhase;
      // The braid tightens toward the tip, the way a real plait does.
      const width = 1.45 * (1 - t * 0.42);

      set(
        out, k, j, s,
        Math.sin(angle) * width + Math.cos(jitterA) * jitterR,
        2.9 - t * 5.6,
        Math.cos(angle) * width * 0.7 + Math.sin(jitterA) * jitterR,
      );
    }
  }
  return out;
};

/** One colour per rope: the three tiers, deepest for the Creative Director. */
export const ropeColors: [number, number, number][] = [
  [0.62, 0.42, 0.5], // Top Artist — soft rosewood
  [0.47, 0.28, 0.38], // Creative Artist — deeper
  [0.29, 0.16, 0.24], // Creative Director — espresso
];

export function colorForRope(k: number): [number, number, number] {
  return ropeColors[ropeOf(k)];
}

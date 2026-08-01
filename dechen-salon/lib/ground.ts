import { acts, type Ground } from "@/content/story";
import { clamp } from "./scroll";

/**
 * The colours the page floor moves through as the story plays.
 *
 * Blush at the open, deepening to plum through the middle acts where the strand
 * needs contrast, and back to blush to finish. Baby pink stays the identity;
 * the depth is only borrowed for the three acts that need it.
 */
export const grounds: Record<Ground, [number, number, number]> = {
  blush: [251, 227, 241],
  rose: [245, 191, 216],
  plum: [59, 27, 51],
};

/** Grounds dark enough that copy on top of them has to invert. */
const darkGrounds: Ground[] = ["plum"];

export function isDark(ground: Ground) {
  return darkGrounds.includes(ground);
}

/**
 * Interpolated floor colour for a continuous act position, e.g. 2.4 is 40% of
 * the way from the rose of act 2 to the plum of act 3.
 */
export function groundAt(act: number): string {
  const from = clamp(Math.floor(act), 0, acts.length - 1);
  const to = clamp(from + 1, 0, acts.length - 1);
  const t = clamp(act - from, 0, 1);

  const a = grounds[acts[from].ground];
  const b = grounds[acts[to].ground];

  const channel = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`;
}

/**
 * How dark the floor is right now, 0 → 1. Used to cross-fade the act copy
 * between ink and petal so text never sits mid-transition at low contrast.
 */
export function darknessAt(act: number): number {
  const from = clamp(Math.floor(act), 0, acts.length - 1);
  const to = clamp(from + 1, 0, acts.length - 1);
  const t = clamp(act - from, 0, 1);

  const a = isDark(acts[from].ground) ? 1 : 0;
  const b = isDark(acts[to].ground) ? 1 : 0;
  return a + (b - a) * t;
}

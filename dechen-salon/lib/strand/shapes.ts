/**
 * The seven shapes the silk strand takes, one per act of the homepage story.
 *
 * Each generator returns the *spine* of every strand: `n` strands × `s` points
 * × 3 floats, laid out strand-major. The renderer expands a spine into a
 * camera-facing ribbon and blends between two of them, which is why every
 * generator must return the same length and stay inside roughly the same
 * bounding volume — a shape that is twice the size of its neighbour makes the
 * transition lurch.
 *
 * Visible volume with the camera at z = 9: x ∈ [-5, 5], y ∈ [-3.4, 3.4].
 */

export type Spine = Float32Array;
export type ShapeGen = (n: number, s: number) => Spine;

const TAU = Math.PI * 2;

/** Deterministic RNG, so the layout is identical on every load and screenshot. */
export function makeRng(seed = 2024) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function set(out: Spine, strand: number, seg: number, s: number, x: number, y: number, z: number) {
  const i = (strand * s + seg) * 3;
  out[i] = x;
  out[i + 1] = y;
  out[i + 2] = z;
}

/** Smoothstep, used to ease shapes rather than have them start abruptly. */
function ease(t: number) {
  return t * t * (3 - 2 * t);
}

/* ------------------------------------------------------------------ ACT 0 */
/**
 * OPEN — hair falling down both sides of the frame, curling inward at the tips.
 *
 * It parts down the middle, which is not decorative: the hero copy is centred,
 * and strands running through a headline make it unreadable no matter how far
 * back they are pushed. Framing the name is both the prettier image and the one
 * that keeps the words legible.
 */
export const coil: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(11);
  const half = Math.max(1, Math.floor(n / 2));

  for (let k = 0; k < n; k++) {
    // Mirror the strands into two curtains with a clear gap between them.
    const side = k < half ? -1 : 1;
    const v = (k % half) / Math.max(1, half - 1);
    const baseX = side * (2.3 + v * 3.5);

    const phase = (k / n) * TAU;
    const wobble = 0.5 + rng() * 0.7;
    const depth = (rng() - 0.5) * 1.6;
    // Roots start above the frame, so the viewer never sees a row of tapered
    // ends across the top — hair should come from somewhere, not just begin.
    const top = 4.8 + rng() * 1.2;
    const length = 6.2 + rng() * 2.0;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      // Curls only in the lower half, and inward, toward the centre.
      const wind = ease(Math.max(0, (t - 0.42) / 0.58));
      const radius = wind * 0.8 * wobble;
      const angle = phase + wind * TAU * 0.9;

      set(
        out, k, j, s,
        baseX - side * wind * 0.75 + Math.sin(angle) * radius,
        top - t * length,
        depth * (1 - wind * 0.4) + Math.cos(angle) * radius,
      );
    }
  }
  return out;
};

/* ------------------------------------------------------------------ ACT 1 */
/**
 * PHILOSOPHY — a lotus.
 *
 * Three rings of petals at increasing radius and height. The salon's roots are
 * Tibetan and Buddhist and the catalog puts lotuses on its own pages, so this
 * is the one place the animation is allowed to be literal.
 */
export const lotus: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rings = 3;

  for (let k = 0; k < n; k++) {
    const ring = k % rings;
    const perRing = Math.ceil(n / rings);
    const petal = Math.floor(k / rings);
    const angle = (petal / perRing) * TAU + ring * 0.42;

    // Outer rings are wider and flatter; the inner ring stands more upright.
    const reach = 1.15 + ring * 0.62;
    const rise = 1.5 - ring * 0.36;
    const tilt = Math.cos(angle * 2 + ring) * 0.1;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      const r = reach * Math.pow(t, 0.62);
      // Rises, peaks, then the tip falls away — the curve of a petal.
      const y = -0.75 + rise * Math.sin(t * Math.PI * 0.86) + tilt * t;

      set(out, k, j, s, Math.cos(angle) * r, y, Math.sin(angle) * r);
    }
  }
  return out;
};

/* ------------------------------------------------------------------ ACT 2 */
/**
 * THE CUT — every strand parallel and ending on exactly the same line.
 *
 * The whole point of the act is precision, so the bottom edge is dead level and
 * the only movement is a small body wave so it doesn't read as a barcode.
 */
export const blunt: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(29);

  for (let k = 0; k < n; k++) {
    const x = (k / (n - 1) - 0.5) * 6.6;
    const z = (rng() - 0.5) * 0.9;
    const sway = 0.1 + rng() * 0.12;
    const phase = rng() * TAU;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      set(
        out, k, j, s,
        x + Math.sin(t * 2.6 + phase) * sway * t,
        2.7 - t * 4.2,
        z + Math.cos(t * 2.1 + phase) * sway * t,
      );
    }
  }
  return out;
};

/* ------------------------------------------------------------------ ACT 3 */
/**
 * COLOUR — the strands fan open from a single point.
 *
 * Each strand carries one of the salon's five shade families (see
 * `colorForAct`), so the fan is a live version of the shade chart on the wall
 * rather than decorative colour.
 */
export const fan: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(47);
  const originY = 2.9;
  const length = 5.3;

  for (let k = 0; k < n; k++) {
    // Spread measured from straight down, in radians.
    const spread = (k / (n - 1) - 0.5) * 2.5;
    const z = (rng() - 0.5) * 0.7;
    const curl = 0.12 + rng() * 0.16;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      // The angle opens up as the strand travels, which bows the fan outward
      // instead of leaving it a flat triangle.
      const angle = spread * (0.45 + 0.55 * t);
      const r = length * t;

      set(
        out, k, j, s,
        Math.sin(angle) * r * 1.05,
        originY - Math.cos(angle) * r,
        z + Math.sin(t * 3.2 + k) * curl * t,
      );
    }
  }
  return out;
};

/* ------------------------------------------------------------------ ACT 4 */
/**
 * LENGTH — a curtain whose strands grow from short to long across the frame.
 *
 * The extensions menu runs 16″ to 30″; this is that table as a picture.
 */
export const curtain: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(83);

  for (let k = 0; k < n; k++) {
    const u = k / (n - 1);
    const x = (u - 0.5) * 7.2;
    const length = 2.4 + u * 3.9;
    const z = (rng() - 0.5) * 1.1;
    const phase = rng() * TAU;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      // Flow increases toward the tips, the way long hair actually hangs.
      const flow = Math.sin(t * 2.2 + phase) * 0.34 * t * t;

      set(out, k, j, s, x + flow, 2.9 - t * length, z + Math.cos(t * 1.8 + phase) * 0.22 * t);
    }
  }
  return out;
};

/* ------------------------------------------------------------------ ACT 5 */
/**
 * CARE — two helices that pinch together and apart.
 *
 * Bond repair is the idea: the strands separate, meet, and lock. The pinch
 * points come from modulating the radius rather than from extra geometry.
 */
export const helix: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(101);

  for (let k = 0; k < n; k++) {
    const side = k % 2 === 0 ? 0 : Math.PI;
    const offset = (k / n) * 0.9;
    const jitter = (rng() - 0.5) * 0.35;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      const angle = t * TAU * 1.55 + side + offset;
      // Pinch points down the length — the bonds knitting back together. A
      // raised cosine rather than abs(cos), which has cusps at its zeros and
      // made the helix look faceted at these segment counts.
      const radius = 1.55 * (0.38 + 0.62 * (0.5 + 0.5 * Math.cos(t * TAU * 1.5)));

      set(
        out, k, j, s,
        Math.cos(angle) * radius + jitter,
        -2.9 + t * 5.8,
        Math.sin(angle) * radius,
      );
    }
  }
  return out;
};

/* ------------------------------------------------------------------ ACT 6 */
/**
 * VISIT — the strands sweep into a soft ring, like a mirror to sit in front of.
 * The closing copy sits inside it.
 */
export const ring: ShapeGen = (n, s) => {
  const out = new Float32Array(n * s * 3);
  const rng = makeRng(199);
  // Wide enough to clear the closing copy that sits inside it.
  const radius = 3.9;

  for (let k = 0; k < n; k++) {
    const start = (k / n) * TAU;
    // Arcs overlap so the ring reads as continuous rather than as n dashes.
    const arc = (TAU / n) * 2.6;
    const r = radius + (rng() - 0.5) * 0.3;

    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      const angle = start + t * arc;

      set(
        out, k, j, s,
        Math.cos(angle) * r,
        Math.sin(angle) * r * 0.92,
        Math.sin(angle * 3 + k) * 0.28,
      );
    }
  }
  return out;
};

/** Index === act id. Must stay aligned with `acts` in content/story.ts. */
export const actShapes: ShapeGen[] = [
  coil,
  lotus,
  blunt,
  fan,
  curtain,
  helix,
  ring,
];

/* -------------------------------------------------------------------------
   Colour
   ------------------------------------------------------------------------- */

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** The five shade families from the salon's chart, used by the colour act. */
const shades: RGB[] = ["#4a3b3a", "#7d4b2c", "#a97c45", "#c9a366", "#ded2bd"].map(
  hexToRgb,
);

const espresso = hexToRgb("#3a2430");
const rosewood = hexToRgb("#8c4a63");
const blushPink = hexToRgb("#f2a8ce");
const gold = hexToRgb("#d8a63c");
const champagne = hexToRgb("#f0dcc0");

/**
 * The colour of strand `k` in act `act`.
 *
 * Acts 0–2 sit on a light ground and so need dark strands; acts 3–5 sit on deep
 * plum and need light ones. Getting this backwards makes the strand vanish,
 * which is the single easiest way to ruin the whole effect.
 */
export function colorForAct(act: number, k: number, n: number): RGB {
  const u = n > 1 ? k / (n - 1) : 0;

  switch (act) {
    case 0: // Open, on blush — dark hair with a rose sheen through it.
      return mix(espresso, rosewood, u * 0.65);
    case 1: // Philosophy, on blush — lotus pinks warming into gold.
      return mix(mix(rosewood, blushPink, u), gold, Math.pow(u, 3) * 0.5);
    case 2: // The cut, on rose — near-black for maximum edge definition.
      return mix(espresso, rosewood, u * 0.3);
    case 3: // Colour, on plum — the actual shade chart, banded across strands.
      return shades[Math.min(shades.length - 1, Math.floor(u * shades.length))];
    case 4: // Length, on plum — honey through to creamy platinum.
      return mix(shades[2], shades[4], u);
    case 5: // Care, on plum — champagne with a gold core.
      return mix(gold, champagne, ease(u));
    default: // Visit, back on blush — dark again, warming toward gold.
      return mix(espresso, gold, Math.pow(u, 1.6) * 0.75);
  }
}

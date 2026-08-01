/**
 * Position buffers for the seven scroll beats.
 *
 * Every beat is just an array of target positions for the *same* particles.
 * The shader lerps between two of these buffers, which is why the whole
 * homepage animation costs one draw call instead of seven separate scenes.
 *
 * Each generator must return exactly `count * 3` floats, and should keep
 * roughly the same visual scale so transitions don't lurch.
 */

/** Deterministic RNG — same layout every load, and same in every screenshot. */
export function makeRng(seed = 1337) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Gen = (count: number) => Float32Array;

/** BEAT 0 — Hero: a slowly drifting spherical cloud of light. */
export const cloud: Gen = (count) => {
  const rng = makeRng(11);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Cube-root keeps density even through the volume instead of clumping.
    const r = 3.4 * Math.cbrt(rng());
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
};

/** BEAT 1 — The problem: everything scatters apart and loses its shape. */
export const scatter: Gen = (count) => {
  const rng = makeRng(29);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rng() - 0.5) * 22;
    out[i * 3 + 1] = (rng() - 0.5) * 13;
    out[i * 3 + 2] = (rng() - 0.5) * 16 - 3;
  }
  return out;
};

/** The 10 vertices of a 5-pointed star, tip pointing up. */
function starPolygon(outer: number, inner: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

/** Ray-casting point-in-polygon test. */
function inPolygon(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * BEAT 2 — Google Reviews: five filled stars in a row.
 *
 * Filled by rejection sampling against the true star polygon. An angular
 * radius approximation was tried first and produced rounded blobs — the
 * points of the star are the entire recognisable feature, so they have to be
 * geometrically correct.
 */
export const stars: Gen = (count) => {
  const rng = makeRng(47);
  const out = new Float32Array(count * 3);
  const per = Math.ceil(count / 5);
  const spacing = 1.26;
  const outer = 0.56;
  const inner = 0.24;
  const poly = starPolygon(outer, inner);

  for (let i = 0; i < count; i++) {
    const starIndex = Math.min(4, Math.floor(i / per));
    const cx = (starIndex - 2) * spacing;

    let x = 0;
    let y = 0;
    // Roughly 50% acceptance for a star, so this terminates quickly.
    for (let attempt = 0; attempt < 40; attempt++) {
      x = (rng() - 0.5) * 2 * outer;
      y = (rng() - 0.5) * 2 * outer;
      if (inPolygon(x, y, poly)) break;
    }

    out[i * 3] = cx + x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = (rng() - 0.5) * 0.12; // slight thickness
  }
  return out;
};

/** Distributes points along a set of line segments, weighted by length. */
function sampleSegments(
  count: number,
  segments: [number, number, number, number][],
  rng: () => number,
  jitter = 0.03,
): Float32Array {
  const out = new Float32Array(count * 3);
  const lengths = segments.map(([x1, y1, x2, y2]) =>
    Math.hypot(x2 - x1, y2 - y1),
  );
  const total = lengths.reduce((a, b) => a + b, 0);

  for (let i = 0; i < count; i++) {
    let pick = rng() * total;
    let s = 0;
    while (s < segments.length - 1 && pick > lengths[s]) {
      pick -= lengths[s];
      s++;
    }
    const [x1, y1, x2, y2] = segments[s];
    const t = rng();
    out[i * 3] = x1 + (x2 - x1) * t + (rng() - 0.5) * jitter;
    out[i * 3 + 1] = y1 + (y2 - y1) * t + (rng() - 0.5) * jitter;
    out[i * 3 + 2] = (rng() - 0.5) * jitter * 2;
  }
  return out;
}

/** BEAT 3 — Web design: a wireframe browser window assembling itself. */
export const browser: Gen = (count) => {
  const rng = makeRng(83);
  const w = 4.6;
  const h = 3.0;
  const barY = h / 2 - 0.5;

  const segments: [number, number, number, number][] = [
    // Outer frame
    [-w / 2, h / 2, w / 2, h / 2],
    [w / 2, h / 2, w / 2, -h / 2],
    [w / 2, -h / 2, -w / 2, -h / 2],
    [-w / 2, -h / 2, -w / 2, h / 2],
    // Title bar
    [-w / 2, barY, w / 2, barY],
    // Hero block inside the page
    [-w / 2 + 0.45, barY - 0.55, -w / 2 + 2.4, barY - 0.55],
    [-w / 2 + 0.45, barY - 0.95, -w / 2 + 3.1, barY - 0.95],
    [-w / 2 + 0.45, barY - 1.3, -w / 2 + 2.0, barY - 1.3],
    // A call-to-action button outline
    [-w / 2 + 0.45, barY - 1.95, -w / 2 + 1.55, barY - 1.95],
    [-w / 2 + 1.55, barY - 1.95, -w / 2 + 1.55, barY - 1.62],
    [-w / 2 + 1.55, barY - 1.62, -w / 2 + 0.45, barY - 1.62],
    [-w / 2 + 0.45, barY - 1.62, -w / 2 + 0.45, barY - 1.95],
    // Image placeholder on the right
    [w / 2 - 2.0, barY - 0.5, w / 2 - 0.45, barY - 0.5],
    [w / 2 - 0.45, barY - 0.5, w / 2 - 0.45, barY - 1.95],
    [w / 2 - 0.45, barY - 1.95, w / 2 - 2.0, barY - 1.95],
    [w / 2 - 2.0, barY - 1.95, w / 2 - 2.0, barY - 0.5],
  ];

  const out = sampleSegments(count, segments, rng);

  // The three window dots — a small share of particles, placed as rings.
  const dots = Math.floor(count * 0.03);
  for (let i = 0; i < dots; i++) {
    const which = i % 3;
    const cx = -w / 2 + 0.28 + which * 0.26;
    const a = rng() * Math.PI * 2;
    const r = 0.07 * Math.sqrt(rng());
    out[i * 3] = cx + Math.cos(a) * r;
    out[i * 3 + 1] = barY + 0.25 + Math.sin(a) * r;
    out[i * 3 + 2] = 0;
  }
  return out;
};

/**
 * BEAT 4 — SEO: a stack of nine search results receding into depth, with the
 * top one pulled forward and wider. The climb from #9 to #1 is the point.
 */
export const ladder: Gen = (count) => {
  const rng = makeRng(101);
  const out = new Float32Array(count * 3);
  const rows = 9;
  // Result #1 gets a lot more particles — it's the one that matters.
  const weights = Array.from({ length: rows }, (_, i) => (i === 0 ? 3.2 : 1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let written = 0;
  for (let row = 0; row < rows; row++) {
    const n =
      row === rows - 1
        ? count - written
        : Math.floor((weights[row] / totalWeight) * count);

    // Tighter spacing and less depth than first attempt — the deep rows were
    // fading to nothing, which lost the "climb" the beat is meant to show.
    const y = 1.9 - row * 0.46;
    const z = -row * 0.42; // deeper as you go down the results
    const width = row === 0 ? 3.6 : 2.7 - row * 0.06;
    const height = row === 0 ? 0.3 : 0.16;

    for (let i = 0; i < n; i++) {
      const idx = written + i;
      out[idx * 3] = (rng() - 0.5) * width;
      out[idx * 3 + 1] = y + (rng() - 0.5) * height;
      out[idx * 3 + 2] = z + (rng() - 0.5) * 0.12;
    }
    written += n;
  }
  return out;
};

/** BEAT 5 — Global reach: a wireframe globe, denser at the marker latitudes. */
export const globe: Gen = (count) => {
  const out = new Float32Array(count * 3);
  const r = 2.45;
  // Fibonacci sphere gives an even, non-clumping surface distribution.
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    out[i * 3] = Math.cos(theta) * radius * r;
    out[i * 3 + 1] = y * r;
    out[i * 3 + 2] = Math.sin(theta) * radius * r;
  }
  return out;
};

/** BEAT 6 — CTA: everything spirals into a bright ring behind the form. */
export const portal: Gen = (count) => {
  const rng = makeRng(199);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    // Angle must be independent of t. Deriving it from t produced a single
    // sweeping spiral arm off to one side; a random angle gives the
    // symmetric funnel the CTA needs to sit inside.
    const angle = rng() * Math.PI * 2;
    // Wide and far back, tightening to a bright ring at z ≈ 0.
    const radius = 0.5 + Math.pow(1 - t, 1.6) * 3.9 + (rng() - 0.5) * 0.22;
    out[i * 3] = Math.cos(angle) * radius;
    out[i * 3 + 1] = Math.sin(angle) * radius * 0.78;
    out[i * 3 + 2] = -7.0 * (1 - t) + (rng() - 0.5) * 0.3;
  }
  return out;
};

/** Index === beat id. Must stay aligned with `beats` in content/site.ts. */
export const beatShapes: Gen[] = [
  cloud,
  scatter,
  stars,
  browser,
  ladder,
  globe,
  portal,
];

/** Per-beat particle colour, lerped alongside position. */
export const beatColors: [number, number, number][] = [
  [0.55, 0.52, 0.98], // hero — brand violet
  [0.38, 0.4, 0.52], // problem — desaturated, dim
  [1.0, 0.76, 0.29], // reviews — gold
  [0.13, 0.83, 0.93], // web design — cyan
  [0.43, 0.36, 0.96], // seo — violet
  [0.3, 0.86, 0.78], // global — teal
  [0.72, 0.7, 1.0], // cta — bright brand
];

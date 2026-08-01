/**
 * The ribbon technique, shared by the homepage story and the team braid.
 *
 * A strand is drawn as a two-vertex-wide triangle strip that turns to face the
 * camera. Games draw hair the same way, and for the same reason: it gives a
 * real specular sheen down the length of the strand for the price of a quad.
 *
 * Both scenes blend between two shapes — the story blends across acts, the
 * braid blends from a loose fall into the finished plait — so the attribute
 * layout is identical and the shaders are literally the same strings.
 */

import * as THREE from "three";
import type { Spine } from "./shapes";

export const ribbonVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uWidth;
  uniform float uVelocity;

  // Spine point and its neighbour, for the two shapes being blended between.
  attribute vec3 aFromP;
  attribute vec3 aFromN;
  attribute vec3 aToP;
  attribute vec3 aToN;
  attribute vec3 aColorFrom;
  attribute vec3 aColorTo;
  // -1 or +1: which edge of the ribbon this vertex is.
  attribute float aSide;
  // 0 at the root of the strand, 1 at the tip.
  attribute float aT;
  attribute float aRand;

  varying float vSide;
  varying float vT;
  varying vec3 vColor;

  void main() {
    // Stagger arrival so the shape assembles strand by strand instead of
    // snapping. Without this the morph reads as a slideshow.
    float stagger = aRand * 0.3;
    float t = clamp((uMix - stagger) / 0.7, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 p = mix(aFromP, aToP, t);
    vec3 pNext = mix(aFromN, aToN, t);

    // A slow idle sway, so a parked scene is never completely still. Scaled by
    // aT so roots stay put and tips move, the way real hair does.
    float sway = sin(uTime * 0.55 + aRand * 6.283) * 0.055 * aT;
    p.x += sway;
    pNext.x += sway;
    p.z += cos(uTime * 0.4 + aRand * 6.283) * 0.045 * aT;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 mvNext = modelViewMatrix * vec4(pNext, 1.0);

    // Ribbon direction in view space, then the perpendicular in the view plane.
    // Doing this in view space is what makes the ribbon face the camera without
    // needing the camera position as a uniform.
    vec2 dir = normalize(mvNext.xy - mv.xy + vec2(1e-5));
    vec2 side = vec2(-dir.y, dir.x);

    // Taper: full width through the body, drawn to a point at the tip, and
    // slightly narrower at the very root so strands don't read as tape.
    float taper = smoothstep(0.0, 0.08, aT) * (1.0 - pow(aT, 2.2));
    // Flicking the page smears the strands a little wider.
    float smear = 1.0 + clamp(abs(uVelocity) * 6.0, 0.0, 0.9);
    float w = uWidth * taper * smear * (0.65 + aRand * 0.7);

    mv.xy += side * aSide * w;

    gl_Position = projectionMatrix * mv;

    vSide = aSide;
    vT = aT;
    vColor = mix(aColorFrom, aColorTo, t);
  }
`;

export const ribbonFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uOpacity;
  // Per-act dimming, so a shape sitting behind centred copy steps back.
  uniform float uFade;

  varying float vSide;
  varying float vT;
  varying vec3 vColor;

  void main() {
    float edge = abs(vSide);

    // The sheen. A bright band down the centre of the ribbon is exactly what
    // light does to a round strand of hair, and it is what sells this as silk
    // rather than as coloured tape.
    float sheen = pow(1.0 - edge, 3.5);

    // Feather the long edges so strands blend into each other instead of
    // stacking up as hard-edged slats.
    float alpha = smoothstep(1.0, 0.35, edge);
    // And fade the last of the tip, so strands end rather than stop.
    alpha *= smoothstep(1.0, 0.86, vT);

    vec3 color = vColor + vec3(0.42, 0.36, 0.34) * sheen;

    gl_FragColor = vec4(color, alpha * uOpacity * uFade);
  }
`;

/** Expands a spine into per-vertex point/next-point attribute data. */
export function writeSpine(
  target: Float32Array,
  targetNext: Float32Array,
  spine: Spine,
  n: number,
  s: number,
) {
  let v = 0;
  for (let k = 0; k < n; k++) {
    for (let j = 0; j < s; j++) {
      const p = (k * s + j) * 3;
      // The last point has no successor; reuse the previous direction so the
      // tip's ribbon orientation matches the segment before it.
      const next = (k * s + Math.min(s - 1, j + 1)) * 3;

      for (let side = 0; side < 2; side++) {
        const o = v * 3;
        target[o] = spine[p];
        target[o + 1] = spine[p + 1];
        target[o + 2] = spine[p + 2];
        targetNext[o] = spine[next];
        targetNext[o + 1] = spine[next + 1];
        targetNext[o + 2] = spine[next + 2];
        v++;
      }
    }
  }
}

/** Expands per-strand colours into per-vertex colour data. */
export function writeColors(
  target: Float32Array,
  color: (k: number) => [number, number, number],
  n: number,
  s: number,
) {
  let v = 0;
  for (let k = 0; k < n; k++) {
    const [r, g, b] = color(k);
    for (let j = 0; j < s; j++) {
      for (let side = 0; side < 2; side++) {
        const o = v * 3;
        target[o] = r;
        target[o + 1] = g;
        target[o + 2] = b;
        v++;
      }
    }
  }
}

/**
 * Builds the ribbon geometry for `n` strands of `s` points, with both shape
 * slots filled from the two spines given.
 */
export function buildRibbonGeometry({
  n,
  s,
  from,
  to,
  colorFrom,
  colorTo,
  rng,
}: {
  n: number;
  s: number;
  from: Spine;
  to: Spine;
  colorFrom: (k: number) => [number, number, number];
  colorTo: (k: number) => [number, number, number];
  rng: () => number;
}) {
  const vertexCount = n * s * 2;
  const geo = new THREE.BufferGeometry();

  const fromP = new Float32Array(vertexCount * 3);
  const fromN = new Float32Array(vertexCount * 3);
  const toP = new Float32Array(vertexCount * 3);
  const toN = new Float32Array(vertexCount * 3);
  const cFrom = new Float32Array(vertexCount * 3);
  const cTo = new Float32Array(vertexCount * 3);
  const sides = new Float32Array(vertexCount);
  const ts = new Float32Array(vertexCount);
  const rands = new Float32Array(vertexCount);

  let v = 0;
  for (let k = 0; k < n; k++) {
    const strandRand = rng();
    for (let j = 0; j < s; j++) {
      const t = j / (s - 1);
      for (let side = 0; side < 2; side++) {
        sides[v] = side === 0 ? -1 : 1;
        ts[v] = t;
        rands[v] = strandRand;
        v++;
      }
    }
  }

  writeSpine(fromP, fromN, from, n, s);
  writeSpine(toP, toN, to, n, s);
  writeColors(cFrom, colorFrom, n, s);
  writeColors(cTo, colorTo, n, s);

  // `position` is never read by the shader — gl_Position is built entirely from
  // the attributes above — but three.js requires it to size the geometry.
  geo.setAttribute("position", new THREE.BufferAttribute(fromP.slice(), 3));
  geo.setAttribute("aFromP", new THREE.BufferAttribute(fromP, 3));
  geo.setAttribute("aFromN", new THREE.BufferAttribute(fromN, 3));
  geo.setAttribute("aToP", new THREE.BufferAttribute(toP, 3));
  geo.setAttribute("aToN", new THREE.BufferAttribute(toN, 3));
  geo.setAttribute("aColorFrom", new THREE.BufferAttribute(cFrom, 3));
  geo.setAttribute("aColorTo", new THREE.BufferAttribute(cTo, 3));
  geo.setAttribute("aSide", new THREE.BufferAttribute(sides, 1));
  geo.setAttribute("aT", new THREE.BufferAttribute(ts, 1));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rands, 1));

  // Two triangles per rung between consecutive spine points.
  const indices: number[] = [];
  for (let k = 0; k < n; k++) {
    for (let j = 0; j < s - 1; j++) {
      const base = (k * s + j) * 2;
      indices.push(base, base + 1, base + 2);
      indices.push(base + 1, base + 3, base + 2);
    }
  }
  geo.setIndex(indices);

  // The shapes all live inside this sphere. Fixing it stops three.js
  // recomputing bounds it cannot derive from `position` anyway, and stops the
  // mesh being wrongly culled mid-morph.
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 14);

  return geo;
}

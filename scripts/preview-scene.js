/**
 * Vanilla-three.js port of the homepage particle scene, for the standalone
 * single-file preview (scripts/build-preview.mjs).
 *
 * The shaders and shape generators are the same maths as the React version in
 * components/three and lib/three — this file exists only because the preview
 * has to be one self-contained HTML file with no React runtime, and importing
 * three directly lets esbuild tree-shake it down to what we actually use.
 */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  BufferAttribute,
  Points,
  ShaderMaterial,
  Color,
  Sphere,
  Vector3,
  AdditiveBlending,
} from "three";

/* ---------------------------------------------------------- shape buffers */

function makeRng(seed = 1337) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const cloud = (count) => {
  const rng = makeRng(11);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 3.4 * Math.cbrt(rng());
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
};

const scatter = (count) => {
  const rng = makeRng(29);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rng() - 0.5) * 22;
    out[i * 3 + 1] = (rng() - 0.5) * 13;
    out[i * 3 + 2] = (rng() - 0.5) * 16 - 3;
  }
  return out;
};

function starPolygon(outer, inner) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

function inPolygon(x, y, poly) {
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

const stars = (count) => {
  const rng = makeRng(47);
  const out = new Float32Array(count * 3);
  const per = Math.ceil(count / 5);
  const outer = 0.56;
  const poly = starPolygon(outer, 0.24);
  for (let i = 0; i < count; i++) {
    const cx = (Math.min(4, Math.floor(i / per)) - 2) * 1.26;
    let x = 0;
    let y = 0;
    for (let a = 0; a < 40; a++) {
      x = (rng() - 0.5) * 2 * outer;
      y = (rng() - 0.5) * 2 * outer;
      if (inPolygon(x, y, poly)) break;
    }
    out[i * 3] = cx + x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = (rng() - 0.5) * 0.12;
  }
  return out;
};

function sampleSegments(count, segments, rng, jitter = 0.03) {
  const out = new Float32Array(count * 3);
  const lengths = segments.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1));
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

const browser = (count) => {
  const rng = makeRng(83);
  const w = 4.6;
  const h = 3.0;
  const b = h / 2 - 0.5;
  const L = -w / 2;
  const R = w / 2;
  const out = sampleSegments(
    count,
    [
      [L, h / 2, R, h / 2],
      [R, h / 2, R, -h / 2],
      [R, -h / 2, L, -h / 2],
      [L, -h / 2, L, h / 2],
      [L, b, R, b],
      [L + 0.45, b - 0.55, L + 2.4, b - 0.55],
      [L + 0.45, b - 0.95, L + 3.1, b - 0.95],
      [L + 0.45, b - 1.3, L + 2.0, b - 1.3],
      [L + 0.45, b - 1.95, L + 1.55, b - 1.95],
      [L + 1.55, b - 1.95, L + 1.55, b - 1.62],
      [L + 1.55, b - 1.62, L + 0.45, b - 1.62],
      [L + 0.45, b - 1.62, L + 0.45, b - 1.95],
      [R - 2.0, b - 0.5, R - 0.45, b - 0.5],
      [R - 0.45, b - 0.5, R - 0.45, b - 1.95],
      [R - 0.45, b - 1.95, R - 2.0, b - 1.95],
      [R - 2.0, b - 1.95, R - 2.0, b - 0.5],
    ],
    rng,
  );
  const dots = Math.floor(count * 0.03);
  for (let i = 0; i < dots; i++) {
    const cx = L + 0.28 + (i % 3) * 0.26;
    const a = rng() * Math.PI * 2;
    const r = 0.07 * Math.sqrt(rng());
    out[i * 3] = cx + Math.cos(a) * r;
    out[i * 3 + 1] = b + 0.25 + Math.sin(a) * r;
    out[i * 3 + 2] = 0;
  }
  return out;
};

const ladder = (count) => {
  const rng = makeRng(101);
  const out = new Float32Array(count * 3);
  const rows = 9;
  const weights = Array.from({ length: rows }, (_, i) => (i === 0 ? 3.2 : 1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let written = 0;
  for (let row = 0; row < rows; row++) {
    const n =
      row === rows - 1
        ? count - written
        : Math.floor((weights[row] / totalWeight) * count);
    const y = 1.9 - row * 0.46;
    const z = -row * 0.42;
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

const globe = (count) => {
  const out = new Float32Array(count * 3);
  const r = 2.45;
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

const portal = (count) => {
  const rng = makeRng(199);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = rng() * Math.PI * 2;
    const radius = 0.5 + Math.pow(1 - t, 1.6) * 3.9 + (rng() - 0.5) * 0.22;
    out[i * 3] = Math.cos(angle) * radius;
    out[i * 3 + 1] = Math.sin(angle) * radius * 0.78;
    out[i * 3 + 2] = -7.0 * (1 - t) + (rng() - 0.5) * 0.3;
  }
  return out;
};

const beatShapes = [cloud, scatter, stars, browser, ladder, globe, portal];
const beatColors = [
  [0.55, 0.52, 0.98],
  [0.38, 0.4, 0.52],
  [1.0, 0.76, 0.29],
  [0.13, 0.83, 0.93],
  [0.43, 0.36, 0.96],
  [0.3, 0.86, 0.78],
  [0.72, 0.7, 1.0],
];
const beatOffsetX = [0, 0, 2.1, -2.0, 2.1, -2.2, 0];
const cameraZ = [9, 12.5, 8.2, 8.8, 9.6, 9.2, 6.4];

/* --------------------------------------------------------------- shaders */

const vertexShader = `
  uniform float uTime; uniform float uMix; uniform float uSize; uniform float uVelocity;
  attribute vec3 aFrom; attribute vec3 aTo; attribute vec3 aRandom;
  varying float vFade; varying float vRand;
  void main() {
    float stagger = aRandom.x * 0.35;
    float t = clamp((uMix - stagger) / (1.0 - 0.35), 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(aFrom, aTo, t);
    float arc = sin(t * 3.14159) * 0.55;
    pos += normalize(aRandom - 0.5) * arc * (0.4 + aRandom.y);
    float d = uTime * 0.35 + aRandom.z * 6.2831;
    pos.x += sin(d) * 0.045; pos.y += cos(d * 1.3) * 0.045; pos.z += sin(d * 0.7) * 0.045;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float speed = clamp(abs(uVelocity) * 22.0, 0.0, 1.6);
    gl_PointSize = uSize * (1.0 + aRandom.y * 0.9 + speed * 0.35) * (14.0 / -mv.z);
    vFade = smoothstep(-16.0, -2.0, mv.z);
    vRand = aRandom.y;
  }`;

const fragmentShader = `
  precision highp float;
  uniform vec3 uColorFrom; uniform vec3 uColorTo; uniform float uMix; uniform float uOpacity;
  varying float vFade; varying float vRand;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float core = smoothstep(0.5, 0.0, dist);
    float glow = pow(core, 2.6);
    vec3 color = mix(uColorFrom, uColorTo, uMix);
    color += vec3(0.28) * step(0.82, vRand) * glow;
    gl_FragColor = vec4(color, glow * uOpacity * vFade);
  }`;

/* ------------------------------------------------------------------ boot */

export function startScene(canvas) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let gl;
  try {
    gl = canvas.getContext("webgl2");
  } catch {
    gl = null;
  }
  if (!gl) return;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowEnd = (navigator.hardwareConcurrency ?? 4) <= 4 || coarse || window.innerWidth < 1024;
  const count = lowEnd ? 1400 : 4800;

  const renderer = new WebGLRenderer({
    canvas,
    context: gl,
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowEnd ? 1.3 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 60);
  camera.position.set(0, 0, 9);

  const shapes = beatShapes.map((gen) => gen(count));

  const rng = makeRng(7);
  const random = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) random[i] = rng();

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(shapes[0].slice(), 3));
  geometry.setAttribute("aFrom", new BufferAttribute(shapes[0].slice(), 3));
  geometry.setAttribute("aTo", new BufferAttribute(shapes[1].slice(), 3));
  geometry.setAttribute("aRandom", new BufferAttribute(random, 3));
  geometry.boundingSphere = new Sphere(new Vector3(), 24);

  const uniforms = {
    uTime: { value: 0 },
    uMix: { value: 0 },
    uSize: { value: lowEnd ? 3.2 : 2.7 },
    uVelocity: { value: 0 },
    uOpacity: { value: 0 },
    uColorFrom: { value: new Color(...beatColors[0]) },
    uColorTo: { value: new Color(...beatColors[1]) },
  };

  const points = new Points(
    geometry,
    new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  points.frustumCulled = false;
  scene.add(points);

  /* --- scroll progress, measured from the real sections (see Narrative) --- */
  let centers = [];
  const measure = () => {
    centers = Array.from(document.querySelectorAll("[data-beat]")).map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + window.scrollY + r.height / 2;
    });
  };
  measure();
  window.addEventListener("resize", () => {
    measure();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  if (document.fonts) document.fonts.ready.then(measure).catch(() => {});

  const pointer = { x: 0, y: 0 };
  if (!coarse) {
    window.addEventListener(
      "pointermove",
      (e) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true },
    );
  }

  let loadedPair = -1;
  let lastProgress = 0;
  let last = performance.now();
  const target = new Vector3(0, 0, 9);

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    let beatFloat = 0;
    if (centers.length > 1) {
      const vc = window.scrollY + window.innerHeight / 2;
      const end = centers.length - 1;
      if (vc <= centers[0]) beatFloat = 0;
      else if (vc >= centers[end]) beatFloat = end;
      else {
        let i = 0;
        while (i < end && vc > centers[i + 1]) i++;
        const span = centers[i + 1] - centers[i];
        beatFloat = i + (span > 0 ? (vc - centers[i]) / span : 0);
      }
    }

    const from = Math.min(shapes.length - 2, Math.max(0, Math.floor(beatFloat)));
    const mix = Math.min(1, Math.max(0, beatFloat - from));
    const velocity = beatFloat / (shapes.length - 1) - lastProgress;
    lastProgress = beatFloat / (shapes.length - 1);

    if (loadedPair !== from) {
      geometry.getAttribute("aFrom").array.set(shapes[from]);
      geometry.getAttribute("aTo").array.set(shapes[from + 1]);
      geometry.getAttribute("aFrom").needsUpdate = true;
      geometry.getAttribute("aTo").needsUpdate = true;
      loadedPair = from;
    }

    uniforms.uMix.value = mix;
    uniforms.uTime.value += dt;
    uniforms.uVelocity.value += (velocity - uniforms.uVelocity.value) * 0.1;
    uniforms.uColorFrom.value.setRGB(...beatColors[from]);
    uniforms.uColorTo.value.setRGB(...beatColors[from + 1]);
    uniforms.uOpacity.value = Math.min(1, uniforms.uOpacity.value + dt * 1.2);

    const nearGlobe = Math.max(0, 1 - Math.abs(beatFloat - 5));
    points.rotation.y += dt * (0.03 + nearGlobe * 0.22);
    points.rotation.x = Math.sin(uniforms.uTime.value * 0.12) * 0.06;

    const wide = window.innerWidth / window.innerHeight > 1.05;
    const tx = wide ? beatOffsetX[from] + (beatOffsetX[from + 1] - beatOffsetX[from]) * mix : 0;
    points.position.x += (tx - points.position.x) * (1 - Math.pow(0.005, dt));

    const z = cameraZ[from] + (cameraZ[from + 1] - cameraZ[from]) * mix;
    target.set(coarse ? 0 : pointer.x * 0.55, coarse ? 0 : -pointer.y * 0.35, z);
    camera.position.lerp(target, 1 - Math.pow(0.001, dt));
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

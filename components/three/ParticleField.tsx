"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { beatColors, beatShapes, makeRng } from "@/lib/three/shapes";
import { particleCount, type GraphicsTier } from "@/lib/device";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uSize;
  uniform float uVelocity;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aRandom;

  varying float vFade;
  varying float vRand;

  void main() {
    // Stagger each particle's arrival so the shape assembles rather than
    // snapping — the single biggest contributor to the effect feeling alive.
    float stagger = aRandom.x * 0.35;
    float t = clamp((uMix - stagger) / (1.0 - 0.35), 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t); // smoothstep

    vec3 pos = mix(aFrom, aTo, t);

    // Particles bow outward mid-transition so paths arc instead of sliding
    // along straight lines.
    float arc = sin(t * 3.14159) * 0.55;
    pos += normalize(aRandom - 0.5) * arc * (0.4 + aRandom.y);

    // Continuous idle drift, so a parked scene is never completely still.
    float d = uTime * 0.35 + aRandom.z * 6.2831;
    pos.x += sin(d) * 0.045;
    pos.y += cos(d * 1.3) * 0.045;
    pos.z += sin(d * 0.7) * 0.045;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation, plus a slight smear with scroll velocity.
    float speed = clamp(abs(uVelocity) * 22.0, 0.0, 1.6);
    gl_PointSize = uSize * (1.0 + aRandom.y * 0.9 + speed * 0.35)
                 * (14.0 / -mvPosition.z);

    // Fade the deepest particles so the ladder beat reads as real depth.
    vFade = smoothstep(-16.0, -2.0, mvPosition.z);
    vRand = aRandom.y;
  }
`;

const fragmentShader = /* glsl */ `
  // Must match the vertex shader's default (highp) — uMix is shared between
  // the two stages, and differing precision qualifiers fail to link.
  precision highp float;

  uniform vec3 uColorFrom;
  uniform vec3 uColorTo;
  uniform float uMix;
  uniform float uOpacity;

  varying float vFade;
  varying float vRand;

  void main() {
    // Soft round sprite — cheaper and sharper than sampling a texture.
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.0, dist);
    float glow = pow(core, 2.6);

    vec3 color = mix(uColorFrom, uColorTo, uMix);
    // Brighter cores on a random subset reads as depth and variety.
    color += vec3(0.28) * step(0.82, vRand) * glow;

    gl_FragColor = vec4(color, glow * uOpacity * vFade);
  }
`;

/**
 * Where each beat's shape sits horizontally, so it lands opposite that beat's
 * copy instead of behind it. Collapses to centred on narrow screens, where the
 * layout stacks and an offset would push the shape off the edge.
 */
const beatOffsetX = [0, 0, 2.1, -2.0, 2.1, -2.2, 0];

export function ParticleField({ tier }: { tier: GraphicsTier }) {
  const count = particleCount[tier] || particleCount.low;
  const viewport = useThree((s) => s.viewport);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  /** Which pair of shapes the attributes currently hold. */
  const loadedPair = useRef(-1);

  // Precompute every beat's position buffer once, up front. At these counts
  // it's a few milliseconds total and it makes transitions allocation-free.
  const shapes = useMemo(
    () => beatShapes.map((generate) => generate(count)),
    [count],
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const rng = makeRng(7);
    const random = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) random[i] = rng();

    geo.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("aFrom", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("aTo", new THREE.BufferAttribute(shapes[1].slice(), 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(random, 3));
    // The shapes stay within this radius; a fixed sphere avoids per-frame
    // bounding recalculation and stops the points being wrongly culled.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 24);
    return geo;
  }, [count, shapes]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 0 },
      uSize: { value: tier === "high" ? 2.7 : 3.2 },
      uVelocity: { value: 0 },
      uOpacity: { value: 0 },
      uColorFrom: { value: new THREE.Color(...beatColors[0]) },
      uColorTo: { value: new THREE.Color(...beatColors[1]) },
    }),
    [tier],
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    const points = pointsRef.current;
    if (!mat || !points) return;

    const dt = Math.min(delta, 0.05); // clamp so a stalled tab doesn't jump

    const beatFloat = scrollState.beatFloat;
    const from = Math.min(shapes.length - 2, Math.max(0, Math.floor(beatFloat)));
    const mix = Math.min(1, Math.max(0, beatFloat - from));

    // Swap the attribute buffers only when we cross into a new beat pair.
    if (loadedPair.current !== from) {
      const aFrom = geometry.getAttribute("aFrom") as THREE.BufferAttribute;
      const aTo = geometry.getAttribute("aTo") as THREE.BufferAttribute;
      (aFrom.array as Float32Array).set(shapes[from]);
      (aTo.array as Float32Array).set(shapes[from + 1]);
      aFrom.needsUpdate = true;
      aTo.needsUpdate = true;
      loadedPair.current = from;
    }

    mat.uniforms.uMix.value = mix;
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uVelocity.value +=
      (scrollState.velocity - mat.uniforms.uVelocity.value) * 0.1;
    mat.uniforms.uColorFrom.value.setRGB(...beatColors[from]);
    mat.uniforms.uColorTo.value.setRGB(...beatColors[from + 1]);

    // Fade the whole field in on first paint rather than popping it on.
    mat.uniforms.uOpacity.value = Math.min(
      1,
      mat.uniforms.uOpacity.value + dt * 1.2,
    );

    // Per-beat rotation: the globe turns, everything else drifts gently.
    const globeBeat = 5;
    const nearGlobe = Math.max(0, 1 - Math.abs(beatFloat - globeBeat));
    points.rotation.y += dt * (0.03 + nearGlobe * 0.22);
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.06;

    // Slide the shape to the side opposite this beat's copy. Only on wide
    // viewports — the layout stacks below that and centred reads better.
    const wide = viewport.aspect > 1.05;
    const targetX = wide
      ? beatOffsetX[from] + (beatOffsetX[from + 1] - beatOffsetX[from]) * mix
      : 0;
    points.position.x += (targetX - points.position.x) * (1 - Math.pow(0.005, dt));
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

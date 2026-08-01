"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, clamp, damp } from "@/lib/scroll";
import { actShapes, colorForAct, makeRng } from "@/lib/strand/shapes";
import {
  ribbonVertexShader,
  ribbonFragmentShader,
  buildRibbonGeometry,
  writeSpine,
  writeColors,
} from "@/lib/strand/ribbon";
import { strandCount, strandSegments, type Tier } from "@/lib/device";

/**
 * The homepage strand.
 *
 * One draw call for the whole story. Morphing between acts happens on the GPU;
 * the CPU only touches the buffers when the scroll crosses into a new act pair.
 */

/**
 * Per-act staging. Index === act id.
 *
 * `x` puts the shape on the opposite side from that act's copy. The two centred
 * acts (0 and 6) have their copy directly over the shape, so instead of moving
 * sideways they move back and dim — the words win, the strand becomes a
 * backdrop.
 */
const ACT_OFFSET_X = [0, 2.2, -2.2, 2.4, -2.2, 2.4, 0];
const ACT_DEPTH = [-1.4, 0, 0, 0, 0, 0, -1.2];
const ACT_FADE = [0.75, 1, 1, 1, 1, 1, 0.8];

/** Interpolates a per-act table at a fractional act position. */
function blend(table: number[], from: number, mix: number) {
  return table[from] + (table[from + 1] - table[from]) * mix;
}

export function StrandField({ tier }: { tier: Exclude<Tier, "off"> }) {
  const n = strandCount[tier];
  const s = strandSegments[tier];
  const viewport = useThree((state) => state.viewport);

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  /** Which pair of acts the attribute buffers currently hold. */
  const loadedPair = useRef(-1);
  const smoothedVelocity = useRef(0);

  // Every act's spine, computed once. A few milliseconds in total, and it makes
  // the transitions allocation-free.
  const spines = useMemo(
    () => actShapes.map((generate) => generate(n, s)),
    [n, s],
  );

  const geometry = useMemo(
    () =>
      buildRibbonGeometry({
        n,
        s,
        from: spines[0],
        to: spines[1],
        colorFrom: (k) => colorForAct(0, k, n),
        colorTo: (k) => colorForAct(1, k, n),
        rng: makeRng(7),
      }),
    [n, s, spines],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 0 },
      uWidth: { value: tier === "high" ? 0.052 : 0.07 },
      uVelocity: { value: 0 },
      uOpacity: { value: 0 },
      uFade: { value: ACT_FADE[0] },
    }),
    [tier],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    if (!material || !mesh) return;

    // Clamp so a backgrounded tab doesn't resume with one enormous step.
    const dt = Math.min(delta, 0.05);

    const act = scrollState.act;
    const from = clamp(Math.floor(act), 0, spines.length - 2);
    const mix = clamp(act - from, 0, 1);

    if (loadedPair.current !== from) {
      const fromP = geometry.getAttribute("aFromP") as THREE.BufferAttribute;
      const fromN = geometry.getAttribute("aFromN") as THREE.BufferAttribute;
      const toP = geometry.getAttribute("aToP") as THREE.BufferAttribute;
      const toN = geometry.getAttribute("aToN") as THREE.BufferAttribute;
      const colorFrom = geometry.getAttribute("aColorFrom") as THREE.BufferAttribute;
      const colorTo = geometry.getAttribute("aColorTo") as THREE.BufferAttribute;

      writeSpine(
        fromP.array as Float32Array,
        fromN.array as Float32Array,
        spines[from],
        n,
        s,
      );
      writeSpine(
        toP.array as Float32Array,
        toN.array as Float32Array,
        spines[from + 1],
        n,
        s,
      );
      writeColors(colorFrom.array as Float32Array, (k) => colorForAct(from, k, n), n, s);
      writeColors(colorTo.array as Float32Array, (k) => colorForAct(from + 1, k, n), n, s);

      fromP.needsUpdate = true;
      fromN.needsUpdate = true;
      toP.needsUpdate = true;
      toN.needsUpdate = true;
      colorFrom.needsUpdate = true;
      colorTo.needsUpdate = true;
      loadedPair.current = from;
    }

    material.uniforms.uMix.value = mix;
    material.uniforms.uTime.value += dt;

    smoothedVelocity.current = damp(
      smoothedVelocity.current,
      scrollState.velocity,
      8,
      dt,
    );
    material.uniforms.uVelocity.value = smoothedVelocity.current;

    // Fade in over the first half second rather than popping on.
    material.uniforms.uOpacity.value = Math.min(
      1,
      material.uniforms.uOpacity.value + dt * 1.6,
    );

    // Slow turn, faster through the acts that read as three-dimensional
    // objects: the lotus (1), the helix (5) and the ring (6).
    const dimensional =
      Math.max(0, 1 - Math.abs(act - 1)) +
      Math.max(0, 1 - Math.abs(act - 5)) +
      Math.max(0, 1 - Math.abs(act - 6)) * 0.5;
    mesh.rotation.y += dt * (0.05 + dimensional * 0.16);
    mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.11) * 0.03;

    // On wide screens the shape slides to the side the copy is NOT on — see
    // `acts[].side` in content/story.ts. On narrow ones the layout stacks, so
    // it stays centred and is pushed back behind the text instead.
    const wide = viewport.aspect > 1.05;
    const targetX = wide ? blend(ACT_OFFSET_X, from, mix) : 0;
    mesh.position.x = damp(mesh.position.x, targetX, 3.2, dt);

    const depth = blend(ACT_DEPTH, from, mix);
    mesh.position.z = damp(mesh.position.z, wide ? depth : depth - 1.8, 3.2, dt);

    const fade = blend(ACT_FADE, from, mix);
    material.uniforms.uFade.value = damp(
      material.uniforms.uFade.value,
      wide ? fade : fade * 0.72,
      4,
      dt,
    );
  });

  return (
    <mesh ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={ribbonVertexShader}
        fragmentShader={ribbonFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

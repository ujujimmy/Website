"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "@/lib/scroll";
import { makeRng } from "@/lib/strand/shapes";
import { looseRopes, braid, colorForRope } from "@/lib/strand/braid";
import {
  ribbonVertexShader,
  ribbonFragmentShader,
  buildRibbonGeometry,
} from "@/lib/strand/ribbon";
import { type Tier } from "@/lib/device";

/** Three ropes of strands each, so a rope reads as a rope. */
const STRANDS = { high: 30, low: 15 } as const;
const SEGMENTS = { high: 34, low: 20 } as const;

function Braid({
  tier,
  progress,
}: {
  tier: Exclude<Tier, "off">;
  progress: { value: number };
}) {
  const n = STRANDS[tier];
  const s = SEGMENTS[tier];
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () =>
      buildRibbonGeometry({
        n,
        s,
        from: looseRopes(n, s),
        to: braid(n, s),
        // The ropes keep their colour through the plait; only the shape changes.
        colorFrom: colorForRope,
        colorTo: colorForRope,
        rng: makeRng(23),
      }),
    [n, s],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 0 },
      uWidth: { value: tier === "high" ? 0.075 : 0.1 },
      uVelocity: { value: 0 },
      uOpacity: { value: 0 },
      uFade: { value: 1 },
    }),
    [tier],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    if (!material || !mesh) return;

    const dt = Math.min(delta, 0.05);

    material.uniforms.uMix.value = damp(
      material.uniforms.uMix.value,
      progress.value,
      6,
      dt,
    );
    material.uniforms.uTime.value += dt;
    material.uniforms.uOpacity.value = Math.min(
      1,
      material.uniforms.uOpacity.value + dt * 1.6,
    );

    // A slow turn so the plait reads as a solid object rather than a flat
    // zigzag — the depth is the whole difference between the two.
    mesh.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.45;
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

export default function BraidCanvas({
  tier,
  progress,
}: {
  tier: Exclude<Tier, "off">;
  progress: { value: number };
}) {
  return (
    <Canvas
      className="strand-canvas"
      gl={{
        alpha: true,
        antialias: tier === "high",
        depth: false,
        stencil: false,
      }}
      dpr={tier === "high" ? [1, 2] : 1}
      camera={{ position: [0, 0, 8], fov: 45 }}
    >
      <Braid tier={tier} progress={progress} />
    </Canvas>
  );
}

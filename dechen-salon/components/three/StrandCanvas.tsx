"use client";

import { Canvas } from "@react-three/fiber";
import { StrandField } from "./StrandField";
import type { Tier } from "@/lib/device";

/**
 * The WebGL layer. Kept in its own module so `next/dynamic` can keep three.js
 * out of the initial bundle entirely — it is by a wide margin the heaviest
 * thing on the site, and it is decoration.
 */
export default function StrandCanvas({ tier }: { tier: Exclude<Tier, "off"> }) {
  return (
    <Canvas
      className="strand-canvas"
      // `alpha` so the animated ground shows through; no stencil or depth
      // buffer because a single transparent ribbon pass needs neither.
      gl={{
        alpha: true,
        antialias: tier === "high",
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
      dpr={tier === "high" ? [1, 2] : 1}
      camera={{ position: [0, 0, 9], fov: 42 }}
      // The scene only changes while the page is scrolling or the idle sway is
      // running, but both are continuous, so a frameloop of "always" is honest.
      // Visibility is handled by unmounting the canvas when the story leaves.
      frameloop="always"
    >
      <StrandField tier={tier} />
    </Canvas>
  );
}

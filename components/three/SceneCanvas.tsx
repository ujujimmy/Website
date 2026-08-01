"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";
import { scrollState } from "@/lib/scroll";
import type { GraphicsTier } from "@/lib/device";

/**
 * Camera rig. Pulls back through the problem beat, pushes in for the CTA
 * portal, and adds a little pointer parallax on desktop. All of it is
 * damped — the camera should never move faster than the eye can follow.
 */
function CameraRig({ parallax }: { parallax: boolean }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(0, 0, 9));

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [parallax]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const b = scrollState.beatFloat;

    // Per-beat camera distance, interpolated by where we are between beats.
    const distances = [9, 12.5, 8.2, 8.8, 9.6, 9.2, 6.4];
    const i = Math.min(distances.length - 2, Math.max(0, Math.floor(b)));
    const t = Math.min(1, Math.max(0, b - i));
    const z = distances[i] + (distances[i + 1] - distances[i]) * t;

    target.current.set(
      parallax ? pointer.current.x * 0.55 : 0,
      parallax ? -pointer.current.y * 0.35 : 0,
      z,
    );

    // Exponential damping — frame-rate independent.
    const lerp = 1 - Math.pow(0.001, dt);
    camera.position.lerp(target.current, lerp);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Stops the render loop whenever the canvas is scrolled out of view or the
 * tab is hidden. Without this the GPU keeps working through the footer, the
 * pricing table and every other page section for no visual benefit.
 */
function useRenderGate(ref: React.RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    io.observe(el);

    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref]);

  return active;
}

export default function SceneCanvas({ tier }: { tier: GraphicsTier }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = useRenderGate(wrapRef);
  const highEnd = tier === "high";

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <Canvas
        // Cap device pixel ratio — a 3× phone screen would otherwise render
        // nine times the pixels for no perceptible gain on a particle field.
        dpr={highEnd ? [1, 1.75] : [1, 1.3]}
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 60 }}
        gl={{
          antialias: false, // additive points don't benefit; costs fill rate
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        frameloop={active ? "always" : "never"}
      >
        <CameraRig parallax={highEnd} />
        <ParticleField tier={tier} />
      </Canvas>
    </div>
  );
}

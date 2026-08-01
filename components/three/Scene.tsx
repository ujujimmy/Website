"use client";

import dynamic from "next/dynamic";
import { useDeviceProfile } from "@/lib/device";
import { ScenePoster } from "./ScenePoster";

/**
 * Chooses between the WebGL scene and the static poster.
 *
 * The canvas is loaded client-side only and never on the critical path — the
 * poster is what the visitor sees at first paint, so LCP is always text and
 * CSS, never a WebGL frame. That's what keeps the Lighthouse score defensible
 * on a site that sells SEO.
 */
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => <ScenePoster />,
});

export function Scene() {
  const { tier, ready } = useDeviceProfile();

  if (!ready || tier === "off") return <ScenePoster />;

  return (
    <>
      {/* Poster stays underneath as the canvas's backdrop and safety net. */}
      <ScenePoster />
      <SceneCanvas tier={tier} />
    </>
  );
}

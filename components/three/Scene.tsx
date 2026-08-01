"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDeviceProfile } from "@/lib/device";
import { ScenePoster } from "./ScenePoster";

/**
 * Chooses between the WebGL scene and the static poster, and decides *when*
 * to load it.
 *
 * three.js is the single heaviest thing on the site. Mounting it during
 * hydration put it in direct competition with the main thread while the page
 * was still becoming interactive, which cost ~30 Lighthouse points on a
 * throttled mobile profile — unacceptable for a site whose job is to prove we
 * can build fast ones.
 *
 * So the canvas waits for the browser to go idle. The poster is a complete
 * visual on its own, the 3D is a true progressive enhancement layered on once
 * the device has capacity, and LCP is always text over CSS.
 */
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

export function Scene() {
  const { tier, ready } = useDeviceProfile();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!ready || tier === "off") return;

    // Low-end devices get a longer runway before we add WebGL to their load.
    const timeout = tier === "low" ? 3500 : 1200;

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => setIdle(true), {
        timeout,
      });
      return () => window.cancelIdleCallback(handle);
    }

    // Safari has no requestIdleCallback — fall back to a plain delay.
    const handle = window.setTimeout(() => setIdle(true), timeout);
    return () => window.clearTimeout(handle);
  }, [ready, tier]);

  return (
    <>
      {/* Always present: the canvas's backdrop, and the whole visual when
          WebGL is unavailable or the visitor asked for reduced motion. */}
      <ScenePoster />
      {ready && tier !== "off" && idle && <SceneCanvas tier={tier} />}
    </>
  );
}

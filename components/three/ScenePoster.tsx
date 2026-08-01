/**
 * The always-present background layer: the canvas's backdrop, and the entire
 * visual when WebGL is unavailable or the visitor asked for reduced motion.
 *
 * Built from plain radial gradients with no `filter: blur()`. An earlier
 * version used large blurred circles (blur(110px) over a ~830px element),
 * which cost seconds of rasterisation on a throttled mobile profile. A radial
 * gradient is already soft-edged, so the blur bought nothing visually and
 * everything in main-thread time.
 */
export function ScenePoster() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-ink" />

      {/* Central brand glow. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 46% at 50% 38%, rgba(109,92,246,0.30) 0%, rgba(109,92,246,0.13) 38%, rgba(34,211,238,0.06) 62%, transparent 80%)",
        }}
      />

      {/* Cooler secondary glow, offset low and right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 34% at 88% 76%, rgba(34,211,238,0.16) 0%, transparent 72%)",
        }}
      />

      {/* Faint grid gives the void some structure without costing anything. */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

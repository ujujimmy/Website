/**
 * The no-WebGL fallback: a pure-CSS approximation of the scene's mood.
 *
 * This renders for reduced-motion visitors, devices without WebGL2, and —
 * importantly — as the server-rendered background before the canvas mounts,
 * so the page never flashes flat black on first paint.
 */
export function ScenePoster() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-ink" />
      <div
        className="absolute left-1/2 top-[38%] h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(109,92,246,0.55) 0%, rgba(34,211,238,0.22) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-40 top-[65%] h-[34rem] w-[34rem] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.5) 0%, transparent 70%)",
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
        }}
      />
    </div>
  );
}

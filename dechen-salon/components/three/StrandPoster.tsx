/**
 * The still that stands in for the 3D.
 *
 * Shown underneath the canvas at all times, and shown *alone* when WebGL is
 * unavailable or the visitor asked for reduced motion. It is a hand-drawn
 * version of the same idea — strands of hair falling and curling — rather than
 * an empty box, so the page never looks broken for the people least likely to
 * tolerate it.
 *
 * Pure SVG, server-rendered, no JavaScript.
 */

const STRANDS = 14;

export function StrandPoster() {
  // Deterministic layout: a fan of curved strands, each a quadratic Bézier with
  // a slightly different bow and length.
  const strands = Array.from({ length: STRANDS }, (_, i) => {
    const u = i / (STRANDS - 1);
    const x = 60 + u * 280;
    const bow = 40 + Math.sin(u * Math.PI) * 70;
    const length = 300 + Math.sin(u * Math.PI) * 130;
    return {
      d: `M ${x} 40 Q ${x + bow} ${40 + length * 0.55} ${x + bow * 0.35} ${40 + length}`,
      width: 1.1 + Math.sin(u * Math.PI) * 1.5,
      opacity: 0.18 + Math.sin(u * Math.PI) * 0.4,
    };
  });

  return (
    <svg
      viewBox="0 0 400 500"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="strand-poster" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#3a2430" />
          <stop offset="55%" stopColor="#8c4a63" />
          <stop offset="100%" stopColor="#d8a63c" />
        </linearGradient>
      </defs>

      {strands.map((strand, i) => (
        <path
          key={i}
          d={strand.d}
          fill="none"
          stroke="url(#strand-poster)"
          strokeWidth={strand.width}
          strokeLinecap="round"
          opacity={strand.opacity}
        />
      ))}
    </svg>
  );
}

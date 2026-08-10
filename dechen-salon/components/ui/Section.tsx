import { Reveal } from "./Reveal";

/** Shared page furniture: section shells, eyebrows and the blossom divider. */

export function Section({
  children,
  className = "",
  id,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** `cream` lifts a section off the blush ground without a hard card edge. */
  tone?: "default" | "cream" | "plum";
}) {
  const tones = {
    default: "",
    cream: "bg-cream",
    plum: "bg-plum text-petal",
  };

  return (
    <section id={id} className={`${tones[tone]} px-6 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <header className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal variant="mask" delay={0.05} className="mt-4">
        <h2 className="text-3xl leading-[1.15] sm:text-4xl">{title}</h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.14}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{sub}</p>
        </Reveal>
      ) : null}
    </header>
  );
}

/**
 * The heart-and-swirl rule the salon uses between sections of its catalog.
 * Carried over so the site and the printed menu feel like one thing.
 */
export function Blossom({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 200 34"
        className="h-8 w-48 fill-none stroke-gold/55 stroke-[1.4]"
        focusable="false"
      >
        <path
          d="M4 24 C 44 24, 64 6, 82 6 C 94 6, 100 14, 100 20 C 100 14, 106 6, 118 6 C 136 6, 156 24, 196 24"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

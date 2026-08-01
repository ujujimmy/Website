import Link from "next/link";
import { Beat } from "./Beat";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Section";
import { StatCounter } from "@/components/ui/StatCounter";
import { Button } from "@/components/ui/Button";
import { homeCopy } from "@/content/site";
import { services } from "@/content/services";
import { brand } from "@/content/brand";

/** BEAT 1 — the invisible loss. */
export function ProblemBeat() {
  const { problem } = homeCopy;
  return (
    <Beat side="left" id="problem" beat={1}>
      <Reveal>
        <Eyebrow>{problem.eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-5xl">
          {problem.headline}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-6 text-lg leading-relaxed text-muted">{problem.sub}</p>
      </Reveal>
      <ul className="mt-8 flex flex-col gap-3">
        {problem.points.map((point, i) => (
          <Reveal as="li" key={point} delay={0.2 + i * 0.07}>
            <span className="flex gap-3 text-[0.975rem] leading-relaxed text-muted">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger/70"
              />
              {point}
            </span>
          </Reveal>
        ))}
      </ul>
    </Beat>
  );
}

/** BEATS 2–4 — one per service, alternating sides. */
export function ServiceBeat({
  slug,
  side,
}: {
  slug: (typeof services)[number]["slug"];
  side: "left" | "right";
}) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;

  const accentClass =
    service.accent === "gold"
      ? "text-gold"
      : service.accent === "brand-2"
        ? "text-brand-2"
        : "text-brand-soft";

  return (
    <Beat side={side} id={service.slug} beat={service.beat - 1}>
      <Reveal>
        <Eyebrow>{service.name}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-5xl">
          {service.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          {service.subheading}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <dl className="mt-9 grid grid-cols-3 gap-4 border-y border-line py-6">
          {service.outcomes.map((outcome) => (
            <div key={outcome.label}>
              <dt className="sr-only">{outcome.label}</dt>
              <dd>
                <StatCounter
                  value={outcome.value}
                  className={`block text-2xl font-semibold sm:text-3xl ${accentClass}`}
                />
                <span className="mt-1.5 block text-xs leading-snug text-faint">
                  {outcome.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.26}>
        <Link
          href={`/services/${service.slug}`}
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-brand-2"
        >
          How {service.name.toLowerCase()} works
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
            <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </Reveal>
    </Beat>
  );
}

/** BEAT 5 — where we work. Turns "offshore" into "coverage". */
export function GlobalBeat() {
  const { global } = homeCopy;
  return (
    <Beat side="right" id="global" beat={5}>
      <Reveal>
        <Eyebrow>{global.eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-5xl">
          {global.headline}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-6 text-lg leading-relaxed text-muted">{global.sub}</p>
      </Reveal>

      <ul className="mt-9 grid grid-cols-2 gap-3">
        {global.markers.map((marker, i) => (
          <Reveal as="li" key={marker.label} delay={0.2 + i * 0.06}>
            <div className="glass rounded-xl px-4 py-3.5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]"
                />
                {marker.label}
              </p>
              <p className="mt-1 text-xs text-faint">{marker.detail}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Beat>
  );
}

/** BEAT 6 — the primary conversion moment. */
export function AuditBeat() {
  const { cta } = homeCopy;
  return (
    <Beat side="center" id="free-audit" beat={6}>
      <Reveal>
        <div className="flex justify-center">
          <Eyebrow>{cta.eyebrow}</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
          {cta.headline}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {cta.sub}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {cta.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-center gap-2 text-sm text-muted"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-none stroke-success stroke-[2.2]" aria-hidden="true">
                <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {bullet}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.26}>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={brand.primaryCta.href} size="lg">
            {brand.primaryCta.label}
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
              <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button href="/contact" size="lg" variant="secondary">
            Or just talk to us
          </Button>
        </div>
      </Reveal>
    </Beat>
  );
}

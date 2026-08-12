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
    <Beat side="left" id="problem" beat={1} compact>
      <Reveal>
        <Eyebrow>{problem.eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 text-3xl font-semibold leading-[1.1] sm:mt-5 sm:text-4xl md:text-5xl">
          {problem.headline}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-5 text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
          {problem.sub}
        </p>
      </Reveal>
      <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
        {problem.points.map((point, i) => (
          <Reveal as="li" key={point} delay={0.2 + i * 0.07}>
            <span className="flex gap-3 text-base leading-relaxed text-muted">
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

type Service = (typeof services)[number];

/**
 * The detail half of a service beat: what it does, the recorded numbers, and
 * the link to the full page.
 *
 * Rendered twice — inside the mobile accordion and inside the desktop beat.
 * Duplicating ~40 words of markup is the price of getting a no-JS accordion
 * that cannot cause layout shift: the alternatives are either forcing
 * `<details>` open on desktop through CSS that older Safari and Firefox
 * don't honour, or opening it with JavaScript after paint, which flashes and
 * reflows on exactly the mobile devices this is meant to help. `hidden` and
 * `display: none` both drop their subtree from the accessibility tree, so
 * only one copy is ever announced.
 */
function ServiceDetail({
  service,
  accentClass,
  animate,
}: {
  service: Service;
  accentClass: string;
  /** Reveal animations belong to the desktop beat; the accordion is instant. */
  animate: boolean;
}) {
  const Wrap = animate
    ? Reveal
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <>
      <Wrap delay={0.14}>
        <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
          {service.subheading}
        </p>
      </Wrap>

      <Wrap delay={0.2}>
        <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
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
      </Wrap>

      <Wrap delay={0.26}>
        <Link
          href={`/services/${service.slug}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-base font-medium text-fg transition-colors hover:text-brand-2"
        >
          How {service.name.toLowerCase()} works
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
            <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </Wrap>
    </>
  );
}

/**
 * BEATS 2–4 — one per service, alternating sides.
 *
 * Below `md` these collapse into accordions, closed by default. Three
 * full-viewport service pitches in a row is a desktop reel; on a phone it was
 * three screens of scrolling between the visitor's problem and the price,
 * and the numbers inside them are the same three each time. The heading
 * stays visible so the section still reads as a list of what we do.
 */
export function ServiceBeat({
  slug,
  side,
}: {
  slug: Service["slug"];
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
    <Beat side={side} id={service.slug} beat={service.beat - 1} compact>
      {/*
        The eyebrow and heading render once, at every width, so the page keeps
        exactly one h2 per service and a phone still shows all three services
        as a scannable list. Only the detail below them collapses.
      */}
      <Reveal>
        <Eyebrow>{service.name}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 text-2xl font-semibold leading-tight sm:mt-5 sm:text-4xl md:text-5xl">
          {service.heading}
        </h2>
      </Reveal>

      {/* Mobile: the detail, closed by default. */}
      <details className="group mt-3 border-b border-line md:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-medium text-brand-2 marker:hidden">
          What this involves
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center transition-transform duration-300 group-open:rotate-45"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-current stroke-[1.8]">
              <path d="M8 3v10M3 8h10" strokeLinecap="round" />
            </svg>
          </span>
        </summary>
        <div className="pb-6">
          <ServiceDetail
            service={service}
            accentClass={accentClass}
            animate={false}
          />
        </div>
      </details>

      {/* Desktop: the same detail, always open, with its reveal animations. */}
      <div className="hidden md:block">
        <ServiceDetail service={service} accentClass={accentClass} animate />
      </div>
    </Beat>
  );
}

/**
 * BEAT 5 — where we work. Turns "offshore" into "coverage".
 *
 * On mobile this is one line. The desktop version spends most of a screen —
 * a headline, a four-sentence paragraph and four coverage cards — restating
 * a point that fits in nine words, and a phone visitor deciding whether to
 * keep reading does not need it spelled out four ways.
 */
export function GlobalBeat() {
  const { global } = homeCopy;
  return (
    <Beat side="right" id="global" beat={5} compact>
      <p className="text-base leading-relaxed text-muted md:hidden">
        <span className="font-medium text-fg">Delhi-based.</span> US, Canada
        and UK hours covered.
      </p>

      <div className="hidden md:block">
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
      </div>
    </Beat>
  );
}

/** BEAT 6 — the primary conversion moment. */
export function AuditBeat() {
  const { cta } = homeCopy;
  return (
    <Beat side="center" id="free-audit" beat={6} compact>
      <Reveal>
        <div className="flex justify-center">
          <Eyebrow>{cta.eyebrow}</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 text-3xl font-semibold leading-[1.08] sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl">
          {cta.headline}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
          {cta.sub}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 sm:mt-8">
          {cta.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-center gap-2 text-base text-muted"
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
        {/* Side by side on mobile, as in the hero — stacking two lg buttons
            cost 72px in a section that is already the page's main CTA. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <Button
            href={brand.primaryCta.href}
            size="md"
            className="sm:h-14 sm:px-8 sm:text-base"
          >
            {brand.primaryCta.label}
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
              <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button
            href="/contact"
            size="md"
            variant="secondary"
            className="sm:h-14 sm:px-8 sm:text-base"
          >
            Or just talk to us
          </Button>
        </div>
      </Reveal>
    </Beat>
  );
}

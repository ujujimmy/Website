import Link from "next/link";
import { Act, ActHeading } from "./Act";
import { Reveal } from "@/components/ui/Reveal";
import { Rise } from "@/components/ui/Rise";
import { Button, Arrow } from "@/components/ui/Button";
import { story } from "@/content/story";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";

/** A quiet inline link, styled to work on both blush and plum. */
function ActLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex items-center gap-2 border-b border-current/30 pb-1 text-sm font-medium transition-colors hover:border-current"
    >
      {children}
      <Arrow />
    </Link>
  );
}

/* ------------------------------------------------------------------ ACT 0 */
export function ActOpen() {
  const { open } = story;
  return (
    <Act id={0}>
      {/*
        Everything here is above the fold, so it uses CSS `Rise` rather than the
        observer-driven `Reveal` — see components/ui/Rise.tsx.

        The h1 has no entrance at all. It is the largest-contentful-paint
        element, and any animation that starts it transparent delays the moment
        the browser considers the page painted. The salon's name being simply
        *there*, with the rest settling in around it, also reads better.
      */}
      <Rise as="p" className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-ink">
        {open.place}
      </Rise>

      <h1 className="mt-6 text-[2.6rem] leading-[1.02] sm:text-7xl lg:text-[5.4rem]">
        {open.title}
      </h1>

      <Rise
        as="p"
        delay={0.1}
        className="mt-5 font-display text-xl italic text-gold-ink sm:text-2xl"
      >
        {open.tagline}
      </Rise>

      <Rise
        as="p"
        delay={0.16}
        className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
      >
        {open.sub}
      </Rise>

      <Rise delay={0.22} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href={whatsappLink(bookingMessage)} size="lg" external>
          Book on WhatsApp
          <Arrow />
        </Button>
        <Button href="/menu" size="lg" variant="secondary">
          See the menu
        </Button>
      </Rise>

      <Rise
        as="p"
        delay={0.3}
        className="mt-14 text-[0.7rem] uppercase tracking-[0.3em] text-muted/70"
      >
        {open.scrollHint}
      </Rise>
    </Act>
  );
}

/* ------------------------------------------------------------------ ACT 1 */
export function ActPhilosophy() {
  const { philosophy } = story;
  return (
    <Act id={1}>
      <Reveal>
        <ActHeading
          eyebrow={philosophy.eyebrow}
          headline={philosophy.headline}
          sub={philosophy.sub}
        />
      </Reveal>

      <ul className="mt-9 flex flex-col gap-3.5">
        {philosophy.points.map((point, i) => (
          <Reveal as="li" key={point} delay={0.1 + i * 0.07}>
            <span
              className="flex gap-3 text-[0.95rem] leading-relaxed"
              style={{ color: "var(--act-muted)" }}
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50"
              />
              {point}
            </span>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.32}>
        <ActLink href={philosophy.link.href}>{philosophy.link.label}</ActLink>
      </Reveal>
    </Act>
  );
}

/* ------------------------------------------------------------------ ACT 2 */
export function ActCut() {
  const { cut } = story;
  return (
    <Act id={2}>
      <Reveal>
        <ActHeading eyebrow={cut.eyebrow} headline={cut.headline} sub={cut.sub} />
      </Reveal>
      <Reveal delay={0.16}>
        <ActLink href={cut.link.href}>{cut.link.label}</ActLink>
      </Reveal>
    </Act>
  );
}

/* ------------------------------------------------------------------ ACT 3 */
export function ActColor() {
  const { color } = story;
  return (
    <Act id={3}>
      <Reveal>
        <ActHeading
          eyebrow={color.eyebrow}
          headline={color.headline}
          sub={color.sub}
        />
      </Reveal>

      {/* The salon's own shade chart, as swatches. */}
      <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-4">
        {color.shades.map((shade, i) => (
          <Reveal as="li" key={shade.name} delay={0.1 + i * 0.06}>
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="block h-7 w-7 rounded-full ring-1 ring-white/25"
                style={{ background: shade.hex }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--act-muted)" }}
              >
                {shade.name}
              </span>
            </span>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.36}>
        <ActLink href={color.link.href}>{color.link.label}</ActLink>
      </Reveal>
    </Act>
  );
}

/* ------------------------------------------------------------------ ACT 4 */
export function ActLength() {
  const { length } = story;
  return (
    <Act id={4}>
      <Reveal>
        <ActHeading
          eyebrow={length.eyebrow}
          headline={length.headline}
          sub={length.sub}
        />
      </Reveal>

      <Reveal delay={0.16}>
        <dl className="mt-9 flex gap-8 border-t border-current/15 pt-6">
          <div>
            <dt className="text-xs uppercase tracking-widest" style={{ color: "var(--act-muted)" }}>
              Lengths
            </dt>
            <dd className="mt-1.5 font-display text-2xl">16″–30″</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest" style={{ color: "var(--act-muted)" }}>
              Methods
            </dt>
            <dd className="mt-1.5 font-display text-2xl">Five</dd>
          </div>
        </dl>
      </Reveal>

      <Reveal delay={0.24}>
        <ActLink href={length.link.href}>{length.link.label}</ActLink>
      </Reveal>
    </Act>
  );
}

/* ------------------------------------------------------------------ ACT 5 */
export function ActCare() {
  const { care } = story;
  return (
    <Act id={5}>
      <Reveal>
        <ActHeading eyebrow={care.eyebrow} headline={care.headline} sub={care.sub} />
      </Reveal>
      <Reveal delay={0.16}>
        <ActLink href={care.link.href}>{care.link.label}</ActLink>
      </Reveal>
    </Act>
  );
}

/* ------------------------------------------------------------------ ACT 6 */
export function ActVisit() {
  const { visit } = story;
  return (
    <Act id={6}>
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
          {visit.eyebrow}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mt-5 text-[2.1rem] leading-[1.08] sm:text-5xl">
          {visit.headline}
        </h2>
      </Reveal>

      <Reveal delay={0.14}>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {visit.sub}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-9 flex flex-col items-center gap-1.5 text-sm text-muted">
          <p className="font-medium text-ink">{brand.address.street}</p>
          <p>
            {brand.address.locality}, {brand.address.region} {brand.address.postalCode}
          </p>
          <p className="mt-2">{brand.hours.display}</p>
        </div>
      </Reveal>

      <Reveal delay={0.28}>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={whatsappLink(bookingMessage)} size="lg" external>
            Book on WhatsApp
            <Arrow />
          </Button>
          <Button href="/visit" size="lg" variant="secondary">
            Find us
          </Button>
        </div>
      </Reveal>
    </Act>
  );
}

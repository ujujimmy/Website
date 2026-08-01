import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { Stars } from "@/components/ui/Stars";
import { Button } from "@/components/ui/Button";
import { PricingTable } from "@/components/pricing/PricingTable";
import { stats, clientLogos, testimonials, caseStudies } from "@/content/proof";
import { processSteps } from "@/content/site";
import { faqs } from "@/content/faq";
import { brand } from "@/content/brand";
import { payableTierIds } from "@/lib/razorpay";

/** Trust bar — placeholder figures until real ones exist. See content/proof.ts. */
export function TrustBar() {
  return (
    <section className="relative border-y border-line bg-ink-2/60 py-10 backdrop-blur-sm">
      <div className="container-page">
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/*
            Reveal's own <div> is the direct child of <dl>. An extra wrapper
            here puts two levels between <dl> and its <dt>/<dd>, which is
            invalid — a definition list allows at most one <div> grouping.
          */}
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.06}
              className="text-center lg:text-left"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <StatCounter
                  value={stat.value}
                  className="block text-3xl font-semibold text-gradient sm:text-4xl"
                />
                <span className="mt-1 block text-xs text-faint">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-10 overflow-hidden border-t border-line pt-8">
          <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-12">
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="whitespace-nowrap text-sm font-medium tracking-wide text-faint"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <Section id="process">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, and you can stop after the first."
          sub="The audit is free and useful on its own. If you decide the rest isn't for you, you still walk away with something you can act on."
          align="center"
          className="mx-auto items-center"
        />

        <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 0.08}>
              <div className="glass relative h-full rounded-[var(--radius-card)] p-7">
                <span className="text-sm font-semibold text-brand-2">
                  {step.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials">
      <div className="container-page">
        <SectionHeading
          eyebrow="What clients say"
          title="The results are all publicly verifiable."
          sub="Reviews, rankings and page speed are things you can check yourself — which is exactly why we lead with them."
          align="center"
          className="mx-auto items-center"
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 0.08}>
              <figure className="glass flex h-full flex-col rounded-[var(--radius-card)] p-7">
                <Stars count={testimonial.rating} />
                <blockquote className="mt-5 grow text-[0.975rem] leading-relaxed text-fg/90">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-5 text-sm">
                  <span className="block font-medium">{testimonial.name}</span>
                  <span className="mt-0.5 block text-xs text-faint">
                    {testimonial.role}, {testimonial.company} ·{" "}
                    {testimonial.location}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function WorkPreview() {
  return (
    <Section id="work">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="What changed, and by how much."
          />
          <Button href="/work" variant="secondary" size="sm">
            All case studies
          </Button>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.08}>
              <Link
                href={`/work#${study.slug}`}
                className="glass group flex h-full flex-col rounded-[var(--radius-card)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-soft/40"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-faint">
                  {study.industry} · {study.location}
                </p>
                <h3 className="mt-3 text-lg font-semibold transition-colors group-hover:text-brand-2">
                  {study.client}
                </h3>
                <p className="mt-3 grow text-sm leading-relaxed text-muted">
                  {study.challenge}
                </p>
                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
                  {study.results.map((result) => (
                    <div key={result.label}>
                      <dt className="sr-only">{result.label}</dt>
                      <dd>
                        <span className="block text-base font-semibold text-brand-2">
                          {result.value}
                        </span>
                        <span className="mt-1 block text-[0.7rem] leading-tight text-faint">
                          {result.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function PricingPreview() {
  return (
    <Section id="pricing">
      <div className="container-page">
        <SectionHeading
          eyebrow="Pricing"
          title="Plain numbers, before you talk to anyone."
          sub="No 'contact us for a quote'. You should be able to work out whether this is worth a conversation in about thirty seconds."
          align="center"
          className="mx-auto items-center"
        />
        <div className="mt-14">
          <PricingTable compact payable={payableTierIds()} />
        </div>
      </div>
    </Section>
  );
}

export function FaqSection({ limit }: { limit?: number }) {
  const items = limit ? faqs.slice(0, limit) : faqs;

  return (
    <Section id="faq">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Questions" title="Answered honestly." />
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Something not covered here?{" "}
            <Link
              href="/contact"
              className="text-brand-2 underline underline-offset-4"
            >
              Ask us directly
            </Link>{" "}
            — we answer every message ourselves.
          </p>
        </div>

        <div className="flex flex-col">
          {items.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.04}>
              <details className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-[0.975rem] font-medium marker:hidden">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-current stroke-[1.8]">
                      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-muted">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** Closing conversion band, used at the bottom of most pages. */
export function ClosingCta({
  title = "Find out what's costing you customers.",
  sub = "A free, written audit of your Google profile, your website and your search visibility. No call required, and it's yours to keep.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <Section className="pb-32">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-linear-to-br from-brand/[0.16] via-surface to-brand-2/[0.1] px-8 py-16 text-center sm:px-16">
            {/* Gradient rather than a blurred circle — same look, no
                rasterisation cost. See ScenePoster. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 60% at 50% 0%, rgba(109,92,246,0.30) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
                {sub}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href={brand.primaryCta.href} size="lg">
                  {brand.primaryCta.label}
                </Button>
                <Button href="/contact" size="lg" variant="secondary">
                  Book a call instead
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

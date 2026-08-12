import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { Button } from "@/components/ui/Button";
import { PricingTable } from "@/components/pricing/PricingTable";
import { testimonials } from "@/content/proof";
import { processSteps } from "@/content/site";
import { faqs } from "@/content/faq";
import { brand } from "@/content/brand";

/*
 * TrustBar and WorkPreview used to live here and have been removed from the
 * homepage. Both were pure duplication:
 *
 * - TrustBar's four figures each already appear elsewhere at full size —
 *   1,800+ and 3.9 → 4.4 in the case study, 92/100 in the Lighthouse
 *   section, and "100% verifiable on Google" restates the case study's own
 *   verification line. Its client-name marquee listed the same three
 *   businesses named directly below it.
 * - WorkPreview re-printed Gangnam's numbers a third time. Its two other
 *   clients now sit inside ProofItWorks, which is where the evidence lives.
 *
 * `stats` and `clientLogos` in content/proof.ts are still exported and still
 * accurate — nothing was deleted from the content layer, so either section
 * can be restored by pasting it back and re-adding it to app/page.tsx.
 */

export function Process() {
  return (
    <Section id="process">
      <div className="container-page">
        {/*
          The sub used to re-pitch the audit ("free and useful on its own…"),
          which the beat above and the closing CTA below both already make.
          Three pitches for one offer inside two screens reads as insecurity,
          so this one now does the job the section is actually for: setting
          expectations about the engagement.
        */}
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, and you can stop after the first."
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
                <p className="mt-2.5 text-base leading-relaxed text-muted">
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
  // Renders nothing until real, permissioned quotes exist. An empty
  // testimonial section is invisible; a fabricated one is a liability.
  if (testimonials.length === 0) return null;

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
          <PricingTable compact />
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
          <p className="mt-6 text-base leading-relaxed text-muted">
            Something not covered here?{" "}
            <Link
              href="/contact"
              className="inline-block min-h-11 py-2 text-brand-2 underline underline-offset-4"
            >
              Ask us directly
            </Link>{" "}
            — we answer every message ourselves.
          </p>
        </div>

        <div className="flex flex-col">
          {items.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.04}>
              <details className="group border-b border-line py-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-3 text-left text-base font-medium marker:hidden">
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
                <p className="mb-4 mt-1 max-w-2xl text-base leading-relaxed text-muted">
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
  // The "no call required / yours to keep" pair is made once, in the audit
  // beat above. Repeating it in the closing band added a third instance of
  // the same three phrases within one page.
  sub = "A free, written audit of your Google profile, your website and your search visibility.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    // data-sticky-stop tells the mobile sticky bar to get out of the way —
    // covering the real CTA with a shortcut to the same page helps nobody.
    <Section className="pb-32" data-sticky-stop>
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

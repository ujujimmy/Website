import Link from "next/link";
import { tiers } from "@/content/tiers";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The three stylist tiers.
 *
 * This is the salon's real pricing structure — every colour and cut is quoted
 * three ways — so showing it up front stops the price list being confusing
 * later. It doubles as the team introduction.
 */
export function TierCards() {
  return (
    <Section tone="cream" id="tiers">
      <SectionHead
        eyebrow="Who does your hair"
        title="Choose your artist."
        sub="Every service is offered at three levels. The difference is experience — the care is the same at all three."
      />

      <ul className="mt-12 grid gap-5 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal as="li" key={tier.id} delay={i * 0.08}>
            <article className="panel flex h-full flex-col">
              <h3 className="text-2xl text-gold-ink">{tier.name}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {tier.strapline}
              </p>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-muted">
                {tier.body}
              </p>
              <p className="mt-6 border-t border-line pt-5 text-sm">
                <span className="font-semibold text-gold-ink">Perfect for: </span>
                <span className="text-muted">{tier.perfectFor}</span>
              </p>
            </article>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10">
        <Link
          href="/team"
          className="link-underline inline-flex items-center gap-2 pb-1 text-sm font-medium text-gold-ink"
        >
          More about the team
        </Link>
      </div>
    </Section>
  );
}

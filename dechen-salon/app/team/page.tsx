import type { Metadata } from "next";
import Link from "next/link";
import { tiers } from "@/content/tiers";
import { founder } from "@/content/founder";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { whatsappLink, serviceMessage } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The team",
  description:
    "DECHEN Salon's three stylist tiers — Top Artist, Creative Artist and Creative Director — and how to choose the right one for what you want done.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="The team"
        title="Three levels, one standard."
        sub="Every service is offered by a Top Artist, a Creative Artist or the Creative Director. The difference is experience — the care, the products and the time you get are the same at all three."
      />

      <Section>
        <ul className="grid gap-5 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal as="li" key={tier.id} delay={i * 0.07}>
              <article className="panel flex h-full flex-col">
                <span
                  className="font-display text-3xl text-rose-deep"
                  aria-hidden="true"
                >
                  {`0${tier.rank}`}
                </span>
                <h2 className="mt-3 text-2xl text-gold-ink">{tier.name}</h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {tier.strapline}
                </p>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-muted">
                  {tier.body}
                </p>
                <p className="mt-6 border-t border-line pt-5 text-sm">
                  <span className="font-semibold text-gold-ink">
                    Perfect for:{" "}
                  </span>
                  <span className="text-muted">{tier.perfectFor}</span>
                </p>
                <a
                  href={whatsappLink(
                    serviceMessage(`an appointment with a ${tier.name}`),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-gold-ink"
                >
                  Book a {tier.name}
                  <Arrow />
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Mentorship — one of the eight pillars, and the reason the tiers exist. */}
      <Section tone="cream">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead
              eyebrow="How the team grows"
              title="Every artist here was taught here."
            />
          </div>
          <div className="flex flex-col gap-5 text-base leading-relaxed text-muted">
            <p>
              Our Creative Artists trained directly under Dechen. That is not a
              detail of scheduling — it is why a Creative Artist&rsquo;s balayage
              and the Creative Director&rsquo;s balayage are the same technique
              at different levels of experience, rather than two different
              services that happen to share a name.
            </p>
            <p>
              We offer inspiration and guidance for Tibetan girls to explore hair
              and beauty as a professional career, and our team members are more
              than stylists — they are role models and educators. Mentorship is
              one of the eight things this salon stands for.
            </p>
            <Link
              href="/about"
              className="link-underline inline-flex items-center gap-2 self-start pb-1 text-sm font-medium text-gold-ink"
            >
              What we stand for
            </Link>
          </div>
        </div>
      </Section>

      {/* Dechen */}
      <section className="px-6 py-20 text-center">
        <p className="eyebrow">{founder.role}</p>
        <h2 className="mt-4 text-3xl sm:text-4xl">{founder.name}</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          {founder.short}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/founder" size="lg">
            Her full story
            <Arrow />
          </Button>
          <Button href="/menu" size="lg" variant="secondary">
            Prices by tier
          </Button>
        </div>
      </section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "The team", path: "/team" },
        ])}
      />
    </>
  );
}

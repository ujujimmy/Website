import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { services, serviceBySlug } from "@/content/services";
import { brand } from "@/content/brand";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { Button } from "@/components/ui/Button";
import { ClosingCta, FaqSection } from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, serviceLd } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.seo.title} — ${brand.name}`,
      description: service.seo.description,
      url: `/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <main>
      <PageHero
        eyebrow={service.name}
        title={service.heading}
        sub={service.subheading}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href={brand.primaryCta.href} size="lg">
            {brand.primaryCta.label}
          </Button>
          <Button href="/pricing" size="lg" variant="secondary">
            See what it costs
          </Button>
        </div>
      </PageHero>

      {/* Outcomes */}
      <section className="border-y border-line bg-ink-2/60 py-10">
        <div className="container-page">
          <dl className="grid gap-8 sm:grid-cols-3">
            {service.outcomes.map((outcome, i) => (
              <Reveal key={outcome.label} delay={i * 0.06}>
                <div>
                  <dt className="sr-only">{outcome.label}</dt>
                  <dd>
                    <StatCounter
                      value={outcome.value}
                      className="block text-3xl font-semibold text-gradient sm:text-4xl"
                    />
                    <span className="mt-1.5 block text-xs text-faint">
                      {outcome.label}
                    </span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* The problem */}
      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="The problem" title={service.problem.heading} />
          <div>
            <p className="text-lg leading-relaxed text-muted">
              {service.problem.body}
            </p>
            <ul className="mt-8 flex flex-col gap-3.5">
              {service.problem.costs.map((cost, i) => (
                <Reveal as="li" key={cost} delay={i * 0.06}>
                  <span className="flex gap-3 text-[0.975rem] leading-relaxed text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger/70"
                    />
                    {cost}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* What you get */}
      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow="What you get"
            title="Exactly what's included."
            sub="No vague retainers. These are the things we actually do every month."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {service.deliverables.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.07}>
                <div className="glass h-full rounded-[var(--radius-card)] p-7">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading eyebrow="How we run it" title="The sequence." />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <Reveal as="li" key={step.step} delay={i * 0.07}>
                <div className="relative h-full border-t border-line pt-6">
                  <span className="text-sm font-semibold text-brand-2">
                    {step.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <p className="mt-12 text-sm text-faint">
              Included in:{" "}
              <span className="text-muted">{service.includedIn.join(", ")}</span>{" "}
              ·{" "}
              <Link
                href="/pricing"
                className="text-brand-2 underline underline-offset-4"
              >
                See pricing
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Other services */}
      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow="Also available"
            title="These work better together."
            sub="Reviews get you compared. A good site converts the comparison. SEO gets you into it in the first place."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {others.map((other, i) => (
              <Reveal key={other.slug} delay={i * 0.07}>
                <Link
                  href={`/services/${other.slug}`}
                  className="glass group flex h-full flex-col rounded-[var(--radius-card)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-soft/40"
                >
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-brand-2">
                    {other.name}
                  </h3>
                  <p className="mt-3 grow text-sm leading-relaxed text-muted">
                    {other.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                    Learn more
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
                      <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <FaqSection limit={5} />
      <ClosingCta />

      <JsonLd data={serviceLd(service.slug)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ])}
      />
    </main>
  );
}

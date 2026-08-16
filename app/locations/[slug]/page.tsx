import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { locations, locationBySlug } from "@/content/locations";
import { serviceBySlug } from "@/content/services";
import { brand } from "@/content/brand";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Scorecard } from "@/components/home/Scorecard";
import { ClosingCta } from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = locationBySlug(slug);
  if (!location) return {};

  const service = serviceBySlug(location.service);
  // industryShort + metaDescription keep the title under ~60 chars and the
  // description under ~155, which is where Google truncates each.
  const title = `${service?.name ?? "Local marketing"} for ${location.industryShort} in ${location.city}`;

  return {
    title,
    description: location.metaDescription,
    alternates: { canonical: `/locations/${location.slug}` },
    openGraph: {
      title: `${title} — ${brand.name}`,
      description: location.metaDescription,
      url: `/locations/${location.slug}`,
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locationBySlug(slug);
  if (!location) notFound();

  const service = serviceBySlug(location.service);
  if (!service) notFound();

  const others = locations.filter((l) => l.slug !== location.slug);

  return (
    <main>
      <PageHero
        eyebrow={`${location.city}, ${location.region}`}
        title={`${service.name} for ${location.industry} in ${location.city}`}
        sub={location.localContext}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Areas we serve", href: "/locations" },
          { name: `${location.city}`, href: `/locations/${location.slug}` },
        ]}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href={brand.primaryCta.href} size="lg">
            Get a free {location.city} audit
          </Button>
          <Button href="/audit/sample" size="lg" variant="secondary">
            See a sample first
          </Button>
        </div>
      </PageHero>

      {/* What's actually going wrong in this market */}
      <Section className="pt-4">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="The problem here"
            title={`What's costing ${location.industry} in ${location.city} customers.`}
          />
          <ul className="flex flex-col gap-4">
            {location.painPoints.map((point, i) => (
              <Reveal as="li" key={point} delay={i * 0.06}>
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
        </div>
      </Section>

      {/* What we do — pulled from the service so there is one source of truth */}
      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we do"
            title={`${service.name}, run properly.`}
            sub={service.subheading}
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

          <Reveal>
            {/* Inline links inside a sentence: WCAG 2.5.8 exempts these from the
                44px target rule, since padding them would wreck the line
                spacing of the prose they sit in. The sentence was 14px
                though, which is a readability problem of its own. */}
            <p className="mt-10 text-base text-faint">
              Full detail on{" "}
              <Link
                href={`/services/${service.slug}`}
                className="text-brand-2 underline underline-offset-4"
              >
                how {service.name.toLowerCase()} works
              </Link>{" "}
              ·{" "}
              <Link
                href="/pricing"
                className="text-brand-2 underline underline-offset-4"
              >
                pricing
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* The scores are the same proof wherever you're reading from. */}
      <Scorecard />

      {/* Internal linking: the whole point of a location cluster */}
      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow="Other areas"
            title={`Not in ${location.city}?`}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {others.map((other, i) => (
              <Reveal key={other.slug} delay={i * 0.06}>
                <Link
                  href={`/locations/${other.slug}`}
                  className="glass group flex h-full flex-col rounded-[var(--radius-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-soft/40"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-faint">
                    {other.city}, {other.country}
                  </p>
                  <h3 className="mt-2 text-base font-semibold transition-colors group-hover:text-brand-2">
                    {serviceBySlug(other.service)?.name} for {other.industry}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* This page's own questions, not the site-wide list. Repeating the
          generic FAQ made four supposedly distinct pages read as one
          template. */}
      <Section className="border-t border-line">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Questions"
            title={`${location.city}, specifically.`}
          />
          <div className="flex flex-col">
            {location.faqs.map((faq, i) => (
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
                  <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <ClosingCta
        title={`Find out where you stand in ${location.city}.`}
        sub={`A free written audit: your Google profile against your three closest ${location.city} competitors, your site's speed, and the searches you're missing. No call required.`}
      />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Areas we serve", href: "/locations" },
          { name: location.city, href: `/locations/${location.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: location.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${service.name} for ${location.industry} in ${location.city}`,
          description: location.metaDescription,
          url: `${brand.url}/locations/${location.slug}`,
          provider: { "@id": `${brand.url}/#organization` },
          areaServed: {
            "@type": "City",
            name: location.city,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: `${location.region}, ${location.country}`,
            },
          },
        }}
      />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { locations } from "@/content/locations";
import { serviceBySlug } from "@/content/services";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ClosingCta } from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Areas We Serve",
  description:
    "Google review management, web design and local SEO by city and industry — the United States, Canada, the United Kingdom and India.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  const byCountry = locations.reduce<Record<string, typeof locations>>(
    (acc, location) => {
      (acc[location.country] ??= []).push(location);
      return acc;
    },
    {},
  );

  return (
    <main>
      <PageHero
        eyebrow="Areas we serve"
        title="Local search is local. So are these pages."
        sub="Each page below targets one city and one trade, because that's how people actually search — and it's the same approach we'd use to get you found."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Areas we serve", href: "/locations" },
        ]}
      />

      <Section className="pt-0">
        <div className="container-page flex flex-col gap-14">
          {Object.entries(byCountry).map(([country, entries]) => (
            <div key={country}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                {country}
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {entries.map((location, i) => {
                  const service = serviceBySlug(location.service);
                  return (
                    <Reveal key={location.slug} delay={i * 0.06}>
                      <Link
                        href={`/locations/${location.slug}`}
                        className="glass group flex h-full flex-col rounded-[var(--radius-card)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-soft/40"
                      >
                        <p className="text-xs uppercase tracking-[0.14em] text-faint">
                          {location.city}, {location.region}
                        </p>
                        <h3 className="mt-3 text-lg font-semibold transition-colors group-hover:text-brand-2">
                          {service?.name} for {location.industry}
                        </h3>
                        <p className="mt-3 grow text-sm leading-relaxed text-muted">
                          {location.localContext}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 border-t border-line pt-5 text-sm font-medium">
                          Read more
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
                            <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}

          <Reveal>
            <p className="rounded-[var(--radius-card)] border border-line bg-ink-2/60 p-7 text-base leading-relaxed text-muted">
              Don&apos;t see your city? These pages exist for the markets we
              know well enough to say something useful about. If yours
              isn&apos;t here we can still help —{" "}
              <Link href="/audit" className="text-brand-2 underline underline-offset-4">
                start with a free audit
              </Link>{" "}
              and we&apos;ll tell you honestly whether we&apos;re a fit.
            </p>
          </Reveal>
        </div>
      </Section>

      <ClosingCta />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Areas we serve", href: "/locations" },
        ])}
      />
    </main>
  );
}

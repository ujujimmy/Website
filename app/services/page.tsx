import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ClosingCta } from "@/components/home/Supporting";
import { processSteps } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Google review management, conversion-focused web design, and local SEO for businesses in the US, Canada and the UK.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Three services, one outcome: more customers choose you."
        sub="They're sold separately because not every business needs all three. Most need two."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      <Section className="pt-0">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.08}>
              <Link
                href={`/services/${service.slug}`}
                className="glass group flex h-full flex-col rounded-[var(--radius-card)] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-soft/40"
              >
                <h2 className="text-xl font-semibold transition-colors group-hover:text-brand-2">
                  {service.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {service.blurb}
                </p>

                <ul className="mt-7 grow flex-col gap-2.5">
                  {service.deliverables.map((item) => (
                    <li
                      key={item.title}
                      className="flex gap-2.5 py-1 text-sm text-muted"
                    >
                      <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-brand-2 stroke-[2.2]" aria-hidden="true">
                        <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item.title}
                    </li>
                  ))}
                </ul>

                <span className="mt-8 inline-flex items-center gap-2 border-t border-line pt-6 text-sm font-medium">
                  How it works
                  <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden="true">
                    <path d="M4 10h11M11 5.5L15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="The same process, whichever you pick."
            align="center"
            className="mx-auto items-center"
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.step} delay={i * 0.07}>
                <div className="glass h-full rounded-[var(--radius-card)] p-7">
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
        </div>
      </Section>

      <ClosingCta />
    </main>
  );
}

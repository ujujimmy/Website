import type { Metadata } from "next";
import { caseStudies, testimonials } from "@/content/proof";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { StatCounter } from "@/components/ui/StatCounter";
import { ClosingCta } from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Work & Results",
  description:
    "Case studies showing review growth, site speed improvements and local search rankings for real local businesses.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main>
      <PageHero
        eyebrow="Work"
        title="What changed, and by how much."
        sub="Every number below is something you could verify yourself — a rating, a ranking, a page speed score. That's deliberate."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Work", href: "/work" },
        ]}
      />

      <Section className="pt-0">
        <div className="container-page flex flex-col gap-8">
          {caseStudies.map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.06}>
              <article
                id={study.slug}
                className="glass scroll-mt-28 rounded-[var(--radius-card)] p-8 sm:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-faint">
                      {study.industry} · {study.location} · {study.duration}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                      {study.client}
                    </h2>

                    <h3 className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">
                      The problem
                    </h3>
                    <p className="mt-2.5 leading-relaxed text-muted">
                      {study.challenge}
                    </p>

                    <h3 className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">
                      What we did
                    </h3>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {study.approach.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-relaxed text-muted"
                        >
                          <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-brand-2 stroke-[2.2]" aria-hidden="true">
                            <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {study.services.map((service) => (
                        <li
                          key={service}
                          className="rounded-full border border-line px-3 py-1 text-xs text-faint"
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-line bg-ink-2/70 p-7">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                      {study.results.length > 0 ? "Results" : "Check it yourself"}
                    </h3>
                    {study.results.length === 0 && (
                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {study.verifiable ??
                          "This campaign's numbers weren't recorded. We'd rather say so than invent one."}
                      </p>
                    )}
                    <dl className="mt-6 flex flex-col gap-7">
                      {study.results.map((result) => (
                        <div key={result.label}>
                          <dt className="sr-only">{result.label}</dt>
                          <dd>
                            <StatCounter
                              value={result.value}
                              className="block text-3xl font-semibold text-gradient"
                            />
                            <span className="mt-1 block text-xs text-faint">
                              {result.label}
                            </span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {study.results.length > 0 && study.verifiable && (
                      <p className="mt-7 border-t border-line pt-5 text-xs leading-relaxed text-faint">
                        {study.verifiable}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Hidden entirely until real, permissioned quotes exist. */}
      {testimonials.length > 0 && (
      <Section className="border-t border-line pt-24">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 0.07}>
              <figure className="glass flex h-full flex-col rounded-[var(--radius-card)] p-7">
                <Stars count={testimonial.rating} />
                <blockquote className="mt-5 grow text-[0.95rem] leading-relaxed text-fg/90">
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
      </Section>
      )}

      <ClosingCta
        title="Your business could be the next one on this page."
        sub="Start with the free audit — it shows you the same gap analysis we run before taking on any of the clients above."
      />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Work", href: "/work" },
        ])}
      />
    </main>
  );
}

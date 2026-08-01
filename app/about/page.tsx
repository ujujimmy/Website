import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FaqSection, ClosingCta } from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `${brand.name} is a remote-first agency helping local businesses in the US, Canada, the UK and India win on Google.`,
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "We say what we won't do",
    body: "We don't buy reviews, we don't promise a #1 ranking by next month, and we don't sell you a rebuild when your site only needs fixing. Anyone promising otherwise is either lying or about to get your profile suspended.",
  },
  {
    title: "You own everything",
    body: "Domain, code, content, Google Business Profile, analytics — all created in your name. Leaving should cost you nothing but the notice period, which is the only honest way to sell a monthly service.",
  },
  {
    title: "Reporting on leads, not vanity",
    body: "Impressions and 'engagement' are easy to make look good. We report on reviews, rankings, calls and form fills, because those are the only things that pay you.",
  },
  {
    title: "Plain English, always",
    body: "You should never finish a call with us unsure what you just agreed to. If an explanation needs jargon, it's usually hiding something.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About"
        title="A small team that does the unglamorous work properly."
        sub={`${brand.name} helps local service businesses get found, get chosen and get contacted. We're remote-first, we work your hours, and we'd rather earn next month than lock you into a year.`}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      {/* The offshore question, answered directly rather than avoided. */}
      <Section className="pt-4">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="The obvious question"
            title="Yes, we're based overseas. Here's why that's in your favour."
          />
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-muted">
            <p>
              We're based in Delhi, and that's where our clients are today.
              We're set up to work with businesses in the United States, Canada
              and the United Kingdom. You were going to wonder about it, so
              let's deal with it directly.
            </p>
            <p>
              What it means in practice: you get senior attention at a fraction
              of what a US agency charges, because our costs are lower — not
              because the work is thinner. We keep US Eastern and Pacific hours
              for calls, we put things in writing so nothing depends on catching
              someone at the right moment, and every result we produce is
              publicly verifiable.
            </p>
            <p>
              That last part matters most, and it cuts both ways. Look up
              Gangnam Korean Restaurant in Delhi and check its rating and review
              count against what we claim on this site. Do the same with your
              own listing once we start. You never have to take our word for
              anything.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow="How we work"
            title="Four things we hold to."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.07}>
                <div className="glass h-full rounded-[var(--radius-card)] p-7">
                  <h3 className="text-lg font-semibold">{principle.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                    {principle.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="container-page">
          <SectionHeading eyebrow="Practicalities" title="The boring details." />
          <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { term: "Working hours", desc: brand.hours },
              { term: "Where we work", desc: brand.locations.join(" · ") },
              { term: "Contracts", desc: "Month to month, 30 days notice" },
              { term: "Payment", desc: "Card, bank transfer or Wise, in USD" },
            ].map((item, i) => (
              // Reveal's <div> is the direct child of <dl>; a second wrapper
              // here would make the definition list invalid.
              <Reveal
                key={item.term}
                delay={i * 0.06}
                className="border-t border-line pt-5"
              >
                <dt className="text-xs uppercase tracking-[0.14em] text-faint">
                  {item.term}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </Section>

      <FaqSection limit={5} />
      <ClosingCta />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />
    </main>
  );
}

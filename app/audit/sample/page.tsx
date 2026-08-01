import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { brand } from "@/content/brand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sample Audit",
  description:
    "See exactly what the free audit looks like before you request one — a worked example covering Google profile, website speed and missed searches.",
  alternates: { canonical: "/audit/sample" },
};

/**
 * A worked example of the audit deliverable.
 *
 * The business here is invented, and the page says so twice — in a banner at
 * the top and again at the bottom. That matters: a fabricated audit presented
 * as a real client's data would be exactly the kind of thing that destroys
 * trust if anyone checked.
 *
 * TODO(audit): if you generate audits with a tool, swap these figures for a
 * genuine export with the client's name removed. A real redacted audit is
 * more convincing than a constructed example.
 */
const example = {
  business: "Example Dental (a made-up business)",
  location: "Austin, TX",
  profile: {
    rating: 3.9,
    reviews: 31,
    responded: "4 of 31",
    competitors: [
      { name: "Competitor A", rating: 4.8, reviews: 312, position: 1 },
      { name: "Competitor B", rating: 4.7, reviews: 198, position: 2 },
      { name: "Competitor C", rating: 4.5, reviews: 96, position: 3 },
      { name: "Example Dental", rating: 3.9, reviews: 31, position: 9 },
    ],
  },
  site: [
    { metric: "Mobile load time", value: "6.4s", verdict: "bad", note: "Over half of mobile visitors leave before this finishes" },
    { metric: "Lighthouse performance", value: "38", verdict: "bad", note: "Google's own speed grade, out of 100" },
    { metric: "Mobile-friendly", value: "Partial", verdict: "warn", note: "Booking form unusable below 400px wide" },
    { metric: "Page titles", value: "Missing on 6 pages", verdict: "warn", note: "Search engines have nothing to show in results" },
  ],
  keywords: [
    { term: "emergency dentist austin", volume: "1,900/mo", you: "Not ranking", who: "Competitor A" },
    { term: "teeth whitening austin", volume: "880/mo", you: "Page 3", who: "Competitor B" },
    { term: "dental implants near me", volume: "720/mo", you: "Not ranking", who: "Competitor A" },
    { term: "invisalign austin cost", volume: "480/mo", you: "Page 4", who: "Competitor C" },
  ],
  priorities: [
    "Fix the mobile booking form — it's the single biggest leak, and it's a one-day job",
    "Respond to all 31 existing reviews, starting with the three negatives",
    "Turn on review requests: at current footfall this profile should be gaining 25–40 reviews a month, not 2",
    "Add page titles and descriptions across the site before doing any content work",
  ],
};

const verdictColor = {
  bad: "text-danger",
  warn: "text-gold",
  good: "text-success",
} as const;

export default function SampleAuditPage() {
  return (
    <main>
      <PageHero
        eyebrow="Sample audit"
        title="This is exactly what you get."
        sub="No email required to look. Below is a complete worked example, in the same format we'd send you — so you know what's coming before you ask for one."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Free audit", href: "/audit" },
          { name: "Sample", href: "/audit/sample" },
        ]}
      />

      <Section className="pt-0">
        <div className="container-page">
          {/* Stated plainly and early — this is not a real client's data. */}
          <Reveal>
            <p className="rounded-xl border border-gold/30 bg-gold/[0.06] p-4 text-sm leading-relaxed text-muted">
              <strong className="text-fg">This is an example, not a real client.</strong>{" "}
              &ldquo;Example Dental&rdquo; and every figure below are invented to
              show the format. Your audit contains your real numbers.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-6">
            {/* 1 — Google profile */}
            <Reveal>
              <section className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">
                  Section 1
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Your Google profile vs. your competitors
                </h2>

                <div className="mt-7 overflow-x-auto">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-faint">
                        <th scope="col" className="pb-3 font-medium">Business</th>
                        <th scope="col" className="pb-3 font-medium">Rating</th>
                        <th scope="col" className="pb-3 font-medium">Reviews</th>
                        <th scope="col" className="pb-3 font-medium">Map position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {example.profile.competitors.map((row) => {
                        const isYou = row.name === "Example Dental";
                        return (
                          <tr
                            key={row.name}
                            className={`border-b border-line/60 ${isYou ? "bg-danger/[0.07]" : ""}`}
                          >
                            <td className={`py-3 ${isYou ? "font-semibold text-fg" : "text-muted"}`}>
                              {row.name}
                              {isYou && (
                                <span className="ml-2 rounded-full bg-danger/20 px-2 py-0.5 text-[0.65rem] text-danger">
                                  You
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              <span className="flex items-center gap-2 tabular-nums">
                                {row.rating.toFixed(1)}
                                <Stars count={Math.round(row.rating)} size={11} />
                              </span>
                            </td>
                            <td className="py-3 tabular-nums text-muted">{row.reviews}</td>
                            <td className={`py-3 tabular-nums ${isYou ? "text-danger" : "text-muted"}`}>
                              #{row.position}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-muted">
                  You&apos;re ninth on the search that matters most, with a
                  rating below the 4.0 mark where most people stop considering a
                  business. Only {example.profile.responded} reviews have a
                  reply, and every reply is public — future customers read them.
                </p>
              </section>
            </Reveal>

            {/* 2 — Website */}
            <Reveal delay={0.06}>
              <section className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">
                  Section 2
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Website speed &amp; technical check
                </h2>

                <dl className="mt-7 flex flex-col gap-5">
                  {example.site.map((row) => (
                    <div
                      key={row.metric}
                      className="flex flex-col gap-1 border-b border-line/60 pb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <dt className="text-sm font-medium">{row.metric}</dt>
                      <dd className="flex items-baseline gap-4 sm:text-right">
                        <span className={`text-lg font-semibold tabular-nums ${verdictColor[row.verdict as keyof typeof verdictColor]}`}>
                          {row.value}
                        </span>
                        <span className="max-w-xs text-xs leading-relaxed text-faint">
                          {row.note}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>

            {/* 3 — Keywords */}
            <Reveal delay={0.12}>
              <section className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">
                  Section 3
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  The searches you&apos;re missing
                </h2>

                <div className="mt-7 overflow-x-auto">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-faint">
                        <th scope="col" className="pb-3 font-medium">Search</th>
                        <th scope="col" className="pb-3 font-medium">Monthly</th>
                        <th scope="col" className="pb-3 font-medium">You</th>
                        <th scope="col" className="pb-3 font-medium">Who gets it</th>
                      </tr>
                    </thead>
                    <tbody>
                      {example.keywords.map((row) => (
                        <tr key={row.term} className="border-b border-line/60">
                          <td className="py-3 font-medium">{row.term}</td>
                          <td className="py-3 tabular-nums text-muted">{row.volume}</td>
                          <td className="py-3 text-danger">{row.you}</td>
                          <td className="py-3 text-muted">{row.who}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </Reveal>

            {/* 4 — What to do */}
            <Reveal delay={0.18}>
              <section className="rounded-[var(--radius-card)] border border-brand/30 bg-brand/[0.07] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">
                  Section 4
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  What we&apos;d fix first
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  In order. You can do all of this yourself — the audit is yours
                  to keep whether or not you hire us.
                </p>
                <ol className="mt-6 flex flex-col gap-4">
                  {example.priorities.map((item, i) => (
                    <li key={item} className="flex gap-4">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/25 text-xs font-semibold text-brand-soft">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-fg/90">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-12 rounded-[var(--radius-card)] border border-line bg-ink-2/60 p-7 text-center sm:p-9">
              <h2 className="text-xl font-semibold">
                Want this for your business?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
                Same format, your real numbers, written by a person. Back within
                two business days, and no call required to get it.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/audit" size="lg">
                  {brand.primaryCta.label}
                </Button>
                <Button href="/pricing" size="lg" variant="secondary">
                  See pricing first
                </Button>
              </div>
              <p className="mt-6 text-xs text-faint">
                Reminder: the business above is invented. Yours will contain
                your own data.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Free audit", href: "/audit" },
          { name: "Sample", href: "/audit/sample" },
        ])}
      />
    </main>
  );
}

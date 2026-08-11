import Link from "next/link";
import { headlineResult, caseStudies } from "@/content/proof";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * A star row filled to a fractional rating.
 *
 * Two identical rows stacked, with the gold one clipped to `rating / 5` — the
 * same technique as the intro loader. Rounding to whole stars would erase the
 * entire point of this section, which is a 0.5-star difference.
 */
function RatingStars({
  rating,
  tone,
}: {
  rating: number;
  tone: "before" | "after";
}) {
  const pct = (rating / 5) * 100;
  const fill = tone === "after" ? "var(--color-gold)" : "var(--color-faint)";

  const Row = ({ filled }: { filled: boolean }) => (
    <svg
      viewBox="0 0 132 24"
      className="block h-6 w-[8.25rem]"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${i * 27}, 0)`}
          d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35 6.19 20.4l1.11-6.47L2.6 9.35l6.5-.95L12 2.5z"
          fill={filled ? fill : "none"}
          stroke={filled ? "none" : "var(--color-line)"}
          strokeWidth={filled ? 0 : 1.5}
        />
      ))}
    </svg>
  );

  return (
    <span className="relative inline-block" role="img" aria-label={`${rating} out of 5 stars`}>
      <Row filled={false} />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <Row filled />
      </span>
    </span>
  );
}

function RatingBlock({
  rating,
  label,
  tone,
}: {
  rating: number;
  label: string;
  tone: "before" | "after";
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs uppercase tracking-[0.16em] text-faint">
        {label}
      </span>
      <span
        className={cn(
          "text-5xl font-semibold tabular-nums sm:text-6xl",
          tone === "after" ? "text-gold" : "text-faint",
        )}
      >
        {rating.toFixed(1)}
      </span>
      <RatingStars rating={rating} tone={tone} />
    </div>
  );
}

/**
 * "Proof it works" — the homepage's single proof section.
 *
 * Software vendors in this space lean on aggregate stats across thousands of
 * accounts. We have one campaign with recorded before/after numbers, so this
 * shows that one at full size rather than averaging a client base we don't
 * have — and leans on the thing aggregate data can't offer: the visitor can
 * open the listing and check it in ten seconds.
 *
 * This absorbed the old "Selected work" grid. That grid re-printed Gangnam's
 * 3.9 → 4.4 and 1,800+ a second time, a few hundred pixels below the panel
 * that already showed them at full size — which reads as padding rather than
 * evidence. The headline campaign now appears once, and the other two clients
 * sit under it as what they actually are: real names you can look up, with no
 * recorded numbers to show.
 */
export function ProofItWorks() {
  const r = headlineResult;
  const others = caseStudies.filter((c) => c.client !== r.client);

  return (
    <Section id="proof" className="border-t border-line">
      <div className="container-page">
        <SectionHeading
          eyebrow="Proof it works"
          title="A half-star doesn't sound like much. It changed everything."
          sub="Below 4.0, most people filter you out before reading a single word. This is one real campaign, with the numbers we actually recorded."
          align="center"
          className="mx-auto items-center"
        />

        <Reveal>
          <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-line bg-linear-to-br from-gold/[0.07] via-surface/60 to-transparent p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(46% 60% at 78% 12%, rgba(255,194,75,0.14) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <p className="text-xs uppercase tracking-[0.16em] text-faint">
                {r.industry} · {r.location} · {r.duration}
              </p>
              <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
                {r.client}
              </h3>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                {r.summary}
              </p>

              {/* Before → after */}
              <div className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:gap-14">
                <RatingBlock
                  rating={r.before.rating}
                  label={r.before.label}
                  tone="before"
                />

                <span
                  aria-hidden="true"
                  className="hidden shrink-0 pb-6 text-brand-soft sm:block"
                >
                  <svg viewBox="0 0 40 20" className="h-6 w-10 fill-none stroke-current stroke-[1.6]">
                    <path d="M2 10h33M28 3.5L35.5 10 28 16.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>

                <RatingBlock
                  rating={r.after.rating}
                  label={r.after.label}
                  tone="after"
                />

                <div className="flex flex-col gap-3 sm:ml-auto">
                  <span className="text-xs uppercase tracking-[0.16em] text-faint">
                    {r.reviewsLabel}
                  </span>
                  <StatCounter
                    value={r.reviews}
                    className="text-5xl font-semibold text-gradient tabular-nums sm:text-6xl"
                  />
                </div>
              </div>

              {/* The part a software vendor's aggregate stats can't offer. */}
              <div className="mt-12 border-t border-line pt-8">
                <p className="max-w-xl text-base leading-relaxed text-muted">
                  <span className="font-medium text-fg">
                    Don&apos;t take our word for it.
                  </span>{" "}
                  {r.verify}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/*
          The other two clients. No invented metrics — where a campaign's
          numbers weren't recorded, the services are shown instead, and the
          copy says plainly that's why.
        */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {others.map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.08}>
              <Link
                href={`/work#${study.slug}`}
                className="glass group flex h-full flex-col rounded-[var(--radius-card)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-soft/40"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-faint">
                  {study.industry} · {study.location}
                </p>
                <h3 className="mt-3 text-lg font-semibold transition-colors group-hover:text-brand-2">
                  {study.client}
                </h3>
                <p className="mt-3 grow text-base leading-relaxed text-muted">
                  {study.challenge}
                </p>
                <p className="mt-6 border-t border-line pt-5 text-xs uppercase tracking-[0.14em] text-faint">
                  {study.services.join(" · ")}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <p className="max-w-2xl text-sm leading-relaxed text-faint">
              We didn&apos;t record before-and-after numbers on these two.
              Rather than estimate them, we&apos;ve left them blank — the
              listings are public either way.
            </p>
            <Button href="/work" variant="secondary" size="sm">
              All case studies
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

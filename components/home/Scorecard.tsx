import { lighthouse } from "@/content/proof";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { TestThisPage } from "@/components/home/TestThisPage";

/** Google's own banding: 90+ green, 50–89 amber, below 50 red. */
function band(value: number) {
  if (value >= 90) return "var(--color-success)";
  if (value >= 50) return "var(--color-gold)";
  return "var(--color-danger)";
}

function Dial({
  value,
  label,
  blurb,
}: {
  value: number;
  label: string;
  blurb: string;
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const color = band(value);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="5"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            transform="rotate(-90 44 44)"
          />
        </svg>
        <span
          className="absolute inset-0 grid place-items-center text-xl font-semibold tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <span className="mt-3 text-sm font-medium">{label}</span>
      <span className="mt-0.5 text-xs text-faint">{blurb}</span>
    </div>
  );
}

/**
 * The site's own Lighthouse scores, used as proof.
 *
 * This is the only claim on the site a prospect can verify in ten seconds
 * without taking anyone's word for it — which is exactly why it belongs here.
 * The second button deliberately sends them to test their OWN site: for most
 * local businesses that number comes back poor, and the gap does the selling.
 */
export function Scorecard() {
  return (
    <Section id="scorecard" className="border-t border-line">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Proof you can check yourself"
              title="Google scores this page 92 out of 100."
              sub="Every other number here you'd have to take our word for; this one you don't — it's Google's own test and it takes ten seconds. Run it on this page, then run it on yours."
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TestThisPage />
              <Button
                href="https://pagespeed.web.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Now test your site
              </Button>
            </div>
          </div>

          <Reveal>
            <div className="glass rounded-[var(--radius-card)] p-8 sm:p-10">
              <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {lighthouse.scores.map((score) => (
                  <div key={score.label}>
                    <dt className="sr-only">{score.label}</dt>
                    <dd>
                      <Dial
                        value={score.value}
                        label={score.label}
                        blurb={score.blurb}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
              {/* Provenance stays — a score without its test conditions is
                  not a checkable claim. The old trailing "run it yourself and
                  see" was the third invitation to do so on one screen. */}
              <p className="mt-8 border-t border-line pt-5 text-xs leading-relaxed text-faint">
                Google Lighthouse, {lighthouse.context}. Measured{" "}
                {lighthouse.measuredOn}.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tiers } from "@/content/pricing";
import { brand } from "@/content/brand";
import { formatPrice } from "@/lib/format";
import { planIdFor, credentials, isLiveMode } from "@/lib/razorpay";
import { SubscribeForm } from "@/components/checkout/SubscribeForm";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Start your plan",
  description: "Set up your monthly plan and payment mandate.",
  // A checkout page has no business in search results.
  robots: { index: false, follow: false },
};

/** Reads server-only env, so it can never be statically rendered. */
export const dynamic = "force-dynamic";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const tier = tiers.find((t) => t.id === plan);

  // No plan in the URL is a broken link, not a form to guess at.
  if (!tier) notFound();

  const configured = Boolean(credentials() && planIdFor(tier.id));
  const setup = tier.setup?.INR ?? 0;
  const firstCharge = tier.price.INR + setup;

  return (
    <main className="pb-28 pt-36 sm:pt-44">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <Eyebrow>Checkout</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Start the {tier.name} plan.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {tier.audience}
          </p>

          <div className="glass mt-10 rounded-[var(--radius-card)] p-7">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-2">
              What you&apos;ll be charged
            </h2>

            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{tier.name}, monthly</dt>
                <dd className="tabular-nums">
                  {formatPrice(tier.price.INR, "INR")}
                </dd>
              </div>
              {setup > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">One-time setup</dt>
                  <dd className="tabular-nums">{formatPrice(setup, "INR")}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-line pt-3 font-semibold">
                <dt>Charged today</dt>
                <dd className="tabular-nums">
                  {formatPrice(firstCharge, "INR")}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-faint">
                <dt>Every month after</dt>
                <dd className="tabular-nums">
                  {formatPrice(tier.price.INR, "INR")}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-xs leading-relaxed text-faint">
              Billed in Indian rupees. Prices are set per market — if you&apos;d
              rather be invoiced in USD,{" "}
              <Link
                href="/contact"
                className="text-brand-2 underline underline-offset-4"
              >
                talk to us
              </Link>{" "}
              and we&apos;ll arrange it.
            </p>
          </div>

          <ul className="mt-8 flex flex-col gap-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm text-muted">
                <svg
                  viewBox="0 0 20 20"
                  className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-brand-2 stroke-[2.2]"
                  aria-hidden="true"
                >
                  <path
                    d="M4.5 10.5l3.5 3.5 7.5-8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-faint">
            Not ready to commit?{" "}
            <Link
              href="/audit"
              className="text-brand-2 underline underline-offset-4"
            >
              Get the free audit first
            </Link>
            .
          </p>
        </div>

        {configured ? (
          <SubscribeForm tier={tier} testMode={!isLiveMode()} />
        ) : (
          <PaymentsUnavailable tierName={tier.name} />
        )}
      </div>
    </main>
  );
}

/**
 * Shown when Razorpay keys or this tier's plan ID aren't set. The page still
 * has to convert, so it routes to a human rather than dead-ending.
 */
function PaymentsUnavailable({ tierName }: { tierName: string }) {
  return (
    <div className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
      <h2 className="text-xl font-semibold">Let&apos;s set this up manually</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Online payment for {tierName} isn&apos;t switched on yet. Email us and
        we&apos;ll send an invoice with a payment link the same day — the plan
        and the price are exactly as listed.
      </p>

      <div className="mt-7 flex flex-col gap-3">
        <Button href={`mailto:${brand.contact.email}?subject=${encodeURIComponent(`${tierName} plan`)}`}>
          Email {brand.contact.email}
        </Button>
        <Button href="/contact" variant="secondary">
          Use the contact form
        </Button>
      </div>
    </div>
  );
}

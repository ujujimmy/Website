"use client";

import { tiers, pricingAssurances } from "@/content/pricing";
import { useCurrency, formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

function CurrencySwitcher({
  currency,
  onChange,
}: {
  currency: "USD" | "INR";
  onChange: (c: "USD" | "INR") => void;
}) {
  return (
    <div
      className="glass inline-flex rounded-full p-1"
      role="group"
      aria-label="Currency"
    >
      {(["USD", "INR"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-pressed={currency === c}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
            currency === c
              ? "bg-linear-to-r from-brand to-brand-2 text-ink"
              : "text-muted hover:text-fg",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export function PricingTable({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency, ready } = useCurrency();

  return (
    <div>
      <div className="flex justify-center">
        <CurrencySwitcher currency={currency} onChange={setCurrency} />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.id} delay={i * 0.08}>
            <div
              className={cn(
                "relative flex h-full flex-col rounded-[var(--radius-card)] p-7 sm:p-8",
                tier.featured
                  ? "bg-linear-to-b from-brand/[0.14] to-transparent ring-1 ring-brand/40"
                  : "glass",
              )}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-linear-to-r from-brand to-brand-2 px-3 py-1 text-[0.7rem] font-semibold text-ink">
                  Most popular
                </span>
              )}

              <h3 className="text-xl font-semibold">{tier.name}</h3>
              <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-muted">
                {tier.audience}
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span
                  className={cn(
                    "text-4xl font-semibold tabular-nums transition-opacity",
                    !ready && "opacity-0",
                  )}
                >
                  {formatPrice(tier.price[currency], currency)}
                </span>
                <span className="mb-1.5 text-sm text-faint">{tier.cadence}</span>
              </div>
              <p className="mt-2 min-h-[1.25rem] text-xs text-faint">
                {tier.setup
                  ? `+ ${formatPrice(tier.setup[currency], currency)} one-time setup`
                  : "No setup fee"}
              </p>

              <Button
                href={tier.cta.href}
                variant={tier.featured ? "primary" : "secondary"}
                className="mt-7 w-full"
              >
                {tier.cta.label}
              </Button>

              <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-7">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-muted">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-brand-2 stroke-[2.2]" aria-hidden="true">
                      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
                {!compact &&
                  tier.excludes?.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-faint line-through decoration-line"
                    >
                      <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-faint stroke-[2]" aria-hidden="true">
                        <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {currency === "INR" && (
        <p className="mt-6 text-center text-xs text-faint">
          Indian pricing shown. Rates are set per market, not converted.
        </p>
      )}

      {!compact && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingAssurances.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="glass h-full rounded-2xl p-6">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

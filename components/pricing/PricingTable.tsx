"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tiers, pricingAssurances } from "@/content/pricing";
import { useCurrency, formatPrice } from "@/lib/currency";
import { SubscribeButton } from "@/components/pricing/SubscribeButton";
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
            // min-h-11 / min-w-11: this was a 28px-tall control, well under
            // the 44px tap-target floor, and it switches the page's prices.
            "min-h-11 min-w-11 rounded-full px-5 text-sm font-medium transition-all",
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

/**
 * Dot indicators for the mobile carousel.
 *
 * Buttons rather than dots-as-decoration: on a narrow screen the swipe is
 * discoverable but the count isn't, and tapping is a legitimate way to move
 * between four tiers. Each is 44x44 with the visible dot drawn inside.
 */
function CarouselDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-6 flex justify-center sm:hidden">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show plan ${i + 1} of ${count}`}
          aria-current={i === active}
          className="grid h-11 w-11 place-items-center"
        >
          <span
            className={cn(
              "block h-2 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-brand-2" : "w-2 bg-line",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function PricingTable({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  const trackRef = useRef<HTMLDivElement>(null);
  const featuredIndex = Math.max(
    0,
    tiers.findIndex((t) => t.featured),
  );
  const [active, setActive] = useState(featuredIndex);

  /** Centre a card in the scroll track. */
  const scrollTo = useCallback((i: number, smooth: boolean) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    // The global reduced-motion rule only reaches CSS animations and
    // transitions; a scripted smooth scroll has to opt out on its own.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: smooth && !reduce ? "smooth" : "auto",
    });
  }, []);

  /*
   * Open on the featured tier rather than the cheapest. Four stacked cards
   * meant "Complete Growth System" — the one the pricing is built around —
   * sat four screens below where pricing began. Jumping without animation on
   * mount keeps this off the CLS budget: horizontal scroll isn't layout
   * shift, but a smooth scroll would be visible work during load.
   */
  useEffect(() => {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    scrollTo(featuredIndex, false);
  }, [featuredIndex, scrollTo]);

  /**
   * Track which card is centred, for the dots.
   *
   * This ran on every scroll frame and read `offsetLeft` / `offsetWidth` /
   * `clientWidth` off all four cards to find the nearest one. Reading those
   * forces the browser to flush layout synchronously — during a swipe, on
   * the one interaction that has to stay at 60fps. That is textbook scroll
   * jank and it was self-inflicted.
   *
   * IntersectionObserver against the track gives the same answer for free:
   * it fires only when a card actually crosses a visibility threshold, does
   * its work off the main thread, and reads no layout at all.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio);
        let best = 0;
        let bestRatio = -1;
        [...track.children].forEach((card, i) => {
          const r = ratios.get(card) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        setActive(best);
      },
      { root: track, threshold: [0.25, 0.5, 0.75, 0.95] },
    );

    for (const card of track.children) io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <CurrencySwitcher currency={currency} onChange={setCurrency} />
      </div>

      {/*
        A swipe carousel below `sm`, the original grid from `sm` up. Four
        full-width cards stacked vertically made the pricing section nearly
        four screens tall on a phone, and the comparison the layout exists to
        support — this tier against that one — was impossible without
        scrolling back and forth.

        `-mx-*` + matching padding lets cards bleed to the screen edge so the
        next one peeks in, which is what tells a thumb there's more.
      */}
      <div
        ref={trackRef}
        className={cn(
          // pt-4 clears the featured card's "Most popular" badge, which sits
          // at -top-3: overflow-x:auto forces overflow-y to compute to auto
          // as well, so without the padding the badge is clipped.
          "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-4",
          // Matches container-page's 1.25rem inline padding below 768px.
          "-mx-5 px-5",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6",
          "sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 xl:grid-cols-4",
        )}
      >
        {/*
          No Reveal wrapper on these.

          Each card was a motion component with a whileInView entrance. Inside
          a horizontal scroller that means every swipe drags four cards
          through a 0.7s opacity-and-transform animation as they cross the
          edge — animating the thing the visitor is actively dragging, on the
          slowest device class, while they're trying to compare prices. It
          also read badly: the card you swiped to faded in under your thumb.

          Prices are what people came for. They appear immediately now.
        */}
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="w-[82%] shrink-0 snap-center sm:w-auto sm:shrink"
          >
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
              <p className="mt-2 min-h-[3rem] text-base leading-relaxed text-muted">
                {tier.audience}
              </p>

              {/*
                The price renders visibly from the server in USD and is never
                opacity-gated on a client-only "ready" flag. It was, and the
                result was a pricing table with no prices at all for anyone
                without JS — on a page whose entire pitch is publishing plain
                numbers. An Indian visitor briefly seeing USD before it swaps
                to INR is a far cheaper failure than everyone seeing nothing.

                data-price-* lets the static preview build swap currency
                without React; harmless in the app itself.
              */}
              <div className="mt-6 flex items-end gap-2">
                <span
                  className="text-4xl font-semibold tabular-nums"
                  data-price-usd={formatPrice(tier.price.USD, "USD")}
                  data-price-inr={formatPrice(tier.price.INR, "INR")}
                >
                  {formatPrice(tier.price[currency], currency)}
                </span>
                <span className="mb-1.5 text-sm text-faint">{tier.cadence}</span>
              </div>
              <p className="mt-2 min-h-[1.25rem] text-xs text-faint">
                {tier.setup ? (
                  <>
                    +{" "}
                    <span
                      data-price-usd={formatPrice(tier.setup.USD, "USD")}
                      data-price-inr={formatPrice(tier.setup.INR, "INR")}
                    >
                      {formatPrice(tier.setup[currency], currency)}
                    </span>{" "}
                    one-time setup
                  </>
                ) : (
                  "No setup fee"
                )}
              </p>

              {/* Renders the enquiry CTA until a Razorpay plan is configured
                  for this tier and currency. */}
              <SubscribeButton tier={tier} currency={currency} />

              {tier.buildsOn && (
                <p className="mt-8 border-t border-line pt-7 text-base text-muted">
                  Everything in{" "}
                  <span className="font-medium text-fg">{tier.buildsOn}</span>,
                  plus:
                </p>
              )}

              <ul
                className={cn(
                  "flex flex-col gap-3",
                  tier.buildsOn ? "mt-4" : "mt-8 border-t border-line pt-7",
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-base text-muted">
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
          </div>
        ))}
      </div>

      <CarouselDots
        count={tiers.length}
        active={active}
        onSelect={(i) => scrollTo(i, true)}
      />

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

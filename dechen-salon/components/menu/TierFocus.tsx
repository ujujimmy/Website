"use client";

import { useState } from "react";
import { tiers, type TierId } from "@/content/tiers";

/**
 * Lets a client read the whole price list at one stylist level.
 *
 * The selection is applied by CSS through `data-tier-focus` — the other two
 * columns are removed and the grid narrows, so every row collapses to a single
 * aligned figure (see globals.css). Every price stays in the DOM either way,
 * because a price list that only exists after JavaScript runs is not a price
 * list.
 *
 * The bar is sticky. On a page this long, a filter you have to scroll back to
 * the top to reach is a filter nobody uses twice.
 */
export function TierFocus({ children }: { children: React.ReactNode }) {
  const [focus, setFocus] = useState<TierId | "all">("all");

  const options: { id: TierId | "all"; label: string; hint: string }[] = [
    { id: "all", label: "Compare all three", hint: "Show every level side by side" },
    ...tiers.map((tier) => ({
      id: tier.id,
      label: tier.name,
      hint: tier.strapline,
    })),
  ];

  return (
    <div data-tier-focus={focus}>
      <div className="sticky top-16 z-30 -mx-6 mb-8 bg-blush/95 px-6 py-3 backdrop-blur-sm sm:top-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2.5">
          <p
            id="tier-focus-label"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted"
          >
            Prices shown for
          </p>
          <div
            role="group"
            aria-labelledby="tier-focus-label"
            className="flex flex-wrap justify-center gap-1 rounded-full bg-card p-1.5 shadow-[0_6px_20px_-12px_rgb(59_27_51_/_0.35)]"
          >
            {options.map((option) => {
              const active = focus === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  data-tier-button={option.id}
                  onClick={() => setFocus(option.id)}
                  aria-pressed={active}
                  title={option.hint}
                  className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    active
                      ? "bg-plum text-petal"
                      : "text-muted hover:bg-petal hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

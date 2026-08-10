"use client";

import { useState } from "react";
import { tiers, type TierId } from "@/content/tiers";

/**
 * Lets a client read the whole index at one artist level.
 *
 * The selection is applied by CSS through `data-tier-focus` — the other two
 * columns are removed and the grid narrows, so every row collapses to a single
 * aligned figure (see globals.css). Every price stays in the DOM either way,
 * because a price list that only exists after JavaScript runs is not a price
 * list.
 *
 * The bar is sticky under the header. On a page this long, a filter you have to
 * scroll back to the top to reach is a filter nobody uses twice.
 */
export function TierFocus({ children }: { children: React.ReactNode }) {
  const [focus, setFocus] = useState<TierId | "all">("all");

  const options: { id: TierId | "all"; label: string; hint: string }[] = [
    { id: "all", label: "All three", hint: "Show every level side by side" },
    ...tiers.map((tier) => ({
      id: tier.id,
      label: tier.name,
      hint: tier.strapline,
    })),
  ];

  return (
    <div data-tier-focus={focus}>
      <div className="sticky top-16 z-40 -mx-6 mb-10 border-b border-line bg-paper/95 px-6 py-3 backdrop-blur-sm md:top-20">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p id="tier-focus-label" className="micro text-muted">
            Prices for
          </p>
          <div
            role="group"
            aria-labelledby="tier-focus-label"
            className="flex flex-wrap gap-x-5 gap-y-1"
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
                  className={`micro border-b py-1 transition-colors duration-300 ${
                    active
                      ? "border-lacquer text-lacquer"
                      : "border-transparent text-muted hover:text-ink"
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

"use client";

import { useState } from "react";
import { tiers, type TierId } from "@/content/tiers";

/**
 * Lets a client read the price list at one tier without losing the other two.
 *
 * Selecting a tier dims the other columns via CSS rather than unmounting them,
 * so every figure stays in the document. A price list that only exists after
 * JavaScript runs is not a price list.
 */
export function TierFocus({ children }: { children: React.ReactNode }) {
  const [focus, setFocus] = useState<TierId | "all">("all");

  const options: { id: TierId | "all"; label: string }[] = [
    { id: "all", label: "All three" },
    ...tiers.map((tier) => ({ id: tier.id, label: tier.name })),
  ];

  return (
    <div data-tier-focus={focus}>
      <div className="mb-8 flex flex-col items-center gap-3">
        <p id="tier-focus-label" className="text-xs uppercase tracking-[0.16em] text-muted">
          Show prices for
        </p>
        <div
          role="group"
          aria-labelledby="tier-focus-label"
          className="flex flex-wrap justify-center gap-1.5 rounded-full bg-card p-1.5 shadow-[0_6px_20px_-12px_rgb(59_27_51_/_0.35)]"
        >
          {options.map((option) => {
            const active = focus === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFocus(option.id)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
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

      {children}
    </div>
  );
}

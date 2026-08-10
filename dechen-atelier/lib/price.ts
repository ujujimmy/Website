import type { Price } from "@/content/menu";
import type { TierId } from "@/content/tiers";

/**
 * Indian digit grouping: ₹1,00,000 rather than ₹100,000. Using the wrong
 * grouping on a Delhi price list is the sort of small wrongness that a local
 * client notices immediately.
 */
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatAmount(amount: number) {
  return rupees.format(amount);
}

/** The full human string for a price, used when no tier is selected. */
export function formatPrice(price: Price): string {
  switch (price.kind) {
    case "flat":
      return formatAmount(price.amount);
    case "dual":
      return `${formatAmount(price.a)} / ${formatAmount(price.b)}`;
    case "range":
      // En dash, and the currency symbol only once — "₹2,500–3,500" is how a
      // price list reads on paper.
      return `${formatAmount(price.from)}–${rupees
        .format(price.to)
        .replace("₹", "")}`;
    case "from":
      return `${formatAmount(price.amount)} onwards`;
    case "tiered":
      return `${formatAmount(price.top)}–${rupees
        .format(price.director)
        .replace("₹", "")}`;
    case "consult":
      return "On consultation";
  }
}

/**
 * The price for one tier, or null when this item isn't tier-priced. Lets the
 * menu page filter to "show me Creative Artist prices" and have every row
 * answer with a single number.
 */
export function priceForTier(price: Price, tier: TierId): string | null {
  if (price.kind !== "tiered") return null;
  const amount =
    tier === "top"
      ? price.top
      : tier === "creative"
        ? price.creative
        : price.director;
  return formatAmount(amount);
}

/** Whether a row changes with the stylist tier. Drives the menu's tier filter. */
export function isTiered(price: Price) {
  return price.kind === "tiered";
}

/** The lowest figure in a price, for "from ₹X" summaries on service cards. */
export function lowestAmount(price: Price): number | null {
  switch (price.kind) {
    case "flat":
      return price.amount;
    case "dual":
      return Math.min(price.a, price.b);
    case "range":
      return price.from;
    case "from":
      return price.amount;
    case "tiered":
      return Math.min(price.top, price.creative, price.director);
    case "consult":
      return null;
  }
}

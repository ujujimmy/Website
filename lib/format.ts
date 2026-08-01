import type { Currency } from "@/content/pricing";

/**
 * Environment-agnostic formatting. Lives apart from lib/currency.ts because
 * that module is `"use client"` (it owns the currency hook), and server code
 * — the Razorpay notification emails — needs `formatPrice` too.
 */

/** Whole-number formatting; these prices never need decimals. */
export function formatPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

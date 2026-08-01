/**
 * Pricing is priced by market, not by exchange rate — USD and INR are set
 * independently on purpose. Do not compute one from the other.
 *
 * TODO(pricing): sanity-check these against what you actually want to charge
 * in North America before launch. The USD numbers below are positioned for a
 * US/Canada local business, which is deliberately well above Indian rates.
 */

export type Currency = "USD" | "INR";

export type Tier = {
  id: "starter" | "growth" | "authority";
  name: string;
  /** Who it's for, one line. */
  audience: string;
  /** Monthly price by currency. */
  price: Record<Currency, number>;
  /** One-time setup fee, if any. */
  setup: Record<Currency, number> | null;
  /** Shown under the price. */
  cadence: string;
  features: string[];
  /** Things explicitly NOT included, so the tier boundary is honest. */
  excludes?: string[];
  featured?: boolean;
  cta: { label: string; href: string };
};

export const currencySymbol: Record<Currency, string> = {
  USD: "$",
  INR: "₹",
};

export const tiers: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    audience:
      "One location that needs its Google presence fixed and its rating climbing.",
    price: { USD: 499, INR: 15000 },
    setup: { USD: 300, INR: 9000 },
    cadence: "per month",
    features: [
      "Google Business Profile overhaul",
      "Review request automation (SMS + email)",
      "Review responses within 24 hours",
      "Negative review alerts",
      "Monthly rating & competitor report",
      "Email support",
    ],
    excludes: ["Website build", "Ongoing SEO content"],
    cta: { label: "Start with Starter", href: "/audit?plan=starter" },
  },
  {
    id: "growth",
    name: "Growth",
    audience:
      "The common case: the reviews need work and the website is holding everything back.",
    price: { USD: 1499, INR: 45000 },
    setup: { USD: 1500, INR: 45000 },
    cadence: "per month",
    features: [
      "Everything in Starter",
      "Custom website, built and launched",
      "On-page & technical SEO",
      "Local SEO and citation cleanup",
      "2 content pages per month",
      "Conversion tracking & call tracking",
      "Monthly strategy call",
    ],
    featured: true,
    cta: { label: "Start with Growth", href: "/audit?plan=growth" },
  },
  {
    id: "authority",
    name: "Authority",
    audience:
      "Multi-location or competitive markets where you intend to own the category.",
    price: { USD: 3499, INR: 105000 },
    setup: null,
    cadence: "per month",
    features: [
      "Everything in Growth",
      "Up to 5 locations",
      "6 content pages per month",
      "Digital PR & link acquisition",
      "Landing pages for paid campaigns",
      "Dedicated account manager",
      "Bi-weekly strategy calls",
    ],
    cta: { label: "Talk to us about Authority", href: "/contact?plan=authority" },
  },
];

/** Shown beneath the pricing table — removes the usual objections. */
export const pricingAssurances = [
  {
    title: "No long-term contracts",
    body: "Month to month, cancel with 30 days notice. We'd rather earn the next month than trap you into it.",
  },
  {
    title: "You own everything",
    body: "Domain, website code, content and every account stays in your name. If we part ways, you keep all of it.",
  },
  {
    title: "Fixed monthly price",
    body: "No percentage of ad spend, no surprise line items. You know the number before you sign.",
  },
  {
    title: "Real reviews only",
    body: "We never buy, fake or incentivise reviews. That gets profiles suspended, and it's not a risk worth taking with your business.",
  },
];

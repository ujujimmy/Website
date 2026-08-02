/**
 * Pricing.
 *
 * Four tiers, priced by market rather than by exchange rate — the USD and INR
 * figures are set independently on purpose. Do not compute one from the other.
 *
 * USD is positioned for a US/Canada/UK local business. INR sits well below the
 * straight conversion because that is what the Indian market pays, not because
 * the work is any smaller.
 *
 * TODO(pricing): confirm the INR column. The USD figures were chosen by the
 * owner; the rupee ones are a proposal at roughly 60–65% of the converted
 * price, which is a normal gap for this market. Adjust to taste.
 */

export type Currency = "USD" | "INR";

export type Tier = {
  id: "reviews" | "website" | "seo" | "complete";
  name: string;
  /** Who it's for, one line. */
  audience: string;
  /** Monthly price by currency. */
  price: Record<Currency, number>;
  /** One-time setup fee, if any. Null for all tiers today. */
  setup: Record<Currency, number> | null;
  /** Shown under the price. */
  cadence: string;
  /**
   * When set, the card leads with "Everything in X, plus:" and lists only the
   * additions — the same structure that makes a four-tier ladder readable
   * instead of four near-identical feature lists.
   */
  buildsOn?: string;
  features: string[];
  /** Things explicitly NOT included, so the tier boundary is honest. */
  excludes?: string[];
  featured?: boolean;
  cta: { label: string; href: string };
  /**
   * Razorpay Plan IDs, created in the Razorpay dashboard under
   * Subscriptions → Plans. One per currency, because a Razorpay plan has a
   * fixed currency and amount baked in.
   *
   * The server maps tier -> plan ID and never accepts a plan or an amount
   * from the browser, so a visitor cannot subscribe themselves to a cheaper
   * plan by editing the request.
   *
   * TODO(payments): replace with your real plan IDs. Leave undefined and the
   * subscribe button falls back to the normal enquiry CTA.
   */
  razorpayPlanId?: Partial<Record<Currency, string>>;
};

export const currencySymbol: Record<Currency, string> = {
  USD: "$",
  INR: "₹",
};

export const tiers: Tier[] = [
  {
    id: "reviews",
    name: "Review Automation",
    audience:
      "Your rating is holding you back and nobody is asking your happy customers to say so.",
    price: { USD: 149, INR: 7999 },
    setup: null,
    cadence: "per month",
    features: [
      "Google Business Profile optimisation",
      "Automatic review requests by SMS and email",
      "Review responses within 24 hours",
      "Negative review alerts",
      "Win-back campaign to past customers",
      "In-store QR code and tap-to-review cards",
    ],
    excludes: ["Website build", "Ongoing SEO"],
    cta: { label: "Get more reviews", href: "/audit?need=reviews" },
    // razorpayPlanId: { INR: "plan_XXXXXXXXXXXX", USD: "plan_XXXXXXXXXXXX" },
  },
  {
    id: "website",
    name: "Website Package",
    audience:
      "You need a site that loads fast and turns the visit into a phone call.",
    price: { USD: 297, INR: 14999 },
    setup: null,
    cadence: "per month",
    features: [
      "Custom website, designed and built",
      "Mobile-first, sub-2-second target",
      "Built on an SEO-ready foundation",
      "Structured to capture leads, not just inform",
      "Hosting included",
      "Unlimited content updates and maintenance",
    ],
    excludes: ["Review generation", "Ongoing SEO content"],
    cta: { label: "Build my website", href: "/audit?need=website" },
    // razorpayPlanId: { INR: "plan_XXXXXXXXXXXX", USD: "plan_XXXXXXXXXXXX" },
  },
  {
    id: "seo",
    name: "Local SEO Growth",
    audience:
      "Reviews are handled — now you want to be the business people find first.",
    price: { USD: 397, INR: 19999 },
    setup: null,
    cadence: "per month",
    buildsOn: "Review Automation",
    features: [
      "Deep Google Business Profile optimisation",
      "Citation building and cleanup",
      "Local SEO for your service area",
      "Monthly on-page improvements",
      "Rank and competitor reporting",
    ],
    cta: { label: "Grow my business", href: "/audit?need=seo" },
    // razorpayPlanId: { INR: "plan_XXXXXXXXXXXX", USD: "plan_XXXXXXXXXXXX" },
  },
  {
    id: "complete",
    name: "Complete Growth System",
    audience:
      "You would rather hand the whole thing over and get one report a month.",
    price: { USD: 497, INR: 24999 },
    setup: null,
    cadence: "per month",
    buildsOn: "Local SEO Growth",
    features: [
      "Custom website, built and hosted",
      "Mobile-first and SEO-ready",
      "Unlimited updates and maintenance",
      "Everything above, managed for you",
      "Monthly strategy call",
    ],
    featured: true,
    cta: { label: "Get everything", href: "/audit?need=everything" },
    // razorpayPlanId: { INR: "plan_XXXXXXXXXXXX", USD: "plan_XXXXXXXXXXXX" },
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

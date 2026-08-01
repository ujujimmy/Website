/**
 * Proof.
 *
 * The case studies below are REAL clients, supplied by the owner. Two rules
 * apply to everything in this file and should not be relaxed:
 *
 * 1. Never invent a number. Where a result wasn't measured, the copy says
 *    what was done instead of inventing a metric.
 * 2. Never invent a quote. These are real businesses; attributing words to
 *    them that they never said is the single fastest way to destroy the
 *    credibility this whole site exists to build. `testimonials` is empty
 *    until real ones are collected — see the TODO there.
 */

/**
 * This site's own Google Lighthouse scores — the one proof point that needs
 * nobody to vouch for it, because any visitor can re-run the test.
 *
 * TODO(scores): re-measure after the first deploy and update these. Hosting,
 * domain and network all move the number, and a score that does not match
 * what a visitor measures is worse than showing none at all.
 */
export const lighthouse = {
  measuredOn: "August 2026",
  context: "Mobile, 4× CPU throttling, slow 4G",
  scores: [
    { label: "Performance", value: 92, blurb: "How fast it loads" },
    { label: "Accessibility", value: 100, blurb: "Usable by everyone" },
    { label: "Best Practices", value: 96, blurb: "Built correctly" },
    { label: "SEO", value: 100, blurb: "Ready to rank" },
  ],
};

/**
 * Trust bar figures.
 *
 * Only claims that can be backed up. There is deliberately no "150+ clients"
 * here — three named clients is what exists today, and an inflated number is
 * exactly what a prospect checks first.
 *
 * TODO(proof): as more work lands, add it here. If you can evidence a total
 * across clients, a "reviews generated" figure is the strongest one to grow.
 */
export const stats = [
  { value: "1,800+", label: "Reviews generated for one client" },
  { value: "3.9 → 4.4", label: "Rating lift on that campaign" },
  { value: "3", label: "Businesses currently served" },
  { value: "100%", label: "Results verifiable on Google" },
];

/** Real client names, shown as a simple wordmark row. */
export const clientLogos = [
  "Gangnam Korean Restaurant",
  "Sopa Himalayan Kitchen",
  "Dachen Salon",
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
};

/**
 * Intentionally empty.
 *
 * TODO(proof): collect real testimonials before adding any. Ask each client
 * for one or two sentences and explicit permission to publish it with their
 * business name. Any component rendering this array must handle it being
 * empty — the site simply omits the section rather than showing filler.
 */
export const testimonials: Testimonial[] = [];

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  location: string;
  challenge: string;
  approach: string[];
  results: { value: string; label: string }[];
  duration: string;
  services: string[];
  /** Shown as a "check it yourself" prompt where results are public. */
  verifiable?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "gangnam-korean-restaurant",
    client: "Gangnam Korean Restaurant",
    industry: "Restaurant",
    location: "Delhi, India",
    challenge:
      "A well-liked restaurant sitting at 3.9 stars — below the threshold where most diners stop scrolling. Plenty of happy customers, almost none of them leaving a review.",
    approach: [
      "Rebuilt the Google Business Profile: categories, menu, hours, photos",
      "Put review requests in front of diners at the moment they were happiest, not days later",
      "Responded to reviews consistently, including the critical ones",
      "Kept requests running continuously so the rating climbed on volume, not luck",
    ],
    results: [
      { value: "3.9 → 4.4", label: "Google rating" },
      { value: "1,800+", label: "Reviews generated" },
    ],
    duration: "Ongoing",
    services: ["Google Reviews"],
    verifiable: "Search the restaurant on Google Maps and see the rating and review count for yourself.",
  },
  {
    slug: "sopa-himalayan-kitchen",
    client: "Sopa Himalayan Kitchen",
    industry: "Restaurant",
    location: "Majnu-ka-Tilla, Delhi",
    challenge:
      "Strong food and steady regulars, but a review count that badly understated how many people the kitchen actually makes happy.",
    approach: [
      "Google Business Profile cleaned up and completed",
      "A repeatable review request routine the staff could actually keep up with",
      "Ongoing review responses in the restaurant's own voice",
    ],
    // No invented metrics: the campaign's numbers weren't recorded.
    // TODO(proof): add before/after rating and review count when available.
    results: [],
    duration: "Ongoing",
    services: ["Google Reviews"],
    verifiable: "Their Google listing is public — the review activity speaks for itself.",
  },
  {
    slug: "dachen-salon",
    client: "Dachen Salon",
    industry: "Hair & beauty",
    location: "Delhi, India",
    challenge:
      "No proper website. Customers looking for the salon online found no clear way to see services or get in touch.",
    approach: [
      "Built a fast, mobile-first website around one action: getting in touch",
      "Services and pricing laid out plainly instead of buried",
      "Structured so the salon shows up properly in local search",
    ],
    // TODO(proof): add load time, traffic or enquiry numbers if measured.
    results: [],
    duration: "Completed",
    services: ["Web Design"],
  },
];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);

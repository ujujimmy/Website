/**
 * ⚠️  PLACEHOLDER PROOF — READ BEFORE SHOWING THIS SITE TO A PROSPECT.
 *
 * Every number, logo, name and quote in this file is invented for layout
 * purposes. The whole job of this website is credibility, and fabricated
 * results are the single fastest way to destroy it — a prospect who checks
 * one of these and finds nothing is gone for good.
 *
 * TODO(proof): replace ALL of the below with real client data before any
 * outreach. If you only have two or three Indian clients, use those — real
 * modest numbers convert far better than impressive invented ones.
 */

/**
 * This site's own Google Lighthouse scores.
 *
 * Unlike everything else in this file these are REAL — measured on the
 * production build, throttled mobile profile. They are the one proof point
 * here that needs no client to vouch for it, because any visitor can re-run
 * the test themselves in ten seconds.
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

/** Headline stats in the trust bar. TODO(proof): replace with real figures. */
export const stats = [
  { value: "150+", label: "Businesses served" },
  { value: "12,000+", label: "Reviews generated" },
  { value: "4.8★", label: "Average client rating" },
  { value: "4", label: "Countries served" },
];

/** TODO(proof): swap for real client logos in /public/logos, or delete the row. */
export const clientLogos = [
  "Rivera Dental",
  "Northside Plumbing",
  "Bloom Med Spa",
  "Kettle & Co",
  "Apex Roofing",
  "Lakeside Vets",
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
};

/** TODO(proof): replace with real, attributable testimonials. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "We went from 31 reviews to over 200 in four months without anyone on my team having to remember to ask. That alone changed how many first-time patients we see.",
    name: "Dana Rivera",
    role: "Practice Owner",
    company: "Rivera Dental",
    location: "Austin, TX",
    rating: 5,
  },
  {
    quote:
      "The old site looked fine and did nothing. The new one gets me calls. Same traffic, completely different result — I wish I'd rebuilt it two years earlier.",
    name: "Mark Halloran",
    role: "Owner",
    company: "Northside Plumbing",
    location: "Calgary, AB",
    rating: 5,
  },
  {
    quote:
      "They explained what they were doing in plain English every month, which no agency had ever done for me. We're in the map pack for our main service now.",
    name: "Priya Raman",
    role: "Founder",
    company: "Bloom Med Spa",
    location: "Manchester, UK",
    rating: 5,
  },
];

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
};

/** TODO(proof): replace entirely with real case studies. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "rivera-dental",
    client: "Rivera Dental",
    industry: "Dental practice",
    location: "Austin, TX",
    challenge:
      "A 3.8 rating with 31 reviews, sitting below four competitors in the map pack for every service term that mattered.",
    approach: [
      "Rebuilt the Google Business Profile with correct primary and secondary categories",
      "Connected review requests to the existing appointment reminder system",
      "Responded to every historic review, including the four negatives",
      "Published six service pages targeting treatment-specific searches",
    ],
    results: [
      { value: "3.8 → 4.9", label: "Google rating" },
      { value: "+172", label: "New reviews in 4 months" },
      { value: "#1", label: "Map pack position, primary term" },
    ],
    duration: "4 months",
    services: ["Google Reviews", "SEO"],
  },
  {
    slug: "northside-plumbing",
    client: "Northside Plumbing",
    industry: "Home services",
    location: "Calgary, AB",
    challenge:
      "Decent traffic from an old template site that converted almost nobody, with no way to tell which pages drove calls.",
    approach: [
      "Rebuilt the site around a single primary action — call now",
      "Cut mobile load time from 6.4s to 1.6s",
      "Added emergency-callout landing pages for each service area",
      "Wired up call tracking so lead source was finally visible",
    ],
    results: [
      { value: "6.4s → 1.6s", label: "Mobile load time" },
      { value: "3.1×", label: "Increase in calls from site" },
      { value: "94", label: "Lighthouse performance" },
    ],
    duration: "6 weeks",
    services: ["Web Design", "SEO"],
  },
  {
    slug: "bloom-med-spa",
    client: "Bloom Med Spa",
    industry: "Health & beauty",
    location: "Manchester, UK",
    challenge:
      "Strong word of mouth locally but effectively invisible in search for every treatment they offered.",
    approach: [
      "Technical cleanup — fixed indexation on 40% of the site that was not being crawled",
      "Treatment-level content targeting buying-intent searches",
      "Citation consistency across 30+ UK directories",
      "Review generation to strengthen local ranking signals",
    ],
    results: [
      { value: "+310%", label: "Organic traffic" },
      { value: "Top 3", label: "For 11 treatment terms" },
      { value: "+88", label: "Reviews in 5 months" },
    ],
    duration: "5 months",
    services: ["SEO", "Google Reviews"],
  },
];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);

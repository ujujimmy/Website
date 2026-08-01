/**
 * Location × industry landing pages.
 *
 * One generic SEO page has to rank for everyone everywhere, which is very
 * hard. These are many small pages, each aimed at one exact search — someone
 * looking for "Google review management for dentists in Austin" lands on a
 * page that names both the city and the trade, which ranks far more easily
 * and converts far better than a general page.
 *
 * This is also the service being sold, done on our own site — the most
 * persuasive possible demonstration that it works.
 *
 * To add a page, add an entry here. The route, sitemap, internal links and
 * structured data all follow automatically. Keep the list deliberately small
 * and genuinely useful: a hundred thin, near-identical pages is the classic
 * doorway-page mistake and Google devalues them.
 */

export type Location = {
  /** URL segment: /locations/<slug> */
  slug: string;
  city: string;
  region: string;
  country: "United States" | "Canada" | "United Kingdom" | "India";
  /** Plural trade name, lowercase — used mid-sentence. */
  industry: string;
  /** The primary search this page targets. */
  targetSearch: string;
  /** Which of our services leads on this page. */
  service: "google-reviews" | "web-design" | "seo";
  /** One or two sentences specific to this market. Never boilerplate. */
  localContext: string;
  /** Concrete, trade-specific pain points. */
  painPoints: string[];
};

export const locations: Location[] = [
  {
    slug: "google-reviews-dentists-austin",
    city: "Austin",
    region: "Texas",
    country: "United States",
    industry: "dental practices",
    targetSearch: "Google review management for dentists in Austin",
    service: "google-reviews",
    localContext:
      "Austin has one of the densest concentrations of dental practices in Texas, and the map pack for a search like “dentist near me” is fought over by practices with three hundred reviews each. Rating and review count are the deciding factor long before anyone reads your website.",
    painPoints: [
      "Patients compare four practices on stars before they call any of them",
      "A single unanswered complaint sits at the top of your profile for years",
      "Practices asking systematically gain 20–40 reviews a month; most gain two",
    ],
  },
  {
    slug: "google-reviews-restaurants-delhi",
    city: "Delhi",
    region: "NCR",
    country: "India",
    industry: "restaurants",
    targetSearch: "Google review management for restaurants in Delhi",
    service: "google-reviews",
    localContext:
      "This is the work we know best. Delhi diners filter by rating before cuisine, and in a market this crowded the gap between 3.9 and 4.4 stars decides whether a table gets booked at all.",
    painPoints: [
      "Diners filter out anything under 4.0 without reading a single review",
      "Delivery aggregators pull traffic away from your own Google listing",
      "Great food and a mediocre rating is the most common — and most fixable — problem we see",
    ],
  },
  {
    slug: "web-design-home-services-calgary",
    city: "Calgary",
    region: "Alberta",
    country: "Canada",
    industry: "home services businesses",
    targetSearch: "website design for plumbers and home services in Calgary",
    service: "web-design",
    localContext:
      "Home services searches in Calgary spike during cold snaps and burst-pipe season, and almost all of that traffic is on a phone, outdoors, in a hurry. A site that takes six seconds to load loses the job to whoever loads first.",
    painPoints: [
      "Emergency callers abandon a slow site within seconds",
      "No visible phone number above the fold on mobile",
      "No way to tell which pages actually produce calls",
    ],
  },
  {
    slug: "seo-med-spas-manchester",
    city: "Manchester",
    region: "England",
    country: "United Kingdom",
    industry: "med spas and aesthetic clinics",
    targetSearch: "SEO for med spas and aesthetic clinics in Manchester",
    service: "seo",
    localContext:
      "Aesthetic treatments are researched heavily before anyone books, and in Manchester the searches that matter are treatment-specific rather than generic. Clinics that publish a proper page per treatment quietly take the traffic from those that don't.",
    painPoints: [
      "Ranking for “med spa Manchester” but not for the treatments people search",
      "Competitors with a page per treatment capture the buying-intent searches",
      "Strong local word of mouth that never translates into search visibility",
    ],
  },
];

export const locationBySlug = (slug: string) =>
  locations.find((l) => l.slug === slug);

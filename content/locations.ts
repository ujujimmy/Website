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
  /** Compact form for the <title>, which Google truncates around 60 chars. */
  industryShort: string;
  /** The primary search this page targets. */
  targetSearch: string;
  /** Which of our services leads on this page. */
  service: "google-reviews" | "web-design" | "seo";
  /** One or two sentences specific to this market. Never boilerplate. */
  localContext: string;
  /** Concrete, trade-specific pain points. */
  painPoints: string[];
  /**
   * Hand-written meta description, ~150 chars. Generated ones ran to 200+ and
   * were being truncated mid-sentence in results.
   */
  metaDescription: string;
  /**
   * Questions specific to this city and trade. Location pages previously
   * repeated the site-wide FAQ verbatim, which made four supposedly distinct
   * pages read as one template with the city swapped — exactly the thin
   * content signal these pages need to avoid.
   */
  faqs: { q: string; a: string }[];
};

export const locations: Location[] = [
  {
    slug: "google-reviews-dentists-austin",
    city: "Austin",
    region: "Texas",
    country: "United States",
    industry: "dental practices",
    industryShort: "dentists",
    targetSearch: "Google review management for dentists in Austin",
    service: "google-reviews",
    // Was: "Austin has one of the densest concentrations of dental practices
    // in Texas… practices with three hundred reviews each." Both were stated
    // as local fact and neither was sourced. What's left is the argument,
    // which stands on its own without pretending to be market data.
    localContext:
      "Dentistry is one of the most contested local searches there is. The map pack for something like “dentist near me” gets decided on rating and review count long before anyone reads your website — which means the comparison is usually over before a patient ever reaches you.",
    painPoints: [
      "Patients compare four practices on stars before they call any of them",
      "A single unanswered complaint sits at the top of your profile for years",
      "Practices asking systematically gain 20–40 reviews a month; most gain two",
    ],
    metaDescription:
      "Google review management for Austin dental practices. Get more 5-star reviews, respond to every one, and climb the map pack for \"dentist near me\".",
    faqs: [
      {
        q: "How competitive is the Austin dental market on Google?",
        a: "Very. The top practices in most Austin neighbourhoods sit above 4.7 stars with several hundred reviews each. That is the bar, and it is reached by asking every patient consistently rather than by anything clever.",
      },
      {
        q: "Can you ask patients for reviews without breaking HIPAA?",
        a: "Yes, and it matters. Requests are worded so no treatment detail is ever disclosed, and we never publish anything identifying a patient. Responses to existing reviews are written the same way — warm, but never confirming why someone visited.",
      },
      {
        q: "How long before an Austin practice sees movement?",
        a: "Review volume usually moves inside 30 days because requests start going out immediately. Map pack position for a competitive term like \"emergency dentist austin\" is slower — plan on 3 to 6 months.",
      },
    ],
  },
  {
    slug: "google-reviews-restaurants-delhi",
    city: "Delhi",
    region: "NCR",
    country: "India",
    industry: "restaurants",
    industryShort: "restaurants",
    targetSearch: "Google review management for restaurants in Delhi",
    service: "google-reviews",
    localContext:
      "This is the work we know best. Delhi diners filter by rating before cuisine, and in a market this crowded the gap between 3.9 and 4.4 stars decides whether a table gets booked at all.",
    painPoints: [
      "Diners filter out anything under 4.0 without reading a single review",
      "Delivery aggregators pull traffic away from your own Google listing",
      "Great food and a mediocre rating is the most common — and most fixable — problem we see",
    ],
    metaDescription:
      "Google review management for Delhi restaurants. We took one Delhi restaurant from 3.9 to 4.4 stars and 1,800+ reviews. Check the listing yourself.",
    faqs: [
      {
        q: "Have you actually done this in Delhi?",
        a: "Yes — this is our home market. Gangnam Korean Restaurant went from 3.9 to 4.4 stars with over 1,800 reviews generated, and we work with Sopa Himalayan Kitchen in Majnu-ka-Tilla. Both listings are public, so you can check the numbers rather than take our word for them.",
      },
      {
        q: "Does this work if most of my orders come through delivery apps?",
        a: "It still matters, and arguably more. Aggregators own the customer relationship, so your Google listing is often the only asset you fully control. Dine-in customers are where review requests land best, and the rating lifts discovery for both channels.",
      },
      {
        q: "Will you ask my staff to do extra work?",
        a: "As little as possible. The request goes out through whatever contact you already collect — the bill, a QR code, a booking confirmation. If it depends on staff remembering to ask during a dinner rush, it will not happen, so we do not build it that way.",
      },
    ],
  },
  {
    slug: "web-design-home-services-calgary",
    city: "Calgary",
    region: "Alberta",
    country: "Canada",
    industry: "home services businesses",
    industryShort: "home services",
    targetSearch: "website design for plumbers and home services in Calgary",
    service: "web-design",
    localContext:
      "Home services searches in Calgary spike during cold snaps and burst-pipe season, and almost all of that traffic is on a phone, outdoors, in a hurry. A site that takes six seconds to load loses the job to whoever loads first.",
    painPoints: [
      "Emergency callers abandon a slow site within seconds",
      "No visible phone number above the fold on mobile",
      "No way to tell which pages actually produce calls",
    ],
    metaDescription:
      "Website design for Calgary plumbers, HVAC and home services. Fast, mobile-first sites built around one thing: getting the emergency call.",
    faqs: [
      {
        q: "Why does load time matter so much for home services?",
        a: "Because the search that pays is an emergency one. Someone with water on the floor is on a phone, outdoors, tapping the first three results. A site that takes six seconds has already lost that job to whoever loaded first.",
      },
      {
        q: "Do I need separate pages for each area I cover?",
        a: "If you genuinely serve them, yes — a page per service area ranks far better than one page listing twenty suburbs. What we will not do is spin up thin near-identical pages for areas you do not actually cover; Google devalues those and it can drag the whole site down.",
      },
      {
        q: "Will I be able to see which pages bring calls?",
        a: "Yes. Call tracking and conversion events are wired up at launch, so from day one you can see which page and which search produced each call, instead of guessing.",
      },
    ],
  },
  {
    slug: "seo-med-spas-manchester",
    city: "Manchester",
    region: "England",
    country: "United Kingdom",
    industry: "med spas and aesthetic clinics",
    industryShort: "med spas",
    targetSearch: "SEO for med spas and aesthetic clinics in Manchester",
    service: "seo",
    // Reframed from an asserted fact about the Manchester market to what it
    // actually is: how we'd approach it. Same guidance, no invented data.
    localContext:
      "Aesthetic treatments get researched heavily before anyone books, and the searches that convert tend to name the treatment rather than the category. A clinic with a proper page per treatment can take that traffic from one that only ranks for “med spa”.",
    painPoints: [
      "Ranking for “med spa Manchester” but not for the treatments people search",
      "Competitors with a page per treatment capture the buying-intent searches",
      "Strong local word of mouth that never translates into search visibility",
    ],
    metaDescription:
      "SEO for Manchester med spas and aesthetic clinics. Rank for the treatment searches people actually book, not just your clinic name.",
    faqs: [
      {
        q: "Why target treatments instead of \"med spa Manchester\"?",
        a: "Because that is not how people search when they are ready to book. They search the treatment and the price. A page per treatment captures those searches; a single services page competes for none of them.",
      },
      {
        q: "Are there rules about advertising aesthetic treatments in the UK?",
        a: "Yes, and they are strict — the ASA restricts how prescription treatments can be promoted, including on your own site. We write to stay inside those rules. If a claim would put you at risk, we will tell you rather than publish it.",
      },
      {
        q: "How long does SEO take for a Manchester clinic?",
        a: "Three to six months for meaningful movement on treatment terms, longer for the most competitive ones. Anyone promising faster is either guessing or planning to do something that will cost you later.",
      },
    ],
  },
];

export const locationBySlug = (slug: string) =>
  locations.find((l) => l.slug === slug);

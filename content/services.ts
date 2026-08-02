/**
 * The three offers. Copy is written for a US/Canada/UK local business owner:
 * concrete, outcome-first, no marketing-agency abstraction.
 *
 * Adding a niche later = editing the strings here. No component changes.
 */

export type Service = {
  slug: "google-reviews" | "web-design" | "seo";
  /** Short label for nav and cards. */
  name: string;
  /** Full H1 on the service page. */
  heading: string;
  /** One line under the H1. */
  subheading: string;
  /** Nav/card blurb — one sentence. */
  blurb: string;
  /** SEO title + description for the dedicated page. */
  seo: { title: string; description: string };
  /** The problem, in the customer's words. */
  problem: { heading: string; body: string; costs: string[] };
  /** What we actually do. 4 concrete deliverables. */
  deliverables: { title: string; body: string }[];
  /** The delivery process, 4 steps. */
  process: { step: string; title: string; body: string }[];
  /**
   * Numbers shown on the service page.
   *
   * These must be either (a) a result we can evidence and name the client for,
   * or (b) a target/commitment whose label makes clear it is one. Never a
   * "typical client sees X" figure — that implies a client base we do not have
   * and is the first thing a sceptical prospect would probe.
   */
  outcomes: { value: string; label: string }[];
  /** Which pricing tiers include this service. */
  includedIn: string[];
  /** Accent used by the 3D beat and page theme. */
  accent: "gold" | "brand" | "brand-2";
  /** The 3D scroll beat this service owns on the homepage. */
  beat: number;
};

export const services: Service[] = [
  {
    slug: "google-reviews",
    name: "Google Reviews",
    heading: "Turn happy customers into a wall of 5-star reviews",
    subheading:
      "Most of your customers are glad they chose you. Almost none of them will say so publicly unless you ask them properly, at the right moment, in the right way.",
    blurb:
      "Systematic review generation and reputation management for your Google Business Profile.",
    seo: {
      title: "Google Review Management & Generation Service",
      description:
        "Get more 5-star Google reviews. Review request automation, Google Business Profile optimisation and response management for local businesses.",
    },
    problem: {
      heading: "A 3.9 rating is quietly costing you customers",
      body: "When someone searches for a business like yours, they see a row of competitors with star ratings before they see anything else. If you are sitting at 3.9 with 22 reviews and the business below you has 4.8 with 300, the decision is already made — and you never find out you were in the running.",
      costs: [
        "Buyers filter out anything under 4.0 before they read a single word",
        "One unanswered 1-star review outweighs a dozen silent happy customers",
        "Review count and recency both feed local ranking — old reviews decay",
        "Competitors asking for reviews systematically pull further ahead every month",
      ],
    },
    deliverables: [
      {
        title: "Google Business Profile overhaul",
        body: "Categories, services, service areas, hours, attributes, product tiles, geo-tagged photos and Q&A — fully filled out and optimized. This alone moves the needle on map rankings more than most owners expect.",
      },
      {
        title: "Review request automation",
        body: "SMS and email sequences that reach the customer at the moment they are happiest, with a one-tap link straight to your review form. No apps for your staff to remember, no clipboard at the counter.",
      },
      {
        title: "Response management",
        body: "Every review answered within 24 hours in your voice — warm on the good ones, calm and solution-focused on the bad ones. Responses are public, and future customers read them.",
      },
      {
        title: "Reputation monitoring",
        body: "Alerts the moment a negative review lands so it gets handled while it is still fixable, plus a monthly report showing rating, velocity and how you sit against local competitors.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "We benchmark your profile, rating, review velocity and top 3 local competitors, and show you the exact gap.",
      },
      {
        step: "02",
        title: "Set up",
        body: "Profile optimized, request flows built and connected to how you already collect customer contacts.",
      },
      {
        step: "03",
        title: "Generate",
        body: "Requests go out continuously. Real reviews from real customers — nothing bought, nothing fabricated.",
      },
      {
        step: "04",
        title: "Defend",
        body: "Responses handled, negatives flagged fast, monthly reporting on rating and rank movement.",
      },
    ],
    outcomes: [
      { value: "3.9 → 4.4", label: "Rating lift, Gangnam Korean Restaurant" },
      { value: "1,800+", label: "Reviews generated for that client" },
      { value: "<24h", label: "Our response time on new reviews" },
    ],
    includedIn: ["Review Automation", "Local SEO Growth", "Complete Growth System"],
    accent: "gold",
    beat: 3,
  },
  {
    slug: "web-design",
    name: "Web Design",
    heading: "A website that actually books the job",
    subheading:
      "Most small business sites are brochures. They describe the business and then leave the visitor to figure out what to do next. We build the version that turns a visit into a phone call.",
    blurb:
      "Fast, conversion-focused websites designed around one action — getting the customer to contact you.",
    seo: {
      title: "Conversion-Focused Web Design & Development",
      description:
        "Custom-built, fast-loading websites for local businesses. Designed around one action, built for Core Web Vitals, structured so SEO works.",
    },
    problem: {
      heading: "Your site gets traffic. It just doesn't get calls.",
      body: "Traffic is not the problem for most businesses we talk to. The problem is that a visitor lands, waits four seconds for a hero image, reads a paragraph about your 'commitment to excellence', can't find a phone number without scrolling, and leaves. Nothing about that is a marketing problem — it's a build problem.",
      costs: [
        "Over half of mobile visitors leave a page that takes more than 3 seconds",
        "No clear next action means the visitor decides to 'come back later' and never does",
        "Template builders ship bloated code that caps your Core Web Vitals permanently",
        "A site that can't be crawled properly makes every SEO dollar work harder than it should",
      ],
    },
    deliverables: [
      {
        title: "Conversion-first design",
        body: "Structured around one primary action. Phone number visible at every scroll position, trust signals above the fold, and a form short enough that people actually finish it.",
      },
      {
        title: "Built for speed",
        body: "Hand-built rather than assembled from plugins. Images served in modern formats, fonts self-hosted, JavaScript kept off the critical path. Target: sub-2-second load on mobile.",
      },
      {
        title: "SEO-ready foundation",
        body: "Semantic markup, schema, clean URL structure, sitemap and a service-page architecture that gives search engines something to rank. Built in from day one, not bolted on.",
      },
      {
        title: "Yours to keep",
        body: "You own the domain, the code and the content. No proprietary builder holding your site hostage, no monthly fee just to keep it online.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Map",
        body: "We agree on the one action the site exists to drive, then map every page back to it.",
      },
      {
        step: "02",
        title: "Design",
        body: "Full design of every page you'll actually get. No stock template, no surprises at handover.",
      },
      {
        step: "03",
        title: "Build",
        body: "Hand-built, responsive, accessible, and tested on real devices — not just a desktop browser resized.",
      },
      {
        step: "04",
        title: "Launch",
        body: "Analytics, call tracking and conversion events wired up, so from day one you can see what the site is doing.",
      },
    ],
    outcomes: [
      { value: "<2s", label: "Mobile load time we build to" },
      { value: "92", label: "Lighthouse score on this very site" },
      { value: "2–4wk", label: "Build to launch" },
    ],
    includedIn: ["Website Package", "Complete Growth System"],
    accent: "brand-2",
    beat: 4,
  },
  {
    slug: "seo",
    name: "SEO",
    heading: "Get found where your customers are already looking",
    subheading:
      "Ranking on page two is the same as not existing. We do the unglamorous, compounding work that moves you into the results people actually click.",
    blurb:
      "Local and organic SEO that targets the searches with buying intent — not vanity keywords.",
    seo: {
      title: "Local SEO & Organic Search Services",
      description:
        "Local SEO, technical SEO and content built around buying-intent keywords. Get into the Google map pack and the top organic results in your service area.",
    },
    problem: {
      heading: "Position 9 gets almost none of the clicks",
      body: "The top three organic results take the overwhelming majority of clicks, and the map pack takes most of what's left on local searches. If you're ranking ninth for the term that actually describes what you sell, you are visible in a technical sense and invisible in every sense that matters.",
      costs: [
        "The top 3 results capture the large majority of all clicks",
        "The map pack sits above organic results on nearly every local search",
        "Competitors publishing consistently compound their lead every single month",
        "Paid ads stop the moment you stop paying — rankings don't",
      ],
    },
    deliverables: [
      {
        title: "Keyword and intent research",
        body: "We target what people type when they are ready to buy, not the high-volume terms that look impressive in a report and never convert.",
      },
      {
        title: "Technical SEO",
        body: "Crawlability, indexation, site speed, schema, internal linking and mobile usability — the foundation that decides whether anything else you do can work.",
      },
      {
        title: "Local SEO",
        body: "Map pack optimization, citation consistency across directories, location pages, and the review signals that feed local ranking directly.",
      },
      {
        title: "Content that ranks",
        body: "Service and location pages built to answer real searches, published on a consistent schedule. This is the part that compounds.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "Full technical crawl, current rankings, competitor gap analysis. You get the findings whether or not you hire us.",
      },
      {
        step: "02",
        title: "Fix",
        body: "Technical issues cleared first — there is no point publishing content onto a site search engines struggle to crawl.",
      },
      {
        step: "03",
        title: "Build",
        body: "Service pages, location pages and content published on a steady cadence against the keyword map.",
      },
      {
        step: "04",
        title: "Report",
        body: "Monthly reporting on rankings, traffic and — the only one that matters — leads.",
      },
    ],
    outcomes: [
      { value: "Top 3", label: "Target map pack position" },
      { value: "3–6mo", label: "Realistic window for meaningful movement" },
      { value: "0", label: "Long-term contracts required" },
    ],
    includedIn: ["Local SEO Growth", "Complete Growth System"],
    accent: "brand",
    beat: 5,
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

export const serviceSlugs = services.map((s) => s.slug);

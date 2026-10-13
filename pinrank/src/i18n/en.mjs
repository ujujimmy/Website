/** English. Mainly for reviewing the copy and for expats; ads should point at /nl/ and /fr/. */

export default {
  code: "en",
  htmlLang: "en-BE",
  ogLocale: "en_GB",
  label: "EN",
  slugs: { thanks: "thank-you", privacy: "privacy" },

  trades: {
    roofer: { slug: "roofer", label: "Roofer", plural: "roofers", adPlural: "Roofers", search: "roofer near me", job: 2500 },
    renovation: { slug: "renovation", label: "Renovation / contractor", plural: "renovation contractors", adPlural: "Renovation contractors", search: "renovation contractor near me", job: 6000 },
    plumber: { slug: "plumber", label: "Plumber", plural: "plumbers", adPlural: "Plumbers", search: "plumber near me", job: 350 },
    electrician: { slug: "electrician", label: "Electrician", plural: "electricians", adPlural: "Electricians", search: "electrician near me", job: 500 },
    other: { label: "Other construction or home service business", plural: "trades businesses", job: 1500 },
  },

  meta: {
    title: (tr) =>
      tr
        ? `More customers from Google Maps for ${tr.plural} — PinRank`
        : "PinRank — Top of Google Maps for trades businesses in Belgium",
    description: (tr) =>
      `PinRank works on your Google Business Profile every week so ${tr ? tr.plural : "roofers, renovation contractors, plumbers and electricians"} in Belgium rank higher on Google Maps. Not higher after 3 months? Money back.`,
  },

  /** Text on the link-preview image (scripts/og.mjs). */
  og: { eyebrow: "For roofers, renovation, plumbers and electricians in Belgium", title: "Top of Google Maps.", sub: "Not higher after 3 months? Money back." },

  /** Headline on the ad videos (scripts/ad-video.mjs). */
  adVideo: { headline: (tr) => (tr ? `${tr.adPlural}: are you in the top 3 on Google Maps?` : "Are you in the top 3 on Google Maps?") },

  nav: { cta: "Free scan", langLabel: "Language" },

  hero: {
    eyebrow: (tr) => (tr ? `For ${tr.plural} in Belgium` : "For roofers, renovation contractors, plumbers and electricians in Belgium"),
    title: (tr) =>
      tr
        ? `Someone is searching <em>“${tr.search}”</em> right now. Are you in the top 3?`
        : "Get to the top of Google Maps — and get the call <em>before</em> your competitor.",
    sub: "PinRank works on your Google Business Profile every week, so customers in your area find you and call you. Ranking not higher after 3 months? You get your money back.",
    cta: "Get your free ranking scan",
    ctaNote: "4 quick questions · 30 seconds · No obligation",
    wa: "Rather send a WhatsApp right away",
    pick: "Your trade?",
    trust: ["Money-back guarantee after 3 months", "Your profile worked on every week", "Monthly ranking report"],
  },

  demo: {
    label: "Illustrative example",
    week: "Week",
    avg: "Avg. position",
    top3: "In the top 3",
    play: "Play",
    pause: "Pause",
    alt: "Animation: a tradesperson’s ranking at 25 points across their area improves over 12 weeks.",
    captions: [
      { w: 0, t: "Baseline at 25 points across your area" },
      { w: 1, t: "Profile fully optimised" },
      { w: 3, t: "New posts and photos every week" },
      { w: 6, t: "Every review gets a reply" },
      { w: 9, t: "Google sees an active, trustworthy business" },
      { w: 12, t: "The goal: top 3 around your business" },
    ],
  },

  mock: {
    label: "What your customer sees on Google",
    you: "Your business",
    rivalA: "Competitor A",
    rivalB: "Competitor B",
    rivalC: "Competitor C",
    notVisible: "Position 7 · customers don’t see you",
    incoming: "Incoming call",
    via: "New customer from Google Maps",
    open: "Open now",
    call: "Call",
    route: "Directions",
    caption: "Illustration",
  },

  problem: {
    title: "If you’re not in the top 3, the phone rarely rings",
    body: "A leaking roof, a blocked drain, a power cut: nobody goes to page two. And for a renovation, people call the well-reviewed firms at the top of the map first. They search on Google, see three businesses and call one of them. If you’re not there, the job goes to someone else — even if you do better or cheaper work.",
    points: [
      { t: "Dependent on others", d: "Without customers from Google, you rely on word of mouth or lead platforms that charge you for every enquiry." },
      { t: "A profile standing still", d: "Google rewards active profiles: new photos, posts, replies to reviews. Most tradespeople don’t have time for that." },
      { t: "Competitors who do move", d: "Whoever updates their profile every week slowly climbs. Whoever does nothing slips." },
    ],
  },

  grid: {
    title: "We measure your ranking at 25 points across your area",
    body: "Your position on Google Maps depends on where the customer searches from. So we measure how high you rank on a grid around your business — before we start, then every month. You see in black and white whether it’s working.",
    before: "Today",
    after: "The goal after 3 months",
    legend: ["Top 3", "Position 4–10", "Not visible"],
    caption: "Illustrative example. On the free call we look together at where you stand today.",
  },

  how: {
    title: "How it works",
    steps: [
      { t: "Free ranking scan and 15-minute call", d: "We show you on the map where you rank today for the searches that bring you customers, and who ranks above you." },
      { t: "We set your profile up properly", d: "In the first week we tune your categories, services, description, photos and service area to the searches in your trade." },
      { t: "A step forward every week", d: "After that we work on your profile weekly. Every month you get a report showing your ranking on the map." },
    ],
  },

  features: {
    title: "What we do for you every week",
    sub: "You do your trade. We make sure Google sees your business is active, relevant and trustworthy.",
    items: [
      { t: "Keyword research", d: "We find out what customers in your area actually search for and build your profile around it." },
      { t: "Fully optimised profile", d: "Categories, services, description and service area completely filled in and tuned." },
      { t: "Weekly Google posts", d: "A new post on your profile every week, so Google sees your business is alive." },
      { t: "Photos of your work", d: "We regularly upload photos with the right description. You just forward them." },
      { t: "A reply to every review", d: "Every review gets a professional reply — including the less good ones." },
      { t: "Monthly ranking report", d: "Every month you see on the map how your position is moving. No vague numbers." },
    ],
  },

  proof: { title: "What clients say" },

  guarantee: {
    ring: "MONEY-BACK GUARANTEE • NOT HIGHER, MONEY BACK • ",
    months: "months",
    badge: "3 months",
    title: "Not higher after 3 months? Money back.",
    body: "We measure your ranking at the start. If your average position on Google Maps isn’t higher after 3 months, we refund what you paid us. The risk is on us, not on you.",
    note: "The terms are agreed in writing before we start.",
  },

  fit: {
    title: "Is this for you?",
    yesTitle: "It’s for you if…",
    yes: [
      "you run a roofing, renovation, plumbing or electrical business (or another construction or home service business)",
      "you work in a fixed area in Belgium",
      "you can take on more jobs and would rather get them directly than through lead platforms",
    ],
    noTitle: "It’s not for you if…",
    no: ["you already can’t take on new customers", "you don’t have a fixed service area", "you expect results within a week"],
  },

  calc: {
    title: "What’s one extra job worth to you?",
    sub: "Enter your own numbers and see when PinRank pays for itself.",
    job: "Average job value",
    extra: "Extra jobs per month from Google",
    revenue: "Extra revenue per month",
    one: "PinRank pays for itself with {n} job a month.",
    many: "PinRank pays for itself with {n} jobs a month.",
    note: "An example with your numbers, not a promise of results. Amounts excl. VAT.",
  },

  pricing: {
    title: "One package. One clear price.",
    name: "PinRank Local",
    period: { month: "per month", once: "one-time" },
    vat: "excl. VAT",
    includes: [
      "Keyword research for your trade and area",
      "Full optimisation of your Google profile",
      "Weekly posts and photos",
      "A reply to every review",
      "Monthly ranking report on the map",
      "Money-back guarantee after 3 months",
    ],
    cta: "Book a free call",
    note: "A no-obligation call first — you decide after.",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      { q: "What is the free ranking scan?", a: "A map of your area showing where you rank on Google Maps for your main keyword at 25 points around your business, and who ranks above you. We go through it together on the free call." },
      { q: "How quickly will I see results?", a: "It depends on your area and how much competition there is. Local ranking builds over weeks, not days — that’s why we measure after 3 months and back it with a money-back guarantee." },
      { q: "How exactly does the money-back guarantee work?", a: "At the start we measure your ranking on the map for your main keywords. After 3 months we measure again, the same way. If your average position hasn’t improved, we refund what you paid." },
      { q: "Do I have to do much myself?", a: "Very little. You give us access to your Google Business Profile (we explain how) and forward photos of your work now and then. We do the rest." },
      { q: "I don’t have a Google Business Profile yet. Can I still start?", a: "Tell us on the call. We’ll work out the best first step together." },
      { q: "Is this the same as Google Ads?", a: "No. With Google Ads you pay per click and everything stops when you stop paying. We work on your place in the regular Google Maps results — you don’t pay per click there." },
      { q: "What happens on the free call?", a: "We look at your current ranking, show you what your competitors do differently and tell you honestly whether we can help. If it’s not a fit, we’ll say so." },
    ],
  },

  final: {
    title: "Curious where you stand today?",
    body: "Answer 4 quick questions and we’ll prepare your free ranking scan: where you stand today, and who ranks above you. We go through it on a 15-minute call.",
    cta: "Get your free ranking scan",
  },

  sticky: { cta: "Free scan" },

  quiz: {
    title: "Your free ranking scan",
    progress: "Step {n} of {total}",
    close: "Close",
    back: "Back",
    next: "Next",
    q1: "What kind of business do you run?",
    q2: "Which area do you work in?",
    q2Placeholder: "e.g. Ghent, Brussels or Liège",
    q3: "Do you already have a Google Business Profile?",
    gbp: { yes: "Yes", no: "No", unsure: "Not sure" },
    q4: "How can we reach you?",
    fields: { name: "Your name", company: "Business name", phone: "Mobile number", email: "Email address" },
    submit: "Request my scan",
    privacy: "We only use your details to follow up on your request.",
    privacyLink: "Privacy policy",
    errors: { required: "Please fill this in.", phone: "That doesn’t look like a valid number.", email: "That doesn’t look like a valid email address." },
    resultTitle: "Good news, {name}!",
    resultBody: "We’re preparing your ranking scan for {region}. Pick a time below for your free 15-minute call: we’ll show you where you stand and what your competitors do differently.",
    resultBodyNoCal: "We’re preparing your ranking scan for {region}. Send us a WhatsApp and we’ll book a 15-minute call to go through it.",
    or: "or",
    wa: "Prefer WhatsApp? Send us a message",
    waPrimary: "Book your call on WhatsApp",
  },

  wa: {
    generic: "Hi PinRank, I’d like to know more about ranking higher on Google Maps.",
    quiz: "Hi PinRank, I’m {name} from {company} ({trade}, {region}). I’d like to book a free call about my Google Maps ranking.",
  },

  thanks: {
    meta: "Your call is booked — PinRank",
    title: "Great, your call is booked!",
    body: "You’ll get a confirmation email with all the details shortly.",
    prepTitle: "How to get the most out of it",
    prep: [
      "Make sure you can log in to the Google account linked to your business profile.",
      "Think about the 2–3 services you most want more customers for.",
      "Note which competitors you often see ranking above you.",
    ],
    wa: "Forgot something or need to reschedule? Send us a WhatsApp",
    back: "Back to the website",
  },

  cookie: {
    text: "We use cookies to measure which ads work — only if you’re fine with that.",
    accept: "Accept",
    decline: "Decline",
    settings: "Cookie settings",
  },

  footer: {
    vat: "Company no.",
    privacy: "Privacy",
    disclaimer: "PinRank is not affiliated with Google. Google and Google Maps are trademarks of Google LLC.",
  },

  privacy: {
    meta: "Privacy policy — PinRank",
    title: "Privacy policy",
    updated: "Last updated",
    sections: (c) => [
      { h: "Who is responsible?", p: `${c.name}${c.address ? `, ${c.address}` : ""}${c.vat ? `, company number ${c.vat}` : ""}. Questions about your data? Email ${c.email}.` },
      { h: "What do we collect?", p: "What you fill in on our questionnaire (name, business name, area, type of business, mobile number, email address), what you enter when booking a call, messages you send us on WhatsApp and — only with your consent — advertising cookies." },
      { h: "Why?", p: "To follow up on your request and book a call with you (steps prior to a contract, Art. 6(1)(b) GDPR). Advertising cookies are only used to measure which ads work, and only with your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time via ‘Cookie settings’ at the bottom of the page." },
      { h: "Who do we share it with?", p: "Services that help us: Cal.com (scheduling), Meta (ad measurement, only with consent), WhatsApp (messages), our hosting provider and the tool we track enquiries in. Some process data outside the EU, based on the European Commission’s standard contractual clauses or the EU-US Data Privacy Framework. We never sell your data." },
      { h: "How long do we keep it?", p: "If you don’t become a client, we delete your data no later than 24 months after our last contact. If you do, we keep it as long as needed for our work together and our legal obligations." },
      { h: "Your rights", p: `You have the right to access, rectification, erasure, restriction, portability and objection. Email ${c.email}. If you’re not happy with our reply, you can lodge a complaint with the Belgian Data Protection Authority (www.dataprotectionauthority.be).` },
    ],
  },
};

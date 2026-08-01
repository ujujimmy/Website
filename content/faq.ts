/**
 * FAQ doubles as SEO surface (rendered as FAQPage JSON-LD) and as objection
 * handling. The offshore question is answered head-on rather than avoided —
 * a US buyer is going to think it either way, and dodging it reads worse.
 */

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How quickly will I see results?",
    a: "Review volume moves fastest — most clients see a meaningful jump within the first 30 days, because the requests start going out immediately. Website work takes 2–6 weeks to build and launch. SEO is the slow one: expect 3–6 months before movement on competitive terms, and be sceptical of anyone who promises faster.",
  },
  {
    q: "Do you buy or fake reviews?",
    a: "No, and we'd walk away from the work before doing it. Fake reviews get Google Business Profiles suspended and in several countries they are outright illegal. Everything we generate comes from real customers who actually used your business — we just make it easy for them to say so.",
  },
  {
    q: "You're based overseas. Why does that work for me?",
    a: "It means you get senior work at a fraction of a US agency's rate, because our costs are lower — not because the work is thinner. We keep US Eastern and Pacific hours for calls and communicate in writing so nothing gets lost. Our clients today are in Delhi, and we would rather tell you that than pretend otherwise — their listings are public, so you can check the rating and review counts we claim in about a minute. That is the whole point: you never have to take our word for anything.",
  },
  {
    q: "Am I locked into a contract?",
    a: "No. Everything is month to month with 30 days notice. There's an initial setup fee on the Starter and Growth plans that covers the profile overhaul or website build, but after that you can stop whenever you want.",
  },
  {
    q: "Who owns the website and accounts?",
    a: "You do — all of it. Domain, code, content, Google Business Profile, analytics. Everything is created in your name from the start. If you leave, you take the whole thing with you and nothing breaks.",
  },
  {
    q: "What if I already have a website?",
    a: "Then we start with an audit and tell you honestly whether it's worth improving or rebuilding. Plenty of sites just need speed and structure fixed. If yours is one of them, we'll say so rather than sell you a rebuild you don't need.",
  },
  {
    q: "What does the free audit actually include?",
    a: "A review of your Google Business Profile against your top three local competitors, a technical and speed check on your website, and the specific keyword gaps costing you traffic. It's a real document written by a person, and you keep it whether or not you hire us.",
  },
  {
    q: "Which industries do you work with?",
    a: "Mostly local service businesses where reviews drive the buying decision — dental and medical practices, home services, med spas, veterinary clinics, restaurants and professional services. If reviews and local search matter to how you get customers, the approach applies.",
  },
];

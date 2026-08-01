import { brand } from "./brand";
import { services } from "./services";

/** Primary navigation. Services expands into a dropdown on desktop. */
export const nav = [
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      label: s.name,
      href: `/services/${s.slug}`,
      blurb: s.blurb,
    })),
  },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  {
    title: "Services",
    links: services.map((s) => ({
      label: s.name,
      href: `/services/${s.slug}`,
    })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Pricing", href: "/pricing" },
      { label: "Areas we serve", href: "/locations" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Free audit", href: "/audit" },
      { label: "Sample audit", href: "/audit/sample" },
      { label: `Email us`, href: `mailto:${brand.contact.email}` },
      { label: "Call us", href: brand.contact.phoneHref },
    ],
  },
];

/**
 * The homepage scroll narrative. Each entry is one "beat" of the single
 * continuous 3D animation — the canvas reads `beat` to know which position
 * buffer to morph toward, and the DOM renders the copy for the same index.
 *
 * Keep this array and components/three/beats in sync: index === beat id.
 */
export const beats = [
  { id: 0, key: "hero", label: "Hero" },
  { id: 1, key: "problem", label: "The problem" },
  { id: 2, key: "reviews", label: "Google Reviews" },
  { id: 3, key: "web", label: "Web Design" },
  { id: 4, key: "seo", label: "SEO" },
  { id: 5, key: "global", label: "Global reach" },
  { id: 6, key: "cta", label: "Free audit" },
] as const;

export type BeatKey = (typeof beats)[number]["key"];

/** Homepage copy, keyed to the beats above. */
export const homeCopy = {
  hero: {
    eyebrow: "Google Reviews · Websites · SEO",
    headline: "Get chosen before they ever call you.",
    sub: "Your next customer compares you to three competitors in about eleven seconds — stars, then website, then whoever shows up first. We make sure that comparison ends with you.",
    note: "Free audit. No call required. You keep it either way.",
  },
  problem: {
    eyebrow: "The quiet leak",
    headline: "You never hear from the customers you lose.",
    sub: "There's no notification when someone picks the competitor with 300 reviews, or leaves a site that took five seconds to load. The loss is invisible, which is exactly why it goes unfixed for years.",
    points: [
      "A 3.9 rating filters you out before anyone reads a word about you",
      "A slow site loses over half its mobile visitors before it finishes loading",
      "Page-two rankings get a rounding error's worth of clicks",
    ],
  },
  global: {
    eyebrow: "Where we work",
    headline: "Based in Delhi. Set up for your timezone.",
    sub: "Our clients today are here in India, and their results are public — you can verify every claim on this site in about a minute. We keep US Eastern and Pacific hours, and we would rather show you checkable work from Delhi than a client list we do not have.",
    markers: [
      { label: "Delhi, India", detail: "Where we are, and where our clients are today" },
      { label: "United States", detail: "ET & PT hours covered" },
      { label: "Canada", detail: "ET & MT hours covered" },
      { label: "United Kingdom", detail: "GMT hours covered" },
    ],
  },
  cta: {
    eyebrow: "Free, no strings",
    headline: "See exactly what's costing you customers.",
    sub: "Send us your business name and website. You'll get back a real audit written by a person: your Google profile against your three closest competitors, your site's speed and technical issues, and the searches you're missing.",
    bullets: [
      "Delivered within 2 business days",
      "No call required to receive it",
      "Yours to keep, and to act on without us",
    ],
  },
} as const;

export const processSteps = [
  {
    step: "01",
    title: "Free audit",
    body: "We look at your profile, your site and your search visibility, and send you a written breakdown of what's actually wrong.",
  },
  {
    step: "02",
    title: "Plan & pricing",
    body: "A clear scope with a fixed monthly number. If only one of the three services makes sense for you, we'll tell you that.",
  },
  {
    step: "03",
    title: "Build",
    body: "Profile overhaul, website build, technical fixes — the heavy lifting happens in the first 30–45 days.",
  },
  {
    step: "04",
    title: "Compound",
    body: "Reviews keep arriving, content keeps publishing, rankings keep climbing. You get one report a month showing leads, not vanity metrics.",
  },
];

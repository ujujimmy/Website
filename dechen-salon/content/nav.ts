import { chapters } from "./menu";

export const nav = [
  {
    label: "Services",
    href: "/services",
    children: chapters.map((chapter) => ({
      label: chapter.name,
      href: `/services/${chapter.slug}`,
      blurb: chapter.blurb,
    })),
  },
  { label: "Price menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our philosophy", href: "/about", blurb: "What we stand for" },
      { label: "Dechen Dolkar", href: "/founder", blurb: "Founder & Creative Director" },
      { label: "The team", href: "/team", blurb: "Our three stylist tiers" },
      { label: "Reviews", href: "/reviews", blurb: "In our clients' words" },
    ],
  },
  { label: "Visit", href: "/visit" },
] as const;

export const footerNav = [
  {
    title: "Services",
    links: chapters.map((chapter) => ({
      label: chapter.name,
      href: `/services/${chapter.slug}`,
    })),
  },
  {
    title: "The salon",
    links: [
      { label: "Our philosophy", href: "/about" },
      { label: "Dechen Dolkar", href: "/founder" },
      { label: "The team", href: "/team" },
      { label: "Gallery", href: "/gallery" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Full price menu", href: "/menu" },
      { label: "Find us", href: "/visit" },
    ],
  },
];

import type { Metadata } from "next";
import { RESTAURANT, SITE_URL } from "@/data/site";
import { MENU } from "@/data/menu";
import { FAQS } from "@/data/faq";
import { PRIORITY_SLOTS } from "@/data/images";

const abs = (path: string) => new URL(path, SITE_URL).toString();

/** Per-page <title>/<meta>/canonical/og in one call. */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: RESTAURANT.name,
      locale: "en_IN",
      url: abs(path),
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Restaurant + LocalBusiness.
 *
 * `sameAs` carries Instagram only. No Facebook URL has been verified, and a
 * guessed one tells Google that some other business's page belongs to this
 * restaurant — worse than the omission. See RESTAURANT.links.facebook.
 */
export function restaurantLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": `${SITE_URL}/#restaurant`,
    name: RESTAURANT.name,
    url: SITE_URL,
    image: PRIORITY_SLOTS.map((s) => abs(s.src)),
    telephone: RESTAURANT.phone.display,
    priceRange: RESTAURANT.priceRange,
    currenciesAccepted: RESTAURANT.currency,
    servesCuisine: [...RESTAURANT.cuisine],
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT.address.street,
      addressLocality: RESTAURANT.address.locality,
      addressRegion: RESTAURANT.address.region,
      postalCode: RESTAURANT.address.postalCode,
      addressCountry: RESTAURANT.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: RESTAURANT.geo.lat,
      longitude: RESTAURANT.geo.lng,
    },
    openingHoursSpecification: RESTAURANT.hours.days.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${day}`,
      opens: RESTAURANT.hours.opens,
      closes: RESTAURANT.hours.closes,
    })),
    menu: abs("/menu"),
    hasMap: RESTAURANT.links.map,
    sameAs: [RESTAURANT.links.instagram, RESTAURANT.links.facebook].filter(
      (x): x is string => typeof x === "string",
    ),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: RESTAURANT.rating.value,
      reviewCount: RESTAURANT.rating.count,
    },
  };
}

/**
 * Menu + MenuItem.
 *
 * No `offers` block is emitted anywhere, because no price has been verified.
 * Publishing a guessed price into a Google rich result is the same mistake as
 * printing it on the page, with wider distribution. When src/data/menu.ts has
 * real prices, the offers below start emitting on their own.
 */
export function menuLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE_URL}/menu#menu`,
    name: `Menu — ${RESTAURANT.name}`,
    inLanguage: "en-IN",
    hasMenuSection: MENU.map((section) => ({
      "@type": "MenuSection",
      name: section.name,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.note ? { description: item.note } : {}),
        ...(item.veg === true
          ? { suitableForDiet: "https://schema.org/VegetarianDiet" }
          : {}),
        ...(item.price !== null
          ? {
              offers: {
                "@type": "Offer",
                price: item.price,
                priceCurrency: RESTAURANT.currency,
              },
            }
          : {}),
      })),
    })),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: abs(item.path),
      }),
    ),
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

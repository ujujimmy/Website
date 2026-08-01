import { brand } from "@/content/brand";
import { services } from "@/content/services";
import { faqs } from "@/content/faq";

/**
 * JSON-LD builders. Structured data is table stakes for a site that sells
 * SEO — a prospect running Google's Rich Results Test on us is a real
 * scenario, and failing it would be embarrassing.
 */

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${brand.url}/#organization`,
    name: brand.name,
    legalName: brand.legalName,
    url: brand.url,
    description: brand.description,
    email: brand.contact.email,
    telephone: brand.contact.phone,
    priceRange: "$$",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "India" },
    ],
    sameAs: Object.values(brand.socials),
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.blurb,
        url: `${brand.url}/services/${s.slug}`,
      },
    })),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${brand.url}/#website`,
    url: brand.url,
    name: brand.name,
    description: brand.description,
    publisher: { "@id": `${brand.url}/#organization` },
  };
}

export function serviceLd(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.seo.description,
    url: `${brand.url}/services/${service.slug}`,
    provider: { "@id": `${brand.url}/#organization` },
    serviceType: service.name,
    areaServed: ["United States", "Canada", "United Kingdom", "India"],
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${brand.url}${item.href}`,
    })),
  };
}

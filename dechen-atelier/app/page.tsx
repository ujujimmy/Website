import type { Metadata } from "next";
import { home } from "@/content/copy";
import { brand } from "@/content/brand";
import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { ColourFeature } from "@/components/home/ColourFeature";
import { ExtensionsFeature } from "@/components/home/ExtensionsFeature";
import { FounderPanel } from "@/components/home/FounderPanel";
import { Lookbook } from "@/components/home/Lookbook";
import { ReviewsFeature } from "@/components/home/ReviewsFeature";
import { VisitPanel } from "@/components/home/VisitPanel";
import { Chapter, Rule } from "@/components/ui/Section";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { reviewsLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage reads down as a numbered magazine feature: an opening spread,
 * then six chapters, each announced by its number in the left margin. The
 * ground changes exactly twice — for the founder and for the footer — so when
 * it does change it means something.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Chapter n="01" label="Philosophy">
        <Statement />
      </Chapter>

      <Rule />

      <Chapter n="02" label="Services">
        <h2 className="t-section max-w-2xl">
          <RevealLines lines={[home.services.title]} />
        </h2>
        <Reveal delay={0.08}>
          <p className="prose-measure mt-6 mb-12">{home.services.lead}</p>
        </Reveal>
        <ServiceIndex />
      </Chapter>

      <Rule />

      <Chapter n="03" label="Colour">
        <ColourFeature />
      </Chapter>

      <Rule />

      <Chapter n="04" label="Length">
        <ExtensionsFeature />
      </Chapter>

      <FounderPanel />

      <Lookbook />

      <Chapter n="07" label="Reviews" tone="paper-2">
        <h2 className="t-section mb-12 max-w-2xl">
          <RevealLines lines={[home.reviews.title]} />
        </h2>
        <ReviewsFeature />
      </Chapter>

      <Chapter n="08" label="Visit">
        <VisitPanel />
      </Chapter>

      <JsonLd data={reviewsLd()} />
    </>
  );
}

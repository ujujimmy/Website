import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { ServicePreview } from "@/components/home/ServicePreview";
import { ColourFeature } from "@/components/home/ColourFeature";
import { ExtensionsFeature } from "@/components/home/ExtensionsFeature";
import { FounderStrip } from "@/components/home/FounderStrip";
import { TierCards } from "@/components/home/TierCards";
import { Lookbook } from "@/components/home/Lookbook";
import { Reviews } from "@/components/home/Reviews";
import { VisitCard } from "@/components/home/VisitCard";
import { JsonLd } from "@/components/JsonLd";
import { reviewsLd } from "@/lib/seo";

/**
 * The homepage, in the order a client actually asks questions:
 * who are you, what do you believe, what do you do, can you do my colour,
 * can you do length, who will be holding the scissors, is anyone happy, where
 * are you.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <ServicePreview />
      <ColourFeature />
      <ExtensionsFeature />
      <FounderStrip />
      <TierCards />
      <Lookbook />
      <Reviews />
      <VisitCard />

      <JsonLd data={reviewsLd()} />
    </>
  );
}

import { StoryStage } from "@/components/story/StoryStage";
import {
  ActOpen,
  ActPhilosophy,
  ActCut,
  ActColor,
  ActLength,
  ActCare,
  ActVisit,
} from "@/components/story/acts";
import { ServicePreview } from "@/components/home/ServicePreview";
import { Lookbook } from "@/components/home/Lookbook";
import { FounderStrip } from "@/components/home/FounderStrip";
import { TierCards } from "@/components/home/TierCards";
import { Reviews } from "@/components/home/Reviews";
import { VisitCard } from "@/components/home/VisitCard";
import { Blossom } from "@/components/ui/Section";
import { JsonLd } from "@/components/JsonLd";
import { reviewsLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      {/*
        The scroll story. Seven acts, each one viewport tall, mapping 1:1 onto
        the shapes in lib/strand/shapes.ts. All the copy is real HTML — the
        canvas behind it is decoration and the page reads fine without it.
      */}
      <StoryStage>
        <ActOpen />
        <ActPhilosophy />
        <ActCut />
        <ActColor />
        <ActLength />
        <ActCare />
        <ActVisit />
      </StoryStage>

      {/* Everything a visitor needs once the reel has done its job. */}
      <ServicePreview />
      <Lookbook />
      <FounderStrip />
      <Blossom />
      <TierCards />
      <Reviews />
      <VisitCard />

      <JsonLd data={reviewsLd()} />
    </>
  );
}

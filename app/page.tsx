import { Narrative } from "@/components/home/Narrative";
import { Hero } from "@/components/home/Hero";
import { ScrollRail } from "@/components/home/ScrollRail";
import {
  ProblemBeat,
  ServiceBeat,
  GlobalBeat,
  AuditBeat,
} from "@/components/home/Beats";
import { Scorecard } from "@/components/home/Scorecard";
import { PathSelector } from "@/components/home/PathSelector";
import { ProofItWorks } from "@/components/home/ProofItWorks";
import {
  Process,
  Testimonials,
  PricingPreview,
  FaqSection,
  ClosingCta,
} from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <main>
      <ScrollRail />

      {/*
        The scroll narrative. These seven sections map 1:1 onto the beats in
        content/site.ts and the position buffers in lib/three/shapes.ts —
        Narrative converts scroll position across this wrapper into the 0–1
        progress that morphs the particle field.
      */}
      <Narrative>
        <Hero />
        <ProblemBeat />
        {/*
          The self-select cards sit inside the narrative, immediately after
          the problem, rather than eight screens further down. A visitor who
          has just read why they're losing customers is at their most
          motivated to say which one they are — and on mobile this was the
          single biggest thing standing between arriving and reaching an
          answer. Narrative only measures [data-beat] sections, so a non-beat
          section between two beats simply holds the particle field on the
          "scattered" state while these are read.
        */}
        <PathSelector />
        <ServiceBeat slug="google-reviews" side="left" />
        <ServiceBeat slug="web-design" side="right" />
        <ServiceBeat slug="seo" side="left" />
        <GlobalBeat />
        <AuditBeat />
      </Narrative>

      {/* Supporting detail for visitors who need more than the reel. */}
      <ProofItWorks />
      <Scorecard />
      <PricingPreview />
      <Process />
      <Testimonials />
      <FaqSection limit={6} />
      <ClosingCta />

      <JsonLd data={faqLd()} />
    </main>
  );
}

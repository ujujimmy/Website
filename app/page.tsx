import { Narrative } from "@/components/home/Narrative";
import { Hero } from "@/components/home/Hero";
import { ScrollRail } from "@/components/home/ScrollRail";
import {
  ProblemBeat,
  ServiceBeat,
  GlobalBeat,
  AuditBeat,
} from "@/components/home/Beats";
import { PathSelector } from "@/components/home/PathSelector";
import { ProofItWorks } from "@/components/home/ProofItWorks";
import { StickyCta } from "@/components/home/StickyCta";
import {
  PricingPreview,
  FaqSection,
  ClosingCta,
} from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/seo";

/**
 * The homepage, read as a funnel.
 *
 * Every section below answers the one question a visitor is asking at that
 * point, in the order they ask it: what is this, does it apply to me, which
 * one am I, how does it get fixed, can I believe you, what does it cost,
 * what about my objection, how do I start. A section that answers no live
 * question is a section the visitor scrolls past on the way to the answer
 * they came for, so there aren't any.
 *
 * This used to carry three more: a Lighthouse scorecard, a four-step process
 * breakdown and a testimonials block. Each was defensible on its own and all
 * three sat between the proof and the price, which is exactly where someone
 * who is nearly convinced decides whether to keep scrolling. They still exist
 * — Scorecard on the location pages, Process on the service pages, where a
 * reader has already opted into that level of detail.
 */
export default function HomePage() {
  return (
    <main>
      <ScrollRail />

      {/*
        The scroll narrative. These seven sections map 1:1 onto the beats in
        content/site.ts and the position buffers in lib/three/shapes.ts —
        Narrative converts scroll position across this wrapper into the 0–1
        progress that morphs the particle field. Seven in, seven out: the
        shortening happened inside each beat's copy, never by dropping one,
        because removing a beat would silently drop a shape from the morph
        sequence and leave the particle field jumping between states.
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

      {/* Proof, then price, then the objections that survive both, then the
          booking. Nothing between the price and the way to act on it. */}
      <ProofItWorks />
      <PricingPreview />
      <FaqSection limit={4} />
      <ClosingCta />

      <StickyCta />

      <JsonLd data={faqLd()} />
    </main>
  );
}

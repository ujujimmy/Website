import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { PricingTable } from "@/components/pricing/PricingTable";
import { FaqSection, ClosingCta } from "@/components/home/Supporting";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent monthly pricing for Google review management, web design and SEO. Three packages in USD, no long-term contracts.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Pricing"
        title="What it costs, before you talk to anyone."
        sub="Most agencies hide this so they can price you based on how much they think you'll pay. Here are the actual numbers."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
        ]}
      />

      <Section className="pt-0">
        <div className="container-page">
          <PricingTable />
        </div>
      </Section>

      <FaqSection />
      <ClosingCta
        title="Not sure which one fits?"
        sub="Get the free audit first. It tells you which of the three things is actually costing you the most — and sometimes the answer is only one of them."
      />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
        ])}
      />
    </main>
  );
}

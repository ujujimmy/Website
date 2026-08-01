import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FaqSection } from "@/components/home/Supporting";
import { BookingEmbed } from "@/components/contact/BookingEmbed";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${brand.name} about Google reviews, web design or SEO. We work US Eastern and Pacific hours.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Talk to a person, not a form robot."
        sub="Every message here reaches us directly, and we answer all of them — including the ones that turn out not to be a fit."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <Section className="pt-4">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <Reveal>
            <div className="glass flex h-full flex-col rounded-[var(--radius-card)] p-7">
              <h2 className="text-lg font-semibold">Get the free audit</h2>
              <p className="mt-3 grow text-sm leading-relaxed text-muted">
                The fastest way to find out whether we can help. Takes about a
                minute, and you get a real written audit back within two
                business days.
              </p>
              <Button href="/audit" className="mt-6 w-full">
                Start the audit
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass flex h-full flex-col rounded-[var(--radius-card)] p-7">
              <h2 className="text-lg font-semibold">Email us</h2>
              <p className="mt-3 grow text-sm leading-relaxed text-muted">
                Ask anything — pricing, scope, whether your situation is one we
                actually handle. We reply within one business day.
              </p>
              <Button
                href={`mailto:${brand.contact.email}`}
                variant="secondary"
                className="mt-6 w-full"
              >
                {brand.contact.email}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="glass flex h-full flex-col rounded-[var(--radius-card)] p-7">
              <h2 className="text-lg font-semibold">Call us</h2>
              <p className="mt-3 grow text-sm leading-relaxed text-muted">
                We keep {brand.hours}. If you call outside that, leave a message
                and we&apos;ll come back to you at the start of your next
                business day.
              </p>
              <Button
                href={brand.contact.phoneHref}
                variant="secondary"
                className="mt-6 w-full"
              >
                {brand.contact.phone}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Below the audit CTA on purpose — the audit converts colder
            traffic, booking suits people who are already interested. */}
        <div className="container-page mt-12">
          <Reveal>
            <BookingEmbed />
          </Reveal>
        </div>

        <div className="container-page mt-12">
          <Reveal>
            <div className="rounded-[var(--radius-card)] border border-line bg-ink-2/60 p-7 text-sm leading-relaxed text-muted sm:p-9">
              <h2 className="text-base font-semibold text-fg">
                Where we are, plainly
              </h2>
              <p className="mt-3 max-w-3xl">
                We&apos;re a small team based in Delhi. Our clients are here
                today, and we&apos;re set up to work with businesses in the
                United States, Canada and the United Kingdom — calls happen on
                your clock, {brand.hours}. We put everything in writing so
                nothing depends on catching someone at the right moment, and
                every result we claim is on a public Google listing you can
                check yourself.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <FaqSection limit={5} />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />
    </main>
  );
}

import type { Metadata } from "next";
import { brand, primaryLocation, whatsappLink, bookingMessage } from "@/content/brand";
import { chapters } from "@/content/menu";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Visit us",
  description: `DECHEN Salon, ${primaryLocation.street}, ${primaryLocation.locality}, ${primaryLocation.region}. ${brand.hours.display}. Book by WhatsApp or phone.`,
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  return (
    <>
      <PageHero
        eyebrow="Come and sit with us"
        title="Find us in Majnu-ka-Tilla."
        sub="Walk in, or send a message and we'll find you a time. Colour and extensions are best booked ahead so we can give them the hours they deserve."
      />

      {/* The two ways to book. Nothing else competes with these. */}
      <div className="px-6 pb-16">
        <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          <Reveal>
            <a
              href={whatsappLink(bookingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="panel flex h-full flex-col items-center justify-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886" />
                </svg>
              </span>
              <span className="text-lg font-semibold text-ink">WhatsApp</span>
              <span className="text-sm text-muted">
                The fastest way. Send a photo and we&rsquo;ll advise.
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.07}>
            <a
              href={brand.contact.phoneHref}
              className="panel flex h-full flex-col items-center justify-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-plum">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 fill-none stroke-petal stroke-[1.7]"
                  aria-hidden="true"
                >
                  <path
                    d="M6.6 3.5h-.9A2.2 2.2 0 003.5 5.9c0 8 6.6 14.6 14.6 14.6a2.2 2.2 0 002.4-2.2v-.9a1.3 1.3 0 00-1-1.3l-3-.7a1.3 1.3 0 00-1.3.5l-.7.9a11 11 0 01-5.3-5.3l.9-.7a1.3 1.3 0 00.5-1.3l-.7-3a1.3 1.3 0 00-1.3-1z"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-lg font-semibold text-ink">Call us</span>
              <span className="text-sm text-muted">{brand.contact.phone}</span>
            </a>
          </Reveal>
        </div>
      </div>

      {/* Where and when */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="Where" title="Two locations." />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Both are in Majnu-ka-Tilla, and both take the same number and the
              same hours. Come to whichever is nearer.
            </p>

            <ul className="mt-7 flex flex-col gap-6">
              {brand.locations.map((location) => (
                <li key={location.id} className="panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
                    {location.role}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-ink">
                    {location.name}
                  </h3>
                  <address className="mt-2 not-italic text-sm leading-relaxed text-muted">
                    {location.street}
                    <br />
                    {location.locality}, {location.region} {location.postalCode}
                  </address>
                  <a
                    href={location.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-3 inline-block pb-0.5 text-sm font-medium text-gold-ink"
                  >
                    Get directions
                    <span className="sr-only"> to {location.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Button href={brand.socials.instagram} variant="secondary" external>
                {brand.socials.instagramHandle}
                <Arrow />
              </Button>
            </div>
          </div>

          <div>
            <SectionHead eyebrow="When" title="Opening hours." />
            <p className="mt-6 text-base leading-relaxed text-muted">
              {brand.hours.display}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {brand.hours.note}
            </p>

            <h3 className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
              How long to allow
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted">
              <li>
                A cut and blowdry is a short appointment. Global colour,
                highlights and balayage take considerably longer, and a full head
                of extensions is a session, not a stop-in.
              </li>
              <li>
                Tell us what you want when you message and we&rsquo;ll give you
                the honest number before you set out.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Straight to a service */}
      <Section>
        <SectionHead
          eyebrow="Book a service"
          title="Know what you want already?"
          sub="Tap a service and the message arrives with it already named."
          center
        />
        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {chapters.map((chapter, i) => (
            <Reveal as="li" key={chapter.slug} delay={i * 0.05}>
              <a
                href={whatsappLink(
                  `Hi ${brand.shortName}! I'd like to book ${chapter.name.toLowerCase()}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-card px-6 py-3 text-sm font-medium text-ink shadow-[0_6px_20px_-14px_rgb(59_27_51_/_0.4)] transition-colors hover:text-gold-ink"
              >
                {chapter.name}
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Visit us", path: "/visit" },
        ])}
      />
    </>
  );
}

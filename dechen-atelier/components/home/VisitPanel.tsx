import { home } from "@/content/copy";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * Where we are and how to reach us, with no form in sight.
 *
 * Booking is a phone call or a WhatsApp message by the salon's own choice, so
 * the page ends with the two things that actually start an appointment rather
 * than a field labelled "preferred date".
 */
export function VisitPanel() {
  const details = [
    { label: "Address", value: `${brand.address.street}, ${brand.address.locality}` },
    { label: "Hours", value: brand.hours.display },
    { label: "Phone", value: brand.contact.phone, href: brand.contact.phoneHref },
    {
      label: "Instagram",
      value: brand.socials.instagramHandle,
      href: brand.socials.instagram,
    },
  ];

  return (
    <div>
      <h2 className="t-section max-w-2xl">
        <RevealLines lines={[home.visit.title]} />
      </h2>

      <Reveal delay={0.08}>
        <p className="prose-measure mt-8">{home.visit.lead}</p>
      </Reveal>

      <Reveal delay={0.12}>
        <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="border-t border-line pt-4">
              <dt className="micro text-muted">{detail.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed">
                {detail.href ? (
                  <a
                    className="link-rule"
                    href={detail.href}
                    target={detail.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.16} className="mt-10 flex flex-wrap gap-3">
        <Button href={whatsappLink(bookingMessage)} external>
          Book on WhatsApp
          <Arrow />
        </Button>
        <Button href="/visit" variant="line">
          Directions
        </Button>
      </Reveal>
    </div>
  );
}

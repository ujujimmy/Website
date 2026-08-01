import { brand, whatsappLink, bookingMessage } from "@/content/brand";
import { Button, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The closing panel: where we are, when we're open, and the two ways to reach
 * us. No form — booking here is a conversation.
 */
export function VisitCard() {
  return (
    <section className="px-6 pb-24 pt-4" aria-labelledby="visit-heading">
      <Reveal>
        <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-plum px-8 py-14 text-center text-petal sm:px-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">
            Majnu-ka-Tilla, New Delhi
          </p>

          <h2 id="visit-heading" className="mt-5 text-3xl sm:text-4xl">
            Come and sit with us.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-petal/75">
            Walk in, or send a message and we&rsquo;ll find you a time. Colour and
            extensions are best booked ahead so we can give them the hours they
            deserve.
          </p>

          <dl className="mx-auto mt-10 grid max-w-md gap-6 text-left sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-widest text-rose">Where</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-petal/85">
                {brand.address.street}
                <br />
                {brand.address.locality}, {brand.address.region}{" "}
                {brand.address.postalCode}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-rose">When</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-petal/85">
                {brand.hours.display}
                <br />
                {brand.hours.note}
              </dd>
            </div>
          </dl>

          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={whatsappLink(bookingMessage)}
              size="lg"
              variant="secondary"
              external
            >
              Book on WhatsApp
              <Arrow />
            </Button>
            <Button href={brand.contact.phoneHref} size="lg" variant="ghost">
              Call {brand.contact.phone}
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

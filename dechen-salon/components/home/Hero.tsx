import Image from "next/image";
import { images } from "@/content/images";
import { brand, whatsappLink, bookingMessage } from "@/content/brand";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * The homepage hero: type on the left, a full-height photograph on the right.
 *
 * A split rather than a full-bleed image on purpose. The salon's own pictures
 * are around 700px wide, and stretching one across a 1440px screen would look
 * soft — which is the last thing a business selling precision should look. At
 * half-width the photograph is served at close to its native size and stays
 * crisp.
 *
 * Nothing here waits on JavaScript. The h1 is the largest contentful paint and
 * it is plain text on a plain background.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-petal">
      <div className="mx-auto grid w-full max-w-7xl items-stretch lg:grid-cols-[1.05fr_1fr]">
        <div className="flex items-center px-6 pb-16 pt-28 sm:px-10 sm:pb-24 sm:pt-36 lg:py-32 lg:pl-14 lg:pr-16">
          <div className="max-w-xl">
            <p className="eyebrow">Majnu-ka-Tilla &middot; New Delhi</p>

            <h1 className="mt-6 text-[2.6rem] leading-[1.03] sm:text-6xl lg:text-[4.2rem]">
              {brand.name}
            </h1>

            <p className="mt-4 font-display text-xl italic text-gold-ink sm:text-2xl">
              {brand.tagline}
            </p>

            <p className="mt-7 text-base leading-relaxed text-muted sm:text-lg">
              A women-led, Tibetan-owned salon where modern hair artistry meets
              mindful, cruelty-free practice. Colour, extensions and repair by
              India&rsquo;s first Master Hair Extensions Trainer.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={whatsappLink(bookingMessage)} size="lg" external>
                Book on WhatsApp
                <Arrow />
              </Button>
              <Button href="/menu" size="lg" variant="secondary">
                See the price menu
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-7">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Experience</dt>
                <dd className="mt-1.5 font-display text-2xl">15 years</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Extensions</dt>
                <dd className="mt-1.5 font-display text-2xl">16&Prime;&ndash;30&Prime;</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Products</dt>
                <dd className="mt-1.5 font-display text-2xl">Vegan</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="hero-photo relative min-h-[22rem] overflow-hidden lg:min-h-[42rem]">
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover object-top"
            priority
          />
          {/* Softens the join between photograph and page on wide screens. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-petal to-transparent lg:block"
          />
        </div>
      </div>
    </section>
  );
}

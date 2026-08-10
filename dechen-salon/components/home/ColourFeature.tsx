import Image from "next/image";
import Link from "next/link";
import { images } from "@/content/images";
import { shadeFamilies } from "@/content/menu";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";

/**
 * Colour, on the deep plum ground.
 *
 * The salon's shade chart is a real thing on a real wall, and the five names on
 * it are the ones a client will ask for by name. Showing the chart and naming
 * the shades does more work than any amount of adjectives about colour.
 *
 * The plum section is also the page's one moment of drama — everything either
 * side of it is blush.
 */
export function ColourFeature() {
  return (
    <section className="bg-plum px-6 py-20 text-petal sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="image">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-plum-2">
            <Image
              src={images.shades.src}
              alt={images.shades.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 44vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.06}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
              Colour
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-4 text-3xl leading-[1.12] sm:text-4xl">
              The right shade is the one that suits you.
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 text-base leading-relaxed text-petal/75">
              We are experts in recommending how the right colour can enhance your
              personality &mdash; balayage, babylights, ash tones and global
              colour, matched to your skin tone rather than to a photograph.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <ul className="mt-9 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {shadeFamilies.map((shade) => (
                <li key={shade.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="block h-8 w-8 shrink-0 rounded-full ring-1 ring-white/25"
                    style={{ background: shade.hex }}
                  />
                  <span className="text-sm text-petal/85">{shade.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.28}>
            <Link
              href="/services/hair-color"
              className="link-underline mt-10 inline-flex items-center gap-2 pb-1 text-sm font-medium text-rose"
            >
              Colour services and prices
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

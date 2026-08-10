import Image from "next/image";
import Link from "next/link";
import { images } from "@/content/images";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";

/**
 * Extensions.
 *
 * This is the salon's strongest single claim — the founder trained the trainers
 * — so it gets a section of its own rather than being one card among four. The
 * photograph is one of the two in the catalog that is genuinely the salon's own.
 */
export function ExtensionsFeature() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal variant="image">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] bg-petal">
            <Image
              src={images.extensionsBundles.src}
              alt={images.extensionsBundles.alt}
              fill
              sizes="(max-width: 1280px) 92vw, 72rem"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal delay={0.06}>
              <p className="eyebrow">Extensions</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-3xl leading-[1.12] sm:text-4xl">
                Fitted by the person who wrote the course.
              </h2>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.14}>
              <p className="text-base leading-relaxed text-muted">
                Dechen became India&rsquo;s first Master Hair Extensions Trainer
                before she opened this salon. Bad extensions aren&rsquo;t a
                styling problem, they&rsquo;re a weight-and-tension problem
                &mdash; which is exactly what a trainer spends years learning to
                get right.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted">
                    Lengths
                  </dt>
                  <dd className="mt-1.5 font-display text-2xl">16&Prime;&ndash;30&Prime;</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted">
                    Methods
                  </dt>
                  <dd className="mt-1.5 font-display text-2xl">Five</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.26}>
              <Link
                href="/services/hair-extensions"
                className="mt-8 link-underline inline-flex items-center gap-2 pb-1 text-sm font-medium text-gold-ink"
              >
                The full extensions menu
                <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

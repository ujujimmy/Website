import Image from "next/image";
import Link from "next/link";
import { founder } from "@/content/founder";
import { images } from "@/content/images";
import { Reveal } from "@/components/ui/Reveal";

/** Dechen, in her own words. The emotional centre of the homepage. */
export function FounderStrip() {
  return (
    <section className="px-6 py-20 sm:py-28" aria-labelledby="founder-heading">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal variant="image">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-[2rem] bg-petal lg:mx-0">
            <Image
              src={images.founder.src}
              alt={images.founder.alt}
              fill
              sizes="(max-width: 1024px) 80vw, 34vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.06}>
            <p className="eyebrow">{founder.role}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 id="founder-heading" className="mt-4 text-3xl sm:text-4xl">
              Meet {founder.name}
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <blockquote className="mt-6 border-l-2 border-gold/50 pl-5 font-display text-lg italic leading-relaxed text-ink sm:text-xl">
              {founder.quote}
            </blockquote>
          </Reveal>

          <Reveal delay={0.22}>
            <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {founder.credentials.map((credential) => (
                <li key={credential.label}>
                  <p className="text-sm font-semibold text-ink">
                    {credential.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{credential.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.28}>
            <Link
              href="/founder"
              className="mt-9 link-underline inline-flex items-center gap-2 pb-1 text-sm font-medium text-gold-ink"
            >
              Her full story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

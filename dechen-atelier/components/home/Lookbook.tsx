import Link from "next/link";
import { home } from "@/content/copy";
import { brand } from "@/content/brand";
import { images, lookbook } from "@/content/images";
import { Reveal } from "@/components/ui/Reveal";
import { Frame } from "@/components/ui/Frame";

/**
 * A horizontal rail rather than a grid.
 *
 * Fourteen crops in a grid is a contact sheet; the same fourteen on a rail is a
 * portfolio being turned. It's a native scroller with snap points — no
 * JavaScript, no carousel library, and it keeps working with a trackpad, a
 * thumb, or the keyboard.
 */
export function Lookbook() {
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="gutter flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="max-w-xl">
          <Reveal>
            <p className="micro text-lacquer">06 &nbsp; Lookbook</p>
          </Reveal>
          <h2 className="t-section mt-4">{home.lookbook.title}</h2>
          <Reveal delay={0.06}>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {home.lookbook.lead}{" "}
              <a
                href={brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link-rule text-lacquer"
              >
                {home.lookbook.instagram}
              </a>
            </p>
          </Reveal>
        </div>
        <Reveal>
          <Link href="/gallery" className="link-rule text-sm">
            See the full lookbook
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.08} className="mt-10">
        {/* The rail is deliberately allowed to run past the right edge of the
            page: a portfolio that ends flush with the margin looks like it has
            nothing more in it. */}
        {/* Focusable and named: a scroll container that only a mouse or a
            thumb can reach leaves keyboard users unable to see most of it. */}
        <div
          className="rail gutter pb-2"
          role="region"
          aria-label="Recent work — scroll sideways"
          tabIndex={0}
        >
          {lookbook.map((key) => (
            <Frame
              key={key}
              img={images[key]}
              ratio="tall"
              sizes="(max-width: 64rem) 68vw, 24rem"
            />
          ))}
        </div>
      </Reveal>

      <p className="gutter mt-5 text-xs text-muted">
        Scroll sideways &rarr;
      </p>
    </section>
  );
}

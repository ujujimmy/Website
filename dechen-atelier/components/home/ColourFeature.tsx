import { home } from "@/content/copy";
import { images } from "@/content/images";
import { shadeFamilies } from "@/content/menu";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { Frame } from "@/components/ui/Frame";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * Colour, with the salon's own five shade families shown as what they are:
 * flat blocks of the actual hex values from the chart, not a decorative
 * gradient. A client can point at one.
 */
export function ColourFeature() {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
      <div>
        <h2 className="t-section max-w-2xl">
          <RevealLines lines={[home.colour.title]} />
        </h2>

        <Reveal delay={0.1}>
          <p className="prose-measure mt-8">{home.colour.body}</p>
        </Reveal>

        <Reveal variant="wipe" delay={0.12} className="mt-10">
          <Frame
            img={images.colorBabylights}
            ratio="wide"
            sizes="(max-width: 64rem) 100vw, 52rem"
          />
        </Reveal>

        <Reveal delay={0.16} className="mt-8">
          <Button href="/services/hair-color" variant="line">
            Colour services
            <Arrow />
          </Button>
        </Reveal>
      </div>

      <Reveal delay={0.14} className="lg:pt-3">
        <p className="micro text-muted">Shade families</p>
        <ul className="mt-5 flex flex-col">
          {shadeFamilies.map((shade) => (
            <li
              key={shade.name}
              className="flex items-center gap-4 border-t border-line-soft py-3.5 last:border-b"
            >
              <span
                aria-hidden="true"
                className="block h-8 w-8 shrink-0 rounded-full"
                style={{ background: shade.hex }}
              />
              <span className="text-sm">{shade.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          {home.colour.shadesNote}
        </p>
      </Reveal>
    </div>
  );
}

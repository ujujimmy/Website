import { home } from "@/content/copy";
import { images } from "@/content/images";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { Frame } from "@/components/ui/Frame";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * Extensions — the salon's actual specialism, and the reason the founder has a
 * national teaching practice. It gets its own chapter on the homepage for that
 * reason and no other.
 */
export function ExtensionsFeature() {
  const facts = [
    { k: "Lengths", v: "16″ – 30″" },
    { k: "Methods", v: "Tapes, wefts, toppers, clip-ins, fishnet volume" },
    { k: "Fitted by", v: "India's first Master Hair Extensions Trainer" },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
      <Reveal variant="wipe" className="lg:order-2">
        <Frame
          img={images.extensionsBundles}
          ratio="portrait"
          sizes="(max-width: 64rem) 100vw, 34rem"
        />
      </Reveal>

      <div className="lg:order-1">
        <h2 className="t-section">
          <RevealLines lines={[home.extensions.title]} />
        </h2>

        <Reveal delay={0.08}>
          <p className="prose-measure mt-8">{home.extensions.body}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="mt-10">
            {facts.map((fact) => (
              <div
                key={fact.k}
                className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-t border-line py-3.5 last:border-b"
              >
                <dt className="micro pt-1 text-muted">{fact.k}</dt>
                <dd className="text-sm leading-relaxed">{fact.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.16} className="mt-9">
          <Button href="/services/hair-extensions" variant="line">
            Extension services
            <Arrow />
          </Button>
        </Reveal>
      </div>
    </div>
  );
}

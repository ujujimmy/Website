import { home } from "@/content/copy";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { Button, Arrow } from "@/components/ui/Button";

/**
 * The philosophy, said once and briefly.
 *
 * The salon's own philosophy paragraph is long and heartfelt; this is the
 * version that belongs on a homepage, with the full text a click away on
 * /about. Saying it twice at length is how a homepage turns into a brochure.
 */
export function Statement() {
  return (
    <div>
      <h2 className="t-section max-w-3xl">
        <RevealLines lines={[home.statement.title]} />
      </h2>

      <div className="mt-8 flex flex-col gap-6 md:mt-10">
        {home.statement.body.map((paragraph, i) => (
          <Reveal key={paragraph.slice(0, 24)} delay={0.08 + i * 0.06}>
            <p className="prose-measure">{paragraph}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-10">
        <Button href="/about" variant="line">
          What we stand for
          <Arrow />
        </Button>
      </Reveal>
    </div>
  );
}

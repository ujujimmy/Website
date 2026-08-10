import { brand } from "@/content/brand";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Both branches, side by side.
 *
 * They are a minute apart in the same neighbourhood, so the useful thing is not
 * a map but a directions link on each — a client picks whichever Google says is
 * closer and walks. Both share one phone line and one set of hours, which is
 * why neither is repeated per card.
 */
export function Locations({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  const onInk = tone === "ink";

  return (
    <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
      {brand.locations.map((location, i) => (
        <Reveal as="li" key={location.id} delay={i * 0.06}>
          <div
            className={`border-t pt-5 ${onInk ? "border-line-dark" : "border-line"}`}
          >
            <p className="micro text-muted">{location.role}</p>

            <h3 className={`t-sub mt-3 ${onInk ? "text-cream" : ""}`}>
              {location.name}
            </h3>

            <address
              className={`mt-4 text-sm leading-relaxed not-italic ${
                onInk ? "text-dim" : "text-muted"
              }`}
            >
              {location.street}
              <br />
              {location.locality}, {location.region} {location.postalCode}
            </address>

            <a
              href={location.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`link-rule mt-4 inline-block text-sm ${
                onInk ? "text-brass" : "text-lacquer"
              }`}
            >
              Get directions
              <span className="sr-only"> to {location.name}</span>
            </a>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

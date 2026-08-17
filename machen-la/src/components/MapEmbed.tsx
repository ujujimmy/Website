import { RESTAURANT } from "@/data/site";

/**
 * The Google Maps embed on /visit.
 *
 * Points at the coordinates rather than at a name search: there are several
 * similarly named places in the colony and a name query lands people at the
 * wrong door.
 *
 * Three things keep a third-party iframe from costing what it usually costs on
 * a 4G handset:
 *
 *   · `loading="lazy"` — the map is below the address, the hours and the three
 *     action links, so on a phone it does not compete with anything that
 *     matters for first paint.
 *   · the aspect-ratio box reserves the space before the iframe loads, so it
 *     cannot shift the page as it arrives. CLS on this route is 0 and stays 0.
 *   · it sits inside the same hairline frame as every photograph on the site,
 *     so a bright rectangle in a dark page reads as a framed object rather than
 *     as a hole punched in the layout.
 *
 * `output=embed` is the keyless Maps embed. It needs no API key and no billing
 * account, which matters for a restaurant site nobody is going to maintain.
 *
 * Note for the client: this loads content from Google, which sets cookies. If
 * you ever need the site to be cookie-free until a visitor opts in, this is the
 * one component to remove — the action links above it already do the real work.
 */
export function MapEmbed() {
  const { lat, lng } = RESTAURANT.geo;
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=en&output=embed`;

  return (
    <figure>
      <div className="hairline border p-1.5">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <iframe
            src={src}
            title={`Map showing ${RESTAURANT.name} at ${RESTAURANT.address.full}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            // Explicit dimensions as well as the ratio box: belt and braces
            // against layout shift if the CSS is still in flight.
            width={1200}
            height={675}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
      <figcaption className="mt-4 font-mono text-meta uppercase text-wall-faint">
        Rabsel House 47 · {lat}, {lng}
      </figcaption>
    </figure>
  );
}

import Link from "next/link";
import { Plate } from "@/components/Plate";
import { PechaRow } from "@/components/PechaRow";
import { OpenNow } from "@/components/OpenNow";
import { IMAGES } from "@/data/images";
import { SIGNATURE_ITEMS } from "@/data/menu";
import { REVIEW_LINES } from "@/data/reviews";
import { RESTAURANT } from "@/data/site";

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — type-led, not photo-led.

          The available photography is compressed social output. Scaling any of
          it to viewport width would expose the compression and make the whole
          site look cheap, so the type carries the page and exactly one image
          sits under it in a contained frame, capped at 460px.

          ── FUTURE VIDEO SLOT ──────────────────────────────────────────────
          No <video> ships in this build; there is no footage, and a tag
          pointing at nothing is worse than nothing. When a loop exists, drop it
          in the right-hand column in place of <Plate>, and keep these rules:

            · muted, playsInline, loop, autoPlay, and preload="none"
            · same containment as the still — max 540px, never full-bleed
            · poster={IMAGES.interior.src} so the frame is painted before the
              first video byte arrives, and LCP stays on the text
            · wrap in a `matchMedia("(prefers-reduced-motion: reduce)")` check
              and render the still instead when it matches
            · ship H.264 MP4 + VP9 WebM, under 2 MB, no audio track at all —
              this must not cost a 4G visitor their data allowance
            · keep it under 8 seconds and cut on motion, not on a zoom
          ═══════════════════════════════════════════════════════════════════ */}
      {/* The type runs the full width of the container and the image sits below
          it, rather than the two splitting the row. Display type at 104px needs
          real measure — boxed into a half-width column it wraps to five ragged
          lines and starts breaking words. The brief allows the image beside OR
          below; below is what the type wants. */}
      <section className="mx-auto max-w-[76rem] px-5 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-24">
        <p className="font-mono text-meta uppercase text-butter">
          The first kitchen open in Majnu ka Tilla
        </p>

        {/* Motion moment 1 of 2 in the entire site. */}
        <div className="rule-draw mt-6 h-px w-24 bg-butter" />

        <h1 className="font-display mt-10 max-w-[15ch] text-display-xl font-semibold text-wall">
          Tibetan food in Majnu ka Tilla, from{" "}
          <span className="text-butter">7:30</span> in the morning.
        </h1>

        <div className="mt-14 grid gap-12 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
          <div>
            <p className="max-w-[46ch] text-lede text-wall-dim">
              Almost everything in the colony opens at noon. The overnight buses
              from Dharamsala get in at dawn. We are the kitchen that is already
              open — momos, hot pot, ramen, and coffee, while the lane outside is
              still shut.
            </p>
          </div>

          {/* The hairline that separates the two columns is this frame's own
              left edge on desktop; no extra element, no decorative div. */}
          <div className="md:border-l md:border-[color:var(--color-rule)] md:pl-16">
            <Plate
              slot={IMAGES.interior}
              priority
              sizes="(max-width: 640px) 100vw, 460px"
              maxWidth={460}
            />
            <p className="mt-4 max-w-[38ch] font-mono text-meta uppercase text-wall-faint">
              The room, evening
            </p>
          </div>
        </div>
      </section>

      {/* Live status. Replaces the three-column icon grid that would normally
          sit here — it answers the only question a passer-by actually has. */}
      <section className="hairline border-y">
        <div className="mx-auto max-w-[76rem] px-5 sm:px-8">
          <OpenNow />
        </div>
      </section>

      {/* ═══ WHAT TO ORDER FIRST ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-display-l font-medium text-wall">
            What to order first
          </h2>
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center font-mono text-meta uppercase text-butter underline decoration-butter/40 underline-offset-8 hover:decoration-butter"
          >
            The full menu
          </Link>
        </div>

        <p className="mt-6 max-w-[54ch] text-body text-wall-dim">
          If it is your first time, order the hot pot for a table, or the momo
          platter for two. Ask for the tingmo alongside anything with sauce.
        </p>

        {/* A pecha folio is wide, but not unboundedly wide. Past about 58rem the
            price drifts so far from the dish name that the two stop reading as
            one line, which is the whole point of the row. */}
        <ul className="mt-12 max-w-[58rem]">
          {SIGNATURE_ITEMS.map((item) => (
            <PechaRow key={item.id} item={item} />
          ))}
        </ul>
      </section>

      {/* ═══ THE ROOM ══════════════════════════════════════════════════════
          Real reviews, paraphrased, attributed to Google. No cards, no circular
          avatars, no five gold stars, no invented names.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <h2 className="font-display text-display-l font-medium text-wall">
          The room
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-start md:gap-16">
          <div>
            <Plate slot={IMAGES.hotPot} sizes="(max-width: 640px) 100vw, 480px" />
            <div className="mt-10 md:ml-16">
              <Plate
                slot={IMAGES.momos}
                sizes="(max-width: 640px) 100vw, 420px"
                maxWidth={416}
              />
            </div>
          </div>

          <div className="md:pt-10">
            {REVIEW_LINES.map((line) => (
              <figure key={line.id} className="hairline border-l pl-6 mb-10 last:mb-0">
                <blockquote className="font-display text-display-m font-normal text-wall">
                  {line.text}
                  {line.quote && (
                    <>
                      {" "}
                      <span className="text-butter">“{line.quote}”</span>.
                    </>
                  )}
                </blockquote>
                <figcaption className="mt-4 font-mono text-meta uppercase text-wall-faint">
                  {line.source}
                </figcaption>
              </figure>
            ))}

            <p className="mt-12 max-w-[46ch] text-body text-wall-dim">
              Tibetan music, painted beams, and enough space between the tables to
              put a hot pot down. There is seating outside for when Delhi allows
              it.
            </p>
            <Link
              href="/gallery"
              className="mt-6 inline-flex min-h-12 items-center font-mono text-meta uppercase text-butter underline decoration-butter/40 underline-offset-8 hover:decoration-butter"
            >
              See the room
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FINDING IT ════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <h2 className="font-display text-display-l font-medium text-wall">
              Finding it
            </h2>
            <p className="mt-8 max-w-[48ch] text-lede text-wall-dim">
              Majnu ka Tilla is a settlement of narrow lanes, and the address does
              less work than the walk does. Come in from the main road, follow the
              lane past the shops, and ask anyone for Machen La. It is a small
              place and everybody knows it.
            </p>

            <address className="mt-10 not-italic">
              <a
                href={RESTAURANT.links.map}
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-[34ch] font-mono text-body text-wall underline decoration-rule underline-offset-4 hover:text-butter"
              >
                {RESTAURANT.address.full}
              </a>
              <a
                href={`tel:${RESTAURANT.phone.tel}`}
                className="mt-6 inline-flex min-h-12 items-center font-mono text-price text-butter"
              >
                {RESTAURANT.phone.display}
              </a>
            </address>

            <Link
              href="/visit"
              className="mt-8 inline-flex min-h-12 items-center font-mono text-meta uppercase text-butter underline decoration-butter/40 underline-offset-8 hover:decoration-butter"
            >
              Hours, parking and the bus stand
            </Link>
          </div>

          <div className="md:border-l md:border-[color:var(--color-rule)] md:pl-16">
            <Plate
              slot={IMAGES.frontage}
              sizes="(max-width: 640px) 100vw, 420px"
              maxWidth={416}
            />
            <p className="mt-4 font-mono text-meta uppercase text-wall-faint">
              The frontage, from the lane
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

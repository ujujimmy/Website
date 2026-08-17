import type { Metadata } from "next";
import Link from "next/link";
import { Plate } from "@/components/Plate";
import { JsonLd } from "@/components/JsonLd";
import { IMAGES } from "@/data/images";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Eating in Majnu ka Tilla — Machen La, Little Tibet, Delhi",
  description:
    "What to eat in Majnu ka Tilla, Delhi's Tibetan settlement — what tingmo, thukpa and momos actually are, what to order first, and why Machen La opens at 7:30 in the morning.",
  path: "/story",
});

/**
 * This page carries the informational traffic — someone planning a trip to
 * Delhi a week ahead, searching "what to eat in Majnu ka Tilla" from another
 * city. It earns that visit by being genuinely useful about the colony and the
 * food, not by describing the restaurant in adjectives.
 */
export default function StoryPage() {
  return (
    <>
      <section className="mx-auto max-w-[76rem] px-5 pt-12 sm:px-8 sm:pt-16">
        <h1 className="font-display max-w-[20ch] text-display-l font-semibold text-wall">
          Machen La, and eating in Majnu ka Tilla
        </h1>
        <p className="mt-8 max-w-[58ch] text-lede text-wall-dim">
          Majnu ka Tilla — Samyeling to the people who live there, Little Tibet to
          everyone else — is a few lanes of Tibetan Delhi packed in behind the
          ring road, settled by families who came to India after 1959. It is also
          where the buses to Dharamsala and the hills leave from, which is why
          the place runs on a different clock to the rest of the city.
        </p>
      </section>

      {/* ═══ WHY 7:30 ═════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <h2 className="font-display text-display-l font-medium text-wall">
              Why we open at 7:30
            </h2>
            <div className="mt-8 max-w-[58ch] space-y-6 text-body text-wall-dim">
              <p>
                The overnight buses from Dharamsala, McLeod Ganj and Manali set
                down at the edge of the colony around dawn. People get off stiff,
                cold and hungry, walk in with a bag on their shoulder, and find
                the shutters down. Almost every kitchen in Majnu ka Tilla opens
                at noon.
              </p>
              <p>
                We open at 7:30 in the morning, every day. That is the whole
                reason this restaurant is worth knowing about before you arrive.
                If you have just come off a bus, the coffee is on and so is the
                kitchen — you do not have to wait four hours or walk back out to
                the main road for a packet of biscuits.
              </p>
              <p>
                It works the other way round too. If you are catching an evening
                bus up, we are open until 10 at night.
              </p>
            </div>
          </div>

          <div className="md:border-l md:border-[color:var(--color-rule)] md:pl-16">
            <Plate
              slot={IMAGES.morningCoffee}
              sizes="(max-width: 640px) 100vw, 420px"
              maxWidth={416}
            />
            <p className="mt-4 max-w-[30ch] font-mono text-meta uppercase text-wall-faint">
              Morning, before the lane opens
            </p>
          </div>
        </div>
      </section>

      {/* ═══ GLOSSARY ═════════════════════════════════════════════════════
          The single most useful thing this site can give someone who has never
          eaten Tibetan food: what the words on the menu mean.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <h2 className="font-display text-display-l font-medium text-wall">
          Words on a Tibetan menu
        </h2>
        <p className="mt-6 max-w-[54ch] text-body text-wall-dim">
          Useful anywhere in the colony, not only here.
        </p>

        <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {[
            {
              term: "Momo",
              def: "Dumpling. Steamed or fried, filled with buff, chicken or vegetables, eaten with a chilli sauce. The thing Majnu ka Tilla is known for, and the first thing most people order.",
            },
            {
              term: "Tingmo",
              def: "Steamed bread, soft and slightly sweet, pulled apart by hand. Order it alongside anything with sauce — it is there to mop the plate, not to be eaten on its own.",
            },
            {
              term: "Thukpa",
              def: "Noodle soup: noodles, broth, vegetables and usually meat. The standard Tibetan winter meal. If you are eating your way around the colony in January, this is what you want.",
            },
            {
              term: "Buff",
              def: "Buffalo meat. Common in Tibetan cooking and on most menus here. It is leaner and stronger-tasting than beef, and it is what goes into a lot of the momos.",
            },
            {
              term: "Hot pot",
              def: "A pot of broth kept simmering in the middle of the table while you cook in it as you eat. It is a long meal and a shared one — come with people and come with time.",
            },
            {
              term: "Laphing",
              def: "Cold mung-bean noodles, chilli-heavy, sold from the lanes. Not a restaurant dish. Eat it standing up between meals, the way everybody else does.",
            },
          ].map((row) => (
            <div key={row.term} className="hairline border-t pt-5">
              <dt className="font-display text-display-m font-medium text-wall">
                {row.term}
              </dt>
              <dd className="mt-3 max-w-[46ch] text-body text-wall-dim">
                {row.def}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ═══ WHAT TO ORDER ════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
          <div className="md:order-2 md:border-l md:border-[color:var(--color-rule)] md:pl-16">
            <h2 className="font-display text-display-l font-medium text-wall">
              What to order first
            </h2>
            <div className="mt-8 max-w-[54ch] space-y-6 text-body text-wall-dim">
              <p>
                Two of you, first visit: the momo platter and the tingmo, with the
                buff and green cabbage stir fry between you. It is a lot of food
                and it will tell you whether you want to come back.
              </p>
              <p>
                Four or more, and an evening to spend: the hot pot. Order it as
                soon as you sit down, because it cooks at the table and it is not
                a quick meal.
              </p>
              <p>
                Alone, early, off a bus: coffee and something from the kitchen
                while the lane is still shut. That is what we are for.
              </p>
              <p>
                And say something about the heat when you order. The kitchen will
                cook anything milder — the one complaint we get most often is
                from people who did not ask, and then found it too hot.
              </p>
            </div>
            <Link
              href="/menu"
              className="mt-8 inline-flex min-h-12 items-center font-mono text-meta uppercase text-butter underline decoration-butter/40 underline-offset-8 hover:decoration-butter"
            >
              The menu
            </Link>
          </div>

          <div className="md:order-1">
            <Plate
              slot={IMAGES.staff}
              sizes="(max-width: 640px) 100vw, 420px"
              maxWidth={416}
            />
            <p className="mt-4 max-w-[30ch] font-mono text-meta uppercase text-wall-faint">
              The kitchen
            </p>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbLd([{ name: "Story", path: "/story" }])} />
    </>
  );
}

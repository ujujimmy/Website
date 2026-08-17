import type { Metadata } from "next";
import { MENU, MENU_NOTES } from "@/data/menu";
import { RESTAURANT } from "@/data/site";
import { PechaRow } from "@/components/PechaRow";
import { MenuFilter } from "@/components/MenuFilter";
import { JsonLd } from "@/components/JsonLd";
import { menuLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: `Menu & Prices — ${RESTAURANT.name}, Majnu ka Tilla`,
  description:
    "The menu at Machen La Tibet Kitchen in Majnu ka Tilla, Delhi — hot pot, momo platters, ramen, tingmo and chilli plates, with the heat level marked on every dish.",
  path: "/menu",
});

const tabs = MENU.map((c) => ({ id: c.id, name: c.name }));

export default function MenuPage() {
  return (
    <>
      <section className="mx-auto max-w-[76rem] px-5 pt-12 pb-10 sm:px-8 sm:pt-16">
        <h1 className="font-display max-w-[18ch] text-display-l font-semibold text-wall">
          The menu at Machen La, Majnu ka Tilla
        </h1>

        {/* The three lines that do the most work on this page. Prices first,
            because that is the question, and the honest answer is not a number. */}
        <div className="mt-10 grid max-w-[68rem] gap-8 md:grid-cols-3">
          <div className="hairline border-t pt-5">
            <h2 className="font-mono text-meta uppercase text-butter">Prices</h2>
            <p className="mt-3 text-body text-wall-dim">{MENU_NOTES.prices}</p>
          </div>
          <div className="hairline border-t pt-5">
            <h2 className="font-mono text-meta uppercase text-butter">Heat</h2>
            <p className="mt-3 text-body text-wall-dim">{MENU_NOTES.spice}</p>
          </div>
          <div className="hairline border-t pt-5">
            <h2 className="font-mono text-meta uppercase text-butter">
              MSG &amp; allergens
            </h2>
            <p className="mt-3 text-body text-wall-dim">{MENU_NOTES.allergens}</p>
          </div>
        </div>
      </section>

      <MenuFilter tabs={tabs}>
        <div className="mx-auto max-w-[76rem] px-5 pb-8 sm:px-8">
          {MENU.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-heading`}
              className="pt-16 sm:pt-20"
            >
              <div className="hairline border-b pb-4">
                <h2
                  id={`${category.id}-heading`}
                  className="font-display text-display-l font-medium text-wall"
                >
                  {category.name}
                </h2>
                {category.note && (
                  <p className="mt-3 max-w-[52ch] text-body text-wall-dim">
                    {category.note}
                  </p>
                )}
              </div>

              {/* See the note on the home page: a folio wider than ~58rem
                  separates the dish name from its price by so much that they
                  stop reading as a single line. */}
              <ul className="max-w-[58rem] pt-4">
                {category.items.map((item) => (
                  <PechaRow key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </MenuFilter>

      <section className="mx-auto max-w-[76rem] px-5 pt-20 sm:px-8">
        <div className="hairline border-t pt-8">
          <p className="max-w-[54ch] text-body text-wall-dim">
            This is what people order most, not the whole card. The full menu is
            on the table, and the staff know it well — tell them what you like and
            they will point you at the right thing.
          </p>
          <a
            href={`tel:${RESTAURANT.phone.tel}`}
            className="mt-6 inline-flex min-h-12 items-center font-mono text-price text-butter"
          >
            {RESTAURANT.phone.display}
          </a>
        </div>
      </section>

      <JsonLd data={menuLd()} />
      <JsonLd data={breadcrumbLd([{ name: "Menu", path: "/menu" }])} />
    </>
  );
}

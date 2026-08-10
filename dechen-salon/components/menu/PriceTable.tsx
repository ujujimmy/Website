import {
  chapterHasTiers,
  type Chapter,
  type MenuGroup,
  type MenuItem,
  type Price,
} from "@/content/menu";
import { tiers, tierShort } from "@/content/tiers";
import { formatPrice, formatAmount } from "@/lib/price";
import { serviceMessage, whatsappLink } from "@/content/brand";

/**
 * One chapter of the price list, as a single table.
 *
 * The layout rule that makes a price list look like a price list: **every
 * number shares the same right-hand grid**. A flat price spans all three tier
 * columns and right-aligns; a tiered price fills them. The right edge never
 * moves, whatever kind of row it is.
 *
 * All three figures are always in the DOM. The tier filter is CSS — it hides
 * two columns and collapses the grid (see globals.css) — so the page stays
 * complete for search engines, screen readers and anyone with JavaScript off.
 * A price list that only exists after JavaScript runs is not a price list.
 */
export function PriceTable({ chapter }: { chapter: Chapter }) {
  // Extensions are one price whoever fits them. Heading a chapter with three
  // artist levels it doesn't use is the kind of detail that makes a price list
  // feel wrong without a reader being able to say why.
  const hasTiers = chapterHasTiers(chapter);

  return (
    <div className="menu-table" data-tiered={hasTiers ? "" : undefined}>
      {hasTiers ? (
        /* Tier headings appear once per chapter, not once per group. */
        <div className="menu-colhead" aria-hidden="true">
          <span />
          <span className="menu-price">
            {tiers.map((tier) => (
              <span key={tier.id} className="tier-cell" data-tier={tier.id}>
                {tier.name}
              </span>
            ))}
          </span>
        </div>
      ) : null}

      {chapter.groups.map((group) => (
        <Group key={group.title} group={group} />
      ))}
    </div>
  );
}

function Group({ group }: { group: MenuGroup }) {
  return (
    <section className="menu-group">
      <h3 className="menu-group-title">{group.title}</h3>
      {group.intro ? <p className="menu-group-intro">{group.intro}</p> : null}
      {group.note ? <p className="menu-group-note">{group.note}</p> : null}

      <ul className="menu-rows">
        {group.items.map((item) => (
          <Row key={item.name} item={item} group={group.title} />
        ))}
      </ul>
    </section>
  );
}

function Row({ item, group }: { item: MenuItem; group: string }) {
  return (
    <li>
      <a
        className="menu-row"
        href={whatsappLink(serviceMessage(`${item.name} (${group})`))}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="menu-name">
          <span className="menu-service">{item.name}</span>
          {item.note ? <span className="menu-note">{item.note}</span> : null}
        </span>
        <PriceCell price={item.price} name={item.name} />
      </a>
    </li>
  );
}

function PriceCell({ price, name }: { price: Price; name: string }) {
  if (price.kind === "tiered") {
    const amounts = {
      top: price.top,
      creative: price.creative,
      director: price.director,
    } as const;

    return (
      <span className="menu-price">
        {tiers.map((tier) => (
          <span
            key={tier.id}
            className="tier-cell menu-amount"
            data-tier={tier.id}
            // Read on narrow screens, where the column headings are hidden and
            // each figure has to name its own tier.
            data-label={tierShort[tier.id]}
          >
            <span className="sr-only">
              {name}, {tier.name}:{" "}
            </span>
            {formatAmount(amounts[tier.id])}
          </span>
        ))}
      </span>
    );
  }

  // Everything else is a single figure that spans the whole price cell, so its
  // right edge lands exactly where the Creative Director column does.
  return (
    <span className="menu-price">
      <span className="menu-amount menu-amount-flat">{formatPrice(price)}</span>
    </span>
  );
}

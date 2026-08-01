import type { MenuGroup } from "@/content/menu";
import { tiers } from "@/content/tiers";
import { formatPrice, formatAmount } from "@/lib/price";
import { serviceMessage, whatsappLink } from "@/content/brand";

/**
 * One group of the price list.
 *
 * Tiered rows show all three figures side by side rather than collapsing to a
 * range — the tier is the choice the client is actually making, and hiding two
 * of the three numbers makes the menu feel evasive.
 *
 * Every row's price links to WhatsApp with that service already named, so
 * "book" and "how much" are the same tap.
 */
export function PriceRows({ group }: { group: MenuGroup }) {
  const hasTiered = group.items.some((item) => item.price.kind === "tiered");

  return (
    <section className="panel">
      <h3 className="text-2xl text-gold-ink">{group.title}</h3>
      {group.intro ? (
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{group.intro}</p>
      ) : null}
      {group.note ? (
        <p className="mt-3 rounded-2xl bg-petal px-4 py-3 text-xs leading-relaxed text-muted">
          {group.note}
        </p>
      ) : null}

      {/* Column headings, only where there is something to head. */}
      {hasTiered ? (
        <div className="mt-7 hidden grid-cols-[1fr_auto] gap-x-8 border-b border-line pb-2 sm:grid">
          <span className="sr-only">Service</span>
          <span className="grid grid-cols-3 gap-x-6 text-right">
            {tiers.map((tier) => (
              <span
                key={tier.id}
                data-tier={tier.id}
                className="tier-cell text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted"
              >
                {tier.name}
              </span>
            ))}
          </span>
        </div>
      ) : null}

      <ul className={hasTiered ? "mt-1" : "mt-6"}>
        {group.items.map((item) => (
          <li
            key={item.name}
            className="border-b border-line/70 py-4 last:border-0 last:pb-0"
          >
            <a
              href={whatsappLink(serviceMessage(`${item.name} (${group.title})`))}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 rounded-lg transition-colors hover:text-gold-ink"
            >
              <span>
                <span className="font-medium text-ink transition-colors group-hover:text-gold-ink">
                  {item.name}
                </span>
                {item.note ? (
                  <span className="mt-1.5 block max-w-prose text-xs leading-relaxed text-muted">
                    {item.note}
                  </span>
                ) : null}
              </span>

              {item.price.kind === "tiered" ? (
                <span className="grid grid-cols-3 gap-x-6 text-right tabular-nums">
                  <span className="tier-cell text-sm font-semibold text-gold-ink" data-tier="top">
                    <span className="sr-only">{tiers[0].name}: </span>
                    {formatAmount(item.price.top)}
                  </span>
                  <span className="tier-cell text-sm font-semibold text-gold-ink" data-tier="creative">
                    <span className="sr-only">{tiers[1].name}: </span>
                    {formatAmount(item.price.creative)}
                  </span>
                  <span className="tier-cell text-sm font-semibold text-gold-ink" data-tier="director">
                    <span className="sr-only">{tiers[2].name}: </span>
                    {formatAmount(item.price.director)}
                  </span>
                </span>
              ) : (
                <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-gold-ink">
                  {formatPrice(item.price)}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

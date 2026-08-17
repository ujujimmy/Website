import type { MenuItem } from "@/data/menu";
import { SpiceMark, Markers } from "./SpiceMark";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * The pecha row — the signature element of this site.
 *
 * A pecha is the Tibetan loose-leaf scripture folio: a wide horizontal leaf,
 * generous margins, and a pair of red rules running down the inner edge. Each
 * dish is set as one folio line — name large in Fraunces on the left, price in
 * mono hard right, held inside that double rule.
 *
 * ── The one structural rule ────────────────────────────────────────────────
 * `grid-cols-[1fr_auto]` with `items-baseline`. The name may wrap to two lines;
 * the price can never wrap beneath it and can never collapse into a second
 * column. That is the failure every responsive menu has on a 360px phone, and
 * a grid makes it impossible rather than merely unlikely.
 *
 * ── Absent prices ──────────────────────────────────────────────────────────
 * A null price prints an em dash at price weight in the same column. The row
 * keeps its full composition — two aligned columns, nothing collapsing — so the
 * menu reads as a considered document with a quiet gap, not as a broken
 * template with a hole in it.
 */
export function PechaRow({ item }: { item: MenuItem }) {
  return (
    <li
      // Read by the CSS filters on /menu. Keeping filtering in CSS means the
      // full menu stays in the server-rendered HTML no matter what is selected.
      data-veg={item.veg === null ? "unknown" : String(item.veg)}
      data-spice={item.spice ?? "unknown"}
      className="pecha-spine bg-left bg-no-repeat py-6 pl-5 sm:py-8 sm:pl-10"
    >
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-5 sm:gap-x-10">
        <h3 className="font-display text-display-m font-medium text-wall">
          {item.name}
        </h3>
        {item.price === null ? (
          <p className="font-mono text-price text-wall-dim tabular-nums">
            <span aria-hidden="true">—</span>
            <span className="sr-only">Price on the menu in the restaurant</span>
          </p>
        ) : (
          <p className="font-mono text-price font-medium text-butter tabular-nums">
            {inr.format(item.price)}
          </p>
        )}
      </div>

      {item.note && (
        <p className="mt-2 max-w-[52ch] text-body text-wall-dim">{item.note}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <SpiceMark spice={item.spice} />
        <Markers veg={item.veg} chilled={item.chilled} />
      </div>
    </li>
  );
}

import type { Spice } from "@/data/menu";

/**
 * The three-level heat indicator.
 *
 * Heat is encoded three ways at once — the number of filled bars, the colour of
 * the bars, and the word — so it survives colour blindness, a cracked screen and
 * bright daylight in the lane. Colour alone never carries the meaning.
 *
 * `null` prints ASK rather than a guess. See SPICE_POLICY in src/data/menu.ts:
 * a wrong MILD is the direct cause of the complaint this component exists to
 * prevent.
 */

const LEVELS: Record<Spice, { filled: number; className: string }> = {
  MILD: { filled: 1, className: "bg-butter" },
  MEDIUM: { filled: 2, className: "bg-butter" },
  HOT: { filled: 3, className: "bg-dzong-lit" },
};

export function SpiceMark({ spice }: { spice: Spice | null }) {
  const level = spice ? LEVELS[spice] : null;
  const label = spice ?? "ASK";

  return (
    <span
      className="inline-flex items-center gap-2"
      aria-label={
        spice
          ? `Heat level: ${spice.toLowerCase()}`
          : "Heat level not confirmed — ask your server"
      }
    >
      <span aria-hidden="true" className="flex items-end gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={[
              "block w-[3px] rounded-[1px]",
              // Bars step up in height as well as in count — the shape reads
              // even before the colour does.
              i === 0 ? "h-2" : i === 1 ? "h-2.5" : "h-3",
              level && i < level.filled
                ? level.className
                : "bg-wall/25 outline outline-1 -outline-offset-1 outline-wall/20",
            ].join(" ")}
          />
        ))}
      </span>
      <span className="font-mono text-meta uppercase text-wall-dim">{label}</span>
    </span>
  );
}

/**
 * Dietary and serving markers — the only place indigo and jade appear.
 *
 * Both dots carry a visible ring, because neither pigment clears 3:1 against
 * the ink ground on its own (jade 3.7:1 is fine, indigo is 1.6:1 and would be
 * an invisible dot). The word beside each dot is what actually carries the
 * meaning; the pigment is decoration.
 */
export function Markers({
  veg,
  chilled,
}: {
  veg: boolean | null;
  chilled: boolean | null;
}) {
  if (veg !== true && chilled !== true) return null;

  return (
    <span className="inline-flex items-center gap-4">
      {veg === true && (
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="block size-2 rounded-full bg-jade outline outline-1 outline-offset-[2px] outline-jade/60"
          />
          <span className="font-mono text-meta uppercase text-wall-dim">Veg</span>
        </span>
      )}
      {chilled === true && (
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="block size-2 rounded-full bg-indigo outline outline-1 outline-offset-[2px] outline-wall/30"
          />
          <span className="font-mono text-meta uppercase text-wall-dim">Cold</span>
        </span>
      )}
    </span>
  );
}

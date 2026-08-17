import Link from "next/link";

/**
 * The wordmark. Latin type only.
 *
 * ─── TIBETAN SCRIPT SLOT ────────────────────────────────────────────────────
 * There is deliberately no Uchen script anywhere in this build. Generating
 * Tibetan from a model, or copying it off another site, produces wrong Tibetan,
 * and wrong Tibetan on a Tibetan restaurant in a Tibetan settlement is not a
 * design mistake, it is an insult to the people who eat there.
 *
 * When the client supplies verified text — written or checked by someone who
 * reads Tibetan — drop it in here as a <span lang="bo">, set it in a proper
 * Uchen face (Noto Serif Tibetan), and give it its own line above the Latin
 * wordmark at roughly 0.8× the Latin cap height. Nothing else needs to change.
 * ────────────────────────────────────────────────────────────────────────────
 */
export function Wordmark({ as = "span" }: { as?: "span" | "h1" }) {
  const Tag = as;
  return (
    <Tag className="block leading-none">
      <span className="font-display block text-[clamp(1.25rem,4.4vw,1.5rem)] font-semibold tracking-[0.02em] text-wall">
        MACHEN LA
      </span>
      <span className="mt-1 block font-mono text-[0.6875rem] tracking-[0.22em] text-wall-dim uppercase">
        Tibet Kitchen
      </span>
    </Tag>
  );
}

/**
 * No `aria-label` here, deliberately. An audit caught the first version: the
 * label read "MACHEN LA Tibet Kitchen — home" while the visible text read
 * "MACHEN LA Tibet Kitchen", and a screen-reader user hearing a name that does
 * not match what a sighted user reads out loud cannot refer to the same thing
 * by voice. The visible text is already the accessible name.
 */
export function WordmarkLink() {
  return (
    <Link href="/" className="inline-flex min-h-12 items-center">
      <Wordmark />
    </Link>
  );
}

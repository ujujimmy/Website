/**
 * The menu.
 *
 * ── Two rules govern this file ──────────────────────────────────────────────
 *
 * 1. NO INVENTED PRICES. Every `price` is `number | null` and every one of them
 *    is currently `null`, because the real card has not been supplied. A null
 *    renders as an em dash in the price column — the row still reads as a
 *    composed line, not a broken template. `pnpm build` prints every null so
 *    filling them in later is a five-minute job.
 *
 * 2. NO INVENTED DISHES. Only dishes named in real Google reviews are listed.
 *    Adding plausible Tibetan staples (thukpa, laphing, shabhaley) would be the
 *    same failure as inventing a price: a guest orders something the kitchen
 *    does not make. Paste the real card in below and delete this paragraph.
 *
 * ── Adding items ────────────────────────────────────────────────────────────
 * Copy any row, change the fields. `spice`, `veg` and `chilled` all accept
 * `null`, which means "we have not confirmed this" — the interface handles it.
 */

/** Heat as printed on the row. See SPICE_POLICY below for why `null` exists. */
export type Spice = "MILD" | "MEDIUM" | "HOT";

export type MenuItem = {
  id: string;
  name: string;
  /** One short factual line, or null. Not marketing copy — say what it is. */
  note: string | null;
  /** Rupees. `null` until the real card is supplied. Never guess. */
  price: number | null;
  /** `null` renders as ASK, which is the honest answer and the useful one. */
  spice: Spice | null;
  /** `null` where it varies or is unconfirmed — no marker beats a wrong one. */
  veg: boolean | null;
  /** Served cold. Drives the indigo marker; only meaningful on drinks. */
  chilled: boolean | null;
  /** Surfaced in "What to order first" on the home page. */
  signature?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  /** Shown under the category heading on /menu. Keep it to one line. */
  note: string | null;
  items: MenuItem[];
};

/**
 * SPICE_POLICY — read before "fixing" the nulls.
 *
 * The single most repeated complaint in this restaurant's reviews is that food
 * arrives hotter than the guest asked for. A spice label is therefore a promise,
 * and a wrong one causes exactly the review it was added to prevent.
 *
 * So heat is only labelled where it is genuinely knowable:
 *   · dishes whose name declares chilli are marked HOT — erring toward hot is
 *     the safe direction. Someone braced for heat who gets a medium plate is
 *     fine; someone promised mild who gets a hot one writes the one-star.
 *   · things that are mild by definition (steamed bread, fruit coolers) are MILD.
 *   · everything else is null and prints ASK, which pushes the guest to say the
 *     word to the server — which is the actual fix.
 *
 * When the kitchen confirms real levels, set them here and the labels appear.
 */

export const MENU: MenuCategory[] = [
  {
    id: "hot-pot",
    name: "Hot Pot",
    note: "Cooked at your table. Give it time.",
    items: [
      {
        id: "hot-pot",
        name: "Hot Pot",
        note: "Broth kept simmering at the table, everything cooked in it as you eat.",
        price: null,
        spice: null,
        veg: null,
        chilled: null,
        signature: true,
      },
    ],
  },
  {
    id: "momos-platters",
    name: "Momos & Platters",
    note: null,
    items: [
      {
        id: "momo-platter",
        name: "Momo Platter",
        note: "Momos — Tibetan dumplings, steamed or fried — served as a plate.",
        price: null,
        spice: null,
        veg: null,
        chilled: null,
        signature: true,
      },
      {
        id: "tibetan-non-veg-platter",
        name: "Tibetan Non-Veg Platter",
        note: "A mixed plate. Ask the server what is on it today.",
        price: null,
        spice: null,
        veg: false,
        chilled: null,
      },
    ],
  },
  {
    id: "tibetan-plates",
    name: "Tibetan Plates",
    note: null,
    items: [
      {
        id: "tingmo",
        name: "Tingmo",
        note: "Steamed Tibetan bread. Order it to go with anything with sauce.",
        price: null,
        spice: "MILD",
        veg: true,
        chilled: null,
      },
      {
        id: "buff-green-cabbage-stir-fry",
        name: "Buff & Green Cabbage Stir Fry",
        note: "Buffalo and green cabbage. Lighter than it sounds.",
        price: null,
        spice: null,
        veg: false,
        chilled: null,
        signature: true,
      },
    ],
  },
  {
    id: "ramen-sushi",
    name: "Ramen & Sushi",
    note: null,
    items: [
      {
        id: "ramen",
        name: "Ramen",
        price: null,
        note: null,
        spice: null,
        veg: null,
        chilled: null,
        signature: true,
      },
      {
        id: "chicken-sushi",
        name: "Chicken Sushi",
        note: null,
        price: null,
        spice: null,
        veg: false,
        chilled: null,
      },
    ],
  },
  {
    id: "chilli-fry",
    name: "Chilli & Fry",
    note: "The hot end of the menu. Say the word and the kitchen will bring it down.",
    items: [
      {
        id: "chilli-chicken",
        name: "Chilli Chicken",
        note: null,
        price: null,
        spice: "HOT",
        veg: false,
        chilled: null,
      },
      {
        id: "chilli-prawn-dry",
        name: "Chilli Prawn Dry",
        note: null,
        price: null,
        spice: "HOT",
        veg: false,
        chilled: null,
      },
      {
        id: "pork-ribs",
        name: "Pork Ribs",
        note: null,
        price: null,
        spice: null,
        veg: false,
        chilled: null,
      },
    ],
  },
  {
    id: "sides",
    name: "Sides",
    note: null,
    items: [
      {
        id: "crunchy-chicken-fries",
        name: "Crunchy Chicken Fries",
        note: null,
        price: null,
        spice: null,
        veg: false,
        chilled: null,
      },
      {
        id: "spicy-potato-chips",
        name: "Spicy Potato Chips",
        note: null,
        price: null,
        spice: "HOT",
        veg: true,
        chilled: null,
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    note: "Coffee from 7:30, when nothing else in the lane is open.",
    items: [
      {
        id: "grapefruit-orange-cooler",
        name: "Grapefruit & Orange Cooler",
        note: null,
        price: null,
        spice: "MILD",
        veg: true,
        chilled: true,
      },
      {
        id: "kiwi-slush",
        name: "Kiwi Slush",
        note: null,
        price: null,
        spice: "MILD",
        veg: true,
        chilled: true,
      },
      {
        id: "coffee",
        name: "Coffee",
        note: "Ask what is on today.",
        price: null,
        spice: "MILD",
        veg: true,
        chilled: null,
      },
      {
        id: "tibetan-tea",
        name: "Tibetan Tea",
        note: null,
        price: null,
        spice: "MILD",
        veg: true,
        chilled: null,
      },
    ],
  },
];

/** Lines shown at the top of /menu. Edited here, not in the page component. */
export const MENU_NOTES = {
  prices:
    "Prices are on the menu in the restaurant and we would rather you saw the right one there than the wrong one here. Ask the staff, or call and we will tell you.",
  spice:
    "The kitchen will cook anything milder, or hotter. Tell the server when you order — not after. Where a dish says ASK, ask, and you will get a straight answer.",
  allergens:
    "Some dishes use MSG. If you have an allergy, tell the staff before you order and they will check with the kitchen.",
} as const;

export const ALL_ITEMS: MenuItem[] = MENU.flatMap((c) => c.items);

export const SIGNATURE_ITEMS: MenuItem[] = ALL_ITEMS.filter((i) => i.signature);

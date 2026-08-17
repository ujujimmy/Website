/**
 * Image slots.
 *
 * The only photography available is the restaurant's own Instagram output:
 * compressed, ~1080px, square or 4:5. The whole layout is built around that
 * rather than against it.
 *
 * THE RULE: `displayMax` is never larger than half the native pixel width.
 * A 1080px source shown in a 540px CSS box is sharp on a retina phone. The same
 * file stretched across a viewport is visibly mushy and makes the site look
 * cheap. Small and crisp beats large and soft, every time.
 *
 * Every file in /public/images is currently a generated placeholder at the exact
 * dimensions below. See REPLACE-THESE.md at the repo root.
 */

export type Ratio = "1:1" | "4:5";

export type ImageSlot = {
  id: string;
  src: string;
  width: number;
  height: number;
  ratio: Ratio;
  /** Widest this image is ever allowed to render, in CSS pixels. */
  displayMax: number;
  /** Written for a person, not for a crawler. */
  alt: string;
  /** What to shoot. Copied into REPLACE-THESE.md. */
  brief: string;
};

const slot = (s: ImageSlot) => s;

export const IMAGES = {
  interior: slot({
    id: "interior-evening",
    src: "/images/interior-evening.jpg",
    width: 1080,
    height: 1350,
    ratio: "4:5",
    displayMax: 540,
    alt: "The dining room at Machen La Tibet Kitchen in the evening, with warm lamps and Tibetan monastery-influenced decor",
    brief:
      "Wide view of the room in the evening with the lights on. Shoot from a corner so you get depth, not a flat wall.",
  }),
  hotPot: slot({
    id: "hot-pot-table",
    src: "/images/hot-pot-table.jpg",
    width: 1080,
    height: 1080,
    ratio: "1:1",
    displayMax: 540,
    alt: "A hot pot simmering on a full table at Machen La, steam rising off the broth",
    brief:
      "Hot pot on a full table, steam visible. Shoot slightly above the table edge, not directly overhead.",
  }),
  momos: slot({
    id: "momo-platter-overhead",
    src: "/images/momo-platter-overhead.jpg",
    width: 1080,
    height: 1080,
    ratio: "1:1",
    displayMax: 540,
    alt: "A momo platter at Machen La photographed from above, dumplings arranged with dipping sauce",
    brief: "Momo platter straight overhead, sauce in frame, plain surface underneath.",
  }),
  frontage: slot({
    id: "frontage-lane",
    src: "/images/frontage-lane.jpg",
    width: 1080,
    height: 1350,
    ratio: "4:5",
    displayMax: 540,
    alt: "The frontage of Machen La Tibet Kitchen seen from the lane in Majnu ka Tilla",
    brief:
      "The front of the restaurant from the lane, so someone walking up recognises it. Include the sign.",
  }),
  morningCoffee: slot({
    id: "morning-coffee-window",
    src: "/images/morning-coffee-window.jpg",
    width: 1080,
    height: 1350,
    ratio: "4:5",
    displayMax: 540,
    // This one image carries the entire positioning. It is the 7:30 opening,
    // made visible.
    alt: "A cup of coffee on a window table at Machen La in early morning light, before the rest of Majnu ka Tilla opens",
    brief:
      "Coffee on a table by the window in real morning light — the earlier the better. This picture sells the 7:30 opening; it is the most important shot on the list.",
  }),
  staff: slot({
    id: "staff-kitchen",
    src: "/images/staff-kitchen.jpg",
    width: 1080,
    height: 1080,
    ratio: "1:1",
    displayMax: 540,
    alt: "Kitchen staff at work at Machen La Tibet Kitchen",
    brief:
      "The chef or the floor staff, working, not posed in a line. Get permission first.",
  }),
} as const;

/** The six that carry the site, in the order they were prioritised. */
export const PRIORITY_SLOTS: ImageSlot[] = [
  IMAGES.interior,
  IMAGES.hotPot,
  IMAGES.momos,
  IMAGES.frontage,
  IMAGES.morningCoffee,
  IMAGES.staff,
];

/**
 * Optional slots. These are NOT built into any page and no placeholder is
 * generated for them — the brief is explicit that six strong images beat twenty
 * weak ones, and empty slots invite filling with stock. Listed here so the
 * client knows what is worth shooting next, and so /gallery can grow later.
 */
export const FUTURE_SHOTS = [
  "Tingmo with the buff and green cabbage stir fry",
  "A ramen bowl",
  "Pork ribs",
  "The grapefruit and orange cooler beside the kiwi slush",
  "The outdoor seating",
  "One decor detail — a painted beam, a lamp, a corner of the room",
] as const;

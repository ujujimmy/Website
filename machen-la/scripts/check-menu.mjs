/**
 * Runs on every `pnpm build`.
 *
 * Prints every unverified field in the menu so filling them in is a five-minute
 * job rather than an archaeology exercise. It never fails the build — the site
 * is designed to ship with these gaps and render them honestly — but it makes
 * sure nobody can deploy without the list scrolling past them.
 */
const { MENU, ALL_ITEMS } = await import("../src/data/menu.ts");

const missingPrice = ALL_ITEMS.filter((i) => i.price === null);
const missingSpice = ALL_ITEMS.filter((i) => i.spice === null);
const missingVeg = ALL_ITEMS.filter((i) => i.veg === null);

const bar = "─".repeat(64);
const list = (items) =>
  items
    .map((i) => {
      const section = MENU.find((c) => c.items.includes(i));
      return `    ${i.name.padEnd(34)} ${section ? section.name : ""}`;
    })
    .join("\n");

console.log(`\n${bar}\n  MENU DATA — src/data/menu.ts\n${bar}`);
console.log(`  ${ALL_ITEMS.length} items in ${MENU.length} categories\n`);

if (missingPrice.length) {
  console.log(`  PRICE MISSING — renders as an em dash  (${missingPrice.length})`);
  console.log(list(missingPrice));
  console.log("");
}

if (missingSpice.length) {
  console.log(`  HEAT UNCONFIRMED — renders as ASK  (${missingSpice.length})`);
  console.log(list(missingSpice));
  console.log("");
}

if (missingVeg.length) {
  console.log(`  VEG UNCONFIRMED — no marker shown  (${missingVeg.length})`);
  console.log(list(missingVeg));
  console.log("");
}

if (!missingPrice.length && !missingSpice.length && !missingVeg.length) {
  console.log("  Every field verified. Nothing to fill in.\n");
}

console.log(`${bar}\n`);

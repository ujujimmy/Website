/**
 * Questions people actually type into Google before coming to Majnu ka Tilla.
 * Rendered on /visit and emitted as FAQPage structured data from the same array,
 * so the page and the schema can never drift apart.
 *
 * Answer honestly or leave the question out. An unverified answer here goes
 * straight into a Google rich result, which is the worst place to be wrong.
 */

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What time does Machen La open?",
    a: "7:30 in the morning, every day, and we close at 10 at night. Most of Majnu ka Tilla opens around noon, so if you have come off the overnight bus and want breakfast, we are the kitchen that is open.",
  },
  {
    q: "How far is Machen La from the Majnu ka Tilla bus stand?",
    a: "A short walk. The buses to Dharamsala and Manali set down at the edge of the colony and we are inside it, at Rabsel House 47 in New Aruna Colony. Follow the lane in and ask for Machen La — it is a small settlement and everyone knows it.",
  },
  {
    q: "Do you have vegetarian food?",
    a: "Yes. Tingmo, potatoes, the coolers and the coffee are vegetarian, and several other dishes can be made vegetarian. The menu marks what we have confirmed; for anything unmarked, ask the server and they will check with the kitchen.",
  },
  {
    q: "Is the food very spicy?",
    a: "Some of it is, and this is the thing guests most often tell us we got wrong. The kitchen will cook anything milder or hotter — say so when you order rather than after the plate arrives.",
  },
  {
    q: "Do you take cards?",
    a: "Please call us on +91 70425 24233 before you come if this matters to you. We would rather answer it on the phone than print something here that turns out to be wrong at the table.",
  },
  {
    q: "Is there parking near Machen La?",
    a: "Majnu ka Tilla is a dense settlement of narrow lanes and parking is on the main road outside the colony, not at the door. Most people park at the edge and walk in, or come by auto or metro to Vidhan Sabha.",
  },
];

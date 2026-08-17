import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Eating in Majnu ka Tilla — Machen La Tibet Kitchen";

export default function Image() {
  return ogImage({
    kicker: "Little Tibet, Delhi",
    title: "What to eat in Majnu ka Tilla.",
  });
}

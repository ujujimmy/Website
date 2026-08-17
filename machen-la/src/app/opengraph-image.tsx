import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "Machen La Tibet Kitchen — the first kitchen open in Majnu ka Tilla";

export default function Image() {
  return ogImage({
    kicker: "Majnu ka Tilla, Delhi",
    title: "The first kitchen open in Majnu ka Tilla.",
  });
}

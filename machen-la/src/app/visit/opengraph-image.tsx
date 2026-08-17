import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "Machen La Tibet Kitchen, Rabsel House 47, Majnu-ka-Tilla, Delhi 110054";

export default function Image() {
  return ogImage({
    kicker: "Find us",
    title: "Rabsel House 47, Majnu-ka-Tilla.",
  });
}

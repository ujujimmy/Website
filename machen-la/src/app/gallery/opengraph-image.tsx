import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Inside Machen La Tibet Kitchen, Majnu ka Tilla";

export default function Image() {
  return ogImage({
    kicker: "The room",
    title: "Inside Machen La Tibet Kitchen.",
  });
}

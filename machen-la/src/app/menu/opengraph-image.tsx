import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The menu at Machen La Tibet Kitchen, Majnu ka Tilla";

export default function Image() {
  return ogImage({
    kicker: "Menu",
    title: "Hot pot, momos, ramen and tingmo.",
  });
}

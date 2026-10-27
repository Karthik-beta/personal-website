import { ogSize, renderOgImage } from "@/lib/og";

export const alt =
  "Karthik Parameshwara: I build backend-heavy products and see them through to production.";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: "I build backend-heavy products and see them through to production.",
    footer: "Bengaluru, India. Available now.",
  });
}

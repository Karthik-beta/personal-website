import { ogSize, renderOgImage } from "@/lib/og";

// Look v2. Next puts a hash of this file's text in the image URL, and link previews (LinkedIn)
// cache by URL: bump this when og.tsx or the case-study content changes the picture.
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

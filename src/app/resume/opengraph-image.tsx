import { ogSize, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

// Look v2. Next puts a hash of this file's text in the image URL, and link previews (LinkedIn)
// cache by URL: bump this when og.tsx or this picture's text changes.
export const alt = `Resume of ${site.name}. Each line links to the work behind it.`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: "Resume",
    summary: "Each line links to the work behind it: case studies, code and live projects.",
    footer: "Bengaluru, India. Available now.",
  });
}

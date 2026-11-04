import { ogSize, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

// Look v1. Next puts a hash of this file's text in the image URL, and link previews (LinkedIn)
// cache by URL: bump this when og.tsx or this picture's text changes.
export const alt = `Open source work by ${site.name}: workclock and fiscalclock, and fixes sent to other projects.`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: "Open source",
    summary:
      "workclock and fiscalclock on npm, PyPI and crates.io, and fixes sent to other projects.",
    footer: "Bengaluru, India. Available now.",
  });
}

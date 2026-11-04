import {
  caseStudyOgAlt,
  caseStudyOgImage,
  caseStudyOgSize,
} from "@/components/case-study/case-study-page";

// Look v2. Next puts a hash of this file's text in the image URL, and link previews (LinkedIn)
// cache by URL: bump this when og.tsx or the case-study content changes the picture.
export const alt = caseStudyOgAlt("aria");
export const size = caseStudyOgSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return caseStudyOgImage("aria");
}

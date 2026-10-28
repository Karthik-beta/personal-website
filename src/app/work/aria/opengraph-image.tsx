import {
  caseStudyOgAlt,
  caseStudyOgImage,
  caseStudyOgSize,
} from "@/components/case-study/case-study-page";

export const alt = caseStudyOgAlt("aria");
export const size = caseStudyOgSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return caseStudyOgImage("aria");
}

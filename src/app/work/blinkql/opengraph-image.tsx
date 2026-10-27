import { caseStudyOgImage, caseStudyOgSize } from "@/components/case-study/case-study-page";

export const alt = "Case study by Karthik Parameshwara";
export const size = caseStudyOgSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return caseStudyOgImage("blinkql");
}

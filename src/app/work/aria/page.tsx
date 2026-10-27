import { CaseStudyPage, caseStudyMetadata } from "@/components/case-study/case-study-page";

export const metadata = caseStudyMetadata("aria");

export default function Page() {
  return <CaseStudyPage slug="aria" />;
}

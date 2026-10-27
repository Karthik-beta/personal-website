import { CaseStudyPage, caseStudyMetadata } from "@/components/case-study/case-study-page";

export const metadata = caseStudyMetadata("workclock");

export default function Page() {
  return <CaseStudyPage slug="workclock" />;
}

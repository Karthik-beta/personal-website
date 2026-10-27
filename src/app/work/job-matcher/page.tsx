import { CaseStudyPage, caseStudyMetadata } from "@/components/case-study/case-study-page";

export const metadata = caseStudyMetadata("job-matcher");

export default function Page() {
  return <CaseStudyPage slug="job-matcher" />;
}

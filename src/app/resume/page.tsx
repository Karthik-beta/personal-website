import { Download } from "lucide-react";
import type { Metadata } from "next";
import { ResumeSheet } from "@/components/resume/resume-sheet";
import { AskAi } from "@/components/site/ask-ai";
import { JsonLd } from "@/components/site/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { askAi } from "@/content/ask-ai";
import { resume, resumeDescription as description } from "@/content/resume";
import { site } from "@/lib/site";
import { resumeStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Resume",
  description,
  alternates: { canonical: "/resume" },
  // openGraph and twitter replace the layout's objects rather than merging, so repeat the shared fields.
  openGraph: {
    type: "profile",
    locale: "en_GB",
    siteName: site.name,
    url: "/resume",
    title: `Resume | ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    creator: site.x,
    title: `Resume | ${site.name}`,
    description,
  },
};

const updated = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(resume.updated));

export default function ResumePage() {
  return (
    <main id="content" className="pt-8 pb-16 lg:pt-12 lg:pb-24 print:p-0">
      <JsonLd data={resumeStructuredData({ description, updated: resume.updated })} />
      {/* The site's container (aligned with the header), holding the --notes column width. */}
      <div className="mx-auto w-full max-w-[64rem] px-4 [--notes:20rem] sm:px-6 lg:px-8 print:max-w-none print:px-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:mr-(--notes) print:hidden">
          <p className="text-xs text-muted">
            Updated <time dateTime={resume.updated}>{updated}</time>
          </p>
          <a
            href={site.resumePdf}
            download={site.resumePdfName}
            data-track="resume_download"
            className={buttonClasses("quiet")}
          >
            <Download aria-hidden size={18} strokeWidth={1.75} />
            Download PDF
          </a>
        </div>
        <div className="mb-6 text-sm lg:mr-(--notes) print:hidden">
          <AskAi copy={askAi.resume} />
        </div>
        <ResumeSheet resume={resume} />
      </div>
    </main>
  );
}

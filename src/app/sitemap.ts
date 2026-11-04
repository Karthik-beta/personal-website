import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { resume } from "@/content/resume";
import { getOpenSource, lastActivity } from "@/lib/open-source";
import { site } from "@/lib/site";

// Google ignores changefreq and priority, but uses lastModified when it is accurate, so these are
// real content dates (site.updated, the resume's and each study's `updated`, the open-source
// page's latest activity), never the build date.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const openSource = await getOpenSource();
  return [
    { url: site.url, lastModified: site.updated },
    { url: `${site.url}/resume`, lastModified: resume.updated },
    { url: `${site.url}/open-source`, lastModified: lastActivity(openSource) },
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      lastModified: study.updated,
    })),
  ];
}

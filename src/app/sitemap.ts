import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { site } from "@/lib/site";

// Google ignores changefreq and priority, but uses lastModified when it is accurate, so these are
// real content dates (site.updated, each study's `updated`), never the build date.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: site.updated },
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      lastModified: study.updated,
    })),
  ];
}

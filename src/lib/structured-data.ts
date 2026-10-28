import photo from "../../assets/photo/karthik-parameshwara-square.jpg";
import type { CaseStudy } from "@/content/case-studies";
import { site } from "@/lib/site";

// schema.org JSON-LD for search engines (docs/design/11-performance-and-seo.md). Confirmed facts
// only, and only facts a reader can also see on the page (Google's structured-data guidelines).

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

const person = {
  "@type": "Person",
  "@id": personId,
  name: site.name,
  givenName: "Karthik",
  familyName: "Parameshwara",
  // The name on LinkedIn and the resume, so search engines can tie those profiles to this site.
  alternateName: "Karthik P",
  url: site.url,
  image: `${site.url}${photo.src}`,
  jobTitle: "Software Engineer",
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "MVJ College of Engineering" },
  knowsAbout: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "PostgreSQL", "Docker"],
  sameAs: [site.links.github, site.links.linkedin, site.links.x],
};

// Everywhere else refers to the person by @id instead of repeating the details.
const personRef = { "@type": "Person", "@id": personId, name: site.name, url: site.url };

/** Home: the site's name, and a profile page whose subject is Karthik. */
export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        alternateName: "karthik.nz",
        inLanguage: "en-GB",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        url: site.url,
        name: site.title,
        isPartOf: { "@id": websiteId },
        inLanguage: "en-GB",
        dateCreated: site.published,
        dateModified: site.updated,
        mainEntity: person,
      },
    ],
  };
}

/** Case study: an article written by Karthik, plus breadcrumbs back to the home page. */
export function caseStudyStructuredData(study: CaseStudy) {
  const url = `${site.url}/work/${study.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: study.title,
        description: study.summary,
        image: `${url}/opengraph-image`,
        datePublished: study.published,
        dateModified: study.updated,
        inLanguage: "en-GB",
        author: personRef,
        publisher: personRef,
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: site.url },
          { "@type": "ListItem", position: 2, name: study.title, item: url },
        ],
      },
    ],
  };
}

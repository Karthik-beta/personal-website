import { site } from "@/lib/site";
import photo from "../../../assets/photo/karthik-parameshwara-square.jpg";

// schema.org Person for search engines (docs/design/11-performance-and-seo.md). Confirmed facts only.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}${photo.src}`,
  jobTitle: "Software Engineer",
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "MVJ College of Engineering" },
  knowsAbout: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "PostgreSQL", "Docker"],
  sameAs: [site.links.github, site.links.linkedin, site.links.x],
};

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no value can ever close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
    />
  );
}

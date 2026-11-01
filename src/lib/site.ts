// Confirmed facts only (see docs/content, local). Change here, not in components.
export const site = {
  name: "Karthik Parameshwara",
  title: "Karthik Parameshwara | Software engineer",
  description:
    "Full-stack software engineer (backend-leaning) with 3+ years shipping enterprise software. Co-founded Pivotr. Available now in Bengaluru or remote in India.",
  url: "https://karthik.nz",
  x: "@K4rthik__",
  email: "karthikparam10@gmail.com",
  // The resume page (ADR 0016); the PDF is downloaded from there.
  resume: "/resume",
  resumePdf: "/resume.pdf",
  resumePdfName: "Karthik_Parameshwara_Resume.pdf",
  repo: "https://github.com/Karthik-beta/personal-website",
  copyrightYear: 2026,
  // ISO dates for search engines (sitemap, structured data). Bump `updated` when the home page's
  // content changes in a way a reader would notice, not for code or styling changes.
  published: "2026-10-27",
  updated: "2026-10-28",
  links: {
    github: "https://github.com/Karthik-beta",
    linkedin: "https://www.linkedin.com/in/karthik-paramesh",
    x: "https://x.com/K4rthik__",
    devto: "https://dev.to/k4rthik_",
    hashnode: "https://hashnode.com/@karthik-beta",
  },
} as const;

/** Main nav: home sections, plus the open-source page (ADR 0017). */
export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/open-source", label: "Open source" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Marks the nav item for where the reader is: "page" on a page it links to, "true" on a case
 *  study (its link leads to the home page's Work section, not to the page being read). */
export function navCurrent(href: string, pathname: string) {
  if (href === pathname) return "page";
  if (href === "/#work" && pathname.startsWith("/work")) return "true";
  return undefined;
}

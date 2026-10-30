// Confirmed facts only (see docs/content, local). Change here, not in components.
export const site = {
  name: "Karthik Parameshwara",
  title: "Karthik Parameshwara | Software engineer",
  description:
    "Full-stack software engineer (backend-leaning) with 3+ years shipping enterprise software. Co-founded Pivotr. Available now in Bengaluru or remote in India.",
  url: "https://karthik.nz",
  x: "@K4rthik__",
  email: "karthikparam10@gmail.com",
  resume: "/resume.pdf",
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

export const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

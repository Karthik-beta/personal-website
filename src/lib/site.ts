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
  links: {
    github: "https://github.com/Karthik-beta",
    linkedin: "https://www.linkedin.com/in/karthik-paramesh",
    x: "https://x.com/K4rthik__",
  },
} as const;

export const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

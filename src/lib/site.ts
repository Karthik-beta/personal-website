// Confirmed facts only (see docs/content, local). Change here, not in components.
export const site = {
  name: "Karthik Parameshwara",
  url: "https://karthik.nz",
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

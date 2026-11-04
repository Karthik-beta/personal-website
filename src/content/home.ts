// The home page's words. Facts only from the approved story and the projects' own READMEs. The
// components in src/components/home render them, and /index.md is built from them.

/** A sentence that opens with a bold run: "**30+ customer deployments** across two companies". */
export type Lead = { strong: string; rest: string };

/** [ISO date, label] for a <time> element. */
export type When = [string, string];

/** Someone else's published words about Karthik, quoted exactly, with who said it and where. */
export type Recommendation = { paragraphs: string[]; name: string; role: string; href: string };

export type ChapterBlock = string | { quote: string } | { recommendation: Recommendation };

export type Chapter = {
  title: string;
  role?: string;
  from: When;
  /** No end: ongoing, shown as "now". */
  to?: When;
  blocks: ChapterBlock[];
};

export type Project = {
  title: string;
  /** Case-study page, if the project has one. */
  href?: string;
  years: string;
  summary: string;
  stack: string[];
  links: { href: string; label: string }[];
};

const gh = (repo: string) => `https://github.com/Karthik-beta/${repo}`;

export const home = {
  hero: {
    margin: "Now",
    tagline: {
      before: "I build ",
      nowrap: "backend-heavy",
      after: " products and see them through to production.",
    },
    facts: [
      { label: "Role", value: "Software engineer, full-stack, backend-leaning" },
      { label: "Experience", value: "3+ years" },
      { label: "Availability", value: "Available now" },
      { label: "Location", value: "Bengaluru, or remote in India" },
      {
        label: "Stack",
        value:
          "TypeScript, Node.js, NestJS, Next.js, React, PostgreSQL, Docker. Also Python and Rust.",
        wide: true,
      },
    ],
    actions: { resume: "View resume", email: "Email me", github: "GitHub", linkedin: "LinkedIn" },
    highlightsTitle: "Highlights",
    highlights: [
      { strong: "30+ customer deployments", rest: " across two companies" },
      { strong: "Co-founded Pivotr", rest: " and built core modules of its ERP, Aria" },
      {
        strong: "An open-source library",
        rest: ", workclock, published for Rust, Python and JavaScript",
      },
    ] satisfies Lead[],
  },

  chapters: {
    title: "How I got here",
    items: [
      {
        title: "Customers first",
        role: "Marketing and sales",
        from: ["2017", "2017"],
        to: ["2023", "2023"],
        blocks: [
          "Before I wrote software for a living, I spent six years in marketing and sales: on the ground at events, generating leads, and as a marketing intern at Shell.",
          {
            quote:
              "Talking to customers got me interested in the problems behind what they were asking for. I wanted to understand how a solution worked and learn to build it myself.",
          },
          "I started teaching myself to program in 2021 and finished a degree in mechanical engineering at MVJ College of Engineering in 2022.",
        ],
      },
      {
        title: "Learning to ship",
        role: "Software developer, Getin Solutions",
        from: ["2023-06", "June 2023"],
        to: ["2025-05", "May 2025"],
        blocks: [
          "My first engineering role was building two enterprise products for manufacturing customers: an HR system and a production-operations system, with Angular, Django and PostgreSQL.",
          "The work went well beyond code. I took features from requirements to rollout across more than 20 customer deployments, including configuration, testing, troubleshooting and support after go-live.",
          "Some of the problems were properly hard. Real-time data from connected devices fed live dashboards, and I designed an algorithm that works out which shift an employee is on, across fixed, rotational and automatic shift patterns, including shifts that run past midnight.",
        ],
      },
      {
        title: "Building a company",
        role: "Co-founder and software engineer, Pivotr",
        from: ["2025-06", "June 2025"],
        to: ["2026-09", "September 2026"],
        blocks: [
          "In June 2025 I co-founded Pivotr. Our product, Aria, is a modular ERP for businesses. I architected and built two of its core modules, Asset Management and Inventory Management, with TypeScript, NestJS, tRPC, Prisma, PostgreSQL and Next.js.",
          "Owning a product meant owning everything around it. I took Asset Management through 12 customer deployments, built inventory proofs of concept around prospects’ real workflows, and set up an AI-assisted development workflow in which linting, type checks and static analysis gate every change. When the company needed outreach tooling, I built that too: three small tools, each solving the next problem we hit.",
          {
            // Two sentences of Prashanth's LinkedIn recommendation (ADR 0026), word for word.
            recommendation: {
              paragraphs: [
                "The asset management product I was selling was built by Karthik, and so were the outreach tools I used to sell it.",
                "We went into customer meetings together, and more than once what we heard there turned into a working demo for that prospect.",
              ],
              name: "Prashanth Matsya",
              role: "Director of sales, Pivotr",
              href: "https://www.linkedin.com/in/karthik-paramesh/details/recommendations/",
            },
          },
          "Pivotr continues, and Aria is still in use by its customers. After 15 months as a co-founder, I’m returning to what I enjoy most: building software alongside a strong engineering team.",
        ],
      },
      {
        title: "Building in the open",
        from: ["2026-09", "September 2026"],
        blocks: [
          "Since leaving Pivotr I’ve been building in public: workclock, a library for business-time calculations in Rust, Python and JavaScript; Job Matcher, a self-hosted tool that reads job boards and scores each listing against my resume; and Blinkql, an in-browser SQL workbench, still early, with its first outside contributors.",
          "Next, I’m looking for a full-stack role with a backend focus at a product company or scale-up, where I can own features end to end and learn from engineers better than me.",
        ],
      },
    ] satisfies Chapter[],
  },

  work: {
    title: "Selected work",
    intro: "The first four have full case studies: the problem, what I did, and how it turned out.",
    projects: [
      {
        title: "Aria (Pivotr)",
        href: "/work/aria",
        years: "2025 – 2026",
        summary:
          "The asset and inventory modules of a modular B2B ERP, built from data model to deployment. The Asset Management module went through 12 customer deployments.",
        stack: ["TypeScript", "NestJS", "tRPC", "Prisma", "PostgreSQL", "Next.js", "Docker"],
        links: [
          { href: "/work/aria", label: "Read the case study" },
          { href: gh("Aria"), label: "Code on GitHub" },
        ],
      },
      {
        title: "Job Matcher",
        href: "/work/job-matcher",
        years: "2026",
        summary:
          "A self-hosted tool that watches the job boards I follow, filters listings by location and experience, and scores each one against my resume with an LLM. Runs are queued, idempotent and budget-aware.",
        stack: [
          "TypeScript",
          "Bun",
          "NestJS",
          "Next.js",
          "Effect",
          "PostgreSQL",
          "BullMQ",
          "Docker",
        ],
        links: [
          { href: "/work/job-matcher", label: "Read the case study" },
          { href: gh("AI-Job-Resume-Matcher"), label: "Code on GitHub" },
        ],
      },
      {
        title: "workclock",
        href: "/work/workclock",
        years: "2026",
        summary:
          "Business-time arithmetic (working hours, SLAs, shifts, holidays and time zones) with a Rust core and bindings for Python and JavaScript. Published on crates.io, PyPI and npm.",
        stack: ["Rust", "Python (PyO3)", "WebAssembly", "TypeScript"],
        links: [
          { href: "/work/workclock", label: "Read the case study" },
          { href: "https://workclock.karthik.nz/docs/", label: "Read the docs" },
          { href: gh("workclock"), label: "Code on GitHub" },
        ],
      },
      {
        title: "Blinkql",
        href: "/work/blinkql",
        years: "2026",
        summary:
          "An in-browser SQL workbench: open a CSV, Parquet or JSON file and query it on your own machine, with no upload. Early, built in the open with a public roadmap and its first outside contributors.",
        stack: ["TypeScript", "React", "DuckDB-WASM", "Apache Arrow"],
        links: [
          { href: "/work/blinkql", label: "Read the case study" },
          { href: "https://blinkql.karthik.nz", label: "Try Blinkql" },
          { href: gh("Blinkql"), label: "Code on GitHub" },
        ],
      },
      {
        title: "Pivotr's outreach tools",
        years: "2026",
        summary:
          "Three small internal tools built one after another as Pivotr's outreach needs grew: Pivotr-Mailer, then TermiSend, a terminal app for personalised email campaigns with audit logging, then MailSense, for importing and verifying lead lists.",
        stack: ["TypeScript", "Bun", "Ink", "AWS SES", "SvelteKit", "Hono", "SQLite"],
        links: [
          { href: gh("TermiSend"), label: "TermiSend on GitHub" },
          { href: gh("MailSense"), label: "MailSense on GitHub" },
        ],
      },
    ] satisfies Project[],
  },

  openSource: {
    title: "Open source",
    /** Filled from the live data (src/lib/open-source/words.ts). */
    sentence: (libraries: string, projects: string | null) =>
      `I maintain ${libraries}, published on npm, PyPI and crates.io` +
      `${projects ? `, and send fixes to projects such as ${projects}` : ""}.`,
    link: "See open-source work",
  },

  about: {
    title: "About",
    photoAlt: "Karthik Parameshwara",
    story:
      "I started building in college, around 2020, because I wanted to earn some money: first Fiesta Styles, a fashion dropshipping store on Wix, then a movies and shows website on WordPress. That’s when I found I liked building software, and my marketing jobs had given me ideas I needed deeper technical knowledge to build. Now I talk to users before I write code, keep designs simple, make them hard to break, and stay with what I ship after launch. Outside work, I build side projects, still play football and go running regularly.",
    details: [
      {
        label: "Languages",
        value: "English and Kannada (native), Hindi (fluent), some Telugu and Spanish",
      },
      {
        label: "At college",
        value:
          "Helped build and drove go-karts with the Volhester Racing Club, and played football for my college",
      },
    ],
  },

  contact: {
    title: "Contact",
    lead: "I’m available now. The fastest way to reach me is email.",
    actions: { resume: "View resume", linkedin: "LinkedIn", github: "GitHub", x: "X" },
  },
};

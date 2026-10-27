import { ProjectEntry } from "@/components/site/project-entry";
import { Container } from "@/components/ui/container";
import { MarginGrid } from "./margin-grid";

type Project = React.ComponentProps<typeof ProjectEntry> & { years: React.ReactNode };

const gh = (repo: string) => `https://github.com/Karthik-beta/${repo}`;

// Facts only from the approved story and the projects' own READMEs.
const projects: Project[] = [
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
      "A self-hosted tool that watches the job boards you follow, filters listings by location and experience, and scores each one against your resume with an LLM. Runs are queued, idempotent and budget-aware.",
    stack: ["TypeScript", "Bun", "NestJS", "Next.js", "Effect", "PostgreSQL", "BullMQ", "Docker"],
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
    years: "2026",
    summary:
      "An in-browser SQL workbench: open a CSV, Parquet or JSON file and query it on your own machine, with no upload. Early, built in the open with a public roadmap and its first outside contributors.",
    stack: ["TypeScript", "React", "DuckDB-WASM", "Apache Arrow"],
    links: [{ href: gh("Blinkql"), label: "Code on GitHub" }],
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
];

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="pb-16 lg:pb-24">
      <Container className="grid gap-10 md:gap-14">
        <MarginGrid>
          <div className="grid max-w-[65ch] gap-2">
            <h2 id="work-title" className="text-2xl font-semibold stretch-heading">
              Selected work
            </h2>
            <p className="text-muted">
              The first three have full case studies: the problem, what I did, and how it turned
              out.
            </p>
          </div>
        </MarginGrid>
        <div className="grid">
          {projects.map(({ years, ...project }) => (
            <MarginGrid key={project.title} margin={years} className="border-t border-rule py-6">
              <ProjectEntry {...project} framed={false} />
            </MarginGrid>
          ))}
        </div>
      </Container>
    </section>
  );
}

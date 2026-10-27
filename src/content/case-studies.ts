import type { StaticImageData } from "next/image";
import ariaAssetDark from "../../assets/screenshots/aria/asset-management-dark.png";
import ariaAssetLight from "../../assets/screenshots/aria/asset-management.png";
import ariaInventoryDark from "../../assets/screenshots/aria/inventory-management-dark.png";
import ariaInventoryLight from "../../assets/screenshots/aria/inventory-management.png";
import jmAnalyze from "../../assets/screenshots/job-matcher/analyze.png";
import jmMatches from "../../assets/screenshots/job-matcher/matches.png";
import overnightDark from "../../assets/screenshots/workclock/overnight-shift-dark.svg";
import overnightLight from "../../assets/screenshots/workclock/overnight-shift-light.svg";
import weekDark from "../../assets/screenshots/workclock/week-strip-dark.svg";
import weekLight from "../../assets/screenshots/workclock/week-strip-light.svg";

// Every statement here comes from Karthik's answers (Phase 1–5), the resume, or the
// projects' own READMEs. Don't add claims without a source.

export type CaseFigure =
  | {
      kind: "image";
      src: StaticImageData;
      darkSrc?: StaticImageData;
      alt: string;
      caption: string;
      unoptimized?: boolean;
    }
  | { kind: "placeholder"; label: string };

export type CaseSection = { paragraphs?: string[]; points?: string[]; figures?: CaseFigure[] };

export type CaseStudy = {
  slug: string;
  title: string;
  /** One sentence, for the page lede, metadata and the link preview. */
  summary: string;
  role: string;
  when: { label: string; from: string; to?: string };
  stack: string[];
  links: { href: string; label: string }[];
  problem: CaseSection;
  work: CaseSection;
  outcome: CaseSection;
};

const gh = (repo: string) => `https://github.com/Karthik-beta/${repo}`;

export const caseStudies: CaseStudy[] = [
  {
    slug: "aria",
    title: "Aria",
    summary:
      "Core asset and inventory modules, and the platform beneath them, for Pivotr’s modular B2B ERP. Built as the company’s only engineer and taken through 12 customer deployments.",
    role: "Co-founder and the only engineer, Pivotr",
    when: { label: "June 2025 – September 2026", from: "2025-06", to: "2026-09" },
    stack: [
      "TypeScript",
      "NestJS",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Next.js",
      "Tailwind CSS",
      "Docker",
      "Caddy",
    ],
    links: [{ href: gh("Aria"), label: "Code on GitHub" }],
    problem: {
      paragraphs: [
        "Pivotr’s customers were keeping track of their assets and stock in a mix of ways. Pivotr’s answer was Aria: a modular ERP in which assets, inventory, HR and customer relations are modules on one shared platform.",
        "I was the only engineer, so the product had to be designed, built, deployed and supported by one person.",
      ],
    },
    work: {
      points: [
        "Architected and built the Asset Management and Inventory Management modules: the data models, the business logic for the asset lifecycle and inventory operations, the REST and tRPC APIs, and the screens.",
        "Built the shared platform underneath: a Turborepo monorepo in which a type-only API contract keeps the NestJS backend and the Next.js frontend in step, plus authentication, CI/CD, and deployment with Docker Compose and Caddy.",
        "Made Aria easy to try: a Windows demo installer that starts the full stack with demo data, and updates itself, rolling back if an update fails.",
        "Set up an AI-assisted development workflow in which linting, type checking and static analysis gate every change before it is integrated.",
        "Built inventory proofs of concept around prospective customers’ real workflows.",
      ],
      figures: [
        {
          kind: "image",
          src: ariaAssetLight,
          darkSrc: ariaAssetDark,
          alt: "Aria’s Asset Dashboard: summary cards for total asset value (₹58 lakh), active assets (11), maintenance due (3) and pending adjustments (1), a monthly depreciation trend chart, and a donut chart of 14 assets by status.",
          caption:
            "The Asset Management dashboard: asset value, depreciation, maintenance and status on one screen. Demo data.",
        },
        {
          kind: "image",
          src: ariaInventoryLight,
          darkSrc: ariaInventoryDark,
          alt: "Aria’s Inventory Dashboard: summary cards for total stock value (₹39.6 lakh), active items (38), low-stock alerts (22) and pending material requests (1), a chart of inbound and outbound stock over the last 30 days, and a bar chart of stock by warehouse.",
          caption:
            "The Inventory Management dashboard: stock value, reorder alerts and stock movements across warehouses. Demo data.",
        },
      ],
    },
    outcome: {
      paragraphs: [
        "The Asset Management module went through 12 customer deployments, which I handled from configuration and rollout to troubleshooting and support afterwards.",
        "Pivotr continues, and Aria is still in use by its customers.",
      ],
    },
  },
  {
    slug: "job-matcher",
    title: "Job Matcher",
    summary:
      "A self-hosted tool that watches the job boards I follow and scores every new listing against my resume. I use it in my own job hunt.",
    role: "Sole developer",
    when: { label: "October 2026", from: "2026-10" },
    stack: [
      "TypeScript",
      "Bun",
      "NestJS",
      "Next.js",
      "Effect",
      "PostgreSQL",
      "Prisma",
      "BullMQ",
      "Docker",
      "Playwright",
    ],
    links: [
      { href: gh("AI-Job-Resume-Matcher"), label: "Code on GitHub" },
      { href: "https://karthik-beta.github.io/AI-Job-Resume-Matcher/", label: "Project website" },
    ],
    problem: {
      paragraphs: [
        "Job hunting meant checking many careers pages and job boards by hand, then reading every listing to judge whether it fitted. That didn’t scale.",
      ],
    },
    work: {
      paragraphs: [
        "Job Matcher re-checks the boards and careers pages I follow on a schedule, drops listings outside my locations, experience level and title keywords before spending anything on AI, then has an LLM score each remaining job against my resume and explain the fit.",
      ],
      points: [
        "Typed failures. The matching pipeline is written with Effect, so every failure is a typed error and each one is handled on purpose: a rejected API key stops the run, a blocked job page fails only that job, and a Discord outage is only logged.",
        "Safe, idempotent runs. The API only queues a run and a BullMQ worker does the slow work. The run id doubles as the queue job id, so a double click can’t start a run twice, and a per-user Postgres advisory lock stops runs overlapping.",
        "Budget-aware by design. Each run reads the scraping plan’s remaining credits and keeps a reserve, scrapes on a self-hosted instance first and falls back to the cloud only for pages that block it, and only uses an LLM endpoint under a per-token price cap.",
        "Resumable. Scraped pages are cached in Postgres and evaluations are keyed by a hash of the resume, sources, model and requirements, so a rerun picks up where the last one stopped.",
        "Tested like a product: 50+ test files with a 90% per-file line-coverage gate, Playwright end-to-end tests against fake providers, and CI that boots the full stack and runs the installer before anything merges. It installs with one command on Windows, macOS and Linux.",
      ],
      figures: [
        {
          kind: "image",
          src: jmAnalyze,
          alt: "Job Matcher's Analyze page: a completed run that found three listings, checked two, and marked both as matches, each with a one-line reason.",
          caption:
            "A completed run: listings found, checked and matched, with the reason for each. Demo data.",
        },
        {
          kind: "image",
          src: jmMatches,
          alt: "Job Matcher's Matches page listing two pending matches, each with a Mark applied button.",
          caption: "Matches wait here until I mark them as applied. Demo data.",
        },
      ],
    },
    outcome: {
      paragraphs: [
        "I use it regularly in my own job hunt. It saves me screening every listing by hand, and it has surfaced roles I went on to apply for.",
      ],
    },
  },
  {
    slug: "workclock",
    title: "workclock",
    summary:
      "A maintained, correct replacement for an unmaintained business-time library, with one Rust core shared by Rust, Python and JavaScript.",
    role: "Author and maintainer",
    when: { label: "October 2026", from: "2026-10" },
    stack: ["Rust", "jiff", "Python (PyO3)", "WebAssembly", "TypeScript"],
    links: [
      { href: "https://workclock.karthik.nz/docs/", label: "Read the docs" },
      { href: "https://workclock.karthik.nz/playground/", label: "Try the playground" },
      { href: gh("workclock"), label: "Code on GitHub" },
    ],
    problem: {
      paragraphs: [
        "Business-time arithmetic sounds simple: when is a ticket with an 8-hour SLA due, or how many contracted hours fell inside a shift? It gets hard with overnight shifts, holidays and time zones. At Getin Solutions I worked on exactly this kind of problem, with shifts that run past midnight.",
        "The usual Python library for it, businesstimedelta, has had no release since 2019, and its bugs are still open: overnight shifts count as zero hours, queries past the last holiday crash, and holidays in a different time zone can loop forever.",
      ],
      figures: [
        {
          kind: "image",
          src: overnightLight,
          darkSrc: overnightDark,
          unoptimized: true,
          alt: "A 22:00 to 06:00 shift measured from Monday 22:00 to Tuesday 06:00: businesstimedelta 1.0.1 counts 0 hours, workclock counts 8.",
          caption: "The same overnight shift, measured by both libraries.",
        },
      ],
    },
    work: {
      points: [
        "Wrote the core in Rust on top of jiff, and exposed it to Python through PyO3 and to JavaScript through WebAssembly, so all three languages share one implementation.",
        "Ported businesstimedelta’s API and test suite as a compatibility layer: most existing code runs unchanged with one import change, and a migration guide lists where workclock intentionally differs.",
        "Specified every rule with examples in a design document, and checked each binding against a brute-force reference implementation with property-based tests.",
        "Handled the details that bite in production: daylight-saving time resolved the way RFC 5545 and JavaScript Temporal do, bounded searches, signed differences, and time zone data bundled with the Python and npm packages.",
        "Published it on crates.io, PyPI and npm, with a docs site and an in-browser playground.",
      ],
      figures: [
        {
          kind: "image",
          src: weekLight,
          darkSrc: weekDark,
          unoptimized: true,
          alt: "Week strip in London time: a ticket opened at 16:30 on Thursday 24 December 2026 with an 8-hour SLA. With the holidays on 25 and 28 December and the weekend closed, it is due at 09:30 on Wednesday 30 December.",
          caption: "An 8-hour SLA counted across a weekend and two holidays.",
        },
      ],
    },
    outcome: {
      paragraphs: [
        "workclock fixes the overnight-shift, holiday and time zone bugs, and it is much faster: in benchmarks run in CI, 620× faster than businesstimedelta for a year-long span with bank holidays, and 280× faster across a million pairs.",
        "It’s pre-1.0, so the API may still change in a minor release.",
      ],
    },
  },
];

export type Slug = "aria" | "job-matcher" | "workclock";

export function getCaseStudy(slug: Slug): CaseStudy {
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) throw new Error(`Unknown case study: ${slug}`);
  return study;
}

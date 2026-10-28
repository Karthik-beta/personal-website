import { Quote } from "@/components/site/quote";
import { TimeRow } from "@/components/site/time-row";
import { Container } from "@/components/ui/container";
import { MarginGrid } from "./margin-grid";

function Range({ from, to }: { from: [string, string]; to?: [string, string] }) {
  return (
    <>
      <time dateTime={from[0]} className="whitespace-nowrap">
        {from[1]}
      </time>{" "}
      –{" "}
      {to ? (
        <time dateTime={to[0]} className="whitespace-nowrap">
          {to[1]}
        </time>
      ) : (
        "now"
      )}
    </>
  );
}

function Chapter({
  title,
  role,
  children,
}: {
  title: string;
  role?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid gap-4">
      <header className="grid gap-1">
        <h3 className="text-xl font-semibold stretch-title">{title}</h3>
        {role && <p className="text-sm text-muted">{role}</p>}
      </header>
      {children}
    </article>
  );
}

/** The story path: four dated chapters in the time margin. Facts only from the approved story. */
export function Chapters() {
  return (
    <section aria-labelledby="story-title" className="pb-16 lg:pb-24">
      <Container className="grid gap-10 md:gap-14">
        <MarginGrid>
          <h2 id="story-title" className="text-2xl font-semibold stretch-heading">
            How I got here
          </h2>
        </MarginGrid>

        <TimeRow when={<Range from={["2017", "2017"]} to={["2023", "2023"]} />}>
          <Chapter title="Customers first" role="Marketing and sales">
            <p>
              Before I wrote software for a living, I spent six years in marketing and sales: on the
              ground at events, generating leads, and as a marketing intern at Shell.
            </p>
            <Quote>
              Talking to customers got me interested in the problems behind what they were asking
              for. I wanted to understand how a solution worked and learn to build it myself.
            </Quote>
            <p>
              I started teaching myself to program in 2021 and finished a degree in mechanical
              engineering at MVJ College of Engineering in 2022.
            </p>
          </Chapter>
        </TimeRow>

        <TimeRow when={<Range from={["2023-06", "June 2023"]} to={["2025-05", "May 2025"]} />}>
          <Chapter title="Learning to ship" role="Software developer, Getin Solutions">
            <p>
              My first engineering role was building two enterprise products for manufacturing
              customers: an HR system and a production-operations system, with Angular, Django and
              PostgreSQL.
            </p>
            <p>
              The work went well beyond code. I took features from requirements to rollout across
              more than 20 customer deployments, including configuration, testing, troubleshooting
              and support after go-live.
            </p>
            <p>
              Some of the problems were properly hard. Real-time data from connected devices fed
              live dashboards, and I designed an algorithm that works out which shift an employee is
              on, across fixed, rotational and automatic shift patterns, including shifts that run
              past midnight.
            </p>
          </Chapter>
        </TimeRow>

        <TimeRow
          when={<Range from={["2025-06", "June 2025"]} to={["2026-09", "September 2026"]} />}
        >
          <Chapter title="Building a company" role="Co-founder and software engineer, Pivotr">
            <p>
              In June 2025 I co-founded Pivotr. Our product, Aria, is a modular ERP for businesses.
              I architected and built two of its core modules, Asset Management and Inventory
              Management, with TypeScript, NestJS, tRPC, Prisma, PostgreSQL and Next.js.
            </p>
            <p>
              Owning a product meant owning everything around it. I took Asset Management through 12
              customer deployments, built inventory proofs of concept around prospects&rsquo; real
              workflows, and set up an AI-assisted development workflow in which linting, type
              checks and static analysis gate every change. When the company needed outreach
              tooling, I built that too: three small tools, each solving the next problem we hit.
            </p>
            <p>
              Pivotr continues, and Aria is still in use by its customers. After 15 months as a
              co-founder, I&rsquo;m returning to what I enjoy most: building software alongside a
              strong engineering team.
            </p>
          </Chapter>
        </TimeRow>

        <TimeRow when={<Range from={["2026-09", "September 2026"]} />}>
          <Chapter title="Building in the open">
            <p>
              Since leaving Pivotr I&rsquo;ve been building in public: workclock, a library for
              business-time calculations in Rust, Python and JavaScript; Job Matcher, a self-hosted
              tool that reads job boards and scores each listing against my resume; and Blinkql, an
              in-browser SQL workbench, still early, with its first outside contributors.
            </p>
            <p>
              Next, I&rsquo;m looking for a full-stack role with a backend focus at a product
              company or scale-up, where I can own features end to end and learn from engineers
              better than me.
            </p>
          </Chapter>
        </TimeRow>
      </Container>
    </section>
  );
}

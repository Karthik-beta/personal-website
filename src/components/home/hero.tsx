import { Download, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { FactsRow } from "@/components/site/facts-row";
import { LocalTime } from "@/components/site/local-time";
import { ProofStrip } from "@/components/site/proof-strip";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/lib/site";
import { MarginGrid } from "./margin-grid";

const iconProps = { "aria-hidden": true, size: 18, strokeWidth: 1.75 } as const;

const facts = [
  { label: "Role", value: "Software engineer, full-stack, backend-leaning" },
  { label: "Experience", value: "3+ years" },
  { label: "Availability", value: "Available now" },
  { label: "Location", value: "Bengaluru, or remote in India" },
  {
    label: "Stack",
    value: "TypeScript, Node.js, NestJS, Next.js, React, PostgreSQL, Docker. Also Python and Rust.",
    wide: true,
  },
];

const proof = [
  <>
    <strong className="font-semibold">30+ customer deployments</strong> across two companies
  </>,
  <>
    <strong className="font-semibold">Co-founded Pivotr</strong> and built core modules of its ERP,
    Aria
  </>,
  <>
    <strong className="font-semibold">An open-source library</strong>, workclock, published for
    Rust, Python and JavaScript
  </>,
];

/** The skim layer: everything a recruiter needs in ten seconds, without scrolling. */
export function Hero() {
  return (
    <section aria-labelledby="hero-name">
      <Container className="grid gap-12 pt-12 pb-16 md:gap-16 lg:pt-24 lg:pb-24">
        <MarginGrid margin="Now">
          <h1 id="hero-name" className="text-sm font-semibold">
            {site.name}
          </h1>
          <p className="mt-4 max-w-[18ch] text-display font-semibold text-balance stretch-display">
            I build <span className="whitespace-nowrap">backend-heavy</span> products and see them
            through to production.
          </p>
          <div className="mt-8 grid gap-6">
            <FactsRow items={facts} className="@2xl:grid-cols-[1.5fr_0.8fr_0.9fr_1.3fr]" />
            <div>
              <LocalTime />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={site.resume} className={buttonClasses("primary")}>
                <Download {...iconProps} />
                Download resume
                <span className="sr-only"> (PDF)</span>
              </a>
              <TextLink href={`mailto:${site.email}`} kind="action" icon={<Mail {...iconProps} />}>
                Email me
              </TextLink>
              <TextLink href={site.links.github} kind="action" icon={<GitHubIcon />}>
                GitHub
              </TextLink>
              <TextLink href={site.links.linkedin} kind="action" icon={<LinkedInIcon />}>
                LinkedIn
              </TextLink>
            </div>
          </div>
        </MarginGrid>
        <MarginGrid className="border-t border-rule pt-8">
          <h2 className="sr-only">Highlights</h2>
          <ProofStrip items={proof} />
        </MarginGrid>
      </Container>
    </section>
  );
}

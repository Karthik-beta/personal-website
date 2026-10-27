import { Download, Mail } from "lucide-react";
import type { Metadata } from "next";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons/brand";
import { CopyEmail } from "@/components/site/copy-email";
import { FactsRow } from "@/components/site/facts-row";
import { Figure } from "@/components/site/figure";
import { LocalTime } from "@/components/site/local-time";
import { MetaList } from "@/components/site/meta-list";
import { Monogram } from "@/components/site/monogram";
import { ProjectEntry } from "@/components/site/project-entry";
import { ProofStrip } from "@/components/site/proof-strip";
import { Quote } from "@/components/site/quote";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { TimeRow } from "@/components/site/time-row";
import { Button, buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextLink, textLinkClasses } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import {
  colorTokens,
  contrast,
  contrastPairs,
  motionTokens,
  spacingScale,
  tokenValue,
  typeScale,
  type ThemeName,
} from "./tokens";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design tokens and components of karthik.nz.",
  robots: { index: false, follow: false },
};

const toc = [
  { id: "colour", label: "Colour" },
  { id: "contrast", label: "Contrast" },
  { id: "type", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "motion", label: "Motion" },
  { id: "components", label: "Components" },
];

const facts = [
  { label: "Role", value: "Software engineer, full-stack, backend-leaning" },
  { label: "Experience", value: "3+ years" },
  { label: "Availability", value: "Available now" },
  { label: "Where", value: "Bengaluru, or remote in India" },
];

const states = ["default", "hover", "active", "focus"] as const;
const stateLabels = {
  default: "Default",
  hover: "Hover",
  active: "Pressed",
  focus: "Keyboard focus",
};

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid gap-8 border-t border-rule pt-12"
    >
      <div className="grid max-w-[65ch] gap-2">
        <h2 id={`${id}-title`} className="text-2xl font-semibold stretch-heading">
          {title}
        </h2>
        {intro && <p className="text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function Specimen({
  title,
  note,
  children,
}: {
  title: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h3 className="text-xl font-semibold stretch-title">{title}</h3>
        {note && <p className="max-w-[65ch] text-sm text-muted">{note}</p>}
      </div>
      {children}
    </div>
  );
}

/** Renders children in a forced light and a forced dark panel. */
function ThemePair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="grid min-w-0 content-start gap-4 rounded-control border border-rule bg-paper p-5 text-ink sm:p-6"
        >
          <p className="text-xs text-muted">{theme === "light" ? "Light" : "Dark"}</p>
          {children}
        </div>
      ))}
    </div>
  );
}

function ContrastTable({ theme }: { theme: ThemeName }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-sm tabular-nums">
        <caption className="pb-2 text-left text-xs text-muted">
          {theme === "light" ? "Light theme" : "Dark theme"}
        </caption>
        <thead>
          <tr className="border-b border-rule-strong text-left text-xs text-muted">
            <th scope="col" className="py-2 pr-4 font-normal">
              Pair
            </th>
            <th scope="col" className="py-2 pr-4 font-normal">
              Use
            </th>
            <th scope="col" className="py-2 pr-4 font-normal">
              Ratio
            </th>
            <th scope="col" className="py-2 font-normal">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {contrastPairs.map((pair) => {
            const ratio = contrast(tokenValue(pair.fg, theme), tokenValue(pair.bg, theme));
            const result =
              ratio < pair.min ? "Fails" : pair.min === 4.5 && ratio >= 7 ? "AAA" : "AA";
            return (
              <tr key={`${pair.fg}-${pair.bg}`} className="border-b border-rule">
                <td className="py-2 pr-4">
                  <span
                    data-theme={theme}
                    className="mr-2 inline-flex rounded-band px-1.5 py-0.5 font-medium"
                    style={{ color: `var(--${pair.fg})`, backgroundColor: `var(--${pair.bg})` }}
                  >
                    Aa
                  </span>
                  {pair.fg} on {pair.bg}
                </td>
                <td className="py-2 pr-4 text-muted">{pair.use}</td>
                <td className="py-2 pr-4">{ratio.toFixed(2)}:1</td>
                <td className={cn("py-2", result === "Fails" && "font-semibold")}>
                  {result} <span className="text-muted">(needs {pair.min}:1)</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main id="content" className="py-16 lg:py-24">
      <Container className="grid gap-16">
        <header className="grid max-w-[65ch] gap-4">
          <h1 className="text-3xl font-semibold stretch-heading">Styleguide</h1>
          <p className="text-lg">
            The design tokens and components of karthik.nz, rendered from the same code as the site.
            The reasoning behind each choice is in the{" "}
            <TextLink href={`${site.repo}/tree/main/docs/design`}>design docs</TextLink>.
          </p>
          <p className="text-sm text-muted">This page is not indexed by search engines.</p>
          <nav aria-label="On this page">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <TextLink href={`#${item.id}`} className="inline-flex min-h-6 items-center">
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <Section
          id="colour"
          title="Colour"
          intro="Ink on cool paper with one ultramarine accent. Swatches are drawn from the live CSS variables in both themes."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-rule-strong text-left text-xs text-muted">
                  <th scope="col" className="py-2 pr-4 font-normal">
                    Token
                  </th>
                  <th scope="col" className="py-2 pr-4 font-normal">
                    Light
                  </th>
                  <th scope="col" className="py-2 pr-4 font-normal">
                    Dark
                  </th>
                  <th scope="col" className="py-2 font-normal">
                    Use
                  </th>
                </tr>
              </thead>
              <tbody>
                {colorTokens.map((token) => (
                  <tr key={token.name} className="border-b border-rule">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">
                      {token.name}
                    </th>
                    {(["light", "dark"] as const).map((theme) => (
                      <td key={theme} className="py-3 pr-4">
                        <span className="flex items-center gap-2 tabular-nums">
                          <span
                            data-theme={theme}
                            aria-hidden
                            className="size-8 shrink-0 rounded-band border border-rule-strong"
                            style={{ backgroundColor: `var(--${token.name})` }}
                          />
                          {token[theme]}
                        </span>
                      </td>
                    ))}
                    <td className="py-3 text-muted">{token.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          id="contrast"
          title="Contrast"
          intro="Computed from the token values with the WCAG formula. Text needs 4.5:1; control borders need 3:1."
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
            <ContrastTable theme="light" />
            <ContrastTable theme="dark" />
          </div>
        </Section>

        <Section
          id="type"
          title="Typography"
          intro="Instrument Sans, one variable file. Width narrows for headings; size, weight and width carry the hierarchy."
        >
          <div className="grid">
            {typeScale.map((step) => (
              <div
                key={step.token}
                className="grid gap-x-8 gap-y-2 border-t border-rule py-5 md:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <dl className="grid content-start gap-0.5 text-xs text-muted tabular-nums">
                  <dt className="font-medium text-ink">text-{step.token}</dt>
                  <dd>{step.size}</dd>
                  <dd>
                    Line height {step.leading}, weight {step.weight}, width {step.stretch}
                  </dd>
                </dl>
                <p
                  className={cn(
                    "max-w-[65ch]",
                    step.className,
                    step.token === "display" && "max-w-[15ch]",
                  )}
                >
                  {step.sample}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="spacing"
          title="Spacing"
          intro="A 4 px base. Only these steps are used, mostly as gaps on flex and grid."
        >
          <ul className="grid gap-2">
            {spacingScale.map((step) => (
              <li
                key={step.step}
                className="grid grid-cols-[3rem_4rem_minmax(0,1fr)] items-center gap-4 text-sm tabular-nums"
              >
                <span className="font-medium">{step.step}</span>
                <span className="text-muted">{step.px} px</span>
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden
                    className="h-3 shrink-0 rounded-sm bg-accent"
                    style={{ width: step.px }}
                  />
                  <span className="truncate text-muted">{step.use}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="max-w-[65ch] text-sm text-muted">
            Radii: <span className="text-ink">band</span> 6 px (local-time band),{" "}
            <span className="text-ink">control</span> 8 px (buttons, figures). Lines: 1 px{" "}
            <span className="text-ink">rule</span> between content, 1 px{" "}
            <span className="text-ink">rule-strong</span> around controls.
          </p>
        </Section>

        <Section
          id="motion"
          title="Motion"
          intro="Motion only answers what the visitor does. Nothing animates on its own, and reduced-motion settings turn transitions off."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-rule-strong text-left text-xs text-muted">
                  <th scope="col" className="py-2 pr-4 font-normal">
                    Token
                  </th>
                  <th scope="col" className="py-2 pr-4 font-normal">
                    Value
                  </th>
                  <th scope="col" className="py-2 font-normal">
                    Used for
                  </th>
                </tr>
              </thead>
              <tbody>
                {motionTokens.map((token) => (
                  <tr key={token.token} className="border-b border-rule">
                    <th scope="row" className="py-2 pr-4 text-left font-medium">
                      {token.token}
                    </th>
                    <td className="py-2 pr-4 tabular-nums">{token.value}</td>
                    <td className="py-2 text-muted">{token.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          id="components"
          title="Components"
          intro="Every component in its states. Hover, press and Tab through the live examples; the forced states show the same styles side by side."
        >
          <Specimen
            title="Buttons"
            note="Primary for the one main action per screen; quiet for small controls."
          >
            <ThemePair>
              {(["primary", "quiet"] as const).map((variant) => (
                <div key={variant} className="grid gap-2">
                  <p className="text-xs text-muted">
                    {variant === "primary" ? "Primary" : "Quiet"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {states.map((state) => (
                      <span
                        key={state}
                        data-state={state === "default" ? undefined : state}
                        className={buttonClasses(variant)}
                      >
                        {variant === "primary" && (
                          <Download aria-hidden size={18} strokeWidth={1.75} />
                        )}
                        {stateLabels[state]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </ThemePair>
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <Download aria-hidden size={18} strokeWidth={1.75} />
                Live primary
              </Button>
              <Button variant="quiet">Live quiet</Button>
            </div>
          </Specimen>

          <Specimen
            title="Links"
            note="Always underlined: colour alone never marks a link. External links show an icon and say they open a new tab."
          >
            <ThemePair>
              <p className="max-w-[60ch]">
                Inline: the code is on <TextLink href={site.links.github}>GitHub</TextLink>, and the
                full story is in the <TextLink href="#components">case study</TextLink>.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <TextLink
                  href={`mailto:${site.email}`}
                  kind="action"
                  icon={<Mail aria-hidden size={18} strokeWidth={1.75} />}
                >
                  Email me
                </TextLink>
                <TextLink href={site.links.github} kind="action" icon={<GitHubIcon />}>
                  GitHub
                </TextLink>
                <TextLink href={site.links.linkedin} kind="action" icon={<LinkedInIcon />}>
                  LinkedIn
                </TextLink>
                <TextLink href={site.links.x} kind="action" icon={<XIcon />}>
                  X
                </TextLink>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {states.map((state) => (
                  <span
                    key={state}
                    data-state={state === "default" ? undefined : state}
                    className={textLinkClasses("action")}
                  >
                    {stateLabels[state]}
                  </span>
                ))}
              </div>
            </ThemePair>
          </Specimen>

          <Specimen
            title="Navigation"
            note="The bar at the top of this page is the real component. Scroll down to hide it, up to bring it back. Below 768 px the section links move into the Menu."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Monogram className="size-12" />
              <Monogram />
              <span className="text-sm text-muted">
                The monogram, outlined from Instrument Sans. Generated by <code>bun run brand</code>
                .
              </span>
            </div>
          </Specimen>

          <Specimen
            title="Theme toggle"
            note="Switches light and dark, and remembers the choice. Try it here or in the nav."
          >
            <div>
              <ThemeToggle />
            </div>
          </Specimen>

          <Specimen
            title="Facts row"
            note="The skim layer: four labelled facts. 1, 2 or 4 columns depending on width."
          >
            <ThemePair>
              <FactsRow items={facts} />
            </ThemePair>
          </Specimen>

          <Specimen
            title="Local time"
            note="Live in the browser, updated every 30 seconds. Without JavaScript it reads “Based in Bengaluru, India”."
          >
            <ThemePair>
              <div>
                <LocalTime />
              </div>
            </ThemePair>
          </Specimen>

          <Specimen
            title="Time margin"
            note="Dates in the left margin, pinned while their chapter is on screen (768 px and up). Only for real sequences."
          >
            <div className="grid gap-10">
              <TimeRow when="2017 – 2023">
                <h4 className="mb-2 text-xl font-semibold stretch-title">Customers first</h4>
                <p>
                  Talking to customers got me interested in the problems behind what they were
                  asking for. I wanted to understand how a solution worked and learn to build it
                  myself.
                </p>
              </TimeRow>
              <TimeRow when="June 2023 – May 2025">
                <h4 className="mb-2 text-xl font-semibold stretch-title">
                  Learning to ship at Getin Solutions
                </h4>
                <p>
                  Two enterprise products, more than 20 customer deployments, and scheduling
                  problems that cross midnight.
                </p>
              </TimeRow>
            </div>
          </Specimen>

          <Specimen
            title="Proof strip"
            note="Three verifiable statements under the hero. Sentences, not number tiles."
          >
            <ProofStrip
              items={[
                <>
                  <strong className="font-semibold">30+ customer deployments</strong> across two
                  companies
                </>,
                <>
                  <strong className="font-semibold">Co-founded Pivotr</strong> and built core
                  modules of its ERP, Aria
                </>,
                <>
                  <strong className="font-semibold">An open-source library</strong> published for
                  Rust, Python and JavaScript
                </>,
              ]}
            />
          </Specimen>

          <Specimen
            title="Project entry"
            note="A row in the Work list, separated by rules. Not a card."
          >
            <div>
              <ProjectEntry
                title="Aria (Pivotr)"
                href="#components"
                when="2025 – 2026"
                summary="Built the asset and inventory modules of a modular B2B ERP. The Asset Management module went through 12 customer deployments."
                stack={["TypeScript", "NestJS", "tRPC", "Prisma", "PostgreSQL", "Next.js"]}
                links={[
                  { href: "#components", label: "Read the case study" },
                  { href: "https://github.com/Karthik-beta/Aria", label: "Code on GitHub" },
                ]}
              />
              <ProjectEntry
                title="workclock"
                href="#components"
                when="2026"
                summary="Business-time arithmetic (working hours, SLAs, shifts, holidays, time zones) with a Rust core and Python and JavaScript bindings."
                stack={["Rust", "Python (PyO3)", "WebAssembly", "TypeScript"]}
                links={[{ href: "https://workclock.karthik.nz", label: "Read the docs" }]}
              />
            </div>
          </Specimen>

          <Specimen title="Case-study meta" note="At the top of each case study.">
            <div className="max-w-[40rem]">
              <MetaList
                items={[
                  { label: "Role", value: "Co-founder and software engineer" },
                  { label: "When", value: "June 2025 – September 2026" },
                  {
                    label: "Stack",
                    value: "TypeScript, NestJS, tRPC, Prisma, PostgreSQL, Next.js",
                  },
                  {
                    label: "Links",
                    value: (
                      <TextLink href="https://github.com/Karthik-beta/Aria">
                        Code on GitHub
                      </TextLink>
                    ),
                  },
                ]}
              />
            </div>
          </Specimen>

          <Specimen
            title="Figure"
            note="Real screenshots only, with a caption that says what they show."
          >
            <div className="max-w-[48rem]">
              <Figure
                src="/styleguide/sample-figure.svg"
                width={1200}
                height={675}
                unoptimized
                alt="Grey placeholder shapes standing in for a product screenshot"
                caption="Sample image. Case studies will use real product screenshots with fake data."
              />
            </div>
          </Specimen>

          <Specimen
            title="Copy email"
            note="The address is always visible and selectable. The button copies it and announces “Copied” to screen readers."
          >
            <CopyEmail email={site.email} />
          </Specimen>

          <Specimen title="Quote" note="For Karthik's own words only.">
            <Quote source="Karthik Parameshwara">
              Talking to customers got me interested in the problems behind what they were asking
              for.
            </Quote>
          </Specimen>

          <Specimen
            title="Skip link"
            note="First thing a keyboard user reaches. Reload this page and press Tab to see it."
          >
            <div>
              <span className={buttonClasses("primary")}>Skip to content</span>
            </div>
          </Specimen>

          <Specimen title="Footer" note="The real footer is at the bottom of this page.">
            <span className="sr-only">See the page footer.</span>
          </Specimen>
        </Section>
      </Container>
    </main>
  );
}

import { caseStudies, type CaseSection, type CaseStudy } from "@/content/case-studies";
import { home, type Chapter } from "@/content/home";
import { openSource } from "@/content/open-source";
import { resume, resumeDescription, type ResumeRow, type ResumeSection } from "@/content/resume";
import { activitySummary, formatDay, getOpenSource } from "@/lib/open-source";
import {
  contributionTotals,
  counts,
  fetchedAt,
  homeTeaser,
  registries,
  reviewTime,
  stars,
} from "@/lib/open-source/words";
import { site } from "@/lib/site";

// Markdown versions of the pages, for AI assistants and agents (docs/design/14-agent-access.md).
// Every line is built from the content the page renders, so it can only say what the page says;
// scripts/check-agent-docs.ts proves that against a production build.

export type AgentDoc = {
  /** The HTML page this mirrors: "/resume". */
  path: string;
  title: string;
  /** One line, for llms.txt. */
  summary: string;
  markdown: () => Promise<string>;
};

const absolute = (href: string) => (href.startsWith("/") ? `${site.url}${href}` : href);
const link = (label: string, href: string) =>
  `[${label.replace(/[[\]]/g, "\\$&")}](${absolute(href)})`;
const links = (items: { label: string; href: string }[]) =>
  items.map((item) => link(item.label, item.href)).join(" · ");
const md = (...blocks: (string | false | null | undefined)[]) =>
  `${blocks.filter(Boolean).join("\n\n")}\n`;

const range = (chapter: Chapter) => `${chapter.from[1]} – ${chapter.to ? chapter.to[1] : "now"}`;

async function homeMarkdown() {
  const { hero, chapters, work, about, contact } = home;
  const data = await getOpenSource();
  return md(
    `# ${site.name}`,
    `${hero.tagline.before}${hero.tagline.nowrap}${hero.tagline.after}`,
    hero.facts.map((fact) => `- **${fact.label}:** ${fact.value}`).join("\n"),
    links([
      { label: hero.actions.resume, href: site.resume },
      { label: hero.actions.email, href: `mailto:${site.email}` },
      { label: hero.actions.github, href: site.links.github },
      { label: hero.actions.linkedin, href: site.links.linkedin },
    ]),
    `## ${hero.highlightsTitle}`,
    hero.highlights.map((item) => `- **${item.strong}**${item.rest}`).join("\n"),
    `## ${chapters.title}`,
    ...chapters.items.map((chapter) =>
      md(
        `### ${chapter.title}`,
        [chapter.role, range(chapter)].filter(Boolean).join(" · "),
        ...chapter.blocks.map((block) => (typeof block === "string" ? block : `> ${block.quote}`)),
      ).trimEnd(),
    ),
    `## ${work.title}`,
    work.intro,
    ...work.projects.map((project) =>
      md(
        `### ${project.href ? link(project.title, project.href) : project.title}`,
        project.years,
        project.summary,
        project.stack.join(", "),
        links(project.links),
      ).trimEnd(),
    ),
    `## ${home.openSource.title}`,
    homeTeaser(data),
    link(home.openSource.link, "/open-source"),
    `## ${about.title}`,
    about.story,
    about.details.map((item) => `- **${item.label}:** ${item.value}`).join("\n"),
    `## ${contact.title}`,
    contact.lead,
    link(site.email, `mailto:${site.email}`),
    links([
      { label: contact.actions.resume, href: site.resume },
      { label: contact.actions.linkedin, href: site.links.linkedin },
      { label: contact.actions.github, href: site.links.github },
      { label: contact.actions.x, href: site.links.x },
    ]),
  );
}

/** A project's link as the PDF prints it ("blinkql.karthik.nz"), made clickable. */
const projectHref = (text: string) =>
  text.startsWith("karthik.nz/") ? text.slice("karthik.nz".length) : `https://${text}`;

const row = ({ left, right, note }: ResumeRow) =>
  `${note ? `${left} | ${link(note, projectHref(note))}` : left} · ${right}`;

function resumeSection(section: ResumeSection) {
  const heading = `## ${section.title}`;
  if (section.kind === "text") return md(heading, section.text).trimEnd();
  if (section.kind === "lines") {
    return md(
      heading,
      section.lines.map((line) => `- **${line.label}** ${line.text}`).join("\n"),
    ).trimEnd();
  }
  return md(
    heading,
    ...section.entries.map((entry) =>
      md(
        `### ${row(entry.head)}`,
        entry.sub && row(entry.sub),
        ...entry.lines,
        entry.bullets
          .map((bullet) =>
            [
              `- ${bullet.text}`,
              ...bullet.notes.map(
                (note) =>
                  `  - **Evidence:** ${note.text}${note.links.map((l) => ` ${link(l.label, l.href)}`).join("")}`,
              ),
            ].join("\n"),
          )
          .join("\n"),
      ).trimEnd(),
    ),
  ).trimEnd();
}

const resumeUpdated = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(resume.updated));

async function resumeMarkdown() {
  return md(
    `# ${resume.name}`,
    resume.contact
      .map((line) =>
        line.map((item) => (item.href ? link(item.text, item.href) : item.text)).join(" · "),
      )
      .join("\n\n"),
    `Updated ${resumeUpdated} · ${link("Download PDF", site.resumePdf)}`,
    ...resume.sections.map(resumeSection),
  );
}

async function openSourceMarkdown() {
  const data = await getOpenSource();
  const at = fetchedAt(data.fetchedAt);
  return md(
    "# Open source",
    "Two libraries I maintain, fixes I’ve sent to other people’s projects, and the days I’ve shipped.",
    "## Libraries",
    ...openSource.libraries.map((library) => {
      const release = data.releases.find((item) => item.name === library.name);
      return md(
        `### ${library.name}`,
        release && `Released ${formatDay(release.released, data.today)}`,
        library.summary,
        [
          `- **Version:** ${release ? `${release.version}, ${library.status}` : library.status}`,
          `- **Install from:** ${links(registries.map((r) => ({ label: r.label, href: r.href(library.packages[r.key]) })))}`,
          `- **Links:** ${links([
            { label: "Docs", href: library.docs },
            { label: "Source", href: library.repo },
          ])}`,
        ].join("\n"),
      ).trimEnd();
    }),
    "## Contributions to other projects",
    "Pull requests I’ve opened on other people’s projects, newest first, with their status on GitHub.",
    contributionTotals(data),
    ...data.contributions.map((repo) =>
      md(
        `### ${[link(repo.repo, repo.url), stars(repo.stars)].filter(Boolean).join(" · ")}`,
        counts(repo.pullRequests),
        repo.pullRequests
          .map(
            (pr) =>
              `- ${link(pr.title, pr.url)} · ${formatDay(pr.date, data.today)} · ${reviewTime(pr, data.today)}`,
          )
          .join("\n"),
      ).trimEnd(),
    ),
    "## Activity",
    activitySummary(data),
    `Updated from GitHub and the package registries at ${at.hour}:${at.minute} on ${at.day} ${at.month} (Bengaluru time).`,
  );
}

function caseSection(title: string, section: CaseSection) {
  return md(
    `## ${title}`,
    ...(section.paragraphs ?? []),
    section.points?.map((point) => `- ${point}`).join("\n"),
    ...(section.figures ?? []).map((figure) =>
      figure.kind === "image" ? `_${figure.caption}_` : undefined,
    ),
  ).trimEnd();
}

async function caseStudyMarkdown(study: CaseStudy) {
  return md(
    `# ${study.title}`,
    study.summary,
    [
      `- **Role:** ${study.role}`,
      `- **When:** ${study.when.label}`,
      `- **Stack:** ${study.stack.join(", ")}`,
      `- **Links:** ${links(study.links)}`,
    ].join("\n"),
    caseSection("The problem", study.problem),
    caseSection("What I did", study.work),
    caseSection("Outcome", study.outcome),
  );
}

export const agentDocs: AgentDoc[] = [
  { path: "/", title: "Home", summary: site.description, markdown: homeMarkdown },
  { path: "/resume", title: "Resume", summary: resumeDescription, markdown: resumeMarkdown },
  {
    path: "/open-source",
    title: "Open source",
    summary: openSource.description,
    markdown: openSourceMarkdown,
  },
  ...caseStudies.map((study) => ({
    path: `/work/${study.slug}`,
    title: study.title,
    summary: study.summary,
    markdown: () => caseStudyMarkdown(study),
  })),
];

/** "/" is /index.md; every other page is its path plus ".md". */
export const markdownPath = (doc: AgentDoc) => `${doc.path === "/" ? "/index" : doc.path}.md`;

/** The doc for a Markdown route's segments: ["index"], ["resume"], ["work", "aria"]. */
export const findAgentDoc = (segments: string[]) =>
  agentDocs.find((doc) => markdownPath(doc) === `/${segments.join("/")}.md`);

export const markdownHeaders = (doc: AgentDoc) => ({
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  Link: `<${site.url}${doc.path}>; rel="canonical"`,
});

/** llms.txt (llmstxt.org): who this is, then one link per page's Markdown version. */
export function llmsTxt() {
  return md(
    `# ${site.name}`,
    `> ${site.description}`,
    "## Pages",
    agentDocs.map((doc) => `- ${link(doc.title, markdownPath(doc))}: ${doc.summary}`).join("\n"),
    "## Contact",
    [
      `- ${link("Resume (PDF)", site.resumePdf)}`,
      `- ${link("Email", `mailto:${site.email}`)}`,
      `- ${link("GitHub", site.links.github)}`,
      `- ${link("LinkedIn", site.links.linkedin)}`,
    ].join("\n"),
    "## MCP",
    `- ${link("MCP server", "/mcp")}: read-only tools and resources with the same content, over Streamable HTTP`,
  );
}

/** Who Karthik is in a few lines, from the home page's facts: the MCP server's get_profile. */
export function profileMarkdown() {
  return md(
    `# ${site.name}`,
    site.description,
    home.hero.facts.map((fact) => `- **${fact.label}:** ${fact.value}`).join("\n"),
    "## Links",
    [
      `- ${link("Website", "/")}`,
      `- ${link("Resume", site.resume)}`,
      `- ${link("Resume (PDF)", site.resumePdf)}`,
      `- ${link(site.email, `mailto:${site.email}`)}`,
      `- ${link("GitHub", site.links.github)}`,
      `- ${link("LinkedIn", site.links.linkedin)}`,
    ].join("\n"),
  );
}

/** Every page's Markdown in one file. */
export async function llmsFullTxt() {
  const pages = await Promise.all(agentDocs.map((doc) => doc.markdown()));
  return md(
    `# ${site.name}`,
    `> ${site.description}`,
    ...pages.map(
      (markdown, i) => `---\n\nSource: ${site.url}${agentDocs[i].path}\n\n${markdown.trimEnd()}`,
    ),
  );
}

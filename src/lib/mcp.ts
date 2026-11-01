import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { caseStudies, type Slug } from "@/content/case-studies";
import { agentDocs, markdownPath, profileMarkdown, type AgentDoc } from "@/lib/agent-docs";
import { site } from "@/lib/site";

// The read-only MCP server at /mcp (docs/design/14-agent-access.md, Phase 3). Every tool and
// resource answers with the agent-docs registry's Markdown, so it can only say what the site says.

const readOnly = { readOnlyHint: true, openWorldHint: false } as const;

const slugs = caseStudies.map((study) => study.slug as Slug) as [Slug, ...Slug[]];

function doc(path: string): AgentDoc {
  const found = agentDocs.find((item) => item.path === path);
  if (!found) throw new Error(`No agent doc for ${path}`);
  return found;
}

const text = (markdown: string) => ({ content: [{ type: "text" as const, text: markdown }] });

export function createMcpServer() {
  const server = new McpServer(
    { name: "karthik-nz", title: site.name, version: "1.0.0", websiteUrl: site.url },
    {
      instructions: `Read-only information about ${site.name}, a software engineer looking for a role. Every answer is taken from ${site.url}, the same text as its pages.`,
    },
  );

  server.registerTool(
    "get_profile",
    {
      title: "Profile",
      description: `Who ${site.name} is: role, experience, availability, location, stack and links.`,
      annotations: readOnly,
    },
    () => text(profileMarkdown()),
  );

  server.registerTool(
    "get_resume",
    {
      title: "Resume",
      description: "The full resume as Markdown, with the evidence behind each line.",
      annotations: readOnly,
    },
    async () => text(await doc("/resume").markdown()),
  );

  server.registerTool(
    "list_projects",
    {
      title: "Projects",
      description: "The case studies: title, slug, one-line summary and URL.",
      annotations: readOnly,
    },
    () =>
      text(
        caseStudies
          .map(
            (study) =>
              `- **${study.title}** (slug: ${study.slug}): ${study.summary} ${site.url}/work/${study.slug}`,
          )
          .join("\n") + "\n",
      ),
  );

  server.registerTool(
    "get_project",
    {
      title: "Project",
      description: "One case study as Markdown: the problem, the work and the outcome.",
      inputSchema: { slug: z.enum(slugs).describe("The project's slug, from list_projects") },
      annotations: readOnly,
    },
    async ({ slug }) => text(await doc(`/work/${slug}`).markdown()),
  );

  server.registerTool(
    "get_open_source",
    {
      title: "Open source",
      description: "Libraries maintained, pull requests to other projects, and recent activity.",
      annotations: readOnly,
    },
    async () => text(await doc("/open-source").markdown()),
  );

  for (const item of agentDocs) {
    const uri = `${site.url}${markdownPath(item)}`;
    server.registerResource(
      markdownPath(item).slice(1, -3),
      uri,
      { title: item.title, description: item.summary, mimeType: "text/markdown" },
      async () => ({
        contents: [{ uri, mimeType: "text/markdown", text: await item.markdown() }],
      }),
    );
  }

  return server;
}

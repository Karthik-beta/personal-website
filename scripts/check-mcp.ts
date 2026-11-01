// Checks the MCP server at /mcp against a running production build:
//   bun run build && bun run start -p 3200
//   bun run mcp:check http://localhost:3200
// Connects with the SDK's own client and proves every tool and resource answers with the same
// Markdown the site serves at its .md URLs (docs/design/14-agent-access.md, Phase 3).
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { caseStudies } from "@/content/case-studies";
import { home } from "@/content/home";
import { agentDocs, markdownPath } from "@/lib/agent-docs";
import { site } from "@/lib/site";

const base = (process.argv[2] ?? "http://localhost:3200").replace(/\/$/, "");
const endpoint = `${base}/mcp`;
const failures: string[] = [];
const check = (ok: boolean, message: string) => {
  if (!ok) failures.push(message);
};

// The open-source data is fetched on two hourly caches (the .md page and the MCP call), so the
// fetch time in its last line can differ by minutes while the content is the same.
const sameContent = (text: string) =>
  text.replace(/registries at \d\d:\d\d on \d+ \w+/, "registries at <time>");
const markdown = async (path: string) => sameContent(await (await fetch(base + path)).text());

type Content = { type: string; text?: string }[];
const textOf = (result: Record<string, unknown>) =>
  ((result.content ?? []) as Content).map((item) => item.text ?? "").join("");

const client = new Client({ name: "check-mcp", version: "1.0.0" });
await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)));

const info = client.getServerVersion();
check(info?.name === "karthik-nz", `server name is ${info?.name}`);
const instructions = client.getInstructions() ?? "";
check(
  instructions.includes(site.name) && instructions.includes(site.url),
  `instructions do not name ${site.name} and ${site.url}: "${instructions}"`,
);

const expectedTools = [
  "get_open_source",
  "get_profile",
  "get_project",
  "get_resume",
  "list_projects",
];
const { tools } = await client.listTools();
const toolNames = tools.map((tool) => tool.name).sort();
check(
  JSON.stringify(toolNames) === JSON.stringify(expectedTools),
  `tools are ${toolNames.join(", ")}`,
);
for (const tool of tools) {
  check(tool.annotations?.readOnlyHint === true, `${tool.name} is not annotated read-only`);
}

const call = async (name: string, args?: Record<string, unknown>) => {
  const result = await client.callTool({ name, arguments: args });
  check(!result.isError, `${name} ${JSON.stringify(args ?? {})} returned an error`);
  return textOf(result);
};

const profile = await call("get_profile");
for (const value of [site.name, site.email, ...home.hero.facts.map((fact) => fact.value)]) {
  check(profile.includes(value), `get_profile lacks "${value}"`);
}

const registryTools: [string, string, Record<string, unknown>?][] = [
  ["get_resume", "/resume.md"],
  ["get_open_source", "/open-source.md"],
  ...caseStudies.map(
    (study) =>
      ["get_project", `/work/${study.slug}.md`, { slug: study.slug }] as [
        string,
        string,
        Record<string, unknown>,
      ],
  ),
];
for (const [name, path, args] of registryTools) {
  check(
    sameContent(await call(name, args)) === (await markdown(path)),
    `${name} ${JSON.stringify(args ?? {})} differs from ${path}`,
  );
}

const projects = await call("list_projects");
for (const study of caseStudies) {
  for (const value of [study.title, study.slug, study.summary, `${site.url}/work/${study.slug}`]) {
    check(projects.includes(value), `list_projects lacks "${value}"`);
  }
}

const { resources } = await client.listResources();
const expectedUris = agentDocs.map((doc) => `${site.url}${markdownPath(doc)}`).sort();
const uris = resources.map((resource) => resource.uri).sort();
check(JSON.stringify(uris) === JSON.stringify(expectedUris), `resources are ${uris.join(", ")}`);
for (const doc of agentDocs) {
  const uri = `${site.url}${markdownPath(doc)}`;
  const { contents } = await client.readResource({ uri });
  const [content] = contents;
  check(content?.mimeType === "text/markdown", `${uri}: mimeType is ${content?.mimeType}`);
  check(
    content &&
      "text" in content &&
      sameContent(content.text) === (await markdown(markdownPath(doc))),
    `${uri} differs from ${markdownPath(doc)}`,
  );
}

const rpcHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json, text/event-stream",
  "MCP-Protocol-Version": "2025-06-18",
};
const invalid = await fetch(endpoint, {
  method: "POST",
  headers: rpcHeaders,
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name: "get_project", arguments: { slug: "nope" } },
  }),
});
const invalidBody = (await invalid.json()) as { error?: unknown; result?: { isError?: boolean } };
check(invalid.status === 200, `an invalid slug answered HTTP ${invalid.status}`);
check(
  Boolean(invalidBody.error) || invalidBody.result?.isError === true,
  `an invalid slug did not return an MCP error: ${JSON.stringify(invalidBody).slice(0, 200)}`,
);

for (const method of ["GET", "DELETE"]) {
  const res = await fetch(endpoint, { method, headers: { Accept: "text/event-stream" } });
  check(res.status === 405, `${method} /mcp answered ${res.status}, not 405`);
}

const llms = await markdown("/llms.txt");
check(llms.includes(`(${site.url}/mcp)`), "/llms.txt does not list the MCP server");

await client.close();

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}
console.log(
  `OK: ${tools.length} tools (${registryTools.length + 2} calls) and ${resources.length} resources match the site; invalid slug is an MCP error; GET and DELETE are 405`,
);

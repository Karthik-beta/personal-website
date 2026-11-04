import { site } from "@/lib/site";

export type Assistant = { name: string; url: (prompt: string) => string };

// encodeURIComponent, not URLSearchParams: spaces must become %20, not "+".
export const assistants: Assistant[] = [
  { name: "ChatGPT", url: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
  { name: "Claude", url: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}` },
  {
    name: "Perplexity",
    url: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
  },
];

const name = "karthik-nz";
const url = `${site.url}/mcp`;

export const mcpServer = {
  url,
  claudeCode: `claude mcp add --transport http ${name} ${url}`,
  cursor: `cursor://anysphere.cursor-deeplink/mcp/install?name=${name}&config=${Buffer.from(JSON.stringify({ url })).toString("base64")}`,
};

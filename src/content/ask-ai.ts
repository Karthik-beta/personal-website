import { site } from "@/lib/site";

// The words for "Ask your AI about me". The links render between `before` and `after`.
export type AskAiCopy = { before: string; after: string; prompt: string };

export const askAi = {
  home: {
    before: "You can also ask your own AI about me. Open ",
    after: " with a prompt that reads this site first, so the answers come from what’s here.",
    prompt: `Read ${site.url}/llms-full.txt, the website of ${site.name}, a software engineer looking for a role. Summarise Karthik’s experience, strongest projects and the kind of role Karthik fits best. Use only what that page says, link the page each point comes from, and say so if something isn’t covered.`,
  },
  resume: {
    before: "Ask ",
    after: " to check this resume against your job description.",
    prompt: `Read ${site.name}’s resume at ${site.url}/resume.md. I’m hiring and want to know whether Karthik fits the role. First ask me for the job description. Then compare it with the resume: where Karthik matches, where the gaps are, and what to ask in an interview. Use only what the resume says, and say so when it doesn’t cover something.`,
  },
  showPrompt: "See the prompt",
  hidePrompt: "Hide the prompt",
  promptNote: "Paste it into any assistant that can read a web page.",
  mcp: {
    summary: "Connect it to Claude Code, Cursor or another MCP client",
    // The address is text, not a link: a GET to /mcp returns 405.
    lead: "A read-only MCP server answers with the same text as these pages. Its address is ",
    claudeCode: "In Claude Code, run:",
    cursor: "Add to Cursor",
  },
};

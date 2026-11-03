# 0025: "Ask your AI about me" links

- Status: Accepted (2026-11-03). Part of [14-agent-access](../design/14-agent-access.md). Builds
  on [0021](0021-markdown-for-agents.md) and [0023](0023-mcp-server.md).
- Date: 2026-11-03

## Context

The site already serves its pages as Markdown and runs a read-only MCP server, but only agents
and engineers who know where to look ever use them. A recruiter who works with ChatGPT or Claude
has no way in. The goal: let any visitor open their own assistant with a question about Karthik,
answered from the site's approved text.

## Options

1. **Links that open an assistant with a prompt already filled in**, rendered on the server.
   No JavaScript, no new service. The prompt tells the assistant to read the page's Markdown
   first and to use only what it says.
2. **The same, plus a box to paste a job description** that goes into the prompt. More useful in
   theory, but it needs client JavaScript, makes the URL very long, and puts a company's job
   description in a link. Asking the assistant to request the job description gets the same
   result.
3. **A chat box on the site**, backed by a model API. It needs a paid API and a key on the
   server, and the site would own every answer. Rejected under the no-paid-services rule.

## Decision

- **Option 1.** `src/lib/ask-ai.ts` holds the table of assistants (ChatGPT, Claude, Perplexity)
  and the MCP server's address, its Claude Code command and its Cursor one-click install link.
  `src/content/ask-ai.ts` holds the words and one prompt per place. `src/components/site/ask-ai.tsx`
  renders them as server components.
- **Two places:**
  - **Home, Contact section**, under the contact actions: one sentence with the three assistant
    names as links, a "See the prompt" disclosure (so it can be pasted into any other assistant),
    and a disclosure for engineers to connect the MCP server.
  - **`/resume`**, under the Download PDF row: "Ask ChatGPT, Claude or Perplexity to check this
    resume against your job description." The prompt makes the assistant ask for the job
    description first, then compare.
- **Not on the hero** (it would compete with View resume on the skim path) and not on case
  studies yet. The table makes another place one line.
- **Not in the Markdown versions.** An assistant reading `/index.md` doesn't need a link to
  itself.
- **Clicks are GA events:** `ask_ai` (with the assistant's name as the link text) and
  `mcp_install`. The privacy page already covers link clicks.

## Why

- Recruiters already paste resumes into assistants. Doing it from the site points the assistant
  at clean Markdown instead of a PDF, and tells it to stay inside what the site says.
- The resume prompt mirrors what a hiring manager actually does with a resume: check it against
  a job description.
- No client JavaScript, so the phone speed limits in design 14 don't move. Native `<details>` is
  already the site's disclosure pattern.

## Open

- Whether each assistant fetches the page from a prefilled prompt depends on the visitor's plan
  and settings (web search or fetch turned on). Not tested inside each assistant, because that
  means sending a prompt from a signed-in account.
- Gemini has no supported way to prefill a prompt from a link, so it isn't listed. The visible
  prompt covers it.

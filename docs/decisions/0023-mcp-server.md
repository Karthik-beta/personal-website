# 0023: A read-only MCP server

- Status: Accepted (2026-11-01). Phase 3 of [14-agent-access](../design/14-agent-access.md).
  Builds on [0021](0021-markdown-for-agents.md).
- Date: 2026-11-01

## Context

Some recruiters and engineers work through AI agents (Claude, ChatGPT, Cursor). An MCP server
lets them connect the site once and ask about Karthik, with answers taken from the site's own
approved text. No search engine or assistant finds an MCP server on its own, so this is a
convenience and a demonstration, not a ranking signal.

## Options

1. **The official MCP SDK alone**, with its Web-standard Streamable HTTP transport inside a
   Next.js route handler.
2. **Vercel's `mcp-handler` adapter** on top of the SDK.
3. **A hand-written JSON-RPC handler.**

## Decision

- **Option 1.** `src/app/mcp/route.ts` (POST only) and `src/lib/mcp.ts`. Stateless: no
  sessions, plain JSON answers, a fresh server per request. Packages, pinned exactly:
  `@modelcontextprotocol/sdk` 1.32.1 and `zod` 4.6.7.
- **Endpoint:** `https://karthik.nz/mcp`, Streamable HTTP, no sign-in, read-only.
- **Tools:** `get_profile`, `get_resume`, `list_projects`, `get_project` (by slug),
  `get_open_source`. **Resources:** one per page, at its `.md` URL. All of it comes from the
  registry in `src/lib/agent-docs.ts`, so the server can't say anything the pages don't.
- **Listed in `/llms.txt`** under "MCP". Not in the site's navigation, and not in the public MCP
  Registry (that needs a DNS record and is a separate decision).
- **`bun run mcp:check`** connects with the SDK's own client against a production build, calls
  every tool, reads every resource, and checks each answer against the matching Markdown page.

## Why

- The SDK's Web-standard transport takes a `Request` and returns a `Response`, which is exactly a
  route handler. The adapter would add a package for nothing; hand-written JSON-RPC would miss
  protocol details the SDK handles.
- 1.32.1 was chosen over the newest 1.32.2 (nine days old) so the package has had time in public
  use. Both have the same transport.
- Pages are unchanged: on a production build before and after, all seven pages have identical
  HTML and load the identical JavaScript files. `/mcp` is a separate serverless function.

## Open

- Each call runs a Vercel Hobby function. Cold starts are slower than the 7 to 28 ms measured warm
  on a local build. If traffic ever matters, Vercel's firewall rate limit is the first step.
- No CORS headers: a browser-based client connecting directly would be blocked. Claude, ChatGPT
  and Cursor connect from their own servers or apps (inferred, not tested with each).

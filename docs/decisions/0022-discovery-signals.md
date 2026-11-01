# 0022: Discovery signals for agents and Bing

- Status: Accepted (2026-11-01). Phase 2 of [14-agent-access](../design/14-agent-access.md).
  Builds on [0021](0021-markdown-for-agents.md) and adds one line to the `curl` card of
  [0019](0019-easter-eggs.md).
- Date: 2026-11-01

## Context

Phase 1 made a Markdown version of every page and `/llms.txt`. Agents still had to know those
exist, and Bing, whose index feeds ChatGPT search and Copilot, learns about changes only when it
next crawls.

## Decision

- **A `Link` header on each HTML page** pointing to its Markdown version:
  `Link: <https://karthik.nz/resume.md>; rel="alternate"; type="text/markdown"`. It is driven by
  the `markdownPages` table in `next.config.ts`. A header adds no bytes to the page and no work in
  the browser. The Markdown answer keeps its own `rel="canonical"` Link instead.
- **The `curl` card gains one row:** `AI agents https://karthik.nz/llms.txt`. Nothing else on
  the card changes.
- **IndexNow:** a public key in `site.indexNowKey`, served as `public/<key>.txt`, and
  `bun run indexnow`, which sends every sitemap URL plus `/llms.txt` to api.indexnow.org. It
  refuses to send until the key file is live, so it runs by hand after a deploy, not at build.
  `--dry-run` prints what it would send.
- `robots.txt` is unchanged: every crawler is already allowed.

## Why

- Agents that look for `rel="alternate"` find the Markdown without guessing URLs, and people who
  `curl` the site learn where the agent index is.
- IndexNow is free, needs no account, and the key is public by design. Running it by hand after
  a content change is enough for a site that changes a few times a week; a GitHub Action can
  come later if it becomes a chore.
- `bun run agent-docs:check` now also checks the `Link` header on every page, the card line and
  the key file.

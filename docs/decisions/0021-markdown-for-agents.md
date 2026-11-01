# 0021: Markdown versions of the pages, and llms.txt

- Status: Accepted (2026-11-01). Phase 1 of [14-agent-access](../design/14-agent-access.md).
- Date: 2026-11-01

## Context

Karthik wants AI assistants and agents to find and read the site. Each page sends 60 to 148 KB of
HTML for under 1,000 words, and the site had no `llms.txt`. Visitors' pages, wording and speed
must not change.

## Options

1. **Generate Markdown from the content the pages render**, from one registry of pages.
2. **Convert the built HTML to Markdown** with a converter package.
3. **Hand-written Markdown files.**

## Decision

- **Option 1.** `src/lib/agent-docs.ts` lists every page (home, /resume, /open-source, each case
  study) with a title, a one-line summary and a Markdown builder. Every agent output reads it.
- **URLs:** `/index.md`, `/resume.md`, `/open-source.md`, `/work/<slug>.md`, plus `/llms.txt`
  (an index, per llmstxt.org) and `/llms-full.txt` (everything in one file).
- **Content negotiation:** a request for a page with `Accept: text/markdown` gets its Markdown.
  Browsers never send that, so they keep getting HTML. It wins over the `curl` card (ADR 0019)
  only when asked for explicitly; plain `curl` still gets the card.
- **Markdown responses** carry `Link: <page URL>; rel="canonical"`, so search engines index the
  HTML page, not its Markdown copy.
- **The home page's words moved into `src/content/home.ts`**, with no wording change, so the page
  and its Markdown share one source.
- **Left out of the Markdown:** the local-time line, the activity grids, image alt text,
  navigation and footer.
- **`scripts/check-agent-docs.ts`** (`bun run agent-docs:check` against a production build) fails
  if the Markdown says anything the page doesn't, and checks headers, negotiation, `llms.txt` and
  404s.

## Why

- Generating from the content keeps the Markdown exact and lets the check prove it. A converter
  adds a dependency and repeats navigation text; hand-written files drift.
- Pages are untouched for visitors: on a production build before and after, all seven pages have
  identical visible text and load the identical set of JavaScript files.
- Markdown is 2 to 7 KB per page, so an agent reads the whole page cheaply.

## Open

- Next.js overwrites the `Vary` header on HTML pages under `next start`. On Vercel the `has`
  rewrite runs before the cache, so a browser can't be served cached Markdown (inferred, not
  measured). Check `curl -I` and `curl -H "Accept: text/markdown"` on the live site after the push.

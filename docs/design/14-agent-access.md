# 14: Access for AI agents and search

- Status: Phase 1 built (2026-11-01, ADR 0021). Phase 2 built (2026-11-01, ADR 0022). Phase 3
  built (2026-11-01, ADR 0023; the MCP Registry listing is not done). The speed prototype is
  proposed; each needs Karthik's go and gets its own ADR.
- Related: [11-performance-and-seo](11-performance-and-seo.md), ADR 0013 (search and headers),
  ADR 0015 (analytics), ADR 0019 (the `curl` card).

## Goal

Karthik wants to be found in Google and in answers from AI assistants (ChatGPT, Claude,
Perplexity, Gemini, coding agents). The site's wording, design and speed must not change.

## What the audit of /resume and /open-source found (2026-11-01)

Checked on the live site with `curl` and Lighthouse 13.5.0.

- Both pages answer 200 with a canonical URL, a page-specific title and description, link-preview
  images, `lang="en-GB"`, one `h1`, and JSON-LD that parses and links to the `Person` node by
  `@id`. Both are in the sitemap with real dates. No image is missing `alt`.
- `robots.txt` allows everything except `/styleguide`. GPTBot, ClaudeBot, PerplexityBot,
  Claude-User and python-requests all receive the full HTML. Only `curl` gets the plain-text card,
  and only on `/`.
- Lighthouse (one run per page and size): accessibility 100, SEO 100, agentic browsing 100 on both pages at
  both sizes. Best practices 96, caused by this PC's DNS blocking the Cloudflare beacon (a known
  local artefact, not a site fault).
- Desktop performance: 97 (/resume) and 100 (/open-source).
- **Mobile performance: 79 to 81 on /resume and 80 to 85 on /open-source,** four runs each
  (see "Speed" below). This is the only result under the
  95 target, and it was already true before any agent work.
- Fixed in this session: the `Person` node's `knowsAbout` now includes Python and Rust, as the
  resume does (commit 50fc204, not pushed).
- **Missing:** `/llms.txt` returns 404, and no page has a Markdown version. Each page sends about
  145 KB of HTML for about 600 to 1,000 words of text, which is what an agent has to read.

## What actually moves visibility

How each audience finds the site decides what is worth building. This is from public statements
by the companies involved, not something measured here.

| Audience                                      | Where it reads from                                         | Lever                                                                                                          |
| --------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Google Search and AI Overviews                | Google's normal index                                       | What is already in place: crawlable HTML, structured data, sitemap. Google has said it doesn't use `llms.txt`. |
| ChatGPT search, Copilot                       | Bing's index                                                | Bing Webmaster Tools (set up) and IndexNow pings on each deploy                                                |
| Claude, ChatGPT and Perplexity fetching a URL | The page itself, at request time                            | Small, clean Markdown versions of pages                                                                        |
| Coding agents (Claude Code, Cursor)           | The page, often with `Accept: text/markdown`, or `llms.txt` | Markdown by content negotiation, `llms.txt`                                                                    |
| An agent someone connects on purpose          | An MCP server, only once a person adds it                   | A read-only MCP endpoint                                                                                       |

Two honest limits:

- `llms.txt` is a convention, not a standard, and no major search engine has said it ranks pages
  by it. It costs almost nothing and helps the agents that read it, so it is still worth adding.
- **No crawler or chat assistant discovers an MCP server on its own.** It is used only when
  someone adds it to their client. For a personal site its value is as a demonstration for
  engineers and a convenience for recruiters who use agents, not as a ranking signal.

## The data shape

One registry of agent documents. Every agent-facing output reads it, so no page's content is
written twice.

```ts
type AgentDoc = {
  path: string; // "/resume", the HTML page this mirrors
  title: string;
  summary: string; // one line, for llms.txt and MCP listings
  markdown: () => Promise<string>; // built from the same content modules as the page
};
```

- `src/lib/agent-docs.ts` holds the registry: home, /resume, /open-source and each case study.
- Markdown is generated from the sources the pages already use: `src/lib/site.ts`,
  `src/content/resume.json`, `src/content/case-studies.ts`, `src/content/open-source.ts` and the
  cached open-source data.
- The home page's copy lives in JSX today (`src/components/home/*`). Phase 1 moves the words into
  `src/content/home.ts` with **no wording change**, and the components read from it. A parity
  script proves the words are identical.

## Phase 1. Markdown and llms.txt (no new services, no new packages)

**Build.**

- `/llms.txt`: a heading, Karthik's one-line description, then one link per agent document to
  its Markdown version with its summary, plus the resume PDF and contact links.
- `/llms-full.txt`: every agent document in one file, for agents that want it all in one fetch.
- A `.md` version of each page: `/index.md`, `/resume.md`, `/open-source.md`,
  `/work/aria.md` and so on, served by one route handler with `generateStaticParams`, reached
  through a rewrite from `/:path*.md`.
- Content negotiation: a request with `Accept: text/markdown` to any page gets its Markdown,
  through a `has` rewrite in `next.config.ts` (the pattern in Next 16's own guide,
  `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md`). Responses carry
  `Vary: Accept`. Browsers never send that header, so they keep getting HTML.
- All of it prerendered at build, except the parts of `/open-source.md` that come from the hourly
  cached data, which follow the page's own cache.

**You see.** `curl -H "Accept: text/markdown" https://karthik.nz/resume` prints the resume as
Markdown. `https://karthik.nz/llms.txt` lists every page.

**Verify.**

- A parity script (`scripts/check-agent-docs.ts`) builds every Markdown document and checks that
  each of its sentences appears in the matching page's HTML from a production build. Any sentence
  that is not on the page fails the check, so Markdown can never state something the site doesn't.
- The `next build` route table: First Load JS for every existing page is byte-identical before and
  after.
- Every existing page's HTML is identical before and after, apart from the home copy move, which
  must render the same text.

## Phase 2. Discovery signals

- A `Link: </resume.md>; rel="alternate"; type="text/markdown"` HTTP header on each page, set in
  `next.config.ts`. Headers add no bytes to the HTML and no work in the browser.
- The `curl` card gains one line pointing to `/llms.txt`. That is a change to the easter egg's
  wording, so it needs Karthik's OK (ADR 0019).
- **IndexNow** (needs approval: a free Bing service, new to this site). A key file at the site
  root, and a small script that tells Bing which URLs changed after a deploy. It can run by hand
  or from a GitHub Action. Bing's index feeds ChatGPT search and Copilot.
- `robots.txt` stays as it is: everything is already allowed, and naming each AI crawler adds
  nothing while all are allowed.

## Phase 3. A read-only MCP server (needs approval)

**Build.**

- One route, `/mcp`, using the Streamable HTTP transport, stateless, no sign-in, read-only.
- Tools: `get_profile` (name, role, location, availability, links), `get_resume`,
  `list_projects`, `get_project` (by slug), `get_open_source`. Each returns the same Markdown as
  the registry, so the MCP server cannot drift from the site.
- Resources: one per agent document, at its `https://karthik.nz/...md` URL.
- Listed in `llms.txt` and on the `/open-source` page's data, not in the site's navigation.

**Costs to approve.**

- New packages: the official MCP TypeScript SDK and Vercel's `mcp-handler` adapter (and `zod`
  for tool inputs). Their compatibility with Next 16.4 is unproven and is the first prototype.
- Each MCP call is a serverless function call on Vercel Hobby (free tier). Abuse is limited to
  reading public text, but heavy traffic counts toward the free limits. Vercel's firewall rate
  limit is the fallback.
- Optional: listing in the public MCP Registry under the `nz.karthik` namespace, verified with a
  DNS TXT record in Cloudflare. A new service and a DNS change, so it is a separate yes.

**Verify.** The MCP Inspector (run with `npx`, nothing installed) connects to a production build,
lists the tools and calls each one. The page bundles are unchanged, as in Phase 1.

## Speed: what limits the phone score

Lighthouse simulates a mid-range phone with a CPU four times slower than a laptop. On both pages
the score is held down by Total Blocking Time (510 to 900 ms over four runs per page, against a
200 ms target), not by loading. LCP is 1.8 to 2.6 s and CLS is 0.

What blocks the main thread (from the first mobile run of each page):

| Script                                       | Longest task                    | What it is                  |
| -------------------------------------------- | ------------------------------- | --------------------------- |
| `_next/static/.../1md5v4t22-zrd.js` (169 KB) | 450 to 490 ms                   | Next.js's router runtime    |
| `googletagmanager.com/gtag/js`               | 2 tasks, 360 to 390 ms together | Google Analytics (ADR 0015) |
| `_next/static/.../3lw5hnoc0n6xr.js` (230 KB) | 55 to 70 ms                     | React DOM                   |

### Measured across devices (2026-11-01, Lighthouse 13.5.0)

Every page on the live site, phone, tablet (820 x 1180, phone throttling) and desktop, three runs
each (median):

| Device  | Performance                    | Accessibility | Best practices | SEO |
| ------- | ------------------------------ | ------------- | -------------- | --- |
| Desktop | 100 on all 7 pages (99 to 100) | 100           | 96             | 100 |
| Tablet  | 81 to 84                       | 100           | 96             | 100 |
| Phone   | 81 to 85                       | 100           | 96             | 100 |

- **Best practices 96 is this PC, not the site.** Its DNS blocks the Cloudflare beacon and
  Google Analytics' collect address, which logs two console errors. PageSpeed Insights from
  another network should show 100.
- **Google Analytics is not the limiter.** With its scripts blocked on the live site, phone
  scores stayed 78 to 87 and TBT 494 to 890 ms. Loading it later can't reach 95.
- **Tried on two production builds side by side, five alternating runs per page:**
  `experimental.inlineCss` lowered the phone median from 86 to 83 (the HTML grew from 145 to
  246 KB because Next.js copies the CSS into the React payload) and was reverted. Blocking every
  prefetch request changed nothing (86 against 85), so links keep prefetching.
- **What sets the ceiling:** about 187 KB of compressed JavaScript, mostly React DOM (73 KB) and
  the Next.js router (48 KB). On a simulated phone its start-up is one 450 to 490 ms task, more
  than the whole 200 ms TBT budget, and Lighthouse also counts those scripts against LCP, because
  they start before the first paint (observed first and largest paint are both 260 to 310 ms).
- **Reaching 95 on phones would need these pages without client-side React,** for example a
  rebuild on a framework that ships no JavaScript by default. That is a redesign and isn't
  planned. The decision log is `.verify-runs/lh/decision.tsv` (local).
- None of the agent work above adds JavaScript to any page, so it cannot lower these scores. The
  "First Load JS unchanged" check in each phase proves that.

## Decisions for Karthik

1. Phase 1 (Markdown, `llms.txt`, moving the home copy into a content file with no wording
   change). Recommended.
2. Phase 2: the `Link` header (recommended), one line on the `curl` card (recommended), IndexNow
   (recommended; a free Bing service).
3. Phase 3: the MCP server (worth it as a demonstration, not for ranking), and separately the MCP
   Registry listing.
4. Speed: prototype Google Analytics on `lazyOnload` and report measured numbers before any change.

## Alternatives rejected

- **Converting the built HTML to Markdown** with a converter package. It covers every page without
  touching the home copy, but adds a dependency, guesses structure from markup, and repeats
  navigation and footer text. Generating from the content modules is exact.
- **Hand-written Markdown files.** They would drift from the pages. The parity script exists to
  rule that out.
- **A `[slug]` route per page type.** One catch-all Markdown handler is enough.
- **Partytown for Google Analytics.** It doesn't support the App Router well and adds a
  dependency. `lazyOnload` is built in.

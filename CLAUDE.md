@AGENTS.md

# CLAUDE.md: karthik.nz

Personal website for Karthik's job hunt (Software Engineer / Software Developer roles). Read this
file fully before doing anything in this repo.

## Who this is for

- Owner: **Karthik Parameshwara** (use this name on the site). 3+ years as a software engineer;
  co-founded Pivotr (product: Aria ERP) from June 2025 and left in September 2026.
- Position Karthik as a **generalist builder**. Never as a manufacturing, factory or industrial
  person, even where the work history touches that domain (the Getin work was MES/HRMS: translate
  it into transferable skills). Mentioning enterprise software is fine.
- **No pronouns**, on the site or in docs. Refer to Karthik by name.
- Facts about Karthik come only from `docs/research/profile-summary.md` (local) or from Karthik
  directly.
- Audience: recruiters, hiring managers and engineering managers first; engineers browsing GitHub
  second.
- Two reading paths: a **skim path** (role, experience, stack, availability, resume, contact in
  under 10 s) and a **story path** (narrative and case studies).

## Hard rules

1. **Never invent facts about Karthik**: no made-up metrics, titles, dates, companies or
   achievements. Missing info gets a `TODO(karthik): <what's needed>` marker, and you ask.
2. **When not confident, stop and ask.** Give 2–3 options with trade-offs and a recommendation.
   Ask in batches of 3–5 questions, multiple choice where possible.
3. **Teach as you go.** Karthik is not a design person: explain decisions in plain language,
   especially how they land with recruiters.
4. **Record every approved decision** as an ADR in `docs/decisions/`, and add it to the list below.
5. **Work in phases.** Stop at the end of each phase, summarise, and wait for a go-ahead.
6. **Commits**: small, conventional-commit style (`feat:`, `fix:`, `docs:`, `chore:`…). **No AI
   attribution of any kind**: no "Generated with Claude Code", no `Co-authored-by` lines for any
   model.
7. **Do not push** to GitHub (repo or wiki) unless Karthik explicitly says so for that push.
8. **Never touch `workclock.karthik.nz`**: it is a separate GitHub Pages project.
9. No paid services, and no new services or connectors, without asking first.
10. Use the **frontend-design skill** for every design decision and design doc.

## Approved decisions

| ADR                                                              | Decision                                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [0001](docs/decisions/0001-framework-and-hosting.md)             | Next.js App Router, static-first, on Vercel Hobby; DNS on Cloudflare                                                           |
| [0002](docs/decisions/0002-styling-tailwind.md)                  | Tailwind CSS v4, design tokens in `src/app/globals.css`                                                                        |
| [0003](docs/decisions/0003-package-manager-bun.md)               | Bun as package manager and script runner; Next.js runs on Node                                                                 |
| [0004](docs/decisions/0004-ui-primitives-base-ui.md)             | Base UI (`@base-ui/react`, headless) for interactive primitives; install in Phase 3                                            |
| [0005](docs/decisions/0005-license.md)                           | MIT for code; content, personal info and branding all rights reserved                                                          |
| [0006](docs/decisions/0006-docs-wiki-mirror.md)                  | `docs/` is the source of truth; design and decisions are mirrored to the wiki at each phase end                                |
| [0007](docs/decisions/0007-private-docs-local-only.md)           | `docs/research/` and `docs/content/` are gitignored: local only, never committed or published                                  |
| [0008](docs/decisions/0008-private-docs-notion.md)               | Private docs and personal inputs are mirrored to a private Notion project                                                      |
| [0009](docs/decisions/0009-visual-direction-working-hours.md)    | Visual direction "Working hours": Instrument Sans, ultramarine accent, light default + dark, local-time line                   |
| [0010](docs/decisions/0010-site-structure-and-navigation.md)     | Home + case-study pages; slim hide-on-scroll nav with a Resume button                                                          |
| [0011](docs/decisions/0011-icons-identity-analytics.md)          | Lucide + Simple Icons (inline), "KP" monogram, Cloudflare Web Analytics                                                        |
| [0012](docs/decisions/0012-assets-generated-in-code.md)          | Monogram, favicons and OG images generated in code from the real font; Canva for the photo                                     |
| [0013](docs/decisions/0013-search-and-security-headers.md)       | Connected JSON-LD, real sitemap dates, static CSP + security headers, Search Console and Bing                                  |
| [0014](docs/decisions/0014-resume-opens-in-new-tab.md)           | Superseded by 0016                                                                                                             |
| [0015](docs/decisions/0015-google-analytics.md)                  | Google Analytics 4 alongside Cloudflare, no banner; click events; `/privacy` page                                              |
| [0016](docs/decisions/0016-resume-as-a-page.md)                  | Resume is the `/resume` page, generated with the PDF, with approved evidence notes beside each line                            |
| [0017](docs/decisions/0017-open-source-page.md)                  | `/open-source` page and home teaser: live libraries, upstream PRs, a weekly timesheet; cached server fetch                     |
| [0018](docs/decisions/0018-contributions-ledger-and-activity.md) | Contributions as a status ledger (squares, review time, stars, logos); activity from 1 Oct                                     |
| [0019](docs/decisions/0019-easter-eggs.md)                       | Four easter eggs: 404 heading, console note, `curl` card, tap the clock for the time difference                                |
| [0020](docs/decisions/0020-contributions-at-scale.md)            | Contributions: all merged and open PRs fetched; 5 per project and 6 projects shown, the rest behind toggles                    |
| [0021](docs/decisions/0021-markdown-for-agents.md)               | Markdown version of every page from one registry, `llms.txt`, `Accept: text/markdown`; parity check                            |
| [0022](docs/decisions/0022-discovery-signals.md)                 | `Link` header to each page's Markdown, `llms.txt` on the `curl` card, IndexNow (`bun run indexnow` after deploys)              |
| [0023](docs/decisions/0023-mcp-server.md)                        | Read-only MCP server at `/mcp` (official SDK, stateless), tools and resources from the agent-docs registry                     |
| [0024](docs/decisions/0024-mcp-registry-listing.md)              | MCP Registry listing `nz.karthik/karthik-parameshwara`, proven by `/.well-known/mcp-registry-auth`; `bun run mcp:registry`     |
| [0025](docs/decisions/0025-ask-your-ai.md)                       | "Ask your AI" links (ChatGPT, Claude, Perplexity) with a prefilled prompt, on Contact and `/resume`; no client JS              |
| [0026](docs/decisions/0026-quoting-a-recommendation.md)          | Two sentences of Prashanth's LinkedIn recommendation in the Pivotr chapter, credited and linked; separate look from own quotes |
| [0027](docs/decisions/0027-leading-readers-into-case-studies.md) | Aria recording on the home Work list; reading times; "Keep reading" ends; GA events for case-study opens, reads, plays         |
| [0028](docs/decisions/0028-google-tag-manager.md)                | GTM container (`NEXT_PUBLIC_GTM_ID`) replaces gtag.js and loads GA4; strict CSP lists each tag's hosts                         |
| [0029](docs/decisions/0029-x-pixel.md)                           | X pixel (`ri4iu`) allowed in the CSP and disclosed on `/privacy`; LinkedIn Insight Tag dropped; Apollo stays blocked           |

## Conventions

- **Package manager: Bun.** Use `bun install`, `bun add`, `bun run <script>`. Do not create
  `package-lock.json`, `yarn.lock` or `pnpm-lock.yaml`.
- **Next.js 16** has breaking changes compared with older versions. Check `node_modules/next/dist/docs/` before
  writing Next.js code (see `AGENTS.md`). The config enables `cacheComponents`.
- **Styling:** Tailwind utilities only, using design tokens from `globals.css` (`@theme`). No
  hard-coded colours or arbitrary spacing values once tokens exist.
- **Components:** build interactive pieces (dialog, menu, tabs, tooltip, etc.) on Base UI and
  style them with Tailwind. Plain elements (links, buttons, cards) are just semantic HTML.
- **Accessibility:** WCAG 2.2 AA minimum; semantic HTML first.
- **Imports:** use the `@/` alias for `src/`.
- **Formatting:** Prettier (100 cols, double quotes, trailing commas). Run `bun run check` before
  committing.
- Static or mostly static pages; avoid server-only features that would need paid infrastructure.

## Docs and wiki

- `docs/` is the single source of truth. Index: `docs/README.md`.
- Only `docs/design/` and `docs/decisions/` are public on the wiki.
- `docs/research/` and `docs/content/` are **gitignored and local only** (ADR 0007). Never commit,
  sync or quote them anywhere public. Only final, approved wording goes into the site itself.
- Private docs are mirrored to Notion (ADR 0008): the private page **"karthik.nz: Personal website
  (private)"**, with Research, Content and Personal sub-pages. Whenever a private doc changes,
  update its Notion page in the same session. Never put Notion links in this repo.
- Sync with `bun run wiki:sync` (dry run, shows the diff). Push with `bun run wiki:sync -- --push`
  **only after Karthik approves that phase's docs**.

## Where things live

- **Site facts** (name, email, links, description): `src/lib/site.ts`. Change facts there only.
- **Home sections:** `src/components/home/` (hero, chapters, work, about, contact).
- **Structured data:** `src/lib/structured-data.ts`. Bump `site.updated` or a case study's
  `updated` when its content changes (sitemap and JSON-LD dates).
- **Security headers and CSP:** `next.config.ts`. A new third-party host must be added to the CSP.
- **Analytics (ADR 0028):** Google Tag Manager loads GA4 and the X pixel (ADR 0029); the
  container ID is `NEXT_PUBLIC_GTM_ID` in Vercel. Events go through `track()` in
  `src/lib/track.ts`. A new `data-track` name must also be added to the GA4 Event trigger's regex
  in GTM, and a new GTM tag's hosts to the CSP.
- **Case studies:** content in `src/content/case-studies.ts`; one static route per study in
  `src/app/work/<slug>/` (not a `[slug]` route: with Cache Components it can't return a real 404).
- **Shared UI:** `src/components/ui/` (button, text link, container), `src/components/site/`.
- **Open source page:** fixed facts (libraries, status words, hidden owners and repos) in
  `src/content/open-source.ts`; live data from GitHub and the registries in `src/lib/open-source/`,
  cached for an hour. Needs `GITHUB_TOKEN` (read-only, server only) in Vercel; without it the
  GitHub part falls back to `src/content/open-source.snapshot.json`. Refresh that with
  `GITHUB_TOKEN=$(gh auth token) bun run oss:snapshot` when committing other work.
- **Link-preview images:** `src/lib/og.tsx`, used by each `opengraph-image.tsx`. The image URL's
  `?hash` comes only from the route file's text, so after changing how an image looks, bump the
  "Look v" comment in every `opengraph-image.tsx`, then re-inspect the URLs in LinkedIn's Post
  Inspector. Otherwise LinkedIn keeps its cached copy. A link already on the LinkedIn profile can
  keep a broken thumbnail even then: re-add it with `?v=2` on the end (LinkedIn fetches it fresh
  and stores the canonical URL).
- **Markdown for agents (ADR 0021):** the page registry and Markdown builders are
  `src/lib/agent-docs.ts`; routes in `src/app/md/`, `src/app/llms.txt/`, `src/app/llms-full.txt/`;
  rewrites in `next.config.ts`. Home copy lives in `src/content/home.ts`. A new page needs a
  registry entry and a `markdownPages` line. After any wording change, run
  `bun run agent-docs:check` against a production build (`bun run start -p 3200`).
- **MCP server (ADR 0023):** `src/app/mcp/route.ts` and `src/lib/mcp.ts`; its answers come from
  `src/lib/agent-docs.ts`. Check it with `bun run mcp:check` against a production build.
- **"Ask your AI" links (ADR 0025):** assistants and MCP install details in `src/lib/ask-ai.ts`,
  words and prompts in `src/content/ask-ai.ts`, rendered by `src/components/site/ask-ai.tsx` on
  Contact and `/resume`. Server components only: keep it free of client JavaScript.
- **Case-study reach (ADR 0027):** reading time in `src/lib/reading-time.ts`; "Keep reading" in
  `src/components/case-study/case-study-page.tsx`; the Aria recording is `ariaFlow` in
  `src/content/case-studies.ts`, files in `public/work/`, rendered by
  `src/components/site/clip.tsx`. GA events: `data-track` + `data-track-placement` on links,
  `src/components/site/track-view.tsx` for reads, `data-track-video` for plays. Re-record the clip
  only from Aria's production demo, with no customer names or factory screens in frame.
- **MCP Registry (ADR 0024):** `server.json` at the root; publish with `bun run mcp:registry` after
  the deploy is live. The private key is `~/.mcp-registry/karthik-nz-ed25519.pem` on Karthik's PC,
  never in the repo. Raise `version` in `server.json` for every update.
- **IndexNow (ADR 0022):** after a deploy with new or changed pages is live, run
  `bun run indexnow` to tell Bing. The key is `site.indexNowKey` and `public/<key>.txt`; change
  both together or not at all.
- **Easter eggs (ADR 0019):** the console note is `src/instrumentation-client.ts`; the `curl`
  card is `src/app/card.txt/route.ts`, behind a user-agent rewrite in `next.config.ts`; the clock
  toggle is in `src/components/site/local-time.tsx`. All three share the time sentence in
  `src/lib/bengaluru-time.ts`. Keep it to these: a new egg needs its own ADR.
- **Brand assets:** `bun run brand` regenerates the monogram, favicons and font instances from
  `assets/fonts` (see `assets/README.md`). Never edit generated files by hand.
- **Resume:** the source is the general resume in the Job Hunt app (`Job Hunt/App`). Render
  the PDF (without the phone) and the page data together there with
  `uv run jobhunt master --web <pdf> --json <json>`, then run
  `python -I scripts/prepare-resume.py <pdf> --json <json>`. That script writes
  `public/resume.pdf` and `src/content/resume.json`, cleans the PDF's metadata, and checks no
  phone number is left in either. Always run new resumes through it, and never edit
  `resume.json` by hand: evidence notes are written and approved in the facts bank. The
  resume buttons open the `/resume` page (ADR 0016).

## Open items (content from Karthik)

- `grep -rn "TODO(karthik)" src` must return nothing (it does as of 2026-10-27).
- Aria screenshots come from Aria's production demo (`aria-local.cmd`), never `next dev`. Its demo
  data names real companies in sales and customer screens: capture only the dashboards.

## Memory

Durable context about Karthik and this project is also kept in Karthik's Notion Memory (About page
plus memories "Career and job search", "Working style with Claude" and "karthik.nz personal
website"). Keep it in step when facts or preferences change.

## Phase status

- [x] Phase 0: Repo setup
- [x] Phase 1: Research
- [x] Phase 2: Interview (story and positioning)
- [x] Phase 3: Design system docs and `/styleguide`
- [x] Phase 4: Assets (generated in code from the real font, ADR 0012; Canva for the photo)
- [x] Phase 5: Build
- [x] Phase 6: Deploy (guided): live at https://karthik.nz on Vercel since 2026-10-27 (apex
      primary, www redirects; Cloudflare records DNS-only; LinkedIn rule removed; workclock
      untouched). Cloudflare Web Analytics receiving visits. Lighthouse target set to 90;
      real-visitor Web Vitals decide further work.

## After launch

- Pushes to `main` deploy to production automatically (Vercel Git integration).
- `NEXT_PUBLIC_` variables are fixed at build time: after changing one in Vercel, redeploy.
- Verify any DNS change with a lookup of karthik.nz, www and workclock.karthik.nz.
- **Show before pushing:** for visible changes, show Karthik light and dark screenshots from a
  production build and commit locally; push only on an explicit yes, then verify on the live site.
- **Measure speed on a production build** (`bun run build && bun run start`) with a headless
  browser. Prefetching never runs in `next dev`, and Claude's in-app browser pane doesn't prefetch
  either, so navigation there looks slower than it is.
- **Screenshots:** demo or generated data only. Positioning applies to visuals too: no factory,
  OEE or manufacturing content in images or captions, even where a project's own docs use it.
- **Search engines:** Google Search Console (Domain property for karthik.nz) and Bing Webmaster
  Tools are set up. Keep the `google-site-verification` TXT record in Cloudflare. Claude can't
  see the reports, so ask Karthik for screenshots.
- **Structured-data dates** are sent as full date-times with the Bengaluru offset; Google flags
  bare dates. Check new markup in Search Console, not only validator.schema.org.
- **New project subdomains** (`<project>.karthik.nz`) need no new Search Console property. Before
  launch: canonical, link-preview URLs and sitemap use the subdomain; the `*.vercel.app` address
  redirects to it (308); karthik.nz links to it; its sitemap is submitted in Search Console and
  Bing.

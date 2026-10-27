@AGENTS.md

# CLAUDE.md: karthik.nz

Personal website for Karthik's job hunt (Software Engineer / Software Developer roles). Read this
file fully before doing anything in this repo.

## Who this is for

- Owner: Karthik. ~3 years as a software engineer; co-founded a startup for the past year and left
  in September 2026.
- Position Karthik as a **generalist builder**. Never as a manufacturing, factory or industrial
  person, even where the work history touches that domain. Mentioning enterprise software is fine.
- Pronouns: not stated yet. Refer to Karthik by name, or use they/them, until Karthik says
  otherwise.
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

| ADR                                                    | Decision                                                                                        |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [0001](docs/decisions/0001-framework-and-hosting.md)   | Next.js App Router, static-first, on Vercel Hobby; DNS on Cloudflare                            |
| [0002](docs/decisions/0002-styling-tailwind.md)        | Tailwind CSS v4, design tokens in `src/app/globals.css`                                         |
| [0003](docs/decisions/0003-package-manager-bun.md)     | Bun as package manager and script runner; Next.js runs on Node                                  |
| [0004](docs/decisions/0004-ui-primitives-base-ui.md)   | Base UI (`@base-ui/react`, headless) for interactive primitives; install in Phase 3             |
| [0005](docs/decisions/0005-license.md)                 | MIT for code; content, personal info and branding all rights reserved                           |
| [0006](docs/decisions/0006-docs-wiki-mirror.md)        | `docs/` is the source of truth; design and decisions are mirrored to the wiki at each phase end |
| [0007](docs/decisions/0007-private-docs-local-only.md) | `docs/research/` and `docs/content/` are gitignored: local only, never committed or published   |
| [0008](docs/decisions/0008-private-docs-notion.md)     | Private docs and personal inputs are mirrored to a private Notion project                       |

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

## Phase status

- [x] Phase 0: Repo setup
- [ ] Phase 1: Research
- [ ] Phase 2: Interview (story and positioning)
- [ ] Phase 3: Design system docs and `/styleguide`
- [ ] Phase 4: Assets (Canva)
- [ ] Phase 5: Build
- [ ] Phase 6: Deploy (guided)

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

| ADR                                                           | Decision                                                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [0001](docs/decisions/0001-framework-and-hosting.md)          | Next.js App Router, static-first, on Vercel Hobby; DNS on Cloudflare                                         |
| [0002](docs/decisions/0002-styling-tailwind.md)               | Tailwind CSS v4, design tokens in `src/app/globals.css`                                                      |
| [0003](docs/decisions/0003-package-manager-bun.md)            | Bun as package manager and script runner; Next.js runs on Node                                               |
| [0004](docs/decisions/0004-ui-primitives-base-ui.md)          | Base UI (`@base-ui/react`, headless) for interactive primitives; install in Phase 3                          |
| [0005](docs/decisions/0005-license.md)                        | MIT for code; content, personal info and branding all rights reserved                                        |
| [0006](docs/decisions/0006-docs-wiki-mirror.md)               | `docs/` is the source of truth; design and decisions are mirrored to the wiki at each phase end              |
| [0007](docs/decisions/0007-private-docs-local-only.md)        | `docs/research/` and `docs/content/` are gitignored: local only, never committed or published                |
| [0008](docs/decisions/0008-private-docs-notion.md)            | Private docs and personal inputs are mirrored to a private Notion project                                    |
| [0009](docs/decisions/0009-visual-direction-working-hours.md) | Visual direction "Working hours": Instrument Sans, ultramarine accent, light default + dark, local-time line |
| [0010](docs/decisions/0010-site-structure-and-navigation.md)  | Home + case-study pages; slim hide-on-scroll nav with a Resume button                                        |
| [0011](docs/decisions/0011-icons-identity-analytics.md)       | Lucide + Simple Icons (inline), "KP" monogram, Cloudflare Web Analytics                                      |
| [0012](docs/decisions/0012-assets-generated-in-code.md)       | Monogram, favicons and OG images generated in code from the real font; Canva for the photo                   |

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
- **Home sections:** `src/components/home/` (hero, chapters, work, about, contact, JSON-LD).
- **Case studies:** content in `src/content/case-studies.ts`; one static route per study in
  `src/app/work/<slug>/` (not a `[slug]` route: with Cache Components it can't return a real 404).
- **Shared UI:** `src/components/ui/` (button, text link, container), `src/components/site/`.
- **Link-preview images:** `src/lib/og.tsx`, used by each `opengraph-image.tsx`.
- **Brand assets:** `bun run brand` regenerates the monogram, favicons and font instances from
  `assets/fonts` (see `assets/README.md`). Never edit generated files by hand.
- **Resume:** `python -I scripts/prepare-resume.py <resume.pdf>` writes `public/resume.pdf` with
  phone numbers removed by true redaction. Always run new resumes through it.

## Open items (content from Karthik)

- About paragraph (placeholder in `src/components/home/about.tsx`, tagged `TODO(karthik)`).
- Aria screenshots from the demo, demo data only (placeholders in `src/content/case-studies.ts`).
- Updated resume (co-founder title, September 2026 end date, new projects, full name, no phone).
- Run `grep -rn "TODO(karthik)" src` before launch; it must return nothing.

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

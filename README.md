# karthik.nz

Personal website of Karthik Parameshwara, a software engineer. It is built for recruiters and hiring managers, with two
reading paths: a fast skim (role, experience, stack, availability, resume, contact in under 10
seconds) and a deeper story with project case studies.

> Status: **in development**. The live domain still redirects to LinkedIn until launch.

## Tech stack

| Area            | Choice                                                                                |
| --------------- | ------------------------------------------------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org) 16, App Router, TypeScript (strict)                     |
| Styling         | [Tailwind CSS](https://tailwindcss.com) v4, tokens defined in CSS                     |
| UI primitives   | [Base UI](https://base-ui.com) (headless, accessible), added in Phase 3               |
| Package manager | [Bun](https://bun.sh) (Next.js itself runs on Node)                                   |
| Quality         | ESLint (flat config, `eslint-config-next`) and Prettier (with Tailwind class sorting) |
| Hosting         | Vercel (Hobby tier), domain on Cloudflare DNS                                         |

The reasoning behind each choice is in [`docs/decisions/`](docs/decisions/).

## Local setup

Requirements: Node.js 22+ (see `.nvmrc`) and Bun 1.4+.

```bash
bun install
bun run dev
```

Then open http://localhost:3000.

No environment variables are needed yet. If any are added, they will be documented in
`.env.example`; copy it to `.env.local`.

## Scripts

| Command                | What it does                                                             |
| ---------------------- | ------------------------------------------------------------------------ |
| `bun run dev`          | Start the dev server                                                     |
| `bun run build`        | Production build                                                         |
| `bun run start`        | Serve the production build                                               |
| `bun run lint`         | Lint with ESLint                                                         |
| `bun run lint:fix`     | Lint and auto-fix                                                        |
| `bun run format`       | Format everything with Prettier                                          |
| `bun run format:check` | Check formatting without writing                                         |
| `bun run typecheck`    | Generate Next.js route types, then run `tsc --noEmit`                    |
| `bun run check`        | Lint, typecheck and format check together                                |
| `bun run wiki:sync`    | Preview mirroring public docs to the GitHub wiki (`-- --push` publishes) |

## Deployment

- Vercel builds from the `main` branch. Vercel detects `bun.lock` and installs with Bun.
- The domain `karthik.nz` is managed in Cloudflare. DNS records for Vercel are **DNS-only (grey
  cloud)**.
- `workclock.karthik.nz` points to a separate GitHub Pages project. **Do not modify its DNS
  record.**
- A step-by-step deployment guide will be added in Phase 6.

## Folder structure

```text
.
├── docs/                 # Project documentation (source of truth)
│   ├── decisions/        # ADRs: one file per approved decision
│   ├── research/         # Profile research (local only, gitignored)
│   ├── content/          # Story and messaging drafts (local only, gitignored)
│   └── design/           # Design system docs
├── scripts/              # Repo tooling (e.g. wiki sync)
├── src/
│   └── app/              # Next.js App Router: routes, layout, global CSS
├── public/               # Static files served as-is
├── CLAUDE.md             # Conventions for AI-assisted sessions
└── AGENTS.md             # Next.js agent rules (managed by Next.js)
```

## Documentation

Start at [`docs/README.md`](docs/README.md). The design docs and decision records are also
mirrored to the [GitHub wiki](https://github.com/Karthik-beta/personal-website/wiki).

## License

Code is MIT-licensed. Written content, personal information, images and branding are all rights
reserved. See [`LICENSE`](LICENSE).

# karthik.nz

Personal website of Karthik Parameshwara, a software engineer. It is built for recruiters and hiring managers, with two
reading paths: a fast skim (role, experience, stack, availability, resume, contact in under 10
seconds) and a deeper story with project case studies.

> Live at **[karthik.nz](https://karthik.nz)**.

## Tech stack

| Area            | Choice                                                                                |
| --------------- | ------------------------------------------------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org) 16, App Router, TypeScript (strict)                     |
| Styling         | [Tailwind CSS](https://tailwindcss.com) v4, tokens defined in CSS                     |
| UI primitives   | [Base UI](https://base-ui.com) (headless, accessible)                                 |
| Package manager | [Bun](https://bun.sh) (Next.js itself runs on Node)                                   |
| Quality         | ESLint (flat config, `eslint-config-next`) and Prettier (with Tailwind class sorting) |
| Hosting         | Vercel (Hobby tier), domain on Cloudflare DNS                                         |
| Analytics       | Cloudflare Web Analytics (cookie-free), production only                               |

The reasoning behind each choice is in [`docs/decisions/`](docs/decisions/).

## Local setup

Requirements: Node.js 22+ (see `.nvmrc`) and Bun 1.4+.

```bash
bun install
bun run dev
```

Then open http://localhost:3000.

No environment variables are needed for local development. The only one,
`NEXT_PUBLIC_CF_BEACON_TOKEN` (analytics), is documented in `.env.example` and set in Vercel for
production.

## Scripts

| Command                | What it does                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `bun run dev`          | Start the dev server                                                                      |
| `bun run build`        | Production build                                                                          |
| `bun run start`        | Serve the production build                                                                |
| `bun run lint`         | Lint with ESLint                                                                          |
| `bun run lint:fix`     | Lint and auto-fix                                                                         |
| `bun run format`       | Format everything with Prettier                                                           |
| `bun run format:check` | Check formatting without writing                                                          |
| `bun run typecheck`    | Generate Next.js route types, then run `tsc --noEmit`                                     |
| `bun run check`        | Lint, typecheck and format check together                                                 |
| `bun run wiki:sync`    | Preview mirroring public docs to the GitHub wiki (`-- --push` publishes)                  |
| `bun run brand`        | Regenerate monogram, favicons and font instances (needs Python with fontTools and Pillow) |

## Deployment

- Every push to `main` deploys to production on Vercel. Vercel detects `bun.lock` and installs
  with Bun.
- `karthik.nz` is the primary domain; `www.karthik.nz` redirects to it.
- The domain is managed in Cloudflare. The records pointing at Vercel are **DNS-only (grey
  cloud)**: Vercel serves the site and issues the HTTPS certificate.
- `NEXT_PUBLIC_` variables are fixed at build time: after changing one in Vercel, redeploy.
- `workclock.karthik.nz` points to a separate GitHub Pages project. **Do not modify its DNS
  record.**

## Folder structure

```text
.
├── docs/                 # Project documentation (source of truth)
│   ├── decisions/        # ADRs: one file per approved decision
│   ├── research/         # Profile research (local only, gitignored)
│   ├── content/          # Story and messaging drafts (local only, gitignored)
│   └── design/           # Design system docs
├── assets/               # Font, monogram, photo and screenshot sources (see assets/README.md)
├── scripts/              # Repo tooling: wiki sync, brand asset build, resume redaction
├── src/
│   ├── app/              # Next.js App Router: routes, layout, global CSS, icons, OG images
│   ├── components/       # ui/, site/ (header, footer, …), home/ sections, case-study/
│   ├── content/          # Case-study content
│   └── lib/              # Site facts, helpers, OG image renderer
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

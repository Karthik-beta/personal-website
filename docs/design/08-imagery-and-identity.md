# 08: Imagery and identity

- Status: Approved (2026-10-27)
- Decision records: [ADR 0011](../decisions/0011-icons-identity-analytics.md),
  [ADR 0012](../decisions/0012-assets-generated-in-code.md)
- Monogram, favicons and OG images are generated in code from the real font (`bun run brand`).
  Canva is used for the photo. See `assets/README.md`.

## Backgrounds and textures

**None.** The page is flat `paper`. The only coloured area is the `band` behind the local time.
No gradients, noise, grids, dot patterns or blobs. The typography is the visual.

## Illustrations

**None.** Illustrations would compete with the headline and push the site towards the template
look.

## Photo of Karthik

- **One photo, small, in About only.** Not in the hero.
- Size: 160 × 160 px on desktop, 128 × 128 px on phones; delivered at 2× for sharp screens.
- Crop: head and shoulders, square, 8 px radius (not a circle, to match the rest of the UI).
- Natural colour, no filters or duotone. A plain, uncluttered background is best.
- Alt text: "Karthik Parameshwara" (the name is enough; the photo carries no other information).
- Format: AVIF/WebP via `next/image`; the source file kept in `assets/photo/`.
- Touch-ups (crop, light clean-up) in Canva. Background removal may not be available on Canva Free.
- Provided 2026-10-27: `assets/photo/karthik-parameshwara-square.jpg` (see `assets/README.md`).
- The favicon stays the monogram (decided 2026-10-27): a face is unrecognisable at 16 px.

## Project screenshots

- Real screenshots of the actual products only (Aria, Job Matcher, workclock docs/playground). No
  mock device frames.
- Shown in a Figure ([07](07-components.md)), at most 2–3 per case study, each with a caption
  that says what it shows.
- Any customer data in screenshots must be fake or removed.

## Icons

- **UI icons:** [Lucide](https://lucide.dev) (ISC licence), imported per icon as inline SVG
  (`lucide-react`), so there are no external requests. 18 px, 1.75 stroke, `currentColor`.
- **Used icons only:** download, mail, copy, check, external-link, sun, moon, menu, x,
  arrow-left (back link).
- **Brand marks:** GitHub, LinkedIn, X as inline SVG from [Simple Icons](https://simpleicons.org)
  (CC0), single colour `currentColor`, same 18 px size.
- Icons always sit next to a text label, except the theme toggle and menu button, which have an
  `aria-label`.

## Monogram

- **"KP"** in Instrument Sans, weight 700, width 78, tight spacing (−0.02 em), outlined from the
  real glyphs so no font is needed to display it.
- Proportions: letters' cap height is 46% of the square; corner radius is 20% of the side.
- Colours: white letters on an ultramarine square. Single-colour versions in `ink` and white also
  exist.
- **In the nav it uses the text colour** (`ink` square, `paper` letters), not the accent (changed
  2026-10-27). With an accent square the header had two bright blocks, the monogram and the Resume
  button, pulling the eye away from the headline; now the Resume button is the nav's only accent.
  The favicon keeps the accent version, and the shape still ties them together.
- **OG images use the text-colour version too** (changed 2026-10-28), so a link preview shows the
  same mark a visitor then sees in the nav.
- Used in: favicon, nav (24 px, next to the name), OG image.
- **16 px version:** letters enlarged to 58% and rendered with font hinting so strokes snap to
  pixels. At the standard proportions the "K" blurred at 16 px.

## Favicon set

| File                     | Size       | Notes                             |
| ------------------------ | ---------- | --------------------------------- |
| `src/app/icon.svg`       | vector     | Primary favicon (modern browsers) |
| `src/app/favicon.ico`    | 16, 32, 48 | Legacy fallback                   |
| `src/app/apple-icon.png` | 180 × 180  | iOS home screen (no transparency) |

Next.js picks these files up automatically from `src/app/`.

## Open Graph image (link previews)

What shows up when the site is shared on LinkedIn, Slack, WhatsApp or X.

- **1200 × 630 px**, PNG, under 300 KB.
- `paper` background. KP monogram (text-colour version) top-left. Name in `ink` (weight 600). Headline in the display
  style (narrowed). One line at the bottom on the `band`: "Bengaluru, India. Available now."
- Safe area: keep text 64 px from every edge (some apps crop).
- One per page: home (above), and one per case study (title + one-line summary instead of the
  headline).
- Headline line breaks are balanced (`textWrap: balance`), so no single word sits alone.
- Text in the image is also in the page's `og:title` and `og:description`. The image is never the
  only place information appears.
- Rendered at build time by `src/app/opengraph-image.tsx` via the shared `renderOgImage()` in
  `src/lib/og.tsx`. Home image: ~60 KB.

## Asset folder structure

```text
assets/                    # Source files (not served)
├── fonts/                 # Instrument Sans variable font + OFL licence; static/ is generated
├── brand/                 # Generated monogram (SVG variants, 512 px PNG)
└── photo/                 # Original and processed photo (Phase 5)
public/                    # Served as-is
└── resume.pdf             # The downloadable resume (Phase 5)
src/app/                   # Generated icon.svg, favicon.ico, apple-icon.png; opengraph-image.tsx
```

Full details: `assets/README.md`.

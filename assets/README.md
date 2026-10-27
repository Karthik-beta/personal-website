# assets

Source files for the site's visual identity. Nothing in this folder is served directly: the build
and `scripts/build-brand.py` turn these into the files the site uses. See
[ADR 0012](../docs/decisions/0012-assets-generated-in-code.md) and
[08: Imagery and identity](../docs/design/08-imagery-and-identity.md).

## Structure

```text
assets/
├── fonts/
│   ├── InstrumentSans[wdth,wght].ttf   # Official variable font (github.com/google/fonts)
│   ├── OFL.txt                         # Its licence (SIL Open Font License 1.1)
│   └── static/                         # Generated: exact static instances (see below)
├── brand/                              # Generated: "KP" monogram
│   ├── monogram.svg                    # White letters on ultramarine (primary)
│   ├── monogram-ink.svg                # Ink letters, transparent background
│   ├── monogram-white.svg              # White letters, transparent background
│   └── monogram-512.png                # Raster, for profile pictures
└── photo/
    ├── karthik-parameshwara-portrait.jpg  # 864 × 1080 (4:5), master
    └── karthik-parameshwara-square.jpg    # 640 × 640 head and shoulders, used in About
```

## Generated files

Run after changing the font, colours or monogram proportions:

```bash
bun run brand
```

This runs `python -I scripts/build-brand.py` (needs Python with `fonttools` and `Pillow`) and
regenerates:

| Output                                  | Used for                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `assets/fonts/static/*.ttf`             | Link-preview images (`src/lib/og.tsx`)                      |
| `assets/brand/*`                        | Monogram files for use outside the site                     |
| `src/app/icon.svg`                      | Favicon (modern browsers)                                   |
| `src/app/favicon.ico`                   | Favicon fallback: 16, 32, 48 px (16 px tuned for sharpness) |
| `src/app/apple-icon.png`                | iOS home screen, 180 px                                     |
| `src/components/site/monogram-paths.ts` | The `<Monogram>` component in the nav                       |

Never edit generated files by hand; change the script and re-run it.

## Photo

Provided by Karthik. Cropped (bottom trimmed; square head-and-shoulders version), renamed,
and saved as JPEG with author, copyright and description in the EXIF metadata. The site serves it
through `next/image`, which re-encodes it (AVIF/WebP) and strips metadata. Favicons stay the
monogram: a face is unrecognisable at 16 px.

## Link-preview (Open Graph) images

Not stored here. They're rendered at build time by `src/app/opengraph-image.tsx` (home) and, from
Phase 5, one per case study, all through the shared `renderOgImage()` in `src/lib/og.tsx`.

## Licences

- **Instrument Sans:** SIL Open Font License 1.1 (`fonts/OFL.txt`). Redistribution with the
  licence is allowed.
- **Everything else here** (monogram, photo): all rights reserved. See the repository `LICENSE`.

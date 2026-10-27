# 0012: Brand assets generated in code; Canva for the photo

- Status: Accepted
- Date: 2026-10-27

## Context

The original brief was to use Canva for visual assets (OG images, favicon, monogram). The approved
identity depends on Instrument Sans narrowed to 78% width (ADR 0009). Canva's help centre confirms
that Canva doesn't support variable fonts (no width setting), and that custom font uploads need a
paid plan. Karthik is on Canva Free.

## Options

1. **Code, plus Canva for the photo:** generate the monogram, favicons and OG images from the
   real font file, and use Canva only to touch up the photo.
2. **Canva for everything:** as originally briefed, but the font wouldn't match the site, and each
   OG image would be made by hand.
3. **Canva to explore, code to ship.**

## Decision

Option 1.

- The official variable font (`InstrumentSans[wdth,wght].ttf`, OFL) is stored in `assets/fonts/`.
- `scripts/build-brand.py` (`bun run brand`) cuts exact static instances with fontTools and
  outlines the "KP" monogram from real glyphs. It writes the SVG monogram variants, `icon.svg`,
  `favicon.ico` (with a hinted, larger-letter 16 px version), `apple-icon.png` and the path data
  for the nav component.
- OG images are rendered at build time with `next/og` from the static instances, through one shared
  renderer, so every case study gets a matching preview automatically.
- Canva is used for the photo (crop, clean-up) when Karthik provides it. Background removal may not
  be available on Canva Free.

## Why

Every asset matches the site exactly, because it's made from the same font and tokens. It's
reproducible with one command, versioned in git, and costs nothing. Canva remains the right tool
for photo work, where it does something code can't.

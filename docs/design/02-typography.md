# 02: Typography

- Status: Draft for approval
- Decision record: [ADR 0009](../decisions/0009-visual-direction-working-hours.md)

## The typeface: Instrument Sans

One family for everything: **[Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)**
(SIL Open Font License, free).

- **Why this one:** it's a crisp, contemporary sans with a **width axis**. The same family can be
  set narrow and tall for the hero headline, and at normal width for comfortable reading. That
  gives the headline personality without a second typeface.
- **Why not Inter, Geist or Space Grotesk:** they're excellent, but they're the defaults of most
  developer sites and templates. Instrument Sans is just as readable and less expected.
- **Why one family:** fewer files and faster loading, and it matches "calm and precise". Contrast
  comes from width, size and weight.

Variable axes used: weight **400–700**, width **75–100**. Normal style only (no italic file), so one
font file is downloaded. Emphasis uses weight 600, not italics.

## Type scale

Based on the classic typographic scale (Bringhurst: 14, 16, 18, 21, 24, 36, 48, 72). Sizes are
set in `rem`, so they respect the visitor's browser font size.

| Token          | Size (mobile → desktop) | Line height | Weight | Width | Use                                   |
| -------------- | ----------------------- | ----------- | ------ | ----- | ------------------------------------- |
| `text-display` | 40 px → 72 px (`clamp`) | 1.04        | 600    | 78    | Hero headline only                    |
| `text-3xl`     | 36 px → 48 px           | 1.1         | 600    | 85    | Case-study page title                 |
| `text-2xl`     | 28 px → 36 px           | 1.15        | 600    | 85    | Section titles (Work, About, Contact) |
| `text-xl`      | 24 px                   | 1.25        | 600    | 90    | Chapter titles, project names         |
| `text-lg`      | 21 px                   | 1.5         | 400    | 100   | Lede paragraphs, case-study intros    |
| `text-base`    | 17 px → 18 px           | 1.6         | 400    | 100   | Body text                             |
| `text-sm`      | 16 px                   | 1.5         | 500    | 100   | UI: nav, buttons, facts values        |
| `text-xs`      | 14 px                   | 1.45        | 400    | 100   | Dates in the gutter, captions, labels |

Nothing is smaller than 14 px.

## Rules

- **Measure (line length):** body text max **65 characters** (`max-width: 65ch`). The hero
  headline max **15 characters per line** (`15ch`), so it breaks into a strong 3–4 line block.
- **Headings** use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
- **Numbers** that line up (dates, counts, times) use tabular figures
  (`font-variant-numeric: tabular-nums`).
- **Letter-spacing:** −0.01 em on the display size only. Default everywhere else.
- **Case:** sentence case everywhere. **No all-caps labels.**
- **Weights:** 400 for reading, 500 for UI, 600 for headings. 700 is reserved for the monogram.
- **Links in body text** are underlined (offset 0.2 em, 1 px; 2 px on hover). Colour alone never
  signals a link.
- **Dates** follow the content style: "June 2023 – May 2025" (en dash with spaces).

## Loading strategy

- Load with **`next/font/google`**. Next.js downloads the font at build time and serves it from
  karthik.nz itself, so visitors never contact Google: faster and more private.
- **Subset:** `latin` only. **One variable file** (weight + width axes, normal style).
- **`display: swap`** with Next.js's automatic fallback metrics (`adjustFontFallback`). The
  fallback system font is resized to match, so text doesn't jump when the real font arrives (no
  layout shift).
- **Fallback stack:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Exposed as the CSS variable `--font-sans` and mapped to Tailwind's `font-sans` in
  `src/app/globals.css`.
- Budget: the font file should stay under **60 KB** (checked in [11](11-performance-and-seo.md)).

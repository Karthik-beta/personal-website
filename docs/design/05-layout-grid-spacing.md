# 05: Layout, grid and spacing

- Status: Approved (2026-10-27)

## The grid: a time margin plus a reading column

```text
Desktop (≥ 768 px)
┌──────────────────────────────────────────────────────────────┐
│ [nav]                                                        │
│                                                              │
│  time margin    reading column (max 65ch)                    │
│  ───────────    ─────────────────────────────────────        │
│  Now            Karthik Parameshwara                         │
│                 I build backend-heavy products and see       │
│                 them through to production.                  │
│                 [facts row: role │ experience │ ... ]        │
│                                                              │
│  2017 – 2023    Customers first                              │
│                 Paragraph...                                 │
└──────────────────────────────────────────────────────────────┘

Phone (< 768 px)
┌────────────────────────┐
│ [nav]                  │
│ Now                    │  ← the margin label moves above its content
│ Karthik Parameshwara   │
│ I build backend-heavy  │
│ products and see them  │
│ through to production. │
│ Role                   │
│ Software engineer…     │
└────────────────────────┘
```

- **Two columns on desktop:** a **time margin** (`10rem`) and a **reading column** (up to `65ch`
  for text), separated by a `2rem` gap.
- **One column on phones:** margin labels move above their content as small `muted` text.
- **Left-aligned, always.** Text is never centred or justified. Centred text is harder to scan,
  and justified text creates uneven gaps.
- **Page container:** max width `64rem` (1024 px), centred on the screen, with the grid
  left-aligned inside it. On very wide screens the extra space falls on both sides, so the
  reading line never gets too long.
- Wider elements (case-study screenshots, the facts row) can span both columns. Text paragraphs
  never do.

## Spacing scale

A 4 px base, using Tailwind's spacing steps. Only these values are used:

| Token | px  | Typical use                                          |
| ----- | --- | ---------------------------------------------------- |
| 1     | 4   | Icon to label                                        |
| 2     | 8   | Tight groups (fact label to value)                   |
| 3     | 12  | Between list items                                   |
| 4     | 16  | Paragraph spacing; **minimum page gutter on phones** |
| 6     | 24  | Between related blocks (headline to facts)           |
| 8     | 32  | Between columns; card-free group spacing             |
| 12    | 48  | Between sub-sections                                 |
| 16    | 64  | Between sections (phone)                             |
| 24    | 96  | Between sections (desktop)                           |
| 32    | 128 | Hero top padding (desktop)                           |

**Rhythm:** sections are 64 px apart on phones and 96 px on desktop. Spacing between siblings uses
`gap` on flex/grid containers, not margins on each element, so it can't collapse or double up.

## Breakpoints

Tailwind defaults, used mobile-first (styles start at phone size, then add for larger screens):

| Name | Min width | What changes                                                      |
| ---- | --------- | ----------------------------------------------------------------- |
| base | 0         | One column, 16 px gutters, body 17 px                             |
| `sm` | 640 px    | Facts row goes to 2 columns; gutters 24 px                        |
| `md` | 768 px    | Time margin appears; body 18 px; full nav links shown             |
| `lg` | 1024 px   | Facts row goes to 4 columns; section spacing 96 px; gutters 32 px |
| `xl` | 1280 px   | Nothing new: extra space becomes outer margin                     |

## Responsive rules

- **Test widths:** 320, 375, 414, 768, 1024, 1280 and 1440 px. Nothing may scroll sideways at
  any width, down to 320 px. That's also a WCAG requirement (reflow).
- **Touch targets:** at least 44 × 44 px for buttons and nav items.
- **Hero height** follows its content, never `100vh`, so the facts and the start of the story are
  visible on the first screen.
- **Images** scale to the column width (`max-width: 100%`) with a fixed aspect ratio, so they
  never cause layout shift.
- **Long words and URLs** wrap (`overflow-wrap: anywhere` inside text blocks).
- The nav, the facts row and the time margin are the only layout pieces that change between
  breakpoints. Content order never changes.

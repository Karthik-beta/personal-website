# 03: Colour

- Status: Approved (2026-10-27)
- Decision record: [ADR 0009](../decisions/0009-visual-direction-working-hours.md)

## The idea

**Ink on paper, with one ultramarine accent.** Almost everything is two colours of text on a
cool, slightly grey-blue paper. The accent appears in only four places: the primary button,
links, the local-time band, and keyboard focus. Because it's rare, it always means "you can act
here".

- **Why cool paper, not white or cream:** pure white is harsh for long reading. Warm cream is the
  most common generated-site look right now. A cool off-white leans towards the accent, so the
  whole page feels like one considered palette.
- **Why ultramarine:** blue is what people already read as "clickable". Deepened to ultramarine,
  it feels precise rather than default-browser.

## Palette tokens

Components never use raw hex values: always a token. Tokens are CSS variables in
`src/app/globals.css`, mapped into Tailwind's `@theme`.

| Token          | Light     | Dark      | Used for                                             |
| -------------- | --------- | --------- | ---------------------------------------------------- |
| `paper`        | `#f5f6f8` | `#14171c` | Page background                                      |
| `surface`      | `#ffffff` | `#1b1f26` | Raised areas: open mobile menu, figures, code blocks |
| `band`         | `#e3e7f5` | `#1e2433` | Local-time band, text selection highlight            |
| `ink`          | `#15191f` | `#e8eaee` | Main text, headings, icons                           |
| `muted`        | `#59626e` | `#a2aab5` | Secondary text, dates, captions, labels              |
| `rule`         | `#d6dbe1` | `#2b3038` | Decorative hairlines between sections and facts      |
| `rule-strong`  | `#7d8693` | `#6b7480` | Borders of controls (theme toggle, menu button)      |
| `accent`       | `#2c3fb8` | `#9aa8ff` | Links, primary button, focus ring                    |
| `accent-hover` | `#22329a` | `#b8c2ff` | Hover/pressed state of links and the primary button  |
| `on-accent`    | `#ffffff` | `#10131a` | Text on the primary button                           |

No status colours (success, warning, error) are needed: the site has no forms. Feedback such as
"Email copied" uses `ink` text with an icon.

## Light and dark

- **Light is the default.** Dark applies automatically when the visitor's device prefers dark
  (`prefers-color-scheme`), and a toggle in the nav lets anyone override it. The choice is
  remembered in `localStorage`.
- **No flash:** a tiny inline script in `<head>` sets `data-theme` before first paint, so a
  dark-mode visitor never sees a white flash.
- **Dark is designed, not inverted.** The dark accent is lighter (`#9aa8ff`) so it keeps its
  contrast, and the dark paper is blue-grey rather than pure black, which is easier on the eyes.

## Contrast: every text/background pair

Measured with the WCAG 2.x formula. Text needs **4.5:1** (AA), or 7:1 for AAA. Control borders and
focus rings need **3:1** against what's next to them.

### Light

| Foreground             | Background             | Use                                 | Ratio   | Needs | Result              |
| ---------------------- | ---------------------- | ----------------------------------- | ------- | ----- | ------------------- |
| `ink` #15191f          | `paper` #f5f6f8        | Body text, headings                 | 16.31:1 | 4.5:1 | AAA                 |
| `ink` #15191f          | `surface` #ffffff      | Text on raised surfaces             | 17.64:1 | 4.5:1 | AAA                 |
| `ink` #15191f          | `band` #e3e7f5         | Local-time line, text selection     | 14.29:1 | 4.5:1 | AAA                 |
| `muted` #59626e        | `paper` #f5f6f8        | Secondary text, dates in the gutter | 5.72:1  | 4.5:1 | AA                  |
| `muted` #59626e        | `surface` #ffffff      | Secondary text on surfaces          | 6.18:1  | 4.5:1 | AA                  |
| `muted` #59626e        | `band` #e3e7f5         | Secondary text on the band          | 5.01:1  | 4.5:1 | AA                  |
| `accent` #2c3fb8       | `paper` #f5f6f8        | Links                               | 7.74:1  | 4.5:1 | AAA                 |
| `accent` #2c3fb8       | `surface` #ffffff      | Links on surfaces                   | 8.37:1  | 4.5:1 | AAA                 |
| `accent` #2c3fb8       | `band` #e3e7f5         | Links on the band                   | 6.78:1  | 4.5:1 | AA                  |
| `accent-hover` #22329a | `paper` #f5f6f8        | Hovered links                       | 9.75:1  | 4.5:1 | AAA                 |
| `on-accent` #ffffff    | `accent` #2c3fb8       | Primary button label                | 8.37:1  | 4.5:1 | AAA                 |
| `on-accent` #ffffff    | `accent-hover` #22329a | Primary button label (hover)        | 10.55:1 | 4.5:1 | AAA                 |
| `rule-strong` #7d8693  | `paper` #f5f6f8        | Control borders                     | 3.41:1  | 3:1   | AA                  |
| `accent` #2c3fb8       | `paper` #f5f6f8        | Focus ring (non-text)               | 7.74:1  | 3:1   | AA                  |
| `rule` #d6dbe1         | `paper` #f5f6f8        | Decorative hairlines                | 1.29:1  | —     | Exempt (decorative) |

### Dark

| Foreground             | Background             | Use                                 | Ratio   | Needs | Result              |
| ---------------------- | ---------------------- | ----------------------------------- | ------- | ----- | ------------------- |
| `ink` #e8eaee          | `paper` #14171c        | Body text, headings                 | 14.91:1 | 4.5:1 | AAA                 |
| `ink` #e8eaee          | `surface` #1b1f26      | Text on raised surfaces             | 13.72:1 | 4.5:1 | AAA                 |
| `ink` #e8eaee          | `band` #1e2433         | Local-time line, text selection     | 12.86:1 | 4.5:1 | AAA                 |
| `muted` #a2aab5        | `paper` #14171c        | Secondary text, dates in the gutter | 7.66:1  | 4.5:1 | AAA                 |
| `muted` #a2aab5        | `surface` #1b1f26      | Secondary text on surfaces          | 7.05:1  | 4.5:1 | AAA                 |
| `muted` #a2aab5        | `band` #1e2433         | Secondary text on the band          | 6.61:1  | 4.5:1 | AA                  |
| `accent` #9aa8ff       | `paper` #14171c        | Links                               | 8.06:1  | 4.5:1 | AAA                 |
| `accent` #9aa8ff       | `surface` #1b1f26      | Links on surfaces                   | 7.41:1  | 4.5:1 | AAA                 |
| `accent` #9aa8ff       | `band` #1e2433         | Links on the band                   | 6.95:1  | 4.5:1 | AA                  |
| `accent-hover` #b8c2ff | `paper` #14171c        | Hovered links                       | 10.43:1 | 4.5:1 | AAA                 |
| `on-accent` #10131a    | `accent` #9aa8ff       | Primary button label                | 8.33:1  | 4.5:1 | AAA                 |
| `on-accent` #10131a    | `accent-hover` #b8c2ff | Primary button label (hover)        | 10.79:1 | 4.5:1 | AAA                 |
| `rule-strong` #6b7480  | `paper` #14171c        | Control borders                     | 3.79:1  | 3:1   | AA                  |
| `accent` #9aa8ff       | `paper` #14171c        | Focus ring (non-text)               | 8.06:1  | 3:1   | AA                  |
| `rule` #2b3038         | `paper` #14171c        | Decorative hairlines                | 1.35:1  | —     | Exempt (decorative) |

**Rule:** any new text/background combination must be added to these tables with a measured ratio
before it ships. Hairlines (`rule`) may never be the only thing that tells a reader something.

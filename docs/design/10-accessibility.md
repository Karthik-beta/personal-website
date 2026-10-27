# 10: Accessibility

- Status: Approved (2026-10-27)
- Target: **WCAG 2.2 level AA** on every page, in both themes, at every width down to 320 px.

Accessibility is part of the evidence: a hiring manager who checks the site with a keyboard or a
screen reader should find it just as good.

## Semantic HTML

- One `<h1>` per page (the name on home, the title on a case study). Headings never skip levels.
- Landmarks: `<header>` (nav), `<main id="content">`, `<footer>`, and `<nav aria-label="Main">`.
  Each home section is a `<section>` with an `aria-labelledby` heading.
- Lists are lists (`<ul>`, `<dl>` for facts and meta). Dates use `<time datetime="2023-06">`.
- Buttons do things; links go places. Never a `<div>` with a click handler.
- `<html lang="en">`.

## Keyboard

- Everything works with a keyboard alone: Tab, Shift+Tab, Enter, Space, Escape.
- **Skip link** ("Skip to content") is the first focusable element.
- Tab order follows the visual order. No positive `tabindex`.
- The phone menu (Base UI `Dialog`) traps focus while open, closes on Escape, and returns focus to
  the Menu button.
- The hide-on-scroll nav is **always shown when anything inside it has focus**.

## Focus

- Visible focus on every interactive element: a 2 px `accent` ring, 3 px offset. That's at least
  3:1 against both themes ([03](03-color.md)).
- **Focus not obscured** (2.4.11): `scroll-padding-top: 72px` so a focused element is never
  hidden under the nav.
- The default outline is never removed without this replacement.

## Colour and contrast

- All text meets 4.5:1. Control borders and focus rings meet 3:1. The full measured table is in
  [03](03-color.md).
- Colour is never the only signal: links are underlined, the current page is underlined and marked
  `aria-current`, and "Copied" uses a word plus an icon.

## Text and zoom

- Sizes in `rem`. The page works at **200% zoom** and at **320 px** width with no sideways
  scrolling (1.4.10 Reflow).
- Nothing breaks when users increase letter or line spacing (1.4.12 Text Spacing). Containers
  grow; nothing is a fixed height.

## Target size

- Buttons and nav items are at least **44 × 44 px**, above the 24 × 24 px minimum (2.5.8).
  Inline links in paragraphs are exempt but get comfortable line height.

## Images and alt text rules

- **Informative images** (screenshots): alt text says what the image shows and why it matters
  ("Aria's asset list with filters by location and status"), not "screenshot".
- **The photo:** alt "Karthik Parameshwara".
- **Decorative images and icons next to a text label:** `alt=""` / `aria-hidden="true"`.
- **Icon-only buttons** (theme toggle, menu): an `aria-label` that says what happens.
- **Monogram in the nav:** part of the home link, which has the accessible name "Karthik
  Parameshwara, home".
- No text inside images except the OG image, which repeats its text in metadata.

## Links

- Link text makes sense on its own ("Read the Aria case study", not "click here").
- External links say so: an icon plus visually hidden "(opens in a new tab)".
- The resume link says it's a PDF: "Download resume (PDF)".

## Motion

See [09](09-motion-and-interactions.md). `prefers-reduced-motion` is respected globally. Nothing
flashes. The local time updates silently.

## Dynamic content

- "Copied" feedback uses a polite live region (`aria-live="polite"`).
- The local time is **not** a live region.
- Theme changes don't move focus.

## The resume PDF

- `TODO(karthik)`: the PDF should be a text PDF (selectable text, not a scanned image), with a
  title set in its properties. Exporting from Word or Google Docs does this by default.

## How it's checked

- Automated: Lighthouse accessibility score 100, and axe DevTools with zero violations, on every
  page in both themes.
- Manual: a keyboard-only pass, a screen reader pass (NVDA on Windows), 200% zoom, 320 px width,
  and reduced motion on. Listed in [12](12-polish-checklist.md).

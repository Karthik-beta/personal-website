# 09: Motion and interactions

- Status: Approved (2026-10-27)

## Principles

1. **Motion answers the visitor.** Things move only because someone did something: hovered,
   pressed, opened, scrolled up. Nothing animates on its own to get attention.
2. **No entrance animations.** Sections don't fade or slide in on scroll. Everything is visible
   the moment the page loads: for recruiters, for screenshots, for link previews, for slow
   devices.
3. **Short and quiet.** If a visitor notices the animation itself, it's too much.
4. **Reduced motion is respected everywhere** (see below).

## Durations and easing

| Token           | Duration | Easing                       | Used for                                     |
| --------------- | -------- | ---------------------------- | -------------------------------------------- |
| `duration-fast` | 120 ms   | `ease-out`                   | Colour changes on hover, underline thickness |
| `duration-base` | 200 ms   | `cubic-bezier(0.2, 0, 0, 1)` | Nav show/hide, menu panel open               |
| `duration-exit` | 150 ms   | `cubic-bezier(0.4, 0, 1, 1)` | Menu panel close                             |

Only `opacity`, `transform` and colours are animated, since those are cheap for the browser.
Never `height`, `width` or layout properties.

## Interactions

| Element        | Interaction      | Response                                                                                                                |
| -------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Links          | Hover            | Colour → `accent-hover`, underline 1 → 2 px (120 ms)                                                                    |
| Primary button | Hover / press    | Background → `accent-hover`; on press moves down 1 px                                                                   |
| Quiet button   | Hover / press    | Background → `band`; on press moves down 1 px                                                                           |
| Any focusable  | Keyboard focus   | 2 px `accent` ring, offset 3 px. Appears instantly, no animation                                                        |
| Nav bar        | Scroll down / up | Slides up out of view / back in (200 ms)                                                                                |
| Mobile menu    | Open / close     | Fades and slides 8 px down / back (200 / 150 ms)                                                                        |
| Copy email     | Click            | Label changes to "Copied" with a check for 2 s                                                                          |
| Theme toggle   | Click            | Theme switches instantly. Colour transitions are disabled for that frame so the page doesn't fade between themes        |
| Local time     | Every 30 s       | Text updates in place, no animation                                                                                     |
| Chapter dates  | Scroll (desktop) | Date stays pinned in the time margin while its chapter is visible (CSS `position: sticky`, no JavaScript, no animation) |

## Scroll-driven storytelling

Deliberately minimal: the **sticky dates** in the time margin are the only scroll effect. As you
read a chapter, its date stays beside it, the way a schedule keeps the time visible. No parallax,
no scroll-jacking, no scroll-triggered reveals.

## `prefers-reduced-motion`

When a visitor's device asks for reduced motion:

- All transitions and animations are set to effectively **0 ms**. Colour changes are instant.
- The nav **doesn't slide**: it simply appears or disappears.
- The mobile menu appears without the slide.
- Smooth scrolling (`scroll-behavior: smooth`) is turned off, so in-page links jump directly.
- Sticky dates stay, because they don't move on their own.

Implemented once, globally, in `globals.css` with a `@media (prefers-reduced-motion: reduce)`
block, not per component.

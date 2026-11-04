// Documentation copy of the tokens in src/app/globals.css (docs/design/03-color.md).
// The styleguide renders swatches from the CSS variables themselves, so a mismatch shows.

export const colorTokens = [
  { name: "paper", light: "#f5f6f8", dark: "#14171c", use: "Page background" },
  { name: "surface", light: "#ffffff", dark: "#1b1f26", use: "Raised areas: menu, figures" },
  { name: "band", light: "#e3e7f5", dark: "#1e2433", use: "Local-time band, selection" },
  { name: "ink", light: "#15191f", dark: "#e8eaee", use: "Main text, headings, icons" },
  { name: "muted", light: "#59626e", dark: "#a2aab5", use: "Secondary text, dates, labels" },
  { name: "rule", light: "#d6dbe1", dark: "#2b3038", use: "Decorative hairlines" },
  { name: "rule-strong", light: "#7d8693", dark: "#6b7480", use: "Control borders" },
  { name: "accent", light: "#2c3fb8", dark: "#9aa8ff", use: "Links, primary button, focus" },
  { name: "accent-hover", light: "#22329a", dark: "#b8c2ff", use: "Hover and pressed states" },
  { name: "on-accent", light: "#ffffff", dark: "#10131a", use: "Text on the primary button" },
] as const;

export type ColorName = (typeof colorTokens)[number]["name"];
export type ThemeName = "light" | "dark";

export function tokenValue(name: ColorName, theme: ThemeName) {
  const token = colorTokens.find((t) => t.name === name)!;
  return token[theme];
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio. */
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const contrastPairs: { fg: ColorName; bg: ColorName; min: number; use: string }[] = [
  { fg: "ink", bg: "paper", min: 4.5, use: "Body text" },
  { fg: "ink", bg: "surface", min: 4.5, use: "Text on surfaces" },
  { fg: "ink", bg: "band", min: 4.5, use: "Local time, selection" },
  { fg: "muted", bg: "paper", min: 4.5, use: "Secondary text" },
  { fg: "muted", bg: "surface", min: 4.5, use: "Secondary on surfaces" },
  { fg: "muted", bg: "band", min: 4.5, use: "Secondary on the band" },
  { fg: "accent", bg: "paper", min: 4.5, use: "Links" },
  { fg: "accent", bg: "surface", min: 4.5, use: "Links on surfaces" },
  { fg: "accent", bg: "band", min: 4.5, use: "Links on the band" },
  { fg: "accent-hover", bg: "paper", min: 4.5, use: "Hovered links" },
  { fg: "on-accent", bg: "accent", min: 4.5, use: "Button label" },
  { fg: "on-accent", bg: "accent-hover", min: 4.5, use: "Button label, hover" },
  { fg: "rule-strong", bg: "paper", min: 3, use: "Control borders" },
];

export const typeScale = [
  {
    token: "display",
    size: "40 → 72 px",
    leading: "1.04",
    weight: 600,
    stretch: "78%",
    className: "text-display font-semibold stretch-display",
    sample: "I build backend-heavy products and see them through to production.",
  },
  {
    token: "3xl",
    size: "36 → 48 px",
    leading: "1.1",
    weight: 600,
    stretch: "85%",
    className: "text-3xl font-semibold stretch-heading",
    sample: "Aria",
  },
  {
    token: "2xl",
    size: "28 → 36 px",
    leading: "1.15",
    weight: 600,
    stretch: "85%",
    className: "text-2xl font-semibold stretch-heading",
    sample: "Selected work",
  },
  {
    token: "xl",
    size: "24 px",
    leading: "1.25",
    weight: 600,
    stretch: "90%",
    className: "text-xl font-semibold stretch-title",
    sample: "Learning to ship at Getin Solutions",
  },
  {
    token: "lg",
    size: "21 px",
    leading: "1.5",
    weight: 400,
    stretch: "100%",
    className: "text-lg",
    sample:
      "Talking to customers got me interested in the problems behind what they were asking for.",
  },
  {
    token: "base",
    size: "17 → 18 px",
    leading: "1.6",
    weight: 400,
    stretch: "100%",
    className: "text-base",
    sample: "I wanted to understand how a solution worked and learn to build it myself.",
  },
  {
    token: "sm",
    size: "16 px",
    leading: "1.5",
    weight: 500,
    stretch: "100%",
    className: "text-sm font-medium",
    sample: "View resume",
  },
  {
    token: "xs",
    size: "14 px",
    leading: "1.45",
    weight: 400,
    stretch: "100%",
    className: "text-xs text-muted",
    sample: "June 2023 – May 2025",
  },
] as const;

export const spacingScale = [
  { step: "1", px: 4, use: "Icon to label" },
  { step: "2", px: 8, use: "Fact label to value" },
  { step: "3", px: 12, use: "List items" },
  { step: "4", px: 16, use: "Paragraphs; phone gutter" },
  { step: "6", px: 24, use: "Related blocks" },
  { step: "8", px: 32, use: "Column gap" },
  { step: "12", px: 48, use: "Sub-sections" },
  { step: "16", px: 64, use: "Sections (phone)" },
  { step: "24", px: 96, use: "Sections (desktop)" },
  { step: "32", px: 128, use: "Hero top (desktop)" },
] as const;

export const motionTokens = [
  { token: "duration-120", value: "120 ms, ease-out", use: "Hover colour, underline" },
  {
    token: "duration-200 + ease-enter",
    value: "200 ms, cubic-bezier(0.2, 0, 0, 1)",
    use: "Nav show/hide, menu open",
  },
  {
    token: "duration-150 + ease-exit",
    value: "150 ms, cubic-bezier(0.4, 0, 1, 1)",
    use: "Menu close",
  },
] as const;

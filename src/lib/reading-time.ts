import type { CaseSection, CaseStudy } from "@/content/case-studies";

const wordsPerMinute = 230;
const secondsPerFigure = 12;

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

function sectionStats({ paragraphs = [], points = [], figures = [] }: CaseSection) {
  const text = [
    ...paragraphs,
    ...points,
    ...figures.flatMap((f) => (f.kind === "placeholder" ? [] : [f.caption])),
  ];
  return { words: text.reduce((sum, t) => sum + words(t), 0), figures: figures.length };
}

export function readingMinutes(study: CaseStudy): number {
  const sections = [study.problem, study.work, study.outcome].map(sectionStats);
  const wordCount = words(study.summary) + sections.reduce((sum, s) => sum + s.words, 0);
  const figureCount = sections.reduce((sum, s) => sum + s.figures, 0);
  const minutes = wordCount / wordsPerMinute + (figureCount * secondsPerFigure) / 60;
  return Math.max(1, Math.ceil(minutes));
}

export const readingLabel = (minutes: number) => `${minutes} min read`;

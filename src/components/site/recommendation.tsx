import { TextLink } from "@/components/ui/text-link";
import type { Recommendation as RecommendationData } from "@/content/home";

/** Someone else's words, so a neutral rule, quotation marks and a credit: never Karthik's voice. */
export function Recommendation({ paragraphs, name, role, href }: RecommendationData) {
  return (
    <figure className="border-l-2 border-rule-strong pl-4">
      <blockquote className="grid max-w-[60ch] gap-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            “{paragraph}
            {index === paragraphs.length - 1 && "”"}
          </p>
        ))}
      </blockquote>
      <figcaption className="mt-3 text-sm text-muted">
        <span className="font-semibold text-ink">{name}</span>, {role}.{" "}
        <TextLink href={href}>Read it on LinkedIn</TextLink>
      </figcaption>
    </figure>
  );
}

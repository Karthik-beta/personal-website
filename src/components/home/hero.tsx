import { FileText, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { FactsRow } from "@/components/site/facts-row";
import { LocalTime } from "@/components/site/local-time";
import { ProofStrip } from "@/components/site/proof-strip";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { home } from "@/content/home";
import { site } from "@/lib/site";
import { MarginGrid } from "./margin-grid";

const iconProps = { "aria-hidden": true, size: 18, strokeWidth: 1.75 } as const;

/** The skim layer: everything a recruiter needs in ten seconds, without scrolling. */
export function Hero() {
  const { hero } = home;
  return (
    <section aria-labelledby="hero-name">
      <Container className="grid gap-12 pt-12 pb-16 md:gap-16 lg:pt-24 lg:pb-24">
        <MarginGrid margin={hero.margin}>
          <h1 id="hero-name" className="text-sm font-semibold">
            {site.name}
          </h1>
          <p className="mt-4 max-w-[18ch] text-display font-semibold text-balance stretch-display">
            {hero.tagline.before}
            <span className="whitespace-nowrap">{hero.tagline.nowrap}</span>
            {hero.tagline.after}
          </p>
          <div className="mt-8 grid gap-6">
            <FactsRow items={hero.facts} className="@2xl:grid-cols-[1.5fr_0.8fr_0.9fr_1.3fr]" />
            <div>
              <LocalTime />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href={site.resume}>
                <FileText {...iconProps} />
                {hero.actions.resume}
              </ButtonLink>
              <TextLink href={`mailto:${site.email}`} kind="action" icon={<Mail {...iconProps} />}>
                {hero.actions.email}
              </TextLink>
              <TextLink href={site.links.github} kind="action" icon={<GitHubIcon />}>
                {hero.actions.github}
              </TextLink>
              <TextLink href={site.links.linkedin} kind="action" icon={<LinkedInIcon />}>
                {hero.actions.linkedin}
              </TextLink>
            </div>
          </div>
        </MarginGrid>
        <MarginGrid className="border-t border-rule pt-8">
          <h2 className="sr-only">{hero.highlightsTitle}</h2>
          <ProofStrip
            items={hero.highlights.map((item) => (
              <>
                <strong className="font-semibold">{item.strong}</strong>
                {item.rest}
              </>
            ))}
          />
        </MarginGrid>
      </Container>
    </section>
  );
}

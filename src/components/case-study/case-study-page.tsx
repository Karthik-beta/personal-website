import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MarginGrid } from "@/components/home/margin-grid";
import { Figure, FigurePlaceholder } from "@/components/site/figure";
import { MetaList } from "@/components/site/meta-list";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { caseStudies, getCaseStudy, type CaseSection, type Slug } from "@/content/case-studies";
import { ogSize, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

// Each case study has its own static route folder (src/app/work/<slug>/), so an unknown
// /work/… URL matches no route and returns a real 404.

export function caseStudyMetadata(slug: Slug): Metadata {
  const study = getCaseStudy(slug);
  const url = `/work/${study.slug}`;
  // openGraph and twitter replace the layout's objects rather than merging, so repeat the shared fields.
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_GB",
      siteName: site.name,
      url,
      title: `${study.title} | ${site.name}`,
      description: study.summary,
    },
    twitter: {
      card: "summary_large_image",
      creator: site.x,
      title: `${study.title} | ${site.name}`,
      description: study.summary,
    },
  };
}

export const caseStudyOgSize = ogSize;

export function caseStudyOgImage(slug: Slug) {
  const study = getCaseStudy(slug);
  return renderOgImage({ title: study.title, summary: study.summary, footer: "Case study" });
}

function Section({ id, title, section }: { id: string; title: string; section: CaseSection }) {
  return (
    <MarginGrid className="border-t border-rule pt-8">
      <section aria-labelledby={id} className="grid max-w-[65ch] gap-4">
        <h2 id={id} className="text-xl font-semibold stretch-title">
          {title}
        </h2>
        {section.paragraphs?.map((text) => (
          <p key={text}>{text}</p>
        ))}
        {section.points && (
          <ul className="grid list-disc gap-3 pl-5 marker:text-muted">
            {section.points.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        )}
        {section.figures && (
          <div className="mt-2 grid gap-8">
            {section.figures.map((figure, index) =>
              figure.kind === "placeholder" ? (
                <FigurePlaceholder key={index} label={figure.label} />
              ) : (
                <Figure
                  key={index}
                  src={figure.src}
                  darkSrc={figure.darkSrc}
                  alt={figure.alt}
                  caption={figure.caption}
                  unoptimized={figure.unoptimized}
                />
              ),
            )}
          </div>
        )}
      </section>
    </MarginGrid>
  );
}

export function CaseStudyPage({ slug }: { slug: Slug }) {
  const study = getCaseStudy(slug);

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <main id="content" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
      <Container className="grid gap-10 md:gap-12">
        <MarginGrid>
          <TextLink
            href="/#work"
            kind="action"
            icon={<ArrowLeft aria-hidden size={18} strokeWidth={1.75} />}
          >
            All work
          </TextLink>
        </MarginGrid>

        <MarginGrid
          margin={
            <>
              <time dateTime={study.when.from}>{study.when.label.split(" – ")[0]}</time>
              {study.when.to && (
                <>
                  {" – "}
                  <time dateTime={study.when.to} className="whitespace-nowrap">
                    {study.when.label.split(" – ")[1]}
                  </time>
                </>
              )}
            </>
          }
        >
          <header className="grid max-w-[65ch] gap-6">
            <div className="grid gap-3">
              <h1 className="text-3xl font-semibold stretch-heading">{study.title}</h1>
              <p className="text-lg">{study.summary}</p>
            </div>
            <MetaList
              items={[
                { label: "Role", value: study.role },
                { label: "When", value: study.when.label },
                { label: "Stack", value: study.stack.join(", ") },
                {
                  label: "Links",
                  value: (
                    <ul className="flex flex-wrap gap-x-5 gap-y-1">
                      {study.links.map((link) => (
                        <li key={link.href}>
                          <TextLink href={link.href}>{link.label}</TextLink>
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </header>
        </MarginGrid>

        <Section id="problem" title="The problem" section={study.problem} />
        <Section id="what-i-did" title="What I did" section={study.work} />
        <Section id="outcome" title="Outcome" section={study.outcome} />

        <MarginGrid className="border-t border-rule pt-8">
          <div className="grid max-w-[65ch] gap-6">
            <p className="text-lg">
              <span className="text-muted">What this shows: </span>
              {study.shows}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link
                href={`/work/${next.slug}`}
                className="font-semibold text-accent underline underline-offset-[0.2em] hover:text-accent-hover hover:decoration-2"
              >
                Next case study: {next.title}
              </Link>
              <TextLink href="/#contact" kind="action">
                Get in touch
              </TextLink>
            </div>
          </div>
        </MarginGrid>
      </Container>
    </main>
  );
}

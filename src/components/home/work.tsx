import { Clip } from "@/components/site/clip";
import { ProjectEntry } from "@/components/site/project-entry";
import { Container } from "@/components/ui/container";
import { caseStudyAt } from "@/content/case-studies";
import { home } from "@/content/home";
import { readingLabel, readingMinutes } from "@/lib/reading-time";
import { MarginGrid } from "./margin-grid";

export function Work() {
  const { work } = home;
  return (
    <section id="work" aria-labelledby="work-title" className="pb-16 lg:pb-24">
      <Container className="grid gap-10 md:gap-14">
        <MarginGrid>
          <div className="grid max-w-[65ch] gap-2">
            <h2 id="work-title" className="text-2xl font-semibold stretch-heading">
              {work.title}
            </h2>
            <p className="text-muted">{work.intro}</p>
          </div>
        </MarginGrid>
        <div className="grid">
          {work.projects.map(({ years, clip, ...project }) => {
            const study = caseStudyAt(project.href);
            const minutes = study && readingMinutes(study);
            return (
              <MarginGrid
                key={project.title}
                margin={
                  <span className="grid">
                    <span>{years}</span>
                    {minutes && <span>{readingLabel(minutes)}</span>}
                  </span>
                }
                className="border-t border-rule py-6"
              >
                <ProjectEntry
                  {...project}
                  media={clip && <Clip {...clip} caption={undefined} />}
                  readingMinutes={minutes}
                  placement="home_work"
                  framed={false}
                />
              </MarginGrid>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

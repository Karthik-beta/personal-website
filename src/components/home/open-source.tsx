import { Timesheet } from "@/components/open-source/timesheet";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { openSource } from "@/content/open-source";
import { getOpenSource, timesheetWeeks } from "@/lib/open-source";
import { MarginGrid } from "./margin-grid";

const list = (items: string[]) =>
  new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(items);

/** Home teaser for /open-source: one sentence built from the data and the last four weeks. */
export async function OpenSource() {
  const data = await getOpenSource();
  const libraries = list(openSource.libraries.map((library) => library.name));
  const projects = data.contributions
    .slice(0, 3)
    .map((repo) => openSource.projectNames[repo.repo] ?? repo.repo.split("/")[1]);

  return (
    <section id="open-source" aria-labelledby="open-source-title" className="pb-16 lg:pb-24">
      <Container className="grid gap-6">
        <MarginGrid>
          <div className="grid max-w-[65ch] gap-2">
            <h2 id="open-source-title" className="text-2xl font-semibold stretch-heading">
              Open source
            </h2>
            <p>
              I maintain {libraries}, published on npm, PyPI and crates.io
              {projects.length > 0 && <>, and send fixes to projects such as {list(projects)}</>}.
            </p>
          </div>
        </MarginGrid>
        <div className="-ml-1 sm:-ml-1.5">
          <Timesheet weeks={timesheetWeeks(data, 4)} today={data.today} />
        </div>
        <MarginGrid>
          <TextLink href="/open-source" kind="action">
            See open-source work
          </TextLink>
        </MarginGrid>
      </Container>
    </section>
  );
}

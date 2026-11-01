import { Timesheet } from "@/components/open-source/timesheet";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { home } from "@/content/home";
import { getOpenSource, timesheetWeeks } from "@/lib/open-source";
import { homeTeaser } from "@/lib/open-source/words";
import { MarginGrid } from "./margin-grid";

/** Home teaser for /open-source: one sentence built from the data, and the activity grid. */
export async function OpenSource() {
  const data = await getOpenSource();
  return (
    <section id="open-source" aria-labelledby="open-source-title" className="pb-16 lg:pb-24">
      <Container className="grid gap-6">
        <MarginGrid>
          <div className="grid max-w-[65ch] gap-2">
            <h2 id="open-source-title" className="text-2xl font-semibold stretch-heading">
              {home.openSource.title}
            </h2>
            <p>{homeTeaser(data)}</p>
          </div>
        </MarginGrid>
        <MarginGrid>
          {/* -ml-1 takes back the grid's 4 px edge spacing, so the labels line up. */}
          <div className="-ml-1">
            <Timesheet weeks={timesheetWeeks(data)} today={data.today} />
          </div>
        </MarginGrid>
        <MarginGrid>
          <TextLink href="/open-source" kind="action">
            {home.openSource.link}
          </TextLink>
        </MarginGrid>
      </Container>
    </section>
  );
}

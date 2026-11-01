import type { Metadata } from "next";
import { MarginGrid } from "@/components/home/margin-grid";
import { Contributions, LibraryEntry } from "@/components/open-source/sections";
import { Timesheet } from "@/components/open-source/timesheet";
import { JsonLd } from "@/components/site/json-ld";
import { Container } from "@/components/ui/container";
import { openSource } from "@/content/open-source";
import { activitySummary, getOpenSource, lastActivity, timesheetWeeks } from "@/lib/open-source";
import { contributionTotals, fetchedAt } from "@/lib/open-source/words";
import { site } from "@/lib/site";
import { openSourceStructuredData } from "@/lib/structured-data";

const { description } = openSource;

export const metadata: Metadata = {
  title: "Open source",
  description,
  alternates: { canonical: "/open-source" },
  // openGraph and twitter replace the layout's objects rather than merging, so repeat the shared fields.
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: "/open-source",
    title: `Open source | ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    creator: site.x,
    title: `Open source | ${site.name}`,
    description,
  },
};

export default async function OpenSourcePage() {
  const data = await getOpenSource();
  const at = fetchedAt(data.fetchedAt);

  return (
    <main id="content" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
      <JsonLd data={openSourceStructuredData({ description, updated: lastActivity(data) })} />
      <Container className="grid gap-12 md:gap-16">
        <MarginGrid>
          <header className="grid max-w-[65ch] gap-3">
            <h1 className="text-3xl font-semibold stretch-heading">Open source</h1>
            <p className="text-lg">
              Two libraries I maintain, fixes I&rsquo;ve sent to other people&rsquo;s projects, and
              the days I&rsquo;ve shipped.
            </p>
          </header>
        </MarginGrid>

        <section aria-labelledby="libraries" className="grid gap-6">
          <MarginGrid>
            <h2 id="libraries" className="text-2xl font-semibold stretch-heading">
              Libraries
            </h2>
          </MarginGrid>
          <div className="grid gap-10">
            {openSource.libraries.map((library) => (
              <LibraryEntry key={library.name} library={library} data={data} />
            ))}
          </div>
        </section>

        <section aria-labelledby="contributions" className="grid gap-6">
          <MarginGrid>
            <div className="grid max-w-[65ch] gap-2">
              <h2 id="contributions" className="text-2xl font-semibold stretch-heading">
                Contributions to other projects
              </h2>
              <p className="text-muted">
                Pull requests I&rsquo;ve opened on other people&rsquo;s projects, newest first, with
                their status on GitHub.
              </p>
              <p>{contributionTotals(data)}</p>
            </div>
          </MarginGrid>
          <Contributions data={data} />
        </section>

        <section aria-labelledby="activity" className="grid gap-6">
          <MarginGrid>
            <h2 id="activity" className="text-2xl font-semibold stretch-heading">
              Activity
            </h2>
          </MarginGrid>
          <MarginGrid>
            <div className="grid gap-4">
              {/* -ml-1 takes back the grid's 4 px edge spacing, so the labels line up. */}
              <div className="-ml-1">
                <Timesheet weeks={timesheetWeeks(data)} today={data.today} />
              </div>
              <p className="max-w-[65ch]">{activitySummary(data)}</p>
            </div>
          </MarginGrid>
        </section>

        <MarginGrid className="border-t border-rule pt-6">
          <p className="text-xs text-muted">
            Updated from GitHub and the package registries at{" "}
            <time dateTime={data.fetchedAt}>
              {at.hour}:{at.minute} on {at.day} {at.month}
            </time>{" "}
            (Bengaluru time).
          </p>
        </MarginGrid>
      </Container>
    </main>
  );
}

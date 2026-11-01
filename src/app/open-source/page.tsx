import type { Metadata } from "next";
import { MarginGrid } from "@/components/home/margin-grid";
import { Contributions, LibraryEntry } from "@/components/open-source/sections";
import { Timesheet } from "@/components/open-source/timesheet";
import { JsonLd } from "@/components/site/json-ld";
import { Container } from "@/components/ui/container";
import { openSource } from "@/content/open-source";
import {
  activitySummary,
  formatDay,
  getOpenSource,
  lastActivity,
  timesheetWeeks,
} from "@/lib/open-source";
import { site } from "@/lib/site";
import { openSourceStructuredData } from "@/lib/structured-data";

const description =
  "Libraries Karthik Parameshwara maintains, pull requests to other projects, and daily activity, live from GitHub and the package registries.";

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

const fetchedAt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  })
    .formatToParts(new Date(iso))
    .reduce<Record<string, string>>((parts, part) => ({ ...parts, [part.type]: part.value }), {});

export default async function OpenSourcePage() {
  const data = await getOpenSource();
  const since = formatDay(openSource.since, data.today, "long");
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
              the days I&rsquo;ve shipped since {since}.
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
            </div>
          </MarginGrid>
          <Contributions data={data} />
        </section>

        <section aria-labelledby="activity" className="grid gap-6">
          <MarginGrid>
            <h2 id="activity" className="text-2xl font-semibold stretch-heading">
              Activity since {since}
            </h2>
          </MarginGrid>
          <div className="grid gap-4">
            <div className="-ml-1 sm:-ml-1.5">
              <Timesheet weeks={timesheetWeeks(data, 13)} today={data.today} />
            </div>
            <MarginGrid>
              <p className="max-w-[65ch]">{activitySummary(data)}</p>
            </MarginGrid>
          </div>
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

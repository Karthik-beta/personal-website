import { Quote } from "@/components/site/quote";
import { Recommendation } from "@/components/site/recommendation";
import { TimeRow } from "@/components/site/time-row";
import { Container } from "@/components/ui/container";
import { home, type When } from "@/content/home";
import { MarginGrid } from "./margin-grid";

function Range({ from, to }: { from: When; to?: When }) {
  return (
    <>
      <time dateTime={from[0]} className="whitespace-nowrap">
        {from[1]}
      </time>{" "}
      –{" "}
      {to ? (
        <time dateTime={to[0]} className="whitespace-nowrap">
          {to[1]}
        </time>
      ) : (
        "now"
      )}
    </>
  );
}

function Chapter({
  title,
  role,
  children,
}: {
  title: string;
  role?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid gap-4">
      <header className="grid gap-1">
        <h3 className="text-xl font-semibold stretch-title">{title}</h3>
        {role && <p className="text-sm text-muted">{role}</p>}
      </header>
      {children}
    </article>
  );
}

/** The story path: four dated chapters in the time margin. Facts only from the approved story. */
export function Chapters() {
  const { chapters } = home;
  return (
    <section aria-labelledby="story-title" className="pb-16 lg:pb-24">
      <Container className="grid gap-10 md:gap-14">
        <MarginGrid>
          <h2 id="story-title" className="text-2xl font-semibold stretch-heading">
            {chapters.title}
          </h2>
        </MarginGrid>

        {chapters.items.map((chapter) => (
          <TimeRow key={chapter.title} when={<Range from={chapter.from} to={chapter.to} />}>
            <Chapter title={chapter.title} role={chapter.role}>
              {chapter.blocks.map((block, index) =>
                typeof block === "string" ? (
                  <p key={index}>{block}</p>
                ) : "quote" in block ? (
                  <Quote key={index}>{block.quote}</Quote>
                ) : (
                  <Recommendation key={index} {...block.recommendation} />
                ),
              )}
            </Chapter>
          </TimeRow>
        ))}
      </Container>
    </section>
  );
}

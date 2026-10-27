import Image from "next/image";
import { Container } from "@/components/ui/container";
import { MarginGrid } from "./margin-grid";
import photo from "../../../assets/photo/karthik-parameshwara-square.jpg";

const details = [
  {
    label: "Languages",
    value: "English and Kannada (native), Hindi (fluent), some Telugu and Spanish",
  },
  {
    label: "At college",
    value:
      "Helped build and drove go-karts with the Volhester Racing Club, and played football for my college",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="pb-16 lg:pb-24">
      <Container>
        <MarginGrid className="border-t border-rule pt-10">
          <div className="grid gap-6">
            <h2 id="about-title" className="text-2xl font-semibold stretch-heading">
              About
            </h2>
            <div className="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
              <Image
                src={photo}
                alt="Karthik Parameshwara"
                sizes="(min-width: 640px) 160px, 128px"
                placeholder="blur"
                className="size-32 rounded-control sm:size-40"
              />
              <div className="grid max-w-[60ch] content-start gap-6">
                {/* TODO(karthik): About paragraph, written by Karthik. Replace this placeholder. */}
                <p className="rounded-control border border-dashed border-rule-strong p-4 text-sm text-muted">
                  Placeholder: Karthik&rsquo;s own About paragraph goes here.
                </p>
                <dl className="grid gap-3">
                  {details.map((item) => (
                    <div key={item.label} className="grid gap-0.5">
                      <dt className="text-xs text-muted">{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </MarginGrid>
      </Container>
    </section>
  );
}

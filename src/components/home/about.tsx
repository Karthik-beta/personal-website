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
                <p>
                  I started building in college, around 2020, because I wanted to earn some money:
                  first Fiesta Styles, a fashion dropshipping store on Wix, then a movies and shows
                  website on WordPress. That&rsquo;s when I found I liked building software, and my
                  marketing jobs had given me ideas I needed deeper technical knowledge to build.
                  Now I talk to users before I write code, keep designs simple, make them hard to
                  break, and stay with what I ship after launch. Outside work, I build side
                  projects, still play football and go running regularly.
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

import { About } from "@/components/home/about";
import { Chapters } from "@/components/home/chapters";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { Work } from "@/components/home/work";
import { JsonLd } from "@/components/site/json-ld";
import { homeStructuredData } from "@/lib/structured-data";

export default function Home() {
  return (
    <main id="content">
      <JsonLd data={homeStructuredData()} />
      <Hero />
      <Chapters />
      <Work />
      <About />
      <Contact />
    </main>
  );
}

import { About } from "@/components/home/about";
import { Chapters } from "@/components/home/chapters";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { PersonJsonLd } from "@/components/home/person-json-ld";
import { Work } from "@/components/home/work";

export default function Home() {
  return (
    <main id="content">
      <PersonJsonLd />
      <Hero />
      <Chapters />
      <Work />
      <About />
      <Contact />
    </main>
  );
}

import { About } from "@/components/home/about";
import { Chapters } from "@/components/home/chapters";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { Work } from "@/components/home/work";

export default function Home() {
  return (
    <main id="content">
      <Hero />
      <Chapters />
      <Work />
      <About />
      <Contact />
    </main>
  );
}

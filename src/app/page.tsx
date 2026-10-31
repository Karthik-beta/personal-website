import type { Metadata } from "next";
import { About } from "@/components/home/about";
import { Chapters } from "@/components/home/chapters";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { Work } from "@/components/home/work";
import { JsonLd } from "@/components/site/json-ld";
import { site } from "@/lib/site";
import { homeStructuredData } from "@/lib/structured-data";

// openGraph replaces the layout's object rather than merging, so repeat the shared fields.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_GB", siteName: site.name, url: "/" },
};

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

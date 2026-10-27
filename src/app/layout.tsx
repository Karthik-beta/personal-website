import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { Analytics } from "@/components/site/analytics";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SkipLink } from "@/components/site/skip-link";
import { site } from "@/lib/site";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: "/",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: site.x,
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#14171c" },
  ],
};

// Applies a stored theme choice before first paint, so there is no flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: Next.js turns smooth scrolling off while it changes page, so a link
    // from a case study to /#work jumps straight there instead of scrolling the whole home page.
    <html
      lang="en-GB"
      className={instrumentSans.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}

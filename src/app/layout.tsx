import type { Metadata } from "next";
import "./globals.css";

// Placeholder metadata. Real title, description, Open Graph and JSON-LD come in Phase 5.
export const metadata: Metadata = {
  title: "karthik.nz",
  description: "TODO(karthik): site description",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

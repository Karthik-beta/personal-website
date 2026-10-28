import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  monogramLetters,
  monogramRadius,
  monogramSide,
  monogramViewBox,
} from "@/components/site/monogram-paths";

// Link-preview images (docs/design/08-imagery-and-identity.md). Rendered at build time from
// the static font instances made by scripts/build-brand.py. Light theme tokens only.
export const ogSize = { width: 1200, height: 630 };

const colors = { paper: "#f5f6f8", band: "#e3e7f5", ink: "#15191f", muted: "#59626e" };

const asset = (path: string) => readFile(join(process.cwd(), "assets", path));

const [regular, semibold, narrow] = await Promise.all([
  asset("fonts/static/InstrumentSans-Regular.ttf"),
  asset("fonts/static/InstrumentSans-SemiBold.ttf"),
  asset("fonts/static/InstrumentSans-W78-SemiBold.ttf"),
]);

// The text-colour monogram, matching the nav's <Monogram tone="ink" />.
const monogramSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${monogramViewBox}"><rect width="${monogramSide}" height="${monogramSide}" rx="${monogramRadius}" fill="${colors.ink}"/><path fill="${colors.paper}" d="${monogramLetters}"/></svg>`;
const monogramSrc = `data:image/svg+xml;base64,${Buffer.from(monogramSvg).toString("base64")}`;

type OgImageProps = {
  /** The large narrowed line: the headline on home, the project title on a case study. */
  title: string;
  /** Optional line under the title, e.g. a case study's one-sentence summary. */
  summary?: string;
  /** Shown on the band at the bottom. */
  footer: string;
};

export function renderOgImage({ title, summary, footer }: OgImageProps) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: colors.paper,
        color: colors.ink,
        fontFamily: "Instrument Sans",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img src={monogramSrc} width={64} height={64} alt="" />
        <span style={{ fontSize: 32, fontWeight: 600 }}>Karthik Parameshwara</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span
          style={{
            fontFamily: "Instrument Sans Narrow",
            fontSize: summary ? 84 : 80,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: "-0.01em",
            textWrap: "balance",
            maxWidth: summary ? 1000 : 940,
          }}
        >
          {title}
        </span>
        {summary && (
          <span style={{ fontSize: 32, lineHeight: 1.4, color: colors.muted, maxWidth: 960 }}>
            {summary}
          </span>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 28,
            backgroundColor: colors.band,
            padding: "10px 18px",
            borderRadius: 10,
          }}
        >
          {footer}
        </span>
        <span style={{ fontSize: 28, color: colors.muted }}>karthik.nz</span>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Instrument Sans", data: regular, weight: 400, style: "normal" },
        { name: "Instrument Sans", data: semibold, weight: 600, style: "normal" },
        { name: "Instrument Sans Narrow", data: narrow, weight: 600, style: "normal" },
      ],
    },
  );
}

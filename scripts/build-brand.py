"""
Builds the brand assets from the real Instrument Sans font (docs/design/08-imagery-and-identity.md).

    python -I scripts/build-brand.py

Outputs (all regenerated; don't edit by hand):
  assets/fonts/static/*.ttf          exact static instances, used by the OG image route
  assets/brand/monogram*.svg         "KP" monogram, outlined (no font needed to display)
  assets/brand/monogram-512.png      raster for profile pictures
  src/app/icon.svg                   favicon (modern browsers)
  src/app/favicon.ico                16/32/48 px fallback
  src/app/apple-icon.png             180 px, iOS home screen
  src/components/site/monogram-paths.ts  path data for the <Monogram> component

Requires fontTools and Pillow.
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
VARIABLE = ROOT / "assets/fonts/InstrumentSans[wdth,wght].ttf"
STATIC = ROOT / "assets/fonts/static"
BRAND = ROOT / "assets/brand"
APP = ROOT / "src/app"

ACCENT = "#2c3fb8"
INK = "#15191f"
WHITE = "#ffffff"

# Static instances: name -> (width %, weight). W78 matches the site's headline width.
INSTANCES = {
    "InstrumentSans-W78-Bold": (78, 700),
    "InstrumentSans-W78-SemiBold": (78, 600),
    "InstrumentSans-Regular": (100, 400),
    "InstrumentSans-SemiBold": (100, 600),
}

CAP_RATIO = 0.46  # cap height as a share of the square
RADIUS_RATIO = 0.2  # corner radius as a share of the square
TRACKING = -0.02  # em


def build_instances():
    STATIC.mkdir(parents=True, exist_ok=True)
    for name, (width, weight) in INSTANCES.items():
        # recalcTimestamp=False keeps the output byte-identical between runs.
        source = TTFont(VARIABLE, recalcTimestamp=False)
        font = instantiateVariableFont(source, {"wdth": width, "wght": weight})
        font.save(STATIC / f"{name}.ttf")
    return STATIC / "InstrumentSans-W78-Bold.ttf"


def layout(font_path):
    """Positions K and P in font units inside a square, centred on ink and cap height."""
    font = TTFont(font_path)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    cap = font["OS/2"].sCapHeight
    side = cap / CAP_RATIO

    names = [cmap[ord(c)] for c in "KP"]
    pens, x = [], 0.0
    for i, name in enumerate(names):
        pens.append((name, x))
        x += glyphs[name].width + (TRACKING * upm if i == 0 else 0)

    bounds = BoundsPen(glyphs)
    for name, dx in pens:
        glyphs[name].draw(TransformPen(bounds, (1, 0, 0, 1, dx, 0)))
    x_min, _, x_max, _ = bounds.bounds
    offset_x = (side - (x_max - x_min)) / 2 - x_min
    baseline = (side + cap) / 2

    svg_pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    for name, dx in pens:
        # Font units are y-up; SVG is y-down.
        glyphs[name].draw(TransformPen(svg_pen, (1, 0, 0, -1, offset_x + dx, baseline)))
    return {"side": side, "path": svg_pen.getCommands()}


def svg(geo, letters, background=None, rounded=True):
    s = f"{geo['side']:.1f}".rstrip("0").rstrip(".")
    rx = f"{geo['side'] * RADIUS_RATIO:.1f}" if rounded else "0"
    rect = f'<rect width="{s}" height="{s}" rx="{rx}" fill="{background}"/>' if background else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {s} {s}">'
        f"{rect}<path fill=\"{letters}\" d=\"{geo['path']}\"/></svg>\n"
    )


def raster(font_path, px, rounded=True, cap_ratio=CAP_RATIO, supersample=8):
    """
    Renders the monogram with FreeType at `px` pixels. Tiny sizes use bigger letters and
    supersample=1, so the font's hinting snaps strokes to the pixel grid (sharper at 16 px).
    """
    font_file = TTFont(font_path)
    upm, cap = font_file["head"].unitsPerEm, font_file["OS/2"].sCapHeight
    size = px * supersample
    scale = size / (cap / cap_ratio)
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    radius = size * RADIUS_RATIO if rounded else 0
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=ACCENT)
    font = ImageFont.truetype(str(font_path), size=round(upm * scale))
    left, _, right, _ = draw.textbbox((0, 0), "KP", font=font, anchor="ls")
    x = (size - (right - left)) / 2 - left
    baseline = (size + cap * scale) / 2
    draw.text((round(x), round(baseline)), "KP", font=font, fill=WHITE, anchor="ls")
    return image if supersample == 1 else image.resize((px, px), Image.LANCZOS)


def write(path, text):
    """UTF-8 with LF line endings on every OS, so regenerating never creates a diff."""
    path.write_text(text, encoding="utf-8", newline="\n")


def main():
    bold = build_instances()
    geo = layout(bold)

    BRAND.mkdir(parents=True, exist_ok=True)
    write(BRAND / "monogram.svg", svg(geo, WHITE, ACCENT))
    write(BRAND / "monogram-ink.svg", svg(geo, INK))
    write(BRAND / "monogram-white.svg", svg(geo, WHITE))
    write(APP / "icon.svg", svg(geo, WHITE, ACCENT))

    raster(bold, 512).save(BRAND / "monogram-512.png", optimize=True)
    raster(bold, 180, rounded=False).convert("RGB").save(APP / "apple-icon.png", optimize=True)
    icons = [raster(bold, 48), raster(bold, 32), raster(bold, 16, cap_ratio=0.58, supersample=1)]
    icons[0].save(APP / "favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)], append_images=icons[1:])

    side = f"{geo['side']:.1f}".rstrip("0").rstrip(".")
    write(
        ROOT / "src/components/site/monogram-paths.ts",
        "// Generated by scripts/build-brand.py from Instrument Sans (wdth 78, wght 700). Don't edit.\n"
        f'export const monogramViewBox = "0 0 {side} {side}";\n'
        f"export const monogramSide = {side};\n"
        f"export const monogramRadius = {geo['side'] * RADIUS_RATIO:.1f};\n"
        f'export const monogramLetters =\n  "{geo["path"]}";\n',
    )
    print(f"Built brand assets (square {side} units).")


if __name__ == "__main__":
    main()

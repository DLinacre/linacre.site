#!/usr/bin/env python3
"""Generate the CyberBlue-Green visual assets used by linacre.site.

The output is deterministic, local, and uses only Pillow plus system fonts.
Run from the repository root with:
    python scripts/generate_brand_assets.py
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
FONT_MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

INK = (3, 12, 20)
NAVY = (5, 21, 32)
PANEL = (8, 28, 40)
CYAN = (34, 211, 238)
GREEN = (52, 211, 153)
TEXT = (236, 254, 255)
MUTED = (148, 184, 198)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def linear_gradient(size: tuple[int, int], left: tuple[int, int, int], right: tuple[int, int, int]) -> Image.Image:
    width, height = size
    strip = Image.new("RGB", (width, 1))
    pixels = strip.load()
    for x in range(width):
        pixels[x, 0] = mix(left, right, x / max(1, width - 1))
    return strip.resize((width, height))


def radial_glow(base: Image.Image, centre: tuple[int, int], colour: tuple[int, int, int], radius: int, opacity: int) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y = centre
    draw.ellipse((x - radius // 4, y - radius // 4, x + radius // 4, y + radius // 4), fill=(*colour, opacity))
    layer = layer.filter(ImageFilter.GaussianBlur(radius // 3))
    base.alpha_composite(layer)


def gradient_fill(size: tuple[int, int]) -> Image.Image:
    return linear_gradient(size, CYAN, GREEN).convert("RGBA")


def gradient_stroke(base: Image.Image, points: Iterable[tuple[int, int]], width: int = 5, glow: int = 18) -> None:
    mask = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(mask)
    pts = list(points)
    draw.line(pts + [pts[0]], fill=255, width=width, joint="curve")
    grad = gradient_fill(base.size)

    glow_mask = mask.filter(ImageFilter.GaussianBlur(glow))
    glow_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    glow_layer.paste(grad, (0, 0), glow_mask.point(lambda p: p * 90 // 255))
    base.alpha_composite(glow_layer)

    line_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    line_layer.paste(grad, (0, 0), mask)
    base.alpha_composite(line_layer)


def draw_grid(base: Image.Image, spacing: int = 48, alpha: int = 20) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for x in range(0, base.width, spacing):
        draw.line((x, 0, x, base.height), fill=(*CYAN, alpha), width=1)
    for y in range(0, base.height, spacing):
        draw.line((0, y, base.width, y), fill=(*GREEN, alpha), width=1)
    base.alpha_composite(layer)


def draw_circuit(base: Image.Image, y: int, offset: int = 0, alpha: int = 80) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    points = [(-30, y), (130 + offset, y), (170 + offset, y - 34), (315 + offset, y - 34), (355 + offset, y)]
    draw.line(points, fill=(*CYAN, alpha), width=2, joint="curve")
    for x, py in points[1:-1]:
        draw.ellipse((x - 4, py - 4, x + 4, py + 4), fill=(*GREEN, alpha + 30))
    base.alpha_composite(layer)


def draw_logo(base: Image.Image, box: tuple[int, int, int, int], letters: str = "DL") -> None:
    x0, y0, x1, y1 = box
    width, height = x1 - x0, y1 - y0
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(box, radius=min(width, height) // 5, fill=(*PANEL, 225), outline=(*CYAN, 48), width=1)
    base.alpha_composite(layer)

    inset = min(width, height) * 0.16
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    rx, ry = width / 2 - inset, height / 2 - inset
    points = [
        (round(cx), round(cy - ry)),
        (round(cx + rx * 0.88), round(cy - ry * 0.5)),
        (round(cx + rx * 0.88), round(cy + ry * 0.5)),
        (round(cx), round(cy + ry)),
        (round(cx - rx * 0.88), round(cy + ry * 0.5)),
        (round(cx - rx * 0.88), round(cy - ry * 0.5)),
    ]
    gradient_stroke(base, points, width=max(3, width // 45), glow=max(8, width // 15))

    draw = ImageDraw.Draw(base)
    logo_font = font(FONT_BOLD, max(22, width // 3))
    bbox = draw.textbbox((0, 0), letters, font=logo_font)
    tx = cx - (bbox[2] - bbox[0]) / 2
    ty = cy - (bbox[3] - bbox[1]) / 2 - bbox[1]
    draw.text((tx, ty), letters, font=logo_font, fill=TEXT)


def chip(draw: ImageDraw.ImageDraw, xy: tuple[int, int], label: str) -> int:
    x, y = xy
    f = font(FONT_MONO_BOLD, 15)
    bbox = draw.textbbox((0, 0), label, font=f)
    w = bbox[2] - bbox[0] + 28
    draw.rounded_rectangle((x, y, x + w, y + 30), radius=15, fill=(7, 33, 46, 225), outline=(*CYAN, 85), width=1)
    draw.text((x + 14, y + 6), label, font=f, fill=MUTED)
    return w


def make_banner() -> Image.Image:
    size = (1280, 360)
    image = linear_gradient(size, INK, NAVY).convert("RGBA")
    radial_glow(image, (165, 210), CYAN, 360, 150)
    radial_glow(image, (1120, 90), GREEN, 390, 105)
    draw_grid(image, 48, 18)
    draw_circuit(image, 320, 620, 54)
    draw_circuit(image, 56, 880, 42)
    draw_logo(image, (58, 64, 290, 296))

    draw = ImageDraw.Draw(image)
    draw.text((342, 64), "CYBERBLUE / OPEN SOURCE", font=font(FONT_MONO_BOLD, 16), fill=GREEN)
    draw.text((338, 91), "linacre.site", font=font(FONT_BOLD, 58), fill=TEXT)
    draw.text((342, 164), "Useful software. Clear systems. Built to ship.", font=font(FONT_REGULAR, 25), fill=MUTED)

    x = 342
    for label in ("WEB TOOLS", "ANDROID", "AI SYSTEMS", "DEVOPS"):
        x += chip(draw, (x, 214), label) + 10

    draw.text((342, 278), "github.com/DLinacre", font=font(FONT_MONO, 16), fill=(105, 151, 167))
    draw.ellipse((1092, 289, 1102, 299), fill=GREEN)
    draw.text((1112, 285), "SYSTEM ONLINE", font=font(FONT_MONO_BOLD, 14), fill=GREEN)
    return image.convert("RGB")


def make_og() -> Image.Image:
    size = (1200, 630)
    image = linear_gradient(size, INK, (5, 27, 40)).convert("RGBA")
    radial_glow(image, (185, 350), CYAN, 520, 150)
    radial_glow(image, (1050, 110), GREEN, 520, 120)
    draw_grid(image, 54, 18)
    draw_circuit(image, 570, 650, 55)
    draw_logo(image, (74, 136, 394, 456))

    draw = ImageDraw.Draw(image)
    draw.text((462, 145), "LINACRE / USEFUL SOFTWARE", font=font(FONT_MONO_BOLD, 18), fill=GREEN)
    draw.text((454, 183), "Build less noise.", font=font(FONT_BOLD, 56), fill=TEXT)
    draw.text((454, 247), "Ship more value.", font=font(FONT_BOLD, 56), fill=TEXT)
    draw.text((462, 331), "Private browser tools, polished open-source apps,", font=font(FONT_REGULAR, 23), fill=MUTED)
    draw.text((462, 365), "and engineering systems built for real use.", font=font(FONT_REGULAR, 23), fill=MUTED)
    draw.rounded_rectangle((462, 425, 744, 469), radius=22, fill=(7, 35, 48, 235), outline=(*CYAN, 100), width=1)
    draw.text((484, 436), "www.linacre.site", font=font(FONT_MONO_BOLD, 17), fill=CYAN)
    draw.ellipse((1010, 557, 1022, 569), fill=GREEN)
    draw.text((1035, 552), "CYBERBLUE v6", font=font(FONT_MONO_BOLD, 15), fill=GREEN)
    return image.convert("RGB")


def make_icon(size: int) -> Image.Image:
    scale = max(1, size // 128)
    image = linear_gradient((size, size), INK, NAVY).convert("RGBA")
    radial_glow(image, (size // 3, size // 2), CYAN, size, 150)
    inset = round(size * 0.08)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((inset, inset, size - inset, size - inset), radius=round(size * 0.22), fill=(*PANEL, 235), outline=(*CYAN, 70), width=max(1, 2 * scale))
    draw_logo(image, (round(size * 0.12), round(size * 0.12), round(size * 0.88), round(size * 0.88)), "DL")
    return image.convert("RGB")


def write_favicon_svg() -> None:
    content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#22d3ee"/><stop offset="1" stop-color="#34d399"/></linearGradient></defs>
  <rect width="64" height="64" rx="15" fill="#061019"/>
  <path d="M32 7 53 19v26L32 57 11 45V19Z" fill="none" stroke="url(#g)" stroke-width="3.5"/>
  <text x="32" y="39" text-anchor="middle" font-family="system-ui,sans-serif" font-size="19" font-weight="800" fill="#ecfeff">DL</text>
</svg>\n"""
    (ROOT / "public" / "favicon.svg").write_text(content, encoding="utf-8")


def main() -> None:
    (ROOT / ".github").mkdir(exist_ok=True)
    (ROOT / "public").mkdir(exist_ok=True)
    make_banner().save(ROOT / ".github" / "banner.png", quality=95, optimize=True)
    make_og().save(ROOT / "public" / "og.png", quality=94, optimize=True)
    icon_192 = make_icon(192)
    icon_512 = make_icon(512)
    icon_192.save(ROOT / "public" / "icon-192.png", optimize=True)
    icon_512.save(ROOT / "public" / "icon-512.png", optimize=True)
    icon_192.save(ROOT / "public" / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    write_favicon_svg()
    print("Generated CyberBlue-Green banner, OG image, app icons, and favicons.")


if __name__ == "__main__":
    main()

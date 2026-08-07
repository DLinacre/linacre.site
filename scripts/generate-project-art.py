#!/usr/bin/env python3
"""Generate consistent project-card artwork for linacre.site.

Creates one branded SVG per remaining project in public/projects/.
Shared language: deep-ink background, soft glow blobs, fine stroke motifs
in amber (#f0ab3c) / teal (#58d5c9) / violet (#a78bfa) — matching the
AI-rendered banners in the same folder.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "projects")
W, H = 1200, 630

AMBER = "#f0ab3c"
TEAL = "#58d5c9"
VIOLET = "#a78bfa"
PINK = "#f472b6"
INK = "#0a0e15"
LINE = "#22384a"

def head(scene_id):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Project artwork — {scene_id}">
  <defs>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="{AMBER}" stop-opacity=".15"/>
      <stop offset="100%" stop-color="{AMBER}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowT" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="{TEAL}" stop-opacity=".12"/>
      <stop offset="100%" stop-color="{TEAL}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hairline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="{AMBER}" stop-opacity="0"/>
      <stop offset="50%" stop-color="{TEAL}" stop-opacity=".8"/>
      <stop offset="100%" stop-color="{AMBER}" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <g id="grid"><path d="M0 0H{W}M0 0V{H}" stroke="{LINE}" stroke-opacity=".35" stroke-width="1"/></g>
  </defs>
  <rect width="{W}" height="{H}" fill="{INK}"/>
  <g stroke="{LINE}" stroke-opacity=".28" stroke-width="1">
    {"".join(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>' for x in range(150, W, 150))}
    {"".join(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>' for y in range(150, H, 150))}
  </g>'''

def tail():
    return f'  <rect x="120" y="578" width="960" height="2" fill="url(#hairline)"/>\n</svg>\n'

def glow(x, y, r, kind="A"):
    return f'  <circle cx="{x}" cy="{y}" r="{r}" fill="url(#glow{kind})"/>\n'

def motif(body):
    return ("<g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\">\n"
            + body + "</g>\n")

# ---------------------------------------------------------------- scenes
def omniroute():
    s = glow(600, 315, 300, "T") + glow(300, 200, 180)
    nodes = [(600,160),(840,300),(600,470),(360,300),(600,315)]
    b = ""
    for (x,y) in nodes[:4]:
        b += f'<path d="M600 315 Q {(600+x)/2:.0f} {(315+y)/2 - 40:.0f} {x} {y}" stroke="{TEAL}" stroke-width="2.5" stroke-dasharray="1 9" opacity=".85"/>'
    for (x,y) in nodes[:4]:
        b += f'<circle cx="{x}" cy="{y}" r="34" stroke="{TEAL}" stroke-width="3.5"/><circle cx="{x}" cy="{y}" r="12" stroke="{TEAL}" stroke-width="3" opacity=".55"/>'
    b += f'<circle cx="600" cy="315" r="56" stroke="{AMBER}" stroke-width="4.5"/><circle cx="600" cy="315" r="34" stroke="{AMBER}" stroke-width="3" stroke-dasharray="6 8"/>'
    b += f'<path d="M586 315h28M600 301v28" stroke="{AMBER}" stroke-width="4"/>'
    b += f'<path d="M470 200 a180 180 0 0 1 260 0" stroke="{VIOLET}" stroke-width="2.5" opacity=".7"/>'
    b += f'<path d="M452 240 a205 205 0 0 1 296 0" stroke="{VIOLET}" stroke-width="2" opacity=".4"/>'
    return s + motif(b)

def pokeguru():
    s = glow(420, 300, 260) + glow(850, 260, 200, "T")
    cells = ""
    for r in range(2):
        for c in range(4):
            x, y = 240 + c*150, 190 + r*160
            cells += f'<rect x="{x}" y="{y}" width="104" height="140" rx="12" stroke="{LINE}" stroke-width="2.5" opacity=".9"/>'
    hi_x, hi_y = 240 + 2*150, 190 + 0*160
    cells += f'<rect x="{hi_x}" y="{hi_y}" width="104" height="140" rx="12" stroke="{AMBER}" stroke-width="4" transform="translate(8 -18) rotate(3 {hi_x+52} {hi_y+70})"/>'
    cells += f'<circle cx="{hi_x+52}" cy="{hi_y+52}" r="20" stroke="{TEAL}" stroke-width="3" transform="translate(8 -18) rotate(3 {hi_x+52} {hi_y+70})"/>'
    cells += f'<path d="M{hi_x+30} {hi_y+96} h44 M{hi_x+30} {hi_y+112} h28" stroke="{TEAL}" stroke-width="3" opacity=".6" transform="translate(8 -18) rotate(3 {hi_x+52} {hi_y+70})"/>'
    b = cells
    b += f'<circle cx="918" cy="212" r="72" stroke="{TEAL}" stroke-width="5"/><path d="M968 262 l74 74" stroke="{TEAL}" stroke-width="7"/>'
    b += f'<path d="M884 192 l10 8 M894 176 l12 6" stroke="{AMBER}" stroke-width="4"/>'
    for (x,y) in [(330,120),(820,420),(180,420)]:
        b += f'<path d="M{x} {y} l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" stroke="{AMBER}" stroke-width="3" opacity=".8"/>'
    return s + motif(b)

def apexpos():
    s = glow(560, 330, 280, "A") + glow(880, 220, 180, "T")
    b = f'<rect x="360" y="250" width="360" height="220" rx="22" stroke="{AMBER}" stroke-width="4.5"/>'
    b += f'<rect x="392" y="286" width="180" height="60" rx="10" stroke="{TEAL}" stroke-width="3.5"/>'
    b += f'<path d="M404 316 h156" stroke="{TEAL}" stroke-width="3" stroke-dasharray="10 8" opacity=".7"/>'
    for r in range(2):
        for c in range(4):
            b += f'<rect x="{392+c*44}" y="{366+r*44}" width="34" height="34" rx="8" stroke="{AMBER}" stroke-width="2.5" opacity=".8"/>'
    b += f'<rect x="596" y="366" width="92" height="80" rx="10" stroke="{TEAL}" stroke-width="3"/>'
    b += f'<path d="M608 390 h68 M608 410 h48" stroke="{TEAL}" stroke-width="3" opacity=".6"/>'
    b += f'<rect x="620" y="196" width="52" height="54" rx="8" stroke="{VIOLET}" stroke-width="3"/><path d="M628 212h36M628 226h24" stroke="{VIOLET}" stroke-width="2.5" opacity=".7"/>'
    for (x,y,r) in [(800,450,26),(852,458,22),(892,442,18)]:
        b += f'<circle cx="{x}" cy="{y}" r="{r}" stroke="{AMBER}" stroke-width="3.5"/>'
        b += f'<path d="M{x} {y-r+8} v{r*2-16} M{x-r+8} {y} h{r*2-16}" stroke="{AMBER}" stroke-width="2.5" opacity=".55"/>'
    return s + motif(b)

def mobdeals():
    s = glow(430, 300, 260, "T") + glow(830, 320, 200)
    b = f'<rect x="330" y="170" width="180" height="240" rx="26" stroke="{TEAL}" stroke-width="4.5"/>'
    b += f'<path d="M330 236 h180 M330 344 h180" stroke="{TEAL}" stroke-width="2.5" opacity=".55"/>'
    b += f'<path d="M398 170 v66 M398 344 v66" stroke="{TEAL}" stroke-width="2.5" opacity=".55"/>'
    b += f'<rect x="352" y="256" width="50" height="68" rx="6" stroke="{AMBER}" stroke-width="3"/>'
    for i in range(4):
        h = 22 + i*16
        b += f'<rect x="{566+i*34}" y="{360-h}" width="20" height="{h}" rx="5" stroke="{AMBER}" stroke-width="3" fill="{AMBER}" fill-opacity="{0.12+0.1*i}" />'
    b += f'<path d="M700 240 v120 M660 300 h80" stroke="{VIOLET}" stroke-width="4"/>'
    b += f'<path d="M700 240 l-70 60 M700 240 l70 60" stroke="{VIOLET}" stroke-width="3.5"/>'
    b += f'<path d="M614 330 h32 M754 330 h32" stroke="{VIOLET}" stroke-width="3.5"/>'
    b += f'<path d="M630 300 v14 a16 16 0 0 0 32 0 v-14 M770 300 v14 a16 16 0 0 0 -32 0 v-14" stroke="{VIOLET}" stroke-width="3.5"/>'
    return s + motif(b)

def dkma():
    s = glow(600, 320, 300, "A") + glow(330, 250, 180, "T")
    b = ""
    cx, cy, R = 600, 320, 120
    teeth = 10
    import math
    for i in range(teeth):
        a = i*2*math.pi/teeth
        x1, y1 = cx+R*math.cos(a), cy+R*math.sin(a)
        x2, y2 = cx+(R+34)*math.cos(a), cy+(R+34)*math.sin(a)
        b += f'<path d="M{x1:.0f} {y1:.0f} L{x2:.0f} {y2:.0f}" stroke="{AMBER}" stroke-width="14"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="{R}" stroke="{AMBER}" stroke-width="4.5"/>'
    b += f'<path d="M{cx} {cy-46} l-26 58 h20 l-14 50 52-66 h-22 l16-42z" stroke="{TEAL}" stroke-width="4.5"/>'
    b += f'<path d="M{cx-58} {cy-126} c-30-34-72-30-84 2 24-4 44 6 52 26M{cx+58} {cy-126} c30-34 72-30 84 2-24-4-44 6-52 26" stroke="{PINK}" stroke-width="4" opacity=".85"/>'
    b += f'<circle cx="{cx-34}" cy="{cy-64}" r="7" fill="{TEAL}" stroke="none"/><circle cx="{cx+34}" cy="{cy-64}" r="7" fill="{TEAL}" stroke="none"/>'
    b += f'<path d="M392 440 l64 64 M456 440 l-64 64" stroke="{TEAL}" stroke-width="5" opacity=".7" transform="translate(196 0)"/>'
    b += f'<path d="M330 500 h84 l14-20 h-112z" stroke="{TEAL}" stroke-width="4" transform="translate(320 -16)"/>'
    b += f'<rect x="268" y="232" width="76" height="130" rx="14" stroke="{TEAL}" stroke-width="4"/><path d="M288 232 v-14 h36 v14" stroke="{TEAL}" stroke-width="4"/>'
    b += f'<path d="M290 292 h32 M290 322 h32" stroke="{TEAL}" stroke-width="4" opacity=".6"/>'
    return s + motif(b)

def uninstaller():
    s = glow(560, 330, 280, "T") + glow(300, 220, 170)
    b = f'<path d="M470 250 h180 l-22 230 a18 18 0 0 1 -18 16 h-80 a18 18 0 0 1 -18 -16z" stroke="{AMBER}" stroke-width="4.5"/>'
    b += f'<path d="M442 250 h216 M536 250 v-30 a18 18 0 0 1 18 -18 h32 a18 18 0 0 1 18 18 v30" stroke="{AMBER}" stroke-width="4.5"/>'
    for dx in (0, 38, 76):
        b += f'<path d="M{536+dx} 286 v160" stroke="{AMBER}" stroke-width="3.5" opacity=".65"/>'
    spots = [(772,236,-8),(812,300,6),(762,366,-5),(824,432,8),(700,480,-7)]
    for i,(x,y,r) in enumerate(spots):
        col = [TEAL, VIOLET, PINK, TEAL, AMBER][i]
        b += f'<rect x="{x-20}" y="{y-20}" width="40" height="40" rx="10" stroke="{col}" stroke-width="3.5" transform="rotate({r} {x} {y})" opacity="{0.95-0.12*i}"/>'
    b += f'<path d="M330 380 l42 42 84-88" stroke="{TEAL}" stroke-width="7"/>'
    return s + motif(b)

def llmhub():
    s = glow(600, 330, 300, "T") + glow(320, 240, 190)
    b = f'<rect x="260" y="170" width="680" height="330" rx="20" stroke="{LINE}" stroke-width="3"/>'
    heights = [120, 190, 100, 220, 160, 250]
    for i,hh in enumerate(heights):
        x = 320 + i*72
        col = TEAL if i % 2 else AMBER
        b += f'<rect x="{x}" y="{440-hh}" width="40" height="{hh}" rx="8" stroke="{col}" stroke-width="3" fill="{col}" fill-opacity=".10"/>'
    b += f'<path d="M600 430 h320" stroke="{LINE}" stroke-width="2.5"/>'
    b += ""
    pts = [(620,392),(690,360),(760,376),(830,330),(900,344)]
    d = "M" + " L".join(f"{x} {y}" for x,y in pts)
    b += f'<path d="{d}" stroke="{VIOLET}" stroke-width="4.5"/>'
    for x,y in pts: b += f'<circle cx="{x}" cy="{y}" r="7" stroke="{VIOLET}" stroke-width="4"/>'
    cx, cy = 830, 268
    import math
    b += f'<circle cx="{cx}" cy="{cy}" r="52" stroke="{LINE}" stroke-width="3"/>'
    b += f'<path d="M{cx-37} {cy+37} a52 52 0 0 1 74 0" stroke="{LINE}" stroke-width="3"/>'
    b += f'<path d="M{cx} {cy} l26 {-30}" stroke="{AMBER}" stroke-width="5"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="8" stroke="{AMBER}" stroke-width="4"/>'
    return s + motif(b)

def kushcloud():
    s = glow(480, 330, 280, "T") + glow(820, 240, 200)
    b = f'<path d="M360 380 a64 64 0 1 1 20 -125 a78 78 0 0 1 128 -26 a60 60 0 1 1 28 151 z" stroke="{TEAL}" stroke-width="4.5"/>'
    b += f'<circle cx="434" cy="330" r="8" fill="{TEAL}" stroke="none"/><circle cx="494" cy="330" r="8" fill="{TEAL}" stroke="none"/>'
    b += f'<path d="M446 360 q20 18 44 0" stroke="{TEAL}" stroke-width="4" fill="none"/>'
    b += f'<path d="M356 452 q60 36 160 20" stroke="{AMBER}" stroke-width="3.5" stroke-dasharray="2 10"/>'
    stars = [(700,220),(790,300),(880,200),(760,420),(660,330)]
    for i,(x,y) in enumerate(stars):
        col = AMBER if i%2==0 else VIOLET
        s2 = 12 + (i%3)*4
        b += f'<path d="M{x} {y-s2} l{s2*.28:.0f} {s2*.72:.0f} h{s2*.8:.0f} l-{s2*.5:.0f} {s2*.5:.0f} l{s2*.18:.0f} {s2*.8:.0f} -{s2:.0f} -{s2:.0f} l{s2*.18:.0f} -{s2*.8:.0f} -{s2*.5:.0f} -{s2*.5:.0f} h{s2*.8:.0f} z" stroke="{col}" stroke-width="3" opacity=".85"/>'
    b += f'<path d="M640 500 q140 -60 300 -20" stroke="{PINK}" stroke-width="4" opacity=".8"/>'
    b += f'<path d="M900 470 l40 10 -12 38z" stroke="{PINK}" stroke-width="4" opacity=".8"/>'
    return s + motif(b)

def myhub():
    s = glow(600, 320, 300, "A") + glow(330, 260, 170, "T")
    b = ""
    stages = [("build", 300), ("test", 500), ("deploy", 700)]
    for name,x in stages:
        b += f'<circle cx="{x}" cy="315" r="58" stroke="{AMBER}" stroke-width="4.5"/>'
    b += f'<path d="M358 315 h84 M558 315 h84" stroke="{TEAL}" stroke-width="5"/>'
    b += f'<path d="M430 315 l-14 -12 v24 z M630 315 l-14 -12 v24 z" fill="{TEAL}" stroke="none"/>'
    b += f'<path d="M284 300 l12 12 22-24 M484 300 l12 12 22-24 M684 300 l12 12 22-24" stroke="{TEAL}" stroke-width="5"/>'
    b += f'<path d="M300 373 v28 M500 373 v28 M700 373 v28" stroke="{LINE}" stroke-width="3"/>'
    b += f'<rect x="252" y="430" width="96" height="44" rx="12" stroke="{TEAL}" stroke-width="3"/>'
    b += f'<rect x="452" y="430" width="96" height="44" rx="12" stroke="{TEAL}" stroke-width="3"/>'
    b += f'<rect x="652" y="430" width="96" height="44" rx="12" stroke="{TEAL}" stroke-width="3"/>'
    import math
    for (cx2,cy2) in [(900,250),(920,420)]:
        R2 = 40
        for i in range(8):
            a = i*math.pi/4
            b += f'<path d="M{cx2+R2*math.cos(a):.0f} {cy2+R2*math.sin(a):.0f} L{cx2+(R2+14)*math.cos(a):.0f} {cy2+(R2+14)*math.sin(a):.0f}" stroke="{VIOLET}" stroke-width="9"/>'
        b += f'<circle cx="{cx2}" cy="{cy2}" r="{R2}" stroke="{VIOLET}" stroke-width="3.5"/><circle cx="{cx2}" cy="{cy2}" r="14" stroke="{VIOLET}" stroke-width="3.5"/>'
    return s + motif(b)

def payhip():
    s = glow(500, 330, 280) + glow(840, 250, 190, "T")
    b = f'<path d="M300 260 h320 l-24 60 h-272z" stroke="{AMBER}" stroke-width="4.5"/>'
    b += f'<path d="M324 320 v150 a16 16 0 0 0 16 16 h240 a16 16 0 0 0 16 -16 v-150" stroke="{AMBER}" stroke-width="4.5"/>'
    b += f'<path d="M340 260 v-40 a20 20 0 0 1 20 -20 h200 a20 20 0 0 1 20 20 v40" stroke="{AMBER}" stroke-width="4"/>'
    b += f'<rect x="392" y="360" width="136" height="126" rx="10" stroke="{TEAL}" stroke-width="3.5"/>'
    b += f'<path d="M432 486 v-80 h56 v80" stroke="{TEAL}" stroke-width="3.5"/>'
    b += f'<circle cx="852" cy="258" r="64" stroke="{TEAL}" stroke-width="5"/>'
    b += f'<path d="M898 304 l66 66" stroke="{TEAL}" stroke-width="7"/>'
    b += f'<path d="M822 258 h60 M852 228 v60" stroke="{TEAL}" stroke-width="3.5" opacity=".5"/>'
    b += f'<path d="M880 420 q40 30 98 22 M872 456 q48 34 112 20" stroke="{VIOLET}" stroke-width="3.5" opacity=".75"/>'
    b += f'<path d="M980 440 l22 6 -16 18z M984 474 l20 4 -14 16z" stroke="{VIOLET}" stroke-width="3" opacity=".75"/>'
    return s + motif(b)

def deasy():
    s = glow(600, 320, 300, "T") + glow(330, 250, 180)
    b = f'<rect x="280" y="190" width="640" height="360" rx="18" stroke="{TEAL}" stroke-width="4.5"/>'
    b += f'<path d="M280 240 h640" stroke="{TEAL}" stroke-width="3.5"/>'
    b += f'<circle cx="318" cy="215" r="7" stroke="{PINK}" stroke-width="3"/><circle cx="344" cy="215" r="7" stroke="{AMBER}" stroke-width="3"/><circle cx="370" cy="215" r="7" stroke="{TEAL}" stroke-width="3"/>'
    b += f'<path d="M318 292 l44 26 -44 26 M392 344 h64" stroke="{AMBER}" stroke-width="5"/>'
    tog_y = 300
    for i,(x) in enumerate([608, 700, 792]):
        on = i != 1
        col = TEAL if on else LINE
        b += f'<rect x="{x}" y="{tog_y}" width="64" height="34" rx="17" stroke="{col}" stroke-width="3.5"/>'
        cx2 = x + (44 if on else 20)
        b += f'<circle cx="{cx2}" cy="{tog_y+17}" r="10" fill="{col}" stroke="none" opacity="{".9" if on else ".5"}"/>'
    b += f'<path d="M318 420 h260 M318 452 h190 M318 484 h228" stroke="{LINE}" stroke-width="4"/>'
    b += f'<path d="M600 420 h120 M600 452 h88 M600 484 h140" stroke="{VIOLET}" stroke-width="4" opacity=".8"/>'
    return s + motif(b)

def evbot():
    s = glow(430, 320, 280, "T") + glow(830, 300, 200)
    import math
    b = f'<circle cx="300" cy="315" r="64" stroke="{TEAL}" stroke-width="4.5"/>'
    b += f'<path d="M300 283 v-22 M282 296 l-16-16 M318 296 l16-16" stroke="{TEAL}" stroke-width="4.5"/>'
    points = []
    for x in range(392, 640, 8):
        amp = 34 * math.sin((x-392)/248*math.pi)
        y = 315 + amp * math.sin((x-392)/16)
        points.append((x, round(y)))
    d = "M" + " L".join(f"{x} {y}" for x,y in points)
    b += f'<path d="{d}" stroke="{AMBER}" stroke-width="4.5"/>'
    kb_x, kb_y = 668, 240
    for r in range(3):
        for c in range(4):
            b += f'<rect x="{kb_x+c*62}" y="{kb_y+r*56}" width="52" height="46" rx="10" stroke="{VIOLET}" stroke-width="3" opacity="{0.95 - 0.18*r}"/>'
    b += f'<path d="M{kb_x+26} {kb_y+38} c10-14 26-14 36-2 M{kb_x+88} {kb_y+94} c8-12 22-12 32-2" stroke="{TEAL}" stroke-width="3.5" opacity=".8"/>'
    b += f'<path d="M232 262 a74 74 0 0 1 44 106 M368 262 a74 74 0 0 0 -44 106" stroke="{PINK}" stroke-width="3.5" opacity=".8" stroke-dasharray="3 8"/>'
    return s + motif(b)

SCENES = {
    "omniroute": omniroute(),
    "pokeguru": pokeguru(),
    "apex-pos": apexpos(),
    "mob-deals": mobdeals(),
    "dkma-monster": dkma(),
    "linacre-uninstaller": uninstaller(),
    "llm-hub": llmhub(),
    "kushcloud": kushcloud(),
    "myhub-pipeline": myhub(),
    "payhip-scraper": payhip(),
    "deasy": deasy(),
    "ev-bot": evbot(),
}

os.makedirs(OUT, exist_ok=True)
for name, body in SCENES.items():
    path = os.path.join(OUT, name + ".svg")
    with open(path, "w") as f:
        f.write(head(name) + body + tail())
    print("wrote", path, os.path.getsize(path), "bytes")

/**
 * Emblem Lab — a free, fully in-browser generative emblem engine.
 *
 * Deterministic seeded generation ("AI-style" unique marks with zero API
 * keys, zero cost, zero uploads). The same key string always produces the
 * same emblem, which makes keys safe to persist in localStorage, share via
 * theme links, and reuse across sessions and devices.
 *
 * Frame key format: gen:<family>:<symmetry>:<complexity>:<word>
 *   - family     one of GEN_FAMILIES ids, or 'mix' (chosen by hash of word)
 *   - symmetry   2..8 rotational/reflection order
 *   - complexity 1..10 detail density
 *   - word       free-text seed (letters, numbers, anything except ':')
 */

export type GenFamilyId =
  | 'prism'
  | 'sigil'
  | 'circuit'
  | 'orbit'
  | 'woven'
  | 'wave'
  | 'glyph'
  | 'array'
  | 'mix';

export interface GenConfig {
  family: GenFamilyId;
  symmetry: number;
  complexity: number;
  word: string;
}

export const GEN_PREFIX = 'gen:';

export const GEN_FAMILIES: ReadonlyArray<{ id: Exclude<GenFamilyId, 'mix'>; name: string; blurb: string }> = [
  { id: 'prism', name: 'Prism Core', blurb: 'Faceted polygon star with a gradient heart' },
  { id: 'sigil', name: 'Mirror Sigil', blurb: 'Rune-like shards reflected on an axis' },
  { id: 'circuit', name: 'Circuit Trace', blurb: 'PCB spokes with pads and vias' },
  { id: 'orbit', name: 'Orbital', blurb: 'Rings, arcs and satellites around a nucleus' },
  { id: 'woven', name: 'Woven Star', blurb: 'Star-polygon weave, engineered symmetry' },
  { id: 'wave', name: 'Signal Wave', blurb: 'Mirrored sound-signature arcs' },
  { id: 'glyph', name: 'Glyph Tile', blurb: 'Compact abstract monogram blocks' },
  { id: 'array', name: 'Dot Array', blurb: 'Symmetric pixel constellation' },
];

const FAMILY_IDS = GEN_FAMILIES.map((f) => f.id);

/* ── Deterministic randomness ─────────────────────────────────────────── */

function xfnv1a(text: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Rng {
  private nextFn: () => number;
  constructor(seedText: string) {
    this.nextFn = mulberry32(xfnv1a(seedText));
  }
  f(): number {
    return this.nextFn();
  }
  range(min: number, max: number): number {
    return min + (max - min) * this.f();
  }
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
  pick<T>(list: T[]): T {
    return list[Math.floor(this.f() * list.length)];
  }
  chance(probability: number): boolean {
    return this.f() < probability;
  }
}

/* ── Key helpers ──────────────────────────────────────────────────────── */

function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function sanitizeWord(word: string): string {
  return word.replace(/[:`]/g, ' ').replace(/\s+/g, '-').trim().slice(0, 32) || 'linacre';
}

export function isGenFrame(frame: string): boolean {
  return frame.startsWith(GEN_PREFIX);
}

export function makeGenKey(config: GenConfig): string {
  const family = config.family === 'mix' ? 'mix' : (FAMILY_IDS.includes(config.family as never) ? config.family : 'sigil');
  return `${GEN_PREFIX}${family}:${clampInt(config.symmetry, 2, 8)}:${clampInt(config.complexity, 1, 10)}:${sanitizeWord(config.word)}`;
}

export function parseGenKey(key: string): GenConfig {
  const parts = key.slice(GEN_PREFIX.length).split(':');
  const familyRaw = (parts[0] || 'mix') as GenFamilyId;
  const family: GenFamilyId = familyRaw === 'mix' || FAMILY_IDS.includes(familyRaw as never) ? familyRaw : 'mix';
  return {
    family,
    symmetry: clampInt(parseInt(parts[1] || '4', 10), 2, 8),
    complexity: clampInt(parseInt(parts[2] || '5', 10), 1, 10),
    word: sanitizeWord(parts.slice(3).join(':') || 'linacre'),
  };
}

const WORD_A = ['volt', 'neon', 'drift', 'ember', 'zero', 'pixel', 'quantum', 'ghost', 'rapid', 'silent', 'prime', 'hyper', 'lunar', 'solar', 'iron', 'aqua', 'ion', 'onyx', 'flux', 'apex'];
const WORD_B = ['lynx', 'falcon', 'vector', 'signal', 'cipher', 'orbit', 'node', 'spark', 'forge', 'atlas', 'rook', 'delta', 'comet', 'relay', 'haven', 'circuit', 'ember', 'prism', 'surge', 'ward'];

/** Random readable seed word, e.g. "volt-lynx-42". Pass Math.random or any PRF. */
export function randomSeedWord(rand: () => number = Math.random): string {
  const a = WORD_A[Math.floor(rand() * WORD_A.length)];
  const b = WORD_B[Math.floor(rand() * WORD_B.length)];
  const n = Math.floor(rand() * 90) + 10;
  return `${a}-${b}-${n}`;
}

/** Human label for a gen key, e.g. "Prism Core · 4-fold · L6". */
export function labelForKey(key: string): string {
  const cfg = parseGenKey(key);
  const name = cfg.family === 'mix' ? 'Surprise Mix' : GEN_FAMILIES.find((f) => f.id === cfg.family)?.name || cfg.family;
  return `${name} · ${cfg.symmetry}-fold · L${cfg.complexity}`;
}

/* ── Geometry helpers ─────────────────────────────────────────────────── */

const CX = 50;
const CY = 50;

/** Rounded to keep SVG markup compact. */
const n = (v: number): number => Math.round(v * 100) / 100;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Point on circle around centre; 0° = up, clockwise. */
function polar(angleDeg: number, radius: number): [number, number] {
  const a = degToRad(angleDeg - 90);
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
}

function polygonPoints(sides: number, radius: number, offsetDeg = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const [x, y] = polar(offsetDeg + (360 / sides) * i, radius);
    pts.push(`${n(x)},${n(y)}`);
  }
  return pts.join(' ');
}

function arcPath(radius: number, startDeg: number, sweepDeg: number): string {
  const [sx, sy] = polar(startDeg, radius);
  const [ex, ey] = polar(startDeg + sweepDeg, radius);
  const largeArc = Math.abs(sweepDeg) > 180 ? 1 : 0;
  const sweep = sweepDeg >= 0 ? 1 : 0;
  return `M ${n(sx)},${n(sy)} A ${radius},${radius} 0 ${largeArc} ${sweep} ${n(ex)},${n(ey)}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/* ── Family renderers ─────────────────────────────────────────────────── */

interface Palette {
  p: string;
  s: string;
  /** class attribute fragment enabling pulse motion on hero strokes */
  pulse: string;
  glow: string;
}

function renderPrism(rng: Rng, cfg: GenConfig, c: Palette): string {
  const sym = cfg.symmetry;
  const cpx = cfg.complexity;
  const offset = rng.range(0, 360 / sym);
  const parts: string[] = [];

  if (cpx >= 8) parts.push(`<circle cx="50" cy="50" r="47" fill="none" stroke="${c.s}" stroke-width="0.9" stroke-dasharray="1 6" opacity="0.5"/>`);
  parts.push(`<polygon points="${polygonPoints(sym, 42, offset)}" fill="none" stroke="${c.p}" stroke-width="3" stroke-linejoin="round" ${c.pulse} ${c.glow}/>`);
  parts.push(`<polygon points="${polygonPoints(sym, 33.5, offset + 180 / sym)}" fill="none" stroke="${c.s}" stroke-width="1" stroke-dasharray="5 4" opacity="0.4"/>`);

  for (let i = 0; i < sym; i++) {
    const [x, y] = polar(offset + (360 / sym) * i, 42);
    parts.push(`<line x1="${n(x)}" y1="${n(y)}" x2="50" y2="50" stroke="${c.s}" stroke-width="0.75" opacity="0.28"/>`);
    if (cpx >= 3) parts.push(`<circle cx="${n(x)}" cy="${n(y)}" r="2" fill="${c.s}"/>`);
  }
  if (cpx >= 5) {
    parts.push(`<polygon points="${polygonPoints(sym, 19, offset + 180 / sym)}" fill="none" stroke="${c.p}" stroke-width="1.5" opacity="0.6"/>`);
  }
  parts.push(`<polygon points="${polygonPoints(sym, 10, offset)}" fill="url(#brandGrad)" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.75" ${c.glow}/>`);
  return parts.join('\n  ');
}

function renderSigil(rng: Rng, cfg: GenConfig, c: Palette): string {
  const cpx = cfg.complexity;
  const shards = 2 + Math.floor((cpx - 1) / 3); // 2..5
  const parts: string[] = [];
  if (cpx >= 6) parts.push(`<circle cx="50" cy="50" r="44" fill="none" stroke="${c.s}" stroke-width="1" stroke-dasharray="4 5" opacity="0.35"/>`);

  const shardPaths: string[] = [];
  const nodeDots: string[] = [];
  const spread = 58 / Math.max(1, shards);
  for (let i = 0; i < shards; i++) {
    // Antler walk: distinct vertical lane per shard, mixed up/down steps.
    const segments = rng.int(2, 3);
    let x = rng.range(53, 58);
    let y = 21 + spread * i + rng.range(0, Math.min(10, spread));
    let d = `M ${n(x)},${n(y)}`;
    for (let seg = 0; seg < segments; seg++) {
      x = Math.min(80, x + rng.range(6, 15));
      y = Math.min(80, Math.max(20, y + rng.pick([-1, 1]) * rng.range(4, 13)));
      d += ` L ${n(x)},${n(y)}`;
    }
    shardPaths.push(`<path d="${d}" fill="none"/>`);
    const [ex, ey] = [x, y];
    nodeDots.push(`<circle cx="${n(ex)}" cy="${n(ey)}" r="1.9" fill="${c.s}" stroke="none"/>`);
  }

  parts.push(`<g stroke="url(#brandGrad)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none" ${c.pulse} ${c.glow}>
    ${shardPaths.join('\n    ')}
    <g transform="matrix(-1 0 0 1 100 0)">
      ${shardPaths.join('\n      ')}
    </g>
  </g>`);
  parts.push(`<g stroke="none">
    ${nodeDots.join('\n    ')}
    <g transform="matrix(-1 0 0 1 100 0)" fill="${c.s}">
      ${nodeDots.join('\n      ')}
    </g>
  </g>`);
  parts.push(`<path d="M 50,${n(40 - cpx)} L 56,50 L 50,${n(60 + cpx)} L 44,50 Z" fill="${c.p}" opacity="0.9" ${c.glow}/>`);
  return parts.join('\n  ');
}

function renderCircuit(rng: Rng, cfg: GenConfig, c: Palette): string {
  const sym = cfg.symmetry;
  const cpx = cfg.complexity;
  const offset = rng.range(0, 360);
  const parts: string[] = [];

  if (cpx >= 7) parts.push(`<rect x="11" y="11" width="78" height="78" rx="11" fill="none" stroke="${c.p}" stroke-width="2" opacity="0.4"/>`);

  const traces: string[] = [];
  const pads: string[] = [];
  const vias: string[] = [];
  for (let i = 0; i < sym; i++) {
    const angle = offset + (360 / sym) * i;
    const bend = rng.pick([-32, -24, 24, 32]);
    const rElbow = rng.range(15, 21);
    const rEnd = rng.range(29, 36);
    const [ex, ey] = polar(angle, rElbow);
    const [px, py] = polar(angle + bend, rEnd);
    if (cpx < 5 || i % 2 === 0) {
      traces.push(`<path d="M 50,50 L ${n(ex)},${n(ey)} L ${n(px)},${n(py)}" fill="none"/>`);
    } else {
      traces.push(`<path d="M 50,50 L ${n(ex)},${n(ey)}" fill="none" opacity="0.6"/>`);
    }
    pads.push(`<circle cx="${n(px)}" cy="${n(py)}" r="2.6" fill="${c.s}" stroke="none"/>`);
    vias.push(`<circle cx="${n(ex)}" cy="${n(ey)}" r="1.1" fill="${c.s}" opacity="0.9" stroke="none"/>`);
  }
  const pulseGroup = cpx >= 4 ? 1.9 : 2.6;
  parts.push(`<g stroke="${c.p}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${c.glow}>
    ${traces.join('\n    ')}
  </g>`);
  parts.push(pads.join('\n  '));
  parts.push(vias.join('\n  '));
  if (cpx >= 8) {
    for (let i = 0; i < 4; i++) {
      const [x, y] = polar(45 + i * 90, 33);
      parts.push(`<rect x="${n(x - 1.6)}" y="${n(y - 1.6)}" width="3.2" height="3.2" fill="none" stroke="${c.s}" stroke-width="0.8" opacity="0.7"/>`);
    }
  }
  parts.push(`<circle cx="50" cy="50" r="${n(4 + pulseGroup * 0.6)}" fill="url(#brandGrad)" ${c.pulse} ${c.glow}/>`);
  return parts.join('\n  ');
}

function renderOrbit(rng: Rng, cfg: GenConfig, c: Palette): string {
  const sym = cfg.symmetry;
  const cpx = cfg.complexity;
  const offset = rng.range(0, 360);
  const parts: string[] = [];

  parts.push(`<circle cx="50" cy="50" r="44" fill="none" stroke="${c.p}" stroke-width="2.4" ${c.pulse} ${c.glow}/>`);
  parts.push(`<circle cx="50" cy="50" r="37.5" fill="none" stroke="${c.s}" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>`);

  const arcStart = rng.range(0, 360);
  const arcLen = rng.range(50, 120) + cpx * 6;
  parts.push(`<path d="${arcPath(44, arcStart, arcLen)}" fill="none" stroke="${c.s}" stroke-width="2.6" stroke-linecap="round"/>`);

  if (cpx >= 7) {
    parts.push(`<circle cx="50" cy="50" r="30" fill="none" stroke="${c.p}" stroke-width="1" stroke-dasharray="2 5" opacity="0.5"/>`);
  }

  for (let i = 0; i < sym; i++) {
    const angle = offset + (360 / sym) * i + rng.range(-8, 8);
    const [x, y] = polar(angle, 44);
    const r = i % 2 === 0 ? 3.2 : 2.2;
    const fill = i % 2 === 0 ? 'url(#brandGrad)' : c.p;
    parts.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${fill}" ${c.glow}/>`);
  }
  if (cpx >= 4) {
    const [ax, ay] = polar(arcStart + arcLen, 44);
    parts.push(`<circle cx="${n(ax)}" cy="${n(ay)}" r="3.8" fill="none" stroke="${c.s}" stroke-width="1.4"/>`);
  }

  parts.push(`<circle cx="50" cy="50" r="9" fill="url(#brandGrad)" ${c.glow}/>`);
  parts.push(`<path d="M 50,43.4 L 51.8,48.2 L 56.6,50 L 51.8,51.8 L 50,56.6 L 48.2,51.8 L 43.4,50 L 48.2,48.2 Z" fill="#ffffff" opacity="0.95"/>`);
  return parts.join('\n  ');
}

function renderWoven(rng: Rng, cfg: GenConfig, c: Palette): string {
  const sym = cfg.symmetry;
  const cpx = cfg.complexity;
  let step = 1;
  for (let k = Math.floor(sym / 2); k >= 2; k--) {
    if (gcd(k, sym) === 1) {
      step = k;
      break;
    }
  }
  const offset = rng.range(0, 360 / sym);
  const r1 = 41;
  const parts: string[] = [];

  if (cpx >= 8) parts.push(`<circle cx="50" cy="50" r="47" fill="none" stroke="${c.p}" stroke-width="0.9" stroke-dasharray="1 6" opacity="0.5"/>`);

  if (step > 1) {
    let d = '';
    for (let i = 0; i <= sym; i++) {
      const idx = (i * step) % sym;
      const [x, y] = polar(offset + (360 / sym) * idx, r1);
      d += i === 0 ? `M ${n(x)},${n(y)}` : ` L ${n(x)},${n(y)}`;
    }
    parts.push(`<path d="${d} Z" fill="none" stroke="${c.p}" stroke-width="2.2" stroke-linejoin="round" opacity="0.95" ${c.pulse} ${c.glow}/>`);
  } else if (sym >= 6 && sym % 2 === 0) {
    // Composite star {sym / (sym/2)}: e.g. hexagram = two rotated polygons.
    const half = sym / 2;
    parts.push(`<polygon points="${polygonPoints(half, r1, offset)}" fill="none" stroke="${c.p}" stroke-width="2.2" stroke-linejoin="round" ${c.pulse} ${c.glow}/>`);
    parts.push(`<polygon points="${polygonPoints(half, r1, offset + 180 / sym)}" fill="none" stroke="${c.p}" stroke-width="2.2" stroke-linejoin="round" opacity="0.75" ${c.glow}/>`);
  } else {
    parts.push(`<circle cx="50" cy="50" r="${r1}" fill="none" stroke="${c.p}" stroke-width="2.2" ${c.pulse} ${c.glow}/>`);
  }

  if (cpx >= 2) {
    parts.push(`<polygon points="${polygonPoints(sym, 29, offset + 180 / sym)}" fill="none" stroke="${c.s}" stroke-width="1.2" stroke-dasharray="3 4" opacity="0.5"/>`);
  }
  if (cpx >= 4) {
    for (let i = 0; i < sym; i++) {
      const [x, y] = polar(offset + (360 / sym) * i, r1);
      parts.push(`<circle cx="${n(x)}" cy="${n(y)}" r="1.6" fill="${c.s}"/>`);
    }
  }
  if (cpx >= 6) {
    for (let i = 0; i < sym; i++) {
      const angle = offset + (360 / sym) * i + 180 / sym;
      const [x1, y1] = polar(angle, 12);
      const [x2, y2] = polar(angle, 24);
      parts.push(`<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${c.p}" stroke-width="1" opacity="0.5"/>`);
    }
  }
  parts.push(`<path d="M 50,42 L 58,50 L 50,58 L 42,50 Z" fill="url(#brandGrad)" ${c.glow}/>`);
  return parts.join('\n  ');
}

function renderWave(rng: Rng, cfg: GenConfig, c: Palette): string {
  const cpx = cfg.complexity;
  const bands = 2 + Math.floor((cpx - 1) / 3); // 2..4
  const parts: string[] = [];

  for (let i = 0; i < bands; i++) {
    const y = 50 - i * 9;
    const h1 = rng.range(7, 15);
    const h2 = rng.range(7, 15);
    const stroke = i % 2 === 0 ? c.p : c.s;
    const width = i === 0 ? 3.4 : 2.6;
    const glow = i === 0 ? c.glow : '';
    const pulse = i === 0 ? c.pulse : '';
    const dUpper = `M 24,${n(y)} Q 37,${n(y - h1)} 50,${n(y)} Q 63,${n(y + h2 * 0.6)} 76,${n(y)}`;
    parts.push(`<g stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" fill="none" ${pulse} ${glow}>
    <path d="${dUpper}"/>
    <path d="${dUpper}" transform="translate(0 100) scale(1 -1)"/>
  </g>`);
  }

  if (cpx >= 5) {
    parts.push(`<path d="M 17,38 V 62 M 83,38 V 62" stroke="${c.s}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`);
  }
  if (cpx >= 8) {
    parts.push(`<path d="M 24,50 H 34 M 66,50 H 76" stroke="${c.p}" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>`);
  }
  parts.push(`<circle cx="50" cy="50" r="3.4" fill="url(#brandGrad)" ${c.glow}/>`);
  return parts.join('\n  ');
}

function renderGlyph(rng: Rng, cfg: GenConfig, c: Palette): string {
  const cpx = cfg.complexity;
  const motifs = ['arcTL', 'arcTR', 'arcBL', 'arcBR', 'barH', 'barV', 'diag', 'dot'] as const;
  const count = Math.min(6, 3 + Math.floor(cpx / 2)); // 3..6
  const cell = 15;
  const ox = 27.5;
  const oy = 27.5;
  const used = new Set<string>();
  const strokes: string[] = [];

  while (strokes.length < count) {
    const col = rng.int(0, 2);
    const row = rng.int(0, 2);
    const key = `${col}:${row}`;
    if (used.has(key)) continue;
    used.add(key);
    if (col === 1 && row === 1) continue; // centre reserved for the core
    const x = ox + col * cell;
    const y = oy + row * cell;
    strokes.push(motifPath(rng.pick([...motifs]), x, y, cell, c.s));
  }

  const strokeA = `stroke="url(#brandGrad)"`;
  const parts: string[] = [];
  const half = Math.ceil(strokes.length / 2);
  parts.push(`<g ${strokeA} stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none" ${c.pulse} ${c.glow}>
    ${strokes.slice(0, half).join('\n    ')}
  </g>`);
  parts.push(`<g stroke="${c.s}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85">
    ${strokes.slice(half).join('\n    ')}
  </g>`);

  if (cpx >= 4) {
    parts.push(`<path d="M 18,30 V 18 H 30 M 70,18 H 82 V 30 M 82,70 V 82 H 70 M 30,82 H 18 V 70" fill="none" stroke="${c.s}" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>`);
  }
  if (cpx >= 7) {
    parts.push(`<circle cx="50" cy="50" r="45" fill="none" stroke="${c.p}" stroke-width="0.9" stroke-dasharray="2 6" opacity="0.4"/>`);
  }
  parts.push(`<circle cx="50" cy="50" r="4.6" fill="url(#brandGrad)" ${c.glow}/>`);
  return parts.join('\n  ');
}

function motifPath(motif: string, x: number, y: number, size: number, dotFill: string): string {
  const x2 = n(x + size);
  const y2 = n(y + size);
  const cxm = n(x + size / 2);
  const cym = n(y + size / 2);
  switch (motif) {
    case 'arcTL':
      return `<path d="M ${n(x)},${y2} A ${size},${size} 0 0 1 ${x2},${n(y)}"/>`;
    case 'arcTR':
      return `<path d="M ${n(x)},${n(y)} A ${size},${size} 0 0 1 ${x2},${y2}"/>`;
    case 'arcBL':
      return `<path d="M ${n(x)},${n(y)} A ${size},${size} 0 0 0 ${x2},${y2}"/>`;
    case 'arcBR':
      return `<path d="M ${x2},${n(y)} A ${size},${size} 0 0 0 ${n(x)},${y2}"/>`;
    case 'barH':
      return `<path d="M ${n(x)},${cym} H ${x2}"/>`;
    case 'barV':
      return `<path d="M ${cxm},${n(y)} V ${y2}"/>`;
    case 'diag':
      return `<path d="M ${n(x)},${y2} L ${x2},${n(y)}"/>`;
    default:
      return `<circle cx="${cxm}" cy="${cym}" r="2.2" stroke="none" fill="${dotFill}"/>`;
  }
}

function renderArray(rng: Rng, cfg: GenConfig, c: Palette): string {
  const cpx = cfg.complexity;
  const parts: string[] = [];
  const size = 8;
  const positionsX = [27.5, 42.5, 57.5, 72.5];
  const positionsY = [27.5, 42.5, 57.5, 72.5];

  // 8 random bits define the top-left quadrant; mirror for pure symmetry.
  // Density scales with complexity so L1 stays airy and L10 busy.
  const density = 0.38 + cpx * 0.045;
  const bits: number[] = Array.from({ length: 8 }, () => (rng.chance(density) ? 1 : 0));
  const active = (i: number, j: number): number => {
    const mi = i < 2 ? i : 3 - i;
    const mj = j < 2 ? j : 3 - j;
    return bits[mj * 2 + mi];
  };

  if (cpx >= 7) parts.push(`<rect x="13" y="13" width="74" height="74" rx="12" fill="none" stroke="${c.s}" stroke-width="1" stroke-dasharray="4 5" opacity="0.4"/>`);

  const links: string[] = [];
  const tiles: string[] = [];
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      if (!active(i, j)) continue;
      const x = positionsX[i];
      const y = positionsY[j];
      if (i < 3 && active(i + 1, j)) links.push(`<line x1="${n(x + size)}" y1="${n(y + size / 2)}" x2="${n(positionsX[i + 1])}" y2="${n(y + size / 2)}"/>`);
      if (j < 3 && active(i, j + 1)) links.push(`<line x1="${n(x + size / 2)}" y1="${n(y + size)}" x2="${n(x + size / 2)}" y2="${n(positionsY[j + 1])}"/>`);
      const hero = bits[(j * 2 + i + 8) % 8] === 1 && (i < 2 || j < 2);
      const fill = hero ? 'url(#brandGrad)' : (i + j) % 2 === 0 ? c.p : c.s;
      const opacity = hero ? '1' : n(rng.range(0.45, 0.95));
      tiles.push(`<rect x="${n(x)}" y="${n(y)}" width="${size}" height="${size}" rx="2" fill="${fill}" opacity="${opacity}"/>`);
    }
  }
  parts.push(`<g stroke="${c.p}" stroke-width="1.4" opacity="0.32">${links.join('')}</g>`);
  parts.push(`<g ${c.pulse} ${c.glow}>${tiles.join('')}</g>`);
  parts.push(`<rect x="45.5" y="45.5" width="9" height="9" rx="2" fill="url(#brandGrad)" ${c.glow}/>`);
  return parts.join('\n  ');
}

/* ── Entry point ──────────────────────────────────────────────────────── */

/**
 * Render the inner SVG contents (0..100 viewBox space) for a gen:* frame key.
 * Colours and glow/gradient defs are supplied by getEmblemSVG in emblemRenderer.
 */
export function getGenerativeEmblemContents(key: string, p: string, s: string, pulseMotion: boolean): string {
  const cfg = parseGenKey(key);
  const seedRng = new Rng(`lab::${cfg.word}`);
  const family = cfg.family === 'mix' ? seedRng.pick([...FAMILY_IDS]) : cfg.family;
  const rng = new Rng(`lab::${family}::${cfg.symmetry}::${cfg.complexity}::${cfg.word}`);
  const palette: Palette = {
    p,
    s,
    pulse: pulseMotion ? 'class="d-pulse-path"' : '',
    glow: 'filter="url(#glow)"',
  };

  switch (family) {
    case 'prism':
      return renderPrism(rng, cfg, palette);
    case 'sigil':
      return renderSigil(rng, cfg, palette);
    case 'circuit':
      return renderCircuit(rng, cfg, palette);
    case 'orbit':
      return renderOrbit(rng, cfg, palette);
    case 'woven':
      return renderWoven(rng, cfg, palette);
    case 'wave':
      return renderWave(rng, cfg, palette);
    case 'glyph':
      return renderGlyph(rng, cfg, palette);
    default:
      return renderArray(rng, cfg, palette);
  }
}

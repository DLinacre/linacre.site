/**
 * Colour tools for the Identity Studio — hex/HSL conversion, harmony
 * generation, contrast measurement and the curated swatch board.
 * Pure functions, no DOM access, safe to use anywhere.
 */

/** Normalise user input to #RRGGBB uppercase, or return null when invalid. */
export function normalizeHex(input: string): string | null {
  const clean = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return `#${clean.toUpperCase()}`;
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    const [r, g, b] = clean.split('');
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = (normalizeHex(hex) || '#000000').slice(1);
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.min(1, Math.max(0, s));
  const light = Math.min(1, Math.max(0, l));
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (channel: number) =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** Rotate hue by degrees, keeping saturation and lightness. */
export function rotateHue(hex: string, degrees: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h + degrees, s, l);
}

/** Return the same colour at a new lightness (0..1). */
export function withLightness(hex: string, lightness: number): string {
  const { h, s } = hexToHsl(hex);
  return hslToHex(h, s, lightness);
}

/** WCAG relative-luminance contrast ratio between two hex colours. */
export function contrastRatio(hex1: string, hex2: string): number {
  const luminance = (hex: string) => {
    const clean = (normalizeHex(hex) || '#000000').slice(1);
    const values = [0, 2, 4].map(index => parseInt(clean.slice(index, index + 2), 16) / 255);
    const [r, g, b] = values.map(value =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = luminance(hex1);
  const b = luminance(hex2);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Raise lightness until the colour reaches `target` contrast on `background`. */
export function fixContrast(hex: string, background: string, target = 4.5): string {
  let candidate = normalizeHex(hex) || '#FFFFFF';
  let { h, s, l } = hexToHsl(candidate);
  const guard = 40;
  for (let i = 0; i < guard && contrastRatio(candidate, background) < target; i++) {
    l = Math.min(0.97, l + 0.03);
    s = Math.max(0.15, s - 0.01);
    candidate = hslToHex(h, s, l);
    if (l >= 0.97) break;
  }
  return candidate;
}

export type HarmonyId = 'complement' | 'analogous' | 'triadic' | 'mono';

/** Suggest a secondary colour derived from the primary. */
export function harmonySecondary(primary: string, harmony: HarmonyId): string {
  const { h, s, l } = hexToHsl(primary);
  if (harmony === 'complement') return hslToHex(h + 180, Math.max(0.35, s), l);
  if (harmony === 'analogous') return hslToHex(h + 38, Math.max(0.35, s), l);
  if (harmony === 'triadic') return hslToHex(h + 122, Math.max(0.35, s), l);
  return hslToHex(h + 12, Math.max(0.08, s * 0.35), Math.min(0.92, l + 0.22));
}

/** Curated swatch board — hues chosen to read well on the dark brand surface. */
export const SWATCH_ROWS: ReadonlyArray<{ name: string; colors: string[] }> = [
  { name: 'Cyan', colors: ['#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#155E75'] },
  { name: 'Sky', colors: ['#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#075985'] },
  { name: 'Teal', colors: ['#5EEAD4', '#2DD4BF', '#14B8A6', '#0D9488', '#115E59'] },
  { name: 'Emerald', colors: ['#6EE7B7', '#34D399', '#10B981', '#059669', '#065F46'] },
  { name: 'Lime', colors: ['#BEF264', '#A3E635', '#84CC16', '#65A30D', '#3F6212'] },
  { name: 'Amber', colors: ['#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#B45309'] },
  { name: 'Orange', colors: ['#FDBA74', '#FB923C', '#F97316', '#EA580C', '#9A3412'] },
  { name: 'Rose', colors: ['#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#9F1239'] },
  { name: 'Violet', colors: ['#C4B5FD', '#A78BFA', '#8B5CF6', '#818CF8', '#6D28D9'] },
  { name: 'Ice', colors: ['#ECFEFF', '#CFFAFE', '#A5F3FC', '#E2F7FA', '#9AB7C3'] },
];

/** The rainbow strip behind the "any colour" native picker box. */
export const ANY_COLOR_GRADIENT =
  'conic-gradient(from 210deg, #f43f5e, #f59e0b, #facc15, #4ade80, #22d3ee, #6366f1, #c026d3, #f43f5e)';

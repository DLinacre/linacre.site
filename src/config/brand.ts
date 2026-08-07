import type { BrandColorScheme, BrandFontScheme, IdentityPreferences } from '../app/types';

export const DEFAULT_IDENTITY: IdentityPreferences = {
  colorId: 'cyber',
  fontId: 'cyber',
  frameId: 'dl-geo',
  motionId: 'pulse',
  pulseSpeed: 'slow',
  name: 'DAVID LINACRE',
  title: 'Software engineer · useful tools · AI systems',
  bio: 'Building practical software, open-source tools, and reliable automation systems.',
  glow: 2,
  customPrimary: '#22D3EE',
  customSecondary: '#34D399'
};

export const BASE_COLOR_SCHEMES: Record<string, BrandColorScheme> = {
  cyber: { primary: '#22D3EE', secondary: '#34D399' },
  ocean: { primary: '#38BDF8', secondary: '#2DD4BF' },
  matrix: { primary: '#2DD4BF', secondary: '#A3E635' },
  violet: { primary: '#818CF8', secondary: '#22D3EE' },
  mono: { primary: '#E2F7FA', secondary: '#7DD3FC' },
  // Compatibility aliases for previously shared theme links.
  amber: { primary: '#22D3EE', secondary: '#34D399' },
  cyan: { primary: '#38BDF8', secondary: '#2DD4BF' },
  emerald: { primary: '#2DD4BF', secondary: '#A3E635' },
  crimson: { primary: '#818CF8', secondary: '#22D3EE' }
};

export const FONT_SCHEMES: Record<string, BrandFontScheme> = {
  cyber: {
    display: '"Space Grotesk", "Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
    import: ''
  },
  neotech: {
    display: '"Orbitron", sans-serif',
    mono: '"Share Tech Mono", monospace',
    import: "@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800&family=Share+Tech+Mono&display=swap');"
  },
  brutalist: {
    display: '"Plus Jakarta Sans", sans-serif',
    mono: '"Fira Code", monospace',
    import: "@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Plus+Jakarta+Sans:wght@500;800&display=swap');"
  },
  editorial: {
    display: '"Playfair Display", serif',
    mono: '"Fira Mono", monospace',
    import: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Fira+Mono&display=swap');"
  }
};

export function colorSchemesFor(identity: Pick<IdentityPreferences, 'customPrimary' | 'customSecondary'>): Record<string, BrandColorScheme> {
  return {
    ...BASE_COLOR_SCHEMES,
    custom: { primary: identity.customPrimary, secondary: identity.customSecondary }
  };
}

export function resolveColorScheme(identity: Pick<IdentityPreferences, 'colorId' | 'customPrimary' | 'customSecondary'>): BrandColorScheme {
  const colors = colorSchemesFor(identity);
  return colors[identity.colorId] || colors.cyber;
}

export function resolveFontScheme(fontId: string): BrandFontScheme {
  return FONT_SCHEMES[fontId] || FONT_SCHEMES.cyber;
}

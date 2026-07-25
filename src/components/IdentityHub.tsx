import { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  ChevronRight,
  CircleUserRound,
  Code2,
  Copy,
  Dices,
  Download,
  FileImage,
  FlaskConical,
  Github,
  Image as ImageIcon,
  LayoutTemplate,
  Layers,
  Link2,
  Mail,
  Palette,
  Pipette,
  RefreshCw,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Star,
  SwatchBook,
  Trash2,
  Type,
  Upload,
  WandSparkles,
} from 'lucide-react';
import { getEmblemSVG } from '../lib/emblemRenderer';
import type { CustomEmblem } from '../lib/emblemRenderer';
import {
  GEN_FAMILIES,
  isGenFrame,
  labelForKey,
  makeGenKey,
  parseGenKey,
  randomSeedWord,
} from '../lib/emblemLab';
import type { GenFamilyId } from '../lib/emblemLab';
import {
  ANY_COLOR_GRADIENT,
  SWATCH_ROWS,
  contrastRatio,
  fixContrast,
  harmonySecondary,
  normalizeHex,
} from '../lib/colorTools';
import type { HarmonyId } from '../lib/colorTools';

type PreviewMode = 'banner' | 'avatar' | 'social';
type ColorTarget = 'primary' | 'secondary';
type MarkTab = 'curated' | 'lab' | 'upload' | 'ai';

type PaletteOption = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  description: string;
};

type FontOption = {
  id: string;
  name: string;
  display: string;
  mono: string;
  sample: string;
};

const PALETTES: PaletteOption[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Dark & Glass',
    primary: '#38BDF8',
    secondary: '#818CF8',
    description: '🌌 Deep obsidian #030712 background with sky cyan & soft indigo border glass glows.',
  },
  {
    id: 'midnight',
    name: 'Midnight Linear Indigo',
    primary: '#6366F1',
    secondary: '#EC4899',
    description: '🏙️ Sleek Linear/Vercel dark slate with vivid indigo & hot pink accents.',
  },
  {
    id: 'synthwave',
    name: 'Neon Synthwave Cyber',
    primary: '#F43F5E',
    secondary: '#22D3EE',
    description: '⚡ High-octane crimson magenta and electric neon cyan.',
  },
  {
    id: 'matrix',
    name: 'Green Matrix Terminal',
    primary: '#10B981',
    secondary: '#A3E635',
    description: '🌿 Deep terminal matrix green and glowing lime gold.',
  },
  {
    id: 'amber',
    name: 'Solar Ember Sunset',
    primary: '#F97316',
    secondary: '#FBBF24',
    description: '🔥 Fiery solar orange and warm glowing amber gold.',
  },
  {
    id: 'amethyst',
    name: 'Royal Amethyst & Violet',
    primary: '#A855F7',
    secondary: '#EC4899',
    description: '🍇 Deep purple amethyst with vibrant magenta pink highlights.',
  },
  {
    id: 'arctic',
    name: 'Arctic Ice & Frost',
    primary: '#38BDF8',
    secondary: '#E2F7FA',
    description: '🧊 Crisp arctic ice blue and pale frost white on deep cold slate.',
  },
  {
    id: 'stealth',
    name: 'Monochrome Stealth',
    primary: '#F8FAFC',
    secondary: '#64748B',
    description: '👑 Ultra-clean pure white and cool graphite stealth.',
  },
];

const FRAMES = [
  { id: 'dl-mushroom', name: 'Cyber Mushroom', description: '🍄 Built-in mushroom emblem' },
  { id: 'dl-geo', name: 'Geometric DL', description: 'Primary brand mark' },
  { id: 'dl-terminal', name: 'Terminal DL', description: 'Developer identity' },
  { id: 'dl-crest', name: 'Cyber Crest', description: 'Sharper social mark' },
  { id: 'brackets', name: 'Code Prompt', description: 'Simple technical icon' },
  { id: 'circle', name: 'Signal Orb', description: 'Soft compact avatar' },
  { id: 'minimal', name: 'Minimal Spark', description: 'Quiet, abstract option' },
  { id: 'hexagon', name: 'Pipeline Nexus', description: 'Modular grid core' },
  { id: 'dl-sacred', name: 'Sacred Geometry', description: 'Circular precision monogram' },
  { id: 'streetwear', name: 'Cyber Streetwear', description: 'Animated morph badge' },
];

const FONTS: FontOption[] = [
  {
    id: 'cyber',
    name: 'Space Grotesk',
    display: '"Space Grotesk", "Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
    sample: 'Modern / clear / technical',
  },
  {
    id: 'neotech',
    name: 'Orbit System',
    display: '"Orbitron", "Space Grotesk", sans-serif',
    mono: '"Share Tech Mono", "JetBrains Mono", monospace',
    sample: 'Futuristic / display-led',
  },
  {
    id: 'brutalist',
    name: 'Technical Sans',
    display: '"Plus Jakarta Sans", "Inter", sans-serif',
    mono: '"Fira Code", "JetBrains Mono", monospace',
    sample: 'Practical / product-focused',
  },
];

const BRAND_DARK = '#030c14';
const MAX_CUSTOM_EMBLEMS = 8;
const MAX_UPLOAD_BYTES = 300 * 1024;
const LAB_TILES_PER_BATCH = 8;

const safeStorage = {
  get(key: string, fallback: string) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The studio remains usable when browser storage is disabled.
    }
  },
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function downloadText(content: string, filename: string, type = 'image/svg+xml;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function svgToPng(svg: string, filename: string, width: number, height: number) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not render this SVG.'));
    image.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not supported in this browser.');
  context.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(url);
  const pngUrl = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = pngUrl;
  anchor.download = filename;
  anchor.click();
}

/* ── Small building blocks ────────────────────────────────────────────── */

function SwatchBox({ color, active, onPick, title }: { color: string; active: boolean; onPick: (color: string) => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={() => onPick(color)}
      title={title || color}
      aria-label={`Use colour ${color}`}
      className={`h-7 w-full rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-[#030c14]' : 'ring-1 ring-white/10'}`}
      style={{ background: color }}
    />
  );
}

function HexField({ value, onCommit }: { value: string; onCommit: (hex: string) => void }) {
  const [text, setText] = useState(value);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => setText(value), [value]);
  const commit = () => {
    const normalized = normalizeHex(text);
    if (normalized) {
      setInvalid(false);
      onCommit(normalized);
    } else {
      setInvalid(true);
      setText(value);
    }
  };
  return (
    <input
      value={text}
      onChange={(event) => { setText(event.target.value); setInvalid(false); }}
      onBlur={commit}
      onKeyDown={(event) => { if (event.key === 'Enter') (event.target as HTMLInputElement).blur(); }}
      spellCheck={false}
      aria-label="Hex colour value"
      className={`h-10 w-full rounded-xl border bg-background/40 px-3 font-mono text-[11px] font-bold uppercase tracking-wider text-foreground focus:outline-none ${invalid ? 'border-error' : 'border-border-color focus:border-amber-color'}`}
    />
  );
}

function ContrastChip({ label, color }: { label: string; color: string }) {
  const ratio = contrastRatio(color, BRAND_DARK);
  const pass = ratio >= 4.5;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border-color bg-[#030c14] px-2 py-1 font-mono text-[10px]">
      <span className="h-3 w-3 rounded-sm ring-1 ring-white/20" style={{ background: color }} />
      <span className="text-[#9ab7c3]">{label}</span>
      <span className={pass ? 'font-bold text-emerald-color' : 'font-bold text-error'}>
        {ratio.toFixed(2)}:1 {pass ? 'AA' : 'low'}
      </span>
    </span>
  );
}

function MarkTile({
  frameKey,
  primary,
  secondary,
  customEmblems,
  active,
  onSelect,
  favourite,
  onToggleFavourite,
  label,
}: {
  frameKey: string;
  primary: string;
  secondary: string;
  customEmblems: CustomEmblem[];
  active: boolean;
  onSelect: () => void;
  favourite?: boolean;
  onToggleFavourite?: () => void;
  label?: string;
}) {
  const preview = useMemo(
    () => getEmblemSVG(frameKey, primary, secondary, 'static', 'slow', 1, customEmblems),
    [frameKey, primary, secondary, customEmblems],
  );
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSelect}
        title={label || frameKey}
        className={`block w-full rounded-xl border p-2 transition-all hover:bg-muted/30 ${active ? 'bg-muted/40' : 'border-border-color bg-background/20'}`}
        style={active ? { borderColor: primary, boxShadow: `0 0 0 1px ${primary}44` } : undefined}
      >
        <span className="mx-auto block aspect-square w-full max-w-[72px]" dangerouslySetInnerHTML={{ __html: preview }} />
      </button>
      {onToggleFavourite && (
        <button
          type="button"
          onClick={onToggleFavourite}
          aria-label={favourite ? 'Remove from kept marks' : 'Keep this mark'}
          title={favourite ? 'Remove from kept marks' : 'Keep this mark'}
          className="absolute right-1 top-1 rounded-md bg-[#030c14]/80 p-1 text-muted-foreground hover:text-amber-color"
        >
          <Star className={`h-3 w-3 ${favourite ? 'fill-amber-color text-amber-color' : ''}`} />
        </button>
      )}
    </div>
  );
}

/* ── Main studio ──────────────────────────────────────────────────────── */

export default function IdentityHub() {
  const savedPalette = safeStorage.get('linacre_brand_color', 'cyber');
  const initialPalette = savedPalette === 'amber' ? 'cyber' : savedPalette;
  const savedFrame = safeStorage.get('linacre_brand_frame', 'dl-geo');
  const initialTab: MarkTab = isGenFrame(savedFrame) ? 'lab' : savedFrame.startsWith('custom-') ? 'upload' : 'curated';

  const [paletteId, setPaletteId] = useState(initialPalette);
  const [customPrimary, setCustomPrimary] = useState(() => normalizeHex(safeStorage.get('linacre_brand_custom_primary', '#22D3EE')) || '#22D3EE');
  const [customSecondary, setCustomSecondary] = useState(() => normalizeHex(safeStorage.get('linacre_brand_custom_secondary', '#34D399')) || '#34D399');
  const [customBgColor, setCustomBgColor] = useState(() => safeStorage.get('linacre_brand_custom_bg', '#030c14'));
  const [colorTarget, setColorTarget] = useState<ColorTarget>('primary');
  const [recentColors, setRecentColors] = useState<string[]>(() => loadJson<string[]>('linacre_brand_recent_colors', []));
  const [frame, setFrame] = useState(savedFrame);
  const [markTab, setMarkTab] = useState<MarkTab>(safeStorage.get('linacre_brand_mark_tab', initialTab) as MarkTab);
  const [fontId, setFontId] = useState(safeStorage.get('linacre_brand_font', 'cyber'));
  const [motionMode, setMotionMode] = useState(safeStorage.get('linacre_brand_motion', 'pulse'));
  const [glow, setGlow] = useState(Number(safeStorage.get('linacre_brand_glow', '2')));
  const [name, setName] = useState(safeStorage.get('linacre_brand_name', 'DAVID LINACRE'));
  const [title, setTitle] = useState(safeStorage.get('linacre_brand_title', 'Software engineer · useful tools · AI systems'));
  const [bio, setBio] = useState(safeStorage.get('linacre_brand_bio', 'Building practical software, open-source tools, and reliable automation systems.'));
  const [email, setEmail] = useState(safeStorage.get('linacre_brand_email', 'david@linacre.site'));
  const [website, setWebsite] = useState(safeStorage.get('linacre_brand_website', 'https://www.linacre.site'));
  const [previewMode, setPreviewMode] = useState<PreviewMode>('banner');
  const [copied, setCopied] = useState<string | null>(null);

  // Emblem Lab state
  const [labWord, setLabWord] = useState(safeStorage.get('linacre_lab_word', 'linacre'));
  const [labFamily, setLabFamily] = useState<GenFamilyId>((safeStorage.get('linacre_lab_family', 'mix') || 'mix') as GenFamilyId);
  const [labSym, setLabSym] = useState(() => Math.min(8, Math.max(2, Number(safeStorage.get('linacre_lab_sym', '4')) || 4)));
  const [labCpx, setLabCpx] = useState(() => Math.min(10, Math.max(1, Number(safeStorage.get('linacre_lab_cpx', '5')) || 5)));
  const [labBatch, setLabBatch] = useState(() => Math.max(0, Number(safeStorage.get('linacre_lab_batch', '0')) || 0));
  const [favMarks, setFavMarks] = useState<string[]>(() => loadJson<string[]>('linacre_brand_fav_marks', []));

  // Custom uploaded emblems & AI prompt icon generation
  const [customEmblems, setCustomEmblems] = useState<CustomEmblem[]>(() => loadJson<CustomEmblem[]>('linacre_custom_emblems', []));
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasEyeDropper] = useState(() => typeof window !== 'undefined' && 'EyeDropper' in window);

  // AI Icon Generation state (Gemini 3.6 Flash)
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const palette = useMemo<PaletteOption>(() => {
    if (paletteId === 'custom') {
      return {
        id: 'custom',
        name: 'Custom Blend',
        primary: customPrimary,
        secondary: customSecondary,
        description: 'Your own two-colour system, tuned box by box.',
      };
    }
    return PALETTES.find((option) => option.id === paletteId) || PALETTES[0];
  }, [paletteId, customPrimary, customSecondary]);

  const activeFont = FONTS.find((option) => option.id === fontId) || FONTS[0];

  useEffect(() => {
    safeStorage.set('linacre_brand_color', palette.id);
    safeStorage.set('linacre_brand_frame', frame);
    safeStorage.set('linacre_brand_font', activeFont.id);
    safeStorage.set('linacre_brand_motion', motionMode);
    safeStorage.set('linacre_brand_pulse_speed', 'slow');
    safeStorage.set('linacre_brand_glow', String(glow));
    safeStorage.set('linacre_brand_name', name);
    safeStorage.set('linacre_brand_title', title);
    safeStorage.set('linacre_brand_bio', bio);
    safeStorage.set('linacre_brand_email', email);
    safeStorage.set('linacre_brand_website', website);
    safeStorage.set('linacre_brand_custom_primary', customPrimary);
    safeStorage.set('linacre_brand_custom_secondary', customSecondary);
    safeStorage.set('linacre_brand_recent_colors', JSON.stringify(recentColors));
    safeStorage.set('linacre_brand_fav_marks', JSON.stringify(favMarks));
    safeStorage.set('linacre_custom_emblems', JSON.stringify(customEmblems));
    safeStorage.set('linacre_brand_mark_tab', markTab);
    safeStorage.set('linacre_lab_word', labWord);
    safeStorage.set('linacre_lab_family', labFamily);
    safeStorage.set('linacre_lab_sym', String(labSym));
    safeStorage.set('linacre_lab_cpx', String(labCpx));
    safeStorage.set('linacre_lab_batch', String(labBatch));
    safeStorage.set('linacre_brand_custom_bg', customBgColor);

    // Sync live theme colors & background variables to document root
    const root = document.documentElement;
    root.style.setProperty('--color-amber-color', palette.primary);
    root.style.setProperty('--color-cyan', palette.primary);
    root.style.setProperty('--linacre-accent', palette.primary);
    root.style.setProperty('--color-amber-glow', palette.secondary);
    root.style.setProperty('--color-emerald-color', palette.secondary);

    const themeBgs: Record<string, { bg: string; panel: string }> = {
      obsidian: { bg: '#030712', panel: '#0b1220' },
      midnight: { bg: '#0f172a', panel: '#1e293b' },
      synthwave: { bg: '#05050a', panel: '#12091c' },
      matrix: { bg: '#02140d', panel: '#052618' },
      amber: { bg: '#120a04', panel: '#241408' },
      amethyst: { bg: '#0c0414', panel: '#1a082b' },
      arctic: { bg: '#031017', panel: '#0a1c26' },
      stealth: { bg: '#020408', panel: '#0f172a' },
    };

    if (themeBgs[palette.id]) {
      root.style.setProperty('--background', themeBgs[palette.id].bg);
      root.style.setProperty('--linacre-panel', themeBgs[palette.id].panel);
    }

    window.dispatchEvent(new Event('linacre-identity-updated'));
  }, [palette, frame, activeFont, motionMode, glow, name, title, bio, email, website, customPrimary, customSecondary, recentColors, favMarks, customEmblems, markTab, labWord, labFamily, labSym, labCpx, labBatch, customBgColor]);

  const emblem = useMemo(
    () => getEmblemSVG(frame, palette.primary, palette.secondary, motionMode, 'slow', glow, customEmblems),
    [frame, palette, motionMode, glow, customEmblems],
  );

  const bannerSvg = useMemo(() => {
    const safeName = xmlEscape(name || 'DAVID LINACRE');
    const safeTitle = xmlEscape(title || 'Software engineer · useful tools · AI systems');
    const safeWebsite = xmlEscape(website.replace(/^https?:\/\//, '') || 'linacre.site');
    const brandLine = xmlEscape(`${palette.name.toUpperCase()} / VERIFIED IDENTITY`);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320" style="width:100%;height:100%;display:block">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${customBgColor}"/><stop offset="0.55" stop-color="${customBgColor}"/><stop offset="1" stop-color="${customBgColor}"/></linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.primary}"/><stop offset="1" stop-color="${palette.secondary}"/></linearGradient>
    <radialGradient id="aura"><stop stop-color="${palette.primary}" stop-opacity=".18"/><stop offset="1" stop-color="${palette.primary}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="${palette.primary}" stroke-opacity=".08"/></pattern>
  </defs>
  <rect width="1280" height="320" fill="url(#bg)"/>
  <rect width="1280" height="320" fill="url(#grid)"/>
  <circle cx="160" cy="160" r="230" fill="url(#aura)"/>
  <path d="M760 274h120l34-30h170l34 30h162" fill="none" stroke="${palette.secondary}" stroke-opacity=".24" stroke-width="2"/>
  <circle cx="914" cy="244" r="4" fill="${palette.primary}"/><circle cx="1084" cy="244" r="4" fill="${palette.secondary}"/>
  <rect x="58" y="46" width="228" height="228" rx="38" fill="#081c28" fill-opacity=".9" stroke="${palette.primary}" stroke-opacity=".22"/>
  <svg x="82" y="70" width="180" height="180" viewBox="0 0 100 100">${emblem}</svg>
  <text x="342" y="78" fill="${palette.secondary}" font-family="JetBrains Mono, monospace" font-size="15" font-weight="700" letter-spacing="1.5">${brandLine}</text>
  <text x="338" y="145" fill="#ecfeff" font-family="Space Grotesk, Inter, sans-serif" font-size="52" font-weight="700" letter-spacing="-1.5">${safeName}</text>
  <text x="342" y="187" fill="#9ab7c3" font-family="Inter, sans-serif" font-size="22">${safeTitle}</text>
  <rect x="342" y="218" width="238" height="38" rx="19" fill="#082330" stroke="${palette.primary}" stroke-opacity=".65"/>
  <text x="363" y="243" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">${safeWebsite}</text>
  <circle cx="1090" cy="268" r="5" fill="${palette.secondary}"/>
  <text x="1107" y="273" fill="${palette.secondary}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700">AVAILABLE / ONLINE</text>
</svg>`;
  }, [emblem, name, title, website, palette, customBgColor]);

  const avatarSvg = useMemo(() => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" style="width:100%;height:100%;display:block">
  <defs><linearGradient id="avatarBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${customBgColor}"/><stop offset="1" stop-color="${customBgColor}"/></linearGradient><radialGradient id="avatarAura"><stop stop-color="${palette.primary}" stop-opacity=".22"/><stop offset="1" stop-color="${palette.primary}" stop-opacity="0"/></radialGradient></defs>
  <rect width="512" height="512" rx="108" fill="url(#avatarBg)"/>
  <circle cx="256" cy="256" r="245" fill="url(#avatarAura)"/>
  <rect x="44" y="44" width="424" height="424" rx="92" fill="none" stroke="${palette.primary}" stroke-opacity=".38" stroke-width="3"/>
  <svg x="96" y="96" width="320" height="320" viewBox="0 0 100 100">${emblem}</svg>
</svg>`, [emblem, palette, customBgColor]);

  const socialSvg = useMemo(() => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" style="width:100%;height:100%;display:block">
  <defs><linearGradient id="socialBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${customBgColor}"/><stop offset=".6" stop-color="${customBgColor}"/><stop offset="1" stop-color="${customBgColor}"/></linearGradient><pattern id="socialGrid" width="54" height="54" patternUnits="userSpaceOnUse"><path d="M54 0H0V54" fill="none" stroke="${palette.primary}" stroke-opacity=".07"/></pattern></defs>
  <rect width="1200" height="630" fill="url(#socialBg)"/><rect width="1200" height="630" fill="url(#socialGrid)"/>
  <rect x="70" y="135" width="330" height="330" rx="72" fill="#081c28" stroke="${palette.primary}" stroke-opacity=".3"/>
  <svg x="110" y="175" width="250" height="250" viewBox="0 0 100 100">${emblem}</svg>
  <text x="470" y="190" fill="${palette.secondary}" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">LINACRE / USEFUL SOFTWARE</text>
  <text x="462" y="272" fill="#ecfeff" font-family="Space Grotesk, Inter, sans-serif" font-size="57" font-weight="700">${xmlEscape(name)}</text>
  <text x="470" y="320" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-size="21">${xmlEscape(title)}</text>
  <text x="470" y="377" fill="#9ab7c3" font-family="Inter, sans-serif" font-size="20">${xmlEscape(bio).slice(0, 92)}</text>
  <rect x="470" y="420" width="285" height="46" rx="23" fill="#082330" stroke="${palette.primary}" stroke-opacity=".7"/>
  <text x="494" y="450" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700">${xmlEscape(website.replace(/^https?:\/\//, ''))}</text>
</svg>`, [emblem, name, title, bio, website, palette, customBgColor]);

  const currentAsset = previewMode === 'banner'
    ? { svg: bannerSvg, width: 1280, height: 320, name: 'linacre-github-banner' }
    : previewMode === 'avatar'
      ? { svg: avatarSvg, width: 512, height: 512, name: 'linacre-avatar' }
      : { svg: socialSvg, width: 1200, height: 630, name: 'linacre-social-card' };

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1_600);
  };

  const pushRecentColor = (hex: string) => {
    setRecentColors((previous) => [hex, ...previous.filter((entry) => entry !== hex)].slice(0, 10));
  };

  /** Pick any colour for the active target token — always switches into Custom mode. */
  const pickColour = (hex: string, target: ColorTarget = colorTarget) => {
    const normalized = normalizeHex(hex);
    if (!normalized) return;
    if (target === 'primary') setCustomPrimary(normalized);
    else setCustomSecondary(normalized);
    setPaletteId('custom');
    pushRecentColor(normalized);
  };

  const applyHarmony = (harmony: HarmonyId) => {
    pickColour(palette.primary, 'primary');
    pickColour(harmonySecondary(palette.primary, harmony), 'secondary');
  };

  const autoFixContrast = () => {
    setCustomPrimary(fixContrast(palette.primary, BRAND_DARK));
    setCustomSecondary(fixContrast(palette.secondary, BRAND_DARK));
    setPaletteId('custom');
  };

  const openEyeDropper = async () => {
    try {
      const Dropper = (window as unknown as { EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> } }).EyeDropper;
      if (!Dropper) return;
      const result = await new Dropper().open();
      if (result?.sRGBHex) pickColour(result.sRGBHex);
    } catch {
      // User cancelled the eyedropper — nothing to change.
    }
  };

  /* Emblem Lab helpers */
  const labKeys = useMemo(() => {
    const keys: string[] = [];
    for (let i = 0; i < LAB_TILES_PER_BATCH; i++) {
      keys.push(makeGenKey({ family: labFamily, symmetry: labSym, complexity: labCpx, word: `${labWord}·b${labBatch}·${i}` }));
    }
    return keys;
  }, [labFamily, labSym, labCpx, labWord, labBatch]);

  const selectMark = (key: string, tab: MarkTab) => {
    setFrame(key);
    setMarkTab(tab);
    if (isGenFrame(key)) {
      const cfg = parseGenKey(key);
      setLabFamily(cfg.family);
      setLabSym(cfg.symmetry);
      setLabCpx(cfg.complexity);
    }
  };

  const toggleFavourite = (key: string) => {
    setFavMarks((previous) => (previous.includes(key) ? previous.filter((entry) => entry !== key) : [key, ...previous].slice(0, 24)));
  };

  const surpriseMe = () => {
    setLabWord(randomSeedWord());
    setLabFamily('mix');
    setLabSym(2 + Math.floor(Math.random() * 7));
    setLabCpx(1 + Math.floor(Math.random() * 10));
    setLabBatch(0);
  };

  /* Custom emblem uploads */
  const readUploads = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    const file = files[0];
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(`“${file.name}” is ${(file.size / 1024).toFixed(0)} KB — keep uploads under 300 KB so they stay fast and storable.`);
      return;
    }
    if (customEmblems.length >= MAX_CUSTOM_EMBLEMS) {
      setUploadError(`Up to ${MAX_CUSTOM_EMBLEMS} uploaded marks — delete one before adding another.`);
      return;
    }
    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    const isImage = isSvg || ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type);
    if (!isImage) {
      setUploadError('SVG, PNG, JPG, WebP or GIF only — everything stays on this device.');
      return;
    }
    const id = `custom-${Date.now().toString(36)}`;
    const label = (file.name.replace(/\.[^.]+$/, '') || 'Uploaded mark').slice(0, 28);
    if (isSvg) {
      const text = await file.text();
      if (!text.includes('<svg')) {
        setUploadError('That SVG file has no <svg> markup inside.');
        return;
      }
      const sanitized = text.replace(/<script[\s\S]*?<\/script>/gi, '').slice(0, 200_000);
      const emblem: CustomEmblem = { id, name: label, type: 'svg', content: sanitized };
      setCustomEmblems((previous) => [...previous, emblem]);
      selectMark(id, 'upload');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const emblem: CustomEmblem = { id, name: label, type: 'image', content: reader.result };
      setCustomEmblems((previous) => [...previous, emblem]);
      selectMark(id, 'upload');
    };
    reader.onerror = () => setUploadError('Could not read that file — try another image.');
    reader.readAsDataURL(file);
  };

  const removeCustomEmblem = (id: string) => {
    setCustomEmblems((previous) => previous.filter((entry) => entry.id !== id));
    if (frame === id) setFrame('dl-geo');
  };

  const handleGenerateAiIcon = async (promptToUse?: string) => {
    const query = (promptToUse !== undefined ? promptToUse : aiPrompt).trim();
    if (!query) return;
    setAiGenerating(true);
    setAiError(null);

    try {
      const response = await fetch('/api/generate-icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          primaryColor: palette.primary,
          secondaryColor: palette.secondary,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.svg) {
        throw new Error(data.error || 'Failed to generate SVG icon from prompt.');
      }

      const id = `custom-ai-${Date.now().toString(36)}`;
      const label = (query.slice(0, 24) || 'AI Generated Mark');
      const emblem: CustomEmblem = {
        id,
        name: label,
        type: 'svg',
        content: data.svg,
      };

      setCustomEmblems((previous) => [...previous, emblem]);
      selectMark(id, 'ai');
    } catch (err: any) {
      console.error('AI Icon Error:', err);
      setAiError(err.message || 'Could not generate icon. Ensure API key is configured or try another prompt.');
    } finally {
      setAiGenerating(false);
    }
  };

  const cssTokens = `:root {
  --brand-primary: ${palette.primary};
  --brand-secondary: ${palette.secondary};
  --brand-background: #030c14;
  --brand-surface: #081c28;
  --brand-text: #ecfeff;
  --brand-muted: #9ab7c3;
  --brand-gradient: linear-gradient(135deg, ${palette.primary}, ${palette.secondary});
}`;

  const applyCyberPreset = () => {
    setPaletteId('cyber');
    setCustomPrimary('#22D3EE');
    setCustomSecondary('#34D399');
    setFrame('dl-geo');
    setMarkTab('curated');
    setFontId('cyber');
    setMotionMode('pulse');
    setGlow(2);
  };

  const copyThemeLink = () => {
    const url = new URL('/identity', window.location.origin);
    url.searchParams.set('brand_color', palette.id);
    url.searchParams.set('brand_font', activeFont.id);
    url.searchParams.set('brand_frame', frame);
    url.searchParams.set('brand_motion', motionMode);
    url.searchParams.set('brand_glow', String(glow));
    url.searchParams.set('brand_name', name);
    if (palette.id === 'custom') {
      url.searchParams.set('brand_primary', palette.primary);
      url.searchParams.set('brand_secondary', palette.secondary);
    }
    copy(url.toString(), 'link');
  };

  const darkContrast = contrastRatio(palette.primary, BRAND_DARK);
  const activeTargetColor = colorTarget === 'primary' ? customPrimary : customSecondary;

  const MARK_TABS: Array<{ id: MarkTab; label: string; icon: typeof Layers }> = [
    { id: 'curated', label: 'Curated', icon: Layers },
    { id: 'lab', label: 'Emblem Lab ∞', icon: FlaskConical },
    { id: 'ai', label: 'AI Prompt ✨', icon: WandSparkles },
    { id: 'upload', label: 'Upload', icon: Upload },
  ];

  return (
    <div className="space-y-10 pb-12" id="identity-brand-studio">
      <section className="relative overflow-hidden rounded-3xl border border-border-color bg-[var(--linacre-panel)] p-6 shadow-[var(--linacre-card-shadow)] sm:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-color">
              <ShieldCheck className="h-4 w-4" /> Identity Studio v7
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
              One identity. Endless marks. Every colour.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Pick any two colours in the spectrum, generate infinite unique emblems in the Emblem Lab — free, on-device and deterministic — then preview and export production-ready SVG or PNG assets. No accounts, no uploads, no guesswork.
            </p>
          </div>
          <button
            onClick={applyCyberPreset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018] shadow-[0_0_28px_rgba(34,211,238,.2)] hover:bg-amber-glow"
          >
            <WandSparkles className="h-4 w-4" /> Apply CyberBlue preset
          </button>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-amber-color" />
              <h2 className="font-display text-base font-bold text-foreground">1. Colour system</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PALETTES.map((option) => {
                const active = option.id === palette.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPaletteId(option.id)}
                    title={option.description}
                    className={`rounded-xl border p-2.5 text-left transition-all ${active ? 'bg-muted/40' : 'border-border-color bg-background/20 hover:bg-muted/20'}`}
                    style={active ? { borderColor: option.primary, boxShadow: `0 0 0 1px ${option.primary}22` } : undefined}
                  >
                    <span className="flex gap-1">
                      <span className="h-6 w-1/2 rounded-md ring-1 ring-white/10" style={{ background: option.primary }} />
                      <span className="h-6 w-1/2 rounded-md ring-1 ring-white/10" style={{ background: option.secondary }} />
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-1 font-mono text-[10px] font-bold text-foreground">
                      {option.name}
                      {active && <Check className="h-3 w-3 shrink-0" style={{ color: option.secondary }} />}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => setPaletteId('custom')}
                title="Your own two-colour system, tuned box by box."
                className={`rounded-xl border p-2.5 text-left transition-all ${palette.id === 'custom' ? 'bg-muted/40' : 'border-dashed border-border-color bg-background/20 hover:bg-muted/20'}`}
                style={palette.id === 'custom' ? { borderColor: customPrimary, borderStyle: 'solid', boxShadow: `0 0 0 1px ${customPrimary}22` } : undefined}
              >
                <span className="flex gap-1">
                  <span className="h-6 w-1/2 rounded-md ring-1 ring-white/10" style={{ background: customPrimary }} />
                  <span className="h-6 w-1/2 rounded-md ring-1 ring-white/10" style={{ background: customSecondary }} />
                </span>
                <span className="mt-2 flex items-center justify-between gap-1 font-mono text-[10px] font-bold text-foreground">
                  Custom
                  {palette.id === 'custom' && <Check className="h-3 w-3 shrink-0" style={{ color: customSecondary }} />}
                </span>
              </button>
            </div>

            {/* Custom colour lab — boxes for everything, the whole spectrum behind one box */}
            <div className="mt-4 rounded-xl border border-border-color bg-background/25 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <SwatchBook className="h-3.5 w-3.5 text-amber-color" /> Custom colour lab
                </span>
                <div className="flex rounded-lg border border-border-color bg-background/40 p-0.5" role="tablist" aria-label="Colour target">
                  {(['primary', 'secondary'] as ColorTarget[]).map((target) => {
                    const active = colorTarget === target;
                    const chip = target === 'primary' ? customPrimary : customSecondary;
                    return (
                      <button
                        key={target}
                        onClick={() => setColorTarget(target)}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[10px] font-bold capitalize ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        style={active ? { background: `${chip}26`, boxShadow: `inset 0 0 0 1px ${chip}66` } : undefined}
                      >
                        <span className="h-3 w-3 rounded-sm ring-1 ring-white/25" style={{ background: chip }} />
                        {target}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                {SWATCH_ROWS.map((row) => (
                  <div key={row.name} className="grid grid-cols-[3.4rem_1fr] items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">{row.name}</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {row.colors.map((color) => (
                        <SwatchBox key={color} color={color} active={activeTargetColor === color} onPick={pickColour} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                <label
                  className="relative block h-11 cursor-pointer overflow-hidden rounded-xl ring-1 ring-white/15 transition-transform hover:scale-[1.01]"
                  style={{ background: ANY_COLOR_GRADIENT }}
                  title="Open the full-spectrum colour picker"
                >
                  <input
                    type="color"
                    value={activeTargetColor}
                    onChange={(event) => pickColour(event.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Pick any colour from the full spectrum"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/35 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    <Pipette className="h-3.5 w-3.5" /> Any colour · full spectrum
                  </span>
                </label>
                <div className="flex gap-2">
                  {hasEyeDropper && (
                    <button
                      onClick={openEyeDropper}
                      title="Sample a colour from anywhere on screen"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border-color bg-muted/20 px-3 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50"
                    >
                      <Pipette className="h-4 w-4" /> Sample
                    </button>
                  )}
                  <div className="w-28">
                    <HexField value={activeTargetColor} onCommit={pickColour} />
                  </div>
                </div>
              </div>

              {recentColors.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">Recent</span>
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => pickColour(color)}
                      title={color}
                      className={`h-6 w-6 rounded-md transition-transform hover:scale-110 ${activeTargetColor === color ? 'ring-2 ring-white' : 'ring-1 ring-white/15'}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-border-color/40 space-y-2">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Asset Background Fill</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { name: 'Midnight', hex: '#030c14' },
                    { name: 'Obsidian', hex: '#0b0f19' },
                    { name: 'Cyber Navy', hex: '#061520' },
                    { name: 'Deep Purple', hex: '#120824' },
                    { name: 'Pure Black', hex: '#000000' }
                  ].map((bgOption) => (
                    <button
                      key={bgOption.name}
                      onClick={() => setCustomBgColor(bgOption.hex)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-mono cursor-pointer transition-all ${
                        customBgColor === bgOption.hex ? 'border-amber-color bg-amber-color/10 text-amber-color font-bold' : 'border-border-color bg-background/30 text-muted-foreground'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ background: bgOption.hex }} />
                      {bgOption.name}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="w-7 h-6 rounded cursor-pointer border border-border-color bg-transparent"
                    title="Pick custom background color"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">Harmony</span>
                {([
                  ['complement', 'Complement'],
                  ['analogous', 'Analogous'],
                  ['triadic', 'Triadic'],
                  ['mono', 'Soft mono'],
                ] as Array<[HarmonyId, string]>).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => applyHarmony(id)}
                    title={`Set secondary from primary · ${label}`}
                    className="rounded-lg border border-border-color bg-background/40 px-2 py-1.5 font-mono text-[9px] font-bold text-muted-foreground hover:border-amber-color/50 hover:text-foreground"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <ContrastChip label="Primary" color={palette.primary} />
                <ContrastChip label="Secondary" color={palette.secondary} />
                {(darkContrast < 4.5 || contrastRatio(palette.secondary, BRAND_DARK) < 4.5) && (
                  <button
                    onClick={autoFixContrast}
                    className="rounded-lg border border-error/40 bg-error/10 px-2 py-1 font-mono text-[9px] font-bold text-error hover:border-error"
                  >
                    Auto-fix to AA
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-color" />
                <h2 className="font-display text-base font-bold text-foreground">2. Mark and motion</h2>
              </div>
              {isGenFrame(frame) && (
                <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-border-color bg-background/40 px-2 py-1 font-mono text-[9px] font-bold text-muted-foreground" title={frame}>
                  <FlaskConical className="h-3 w-3 shrink-0 text-amber-color" /> {labelForKey(frame)}
                </span>
              )}
            </div>

            <div className="mb-4 flex rounded-xl border border-border-color bg-background/30 p-1" role="tablist" aria-label="Mark source">
              {MARK_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMarkTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-mono text-[10px] font-bold ${markTab === tab.id ? 'text-[#031018]' : 'text-muted-foreground hover:text-foreground'}`}
                  style={markTab === tab.id ? { background: palette.primary } : undefined}
                >
                  <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {markTab === 'curated' && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FRAMES.map((option) => {
                  const active = option.id === frame;
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectMark(option.id, 'curated')}
                      className={`rounded-xl border p-3 text-left transition-all ${active ? 'bg-muted/40' : 'border-border-color bg-background/20 hover:bg-muted/20'}`}
                      style={active ? { borderColor: palette.primary } : undefined}
                    >
                      <span className="mx-auto block h-12 w-12" dangerouslySetInnerHTML={{ __html: getEmblemSVG(option.id, palette.primary, palette.secondary, 'static', 'slow', 1, customEmblems) }} />
                      <span className="mt-2 block font-mono text-[10px] font-bold text-foreground">{option.name}</span>
                      <span className="mt-0.5 block text-[9px] text-muted-foreground">{option.description}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {markTab === 'lab' && (
              <div>
                <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <label className="relative block">
                    <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Seed word — same word, same marks</span>
                    <input
                      value={labWord}
                      onChange={(event) => { setLabWord(event.target.value.slice(0, 32)); setLabBatch(0); }}
                      placeholder="type anything — your name, a vibe…"
                      className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 pr-10 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-amber-color focus:outline-none"
                    />
                    <button
                      onClick={() => { setLabWord(randomSeedWord()); setLabBatch(0); }}
                      title="Dice a new seed word"
                      aria-label="Dice a new seed word"
                      className="absolute bottom-2 right-2 rounded-md p-1.5 text-muted-foreground hover:text-amber-color"
                    >
                      <Dices className="h-4 w-4" />
                    </button>
                  </label>
                  <button
                    onClick={surpriseMe}
                    className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-amber-color px-3 py-2.5 font-mono text-[10px] font-bold text-[#031018] hover:bg-amber-glow"
                  >
                    <Shuffle className="h-4 w-4" /> Surprise me
                  </button>
                </div>

                <div className="mb-3 grid gap-2 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Family</span>
                    <select
                      value={labFamily}
                      onChange={(event) => { setLabFamily(event.target.value as GenFamilyId); setLabBatch(0); }}
                      className="h-10 w-full rounded-xl border border-border-color bg-background/40 px-2 font-mono text-[10px] font-bold text-foreground focus:border-amber-color focus:outline-none"
                    >
                      <option value="mix">Surprise mix</option>
                      {GEN_FAMILIES.map((family) => (
                        <option key={family.id} value={family.id}>{family.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Symmetry · {labSym}-fold</span>
                    <input type="range" min="2" max="8" value={labSym} onChange={(event) => { setLabSym(Number(event.target.value)); setLabBatch(0); }} className="mt-2.5 w-full" aria-label="Symmetry folds" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Complexity · L{labCpx}</span>
                    <input type="range" min="1" max="10" value={labCpx} onChange={(event) => { setLabCpx(Number(event.target.value)); setLabBatch(0); }} className="mt-2.5 w-full" aria-label="Complexity level" />
                  </label>
                </div>

                {favMarks.length > 0 && (
                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Kept marks · {favMarks.length}</span>
                      <button onClick={() => setFavMarks([])} className="font-mono text-[9px] font-bold text-muted-foreground hover:text-error">Clear all</button>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {favMarks.map((key) => (
                        <div key={key} className="w-14 shrink-0">
                          <MarkTile
                            frameKey={key}
                            primary={palette.primary}
                            secondary={palette.secondary}
                            customEmblems={customEmblems}
                            active={frame === key}
                            onSelect={() => selectMark(key, 'lab')}
                            favourite
                            onToggleFavourite={() => toggleFavourite(key)}
                            label={labelForKey(key)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2">
                  {labKeys.map((key) => (
                    <MarkTile
                      key={key}
                      frameKey={key}
                      primary={palette.primary}
                      secondary={palette.secondary}
                      customEmblems={customEmblems}
                      active={frame === key}
                      onSelect={() => selectMark(key, 'lab')}
                      favourite={favMarks.includes(key)}
                      onToggleFavourite={() => toggleFavourite(key)}
                      label={labelForKey(key)}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] text-muted-foreground" title="Deterministic generator — zero cost, zero uploads">Endless by design · batch {labBatch + 1}</span>
                  <button
                    onClick={() => setLabBatch((value) => value + 1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border-color bg-muted/20 px-3 py-2 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> More marks ∞
                  </button>
                </div>
              </div>
            )}

            {markTab === 'ai' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-color/30 bg-background/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-color">
                      <WandSparkles className="h-3.5 w-3.5 text-amber-color" /> AI Vector Studio · Gemini 3.6 Flash
                    </span>
                    <span className="font-mono text-[9px] text-emerald-color font-semibold">Live SVG Generator</span>
                  </div>

                  <div className="relative">
                    <input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateAiIcon(); }}
                      placeholder="e.g. Cybernetic dragon shield, quantum matrix core, futuristic neon owl..."
                      className="h-11 w-full rounded-xl border border-border-color bg-background/50 pl-3 pr-28 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-amber-color focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateAiIcon()}
                      disabled={aiGenerating || !aiPrompt.trim()}
                      className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-amber-color hover:bg-amber-glow font-mono text-[10px] font-bold text-[#031018] flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      {aiGenerating ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" /> Generate
                        </>
                      )}
                    </button>
                  </div>

                  {/* Preset prompt pills */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">Sample Prompts:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '⚡ Cybernetic Quantum Shield',
                        '🔮 Holographic Matrix Core',
                        '🦅 Laser Falcon Crest',
                        '🐱 Neon Cyber Cat Monogram',
                        '🧬 Bio-Digital DNA Helix'
                      ].map((presetPrompt) => (
                        <button
                          key={presetPrompt}
                          type="button"
                          onClick={() => {
                            setAiPrompt(presetPrompt);
                            handleGenerateAiIcon(presetPrompt);
                          }}
                          disabled={aiGenerating}
                          className="rounded-lg border border-border-color bg-background/40 px-2 py-1 font-mono text-[9px] text-muted-foreground hover:border-amber-color/50 hover:text-amber-color transition-colors"
                        >
                          {presetPrompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {aiError && (
                    <p className="font-mono text-[10px] text-rose-400 bg-rose-950/20 p-2 rounded-lg border border-rose-500/30">
                      {aiError}
                    </p>
                  )}
                </div>

                {/* Grid of AI generated custom emblems */}
                {customEmblems.filter(e => e.id.startsWith('custom-ai-')).length > 0 && (
                  <div>
                    <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Generated AI Marks</span>
                    <div className="grid grid-cols-4 gap-2">
                      {customEmblems.filter(e => e.id.startsWith('custom-ai-')).map((custom) => (
                        <div key={custom.id} className="relative">
                          <MarkTile
                            frameKey={custom.id}
                            primary={palette.primary}
                            secondary={palette.secondary}
                            customEmblems={customEmblems}
                            active={frame === custom.id}
                            onSelect={() => selectMark(custom.id, 'ai')}
                            label={custom.name}
                          />
                          <button
                            onClick={() => removeCustomEmblem(custom.id)}
                            title={`Delete ${custom.name}`}
                            aria-label={`Delete ${custom.name}`}
                            className="absolute left-1 top-1 rounded-md bg-[#030c14]/80 p-1 text-muted-foreground hover:text-rose-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {markTab === 'upload' && (
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => { event.preventDefault(); readUploads(event.dataTransfer.files); }}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-color bg-background/20 px-4 py-6 text-center hover:border-amber-color/50 hover:bg-muted/10"
                >
                  <Upload className="h-5 w-5 text-amber-color" />
                  <span className="font-mono text-[10px] font-bold text-foreground">Drop or browse — SVG, PNG, JPG, WebP</span>
                  <span className="text-[9px] text-muted-foreground">Under 300 KB · stays on this device · exports with your palette behind it</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.webp,.gif,image/svg+xml,image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => { readUploads(event.target.files); event.target.value = ''; }}
                />
                {uploadError && <p className="mt-2 font-mono text-[10px] text-error">{uploadError}</p>}

                {customEmblems.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {customEmblems.map((custom) => (
                      <div key={custom.id} className="relative">
                        <MarkTile
                          frameKey={custom.id}
                          primary={palette.primary}
                          secondary={palette.secondary}
                          customEmblems={customEmblems}
                          active={frame === custom.id}
                          onSelect={() => selectMark(custom.id, 'upload')}
                          label={custom.name}
                        />
                        <button
                          onClick={() => removeCustomEmblem(custom.id)}
                          title={`Delete ${custom.name}`}
                          aria-label={`Delete ${custom.name}`}
                          className="absolute left-1 top-1 rounded-md bg-[#030c14]/80 p-1 text-muted-foreground hover:text-error"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Motion</label>
                <div className="flex rounded-xl border border-border-color bg-background/30 p-1">
                  {[
                    ['static', 'Static'],
                    ['pulse', 'Pulse'],
                    ['spin', 'Orbit'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setMotionMode(id)}
                      className={`flex-1 rounded-lg px-2 py-2 font-mono text-[10px] font-bold ${motionMode === id ? 'text-[#031018]' : 'text-muted-foreground hover:text-foreground'}`}
                      style={motionMode === id ? { background: palette.primary } : undefined}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <label htmlFor="brand-glow">Glow</label><span style={{ color: palette.primary }}>{glow}/4</span>
                </div>
                <input id="brand-glow" type="range" min="0" max="4" value={glow} onChange={(event) => setGlow(Number(event.target.value))} className="w-full" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Type className="h-4 w-4 text-amber-color" />
              <h2 className="font-display text-base font-bold text-foreground">3. Type and profile</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {FONTS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFontId(option.id)}
                  className={`rounded-xl border p-3 text-left ${option.id === activeFont.id ? 'bg-muted/40' : 'border-border-color bg-background/20'}`}
                  style={option.id === activeFont.id ? { borderColor: palette.primary } : undefined}
                >
                  <span className="block text-xs font-bold text-foreground" style={{ fontFamily: option.display }}>{option.name}</span>
                  <span className="mt-1 block text-[9px] text-muted-foreground">{option.sample}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Display name</span>
                <input value={name} onChange={(event) => setName(event.target.value.toUpperCase())} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Professional line</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 text-xs text-foreground focus:border-amber-color focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Short bio</span>
                <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-border-color bg-background/40 p-3 text-xs leading-5 text-foreground focus:border-amber-color focus:outline-none" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 font-mono text-[10px] text-foreground focus:border-amber-color focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website</span>
                  <input value={website} onChange={(event) => setWebsite(event.target.value)} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 font-mono text-[10px] text-foreground focus:border-amber-color focus:outline-none" />
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] shadow-[var(--linacre-card-shadow)]">
            <div className="flex flex-col justify-between gap-3 border-b border-border-color bg-muted/20 p-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <LayoutTemplate className="h-4 w-4 text-amber-color" /> Live export preview
              </div>
              <div className="flex rounded-xl border border-border-color bg-background/40 p-1" role="tablist" aria-label="Asset preview">
                {[
                  ['banner', 'GitHub', Github],
                  ['avatar', 'Avatar', CircleUserRound],
                  ['social', 'Social', ImageIcon],
                ].map(([id, label, Icon]) => (
                  <button
                    key={id as string}
                    onClick={() => setPreviewMode(id as PreviewMode)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[10px] font-bold ${previewMode === id ? 'text-[#031018]' : 'text-muted-foreground hover:text-foreground'}`}
                    style={previewMode === id ? { background: palette.primary } : undefined}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label as string}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#020a11] p-4 sm:p-6">
              <motion.div
                key={`${previewMode}-${palette.id}-${palette.primary}-${palette.secondary}-${frame}-${fontId}`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mx-auto overflow-hidden rounded-xl border border-white/10 shadow-2xl ${previewMode === 'avatar' ? 'max-w-sm' : 'w-full'}`}
                style={{ aspectRatio: `${currentAsset.width}/${currentAsset.height}` }}
                dangerouslySetInnerHTML={{ __html: currentAsset.svg }}
              />
            </div>

            <div className="grid gap-2 border-t border-border-color p-4 sm:grid-cols-3">
              <button onClick={() => downloadText(currentAsset.svg, `${currentAsset.name}.svg`)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-color px-3 py-2.5 font-mono text-[10px] font-bold text-[#031018] hover:bg-amber-glow">
                <Download className="h-4 w-4" /> SVG
              </button>
              <button onClick={() => svgToPng(currentAsset.svg, `${currentAsset.name}.png`, currentAsset.width, currentAsset.height)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color bg-muted/20 px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                <FileImage className="h-4 w-4" /> PNG
              </button>
              <button onClick={() => copy(currentAsset.svg, 'asset')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color bg-muted/20 px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                {copied === 'asset' ? <Check className="h-4 w-4 text-emerald-color" /> : <Copy className="h-4 w-4" />} {copied === 'asset' ? 'Copied' : 'Copy code'}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-foreground">Export the full asset set</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">Exact dimensions, transparent-safe SVG, and crisp PNG rendering.</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-color" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { label: 'Logo SVG', note: 'Scalable mark', icon: Sparkles, action: () => downloadText(emblem, 'linacre-emblem.svg') },
                { label: 'GitHub banner', note: '1280 × 320 PNG', icon: Github, action: () => svgToPng(bannerSvg, 'linacre-github-banner.png', 1280, 320) },
                { label: 'Social card', note: '1200 × 630 PNG', icon: ImageIcon, action: () => svgToPng(socialSvg, 'linacre-social-card.png', 1200, 630) },
                { label: 'Avatar', note: '512 × 512 PNG', icon: CircleUserRound, action: () => svgToPng(avatarSvg, 'linacre-avatar.png', 512, 512) },
              ].map((asset) => (
                <button key={asset.label} onClick={asset.action} className="group flex items-center gap-3 rounded-xl border border-border-color bg-background/25 p-3 text-left hover:border-amber-color/45 hover:bg-muted/20">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-color/10 text-amber-color"><asset.icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-mono text-[10px] font-bold text-foreground">{asset.label}</span><span className="mt-0.5 block text-[9px] text-muted-foreground">{asset.note}</span></span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-amber-color" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-amber-color" /><h2 className="font-display text-base font-bold text-foreground">Brand tokens</h2></div>
              <button onClick={() => copy(cssTokens, 'tokens')} className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-color hover:text-amber-glow">
                {copied === 'tokens' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied === 'tokens' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border-color bg-[#020a11] p-4 font-mono text-[10px] leading-5 text-[#9ab7c3]">{cssTokens}</pre>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button onClick={copyThemeLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                {copied === 'link' ? <Check className="h-4 w-4 text-emerald-color" /> : <Link2 className="h-4 w-4" />} {copied === 'link' ? 'Theme link copied' : 'Copy theme link'}
              </button>
              <button onClick={applyCyberPreset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                <RefreshCw className="h-4 w-4" /> Reset to system default
              </button>
            </div>
          </section>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Github, title: 'GitHub', text: 'Use the wide banner and geometric DL mark. Keep README headers short and useful.' },
          { icon: Mail, title: 'Email and documents', text: `Use ${email} and the CyberBlue palette on a plain dark or white surface.` },
          { icon: ImageIcon, title: 'Social profiles', text: 'Use the square avatar at small sizes and the 1200 × 630 card for shared links.' },
        ].map((rule) => (
          <div key={rule.title} className="rounded-2xl border border-border-color bg-muted/10 p-5">
            <rule.icon className="h-5 w-5 text-amber-color" />
            <h2 className="mt-4 font-display text-base font-bold text-foreground">{rule.title}</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{rule.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

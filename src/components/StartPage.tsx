import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Binary,
  Braces,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  KeyRound,
  Layers,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Trash2,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import EverydayTools from './EverydayTools';

type UtilityId = 'json' | 'base64' | 'time' | 'generate';
type CopyTarget = 'json' | 'base64' | 'timestamp' | 'generator' | null;

interface StartPageProps {
  navigate: (tab: string) => void;
}

const utilities: Array<{
  id: UtilityId;
  label: string;
  description: string;
  icon: typeof Braces;
}> = [
  { id: 'json', label: 'JSON', description: 'Format & validate', icon: Braces },
  { id: 'base64', label: 'Base64', description: 'Encode & decode', icon: Binary },
  { id: 'time', label: 'Timestamp', description: 'Unix & ISO time', icon: Clock },
  { id: 'generate', label: 'Generate', description: 'UUID & password', icon: KeyRound },
];

const products = [
  {
    name: "Nic's Food Decider 🍕",
    eyebrow: "What's for dinner?",
    description: "One-click decision engine for meals. Cook or takeaway with weighted random choices.",
    url: 'https://nic-food-decider.vercel.app',
    action: 'Decide Dinner',
    icon: UtensilsCrossed,
    accent: 'amber',
  },
  {
    name: 'APKHub 📱',
    eyebrow: 'Android App Indexer',
    description: 'Discover and download official open-source Android APK releases directly from GitHub & F-Droid.',
    url: 'https://apkhub-alpha.vercel.app',
    action: 'Open APKHub',
    icon: Smartphone,
    accent: 'cyan',
  },
  {
    name: 'Linacre Uninstaller 📦',
    eyebrow: 'Android Debloat Utility',
    description: 'Downloadable Android cleanup app with app labels, safety tiers, and scoped batch-uninstall flow.',
    url: 'https://github.com/LIN4CRE/LinacreUninstaller/releases/latest',
    action: 'Download APK',
    icon: Download,
    accent: 'purple',
  },
  {
    name: 'Fleatment 🐱',
    eyebrow: 'Cat Flea Index & Finder',
    description: 'UK cat flea & tick treatment finder with live delivered price comparisons and safety guides.',
    url: 'https://dlinacre.github.io/Fleatment/',
    action: 'Open Fleatment',
    icon: ShieldCheck,
    accent: 'cyan',
  },
  {
    name: 'Personal OP Agent',
    eyebrow: 'Zero-setup AI workspace',
    description: 'Single-file HTML AI workspace and prompt controller running 100% in your browser.',
    url: '/tools/opagent.html',
    action: 'Launch OP Agent',
    icon: Sparkles,
    accent: 'cyan',
  },
  {
    name: 'Arena Audit',
    eyebrow: 'Universal audit prompt builder',
    description: 'Modular browser audit prompt builder for codebases, UX, security, and performance.',
    url: 'https://dlinacre.github.io/a-audit/',
    action: 'Build audit prompt',
    icon: ShieldCheck,
    accent: 'purple',
  },
  {
    name: 'Mob Deals',
    eyebrow: 'Make a better choice',
    description: 'Compare UK SIM-only deals and keep your number with a plain-English switching guide.',
    url: 'https://dlinacre.github.io/mob-deals/',
    action: 'Compare mobile deals',
    icon: Smartphone,
    accent: 'cyan',
  },
  {
    name: 'PokeGuru',
    eyebrow: 'Search & track',
    description: 'Find Pokémon cards, browse 126 UK sets, and track a collection in GBP.',
    url: 'https://lin4cre.github.io/PokeGuru/',
    action: 'Search Pokémon cards',
    icon: Sparkles,
    accent: 'purple',
  },
  {
    name: 'DKMA Monster',
    eyebrow: 'Keep Android apps alive',
    description: 'Find exact battery and autostart settings for 15 Android phone families, plus GUI tool.',
    url: 'https://lin4cre.github.io/dkma-monster/',
    action: 'Fix background apps',
    icon: ShieldCheck,
    accent: 'emerald',
  },
  {
    name: 'Apex POS',
    eyebrow: 'Run a small business',
    description: 'Offline-first point of sale with stock, customers, expenses, receipts, and reports.',
    url: 'https://dlinacre.github.io/Apex-POS/',
    action: 'Open Apex POS',
    icon: Store,
    accent: 'amber',
  },
] as const;

function secureUuid() {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi) throw new Error('Secure random generation is not supported in this browser.');
  return cryptoApi.randomUUID();
}

function securePassword(length: number) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi) throw new Error('Secure random generation is not supported in this browser.');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-=?';
  const random = new Uint32Array(length);
  cryptoApi.getRandomValues(random);
  return [...random].map((value) => alphabet[value % alphabet.length]).join('');
}

function relativeTime(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
    ['second', 1],
  ];
  const [unit, divisor] = units.find(([, value]) => Math.abs(seconds) >= value) || units[units.length - 1];
  return formatter.format(Math.round(seconds / divisor), unit);
}

export default function StartPage({ navigate }: StartPageProps) {
  const [now, setNow] = useState(() => new Date());
  const [searchInput, setSearchInput] = useState('');
  const [activeUtility, setActiveUtility] = useState<UtilityId>('json');
  const [copied, setCopied] = useState<CopyTarget>(null);

  const [jsonValue, setJsonValue] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [base64Value, setBase64Value] = useState('');
  const [base64Error, setBase64Error] = useState('');
  const [timestampValue, setTimestampValue] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [generatedType, setGeneratedType] = useState<'uuid' | 'password'>('uuid');
  const [passwordLength, setPasswordLength] = useState(20);
  const [generatedValue, setGeneratedValue] = useState<string>(() => secureUuid());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [now]);

  const parsedTimestamp = useMemo(() => {
    const raw = timestampValue.trim();
    if (!raw) return null;

    let date: Date;
    if (/^-?\d+(\.\d+)?$/.test(raw)) {
      const number = Number(raw);
      const milliseconds = Math.abs(number) < 10_000_000_000 ? number * 1000 : number;
      date = new Date(milliseconds);
    } else {
      date = new Date(raw);
    }

    return Number.isNaN(date.getTime()) ? null : date;
  }, [timestampValue]);

  const copyText = async (text: string, target: Exclude<CopyTarget, null>) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1_600);
  };

  const formatJson = (minify = false) => {
    if (!jsonValue.trim()) {
      setJsonError('Paste JSON first.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonValue(JSON.stringify(parsed, null, minify ? 0 : 2));
      setJsonError('');
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'That is not valid JSON.');
    }
  };

  const transformBase64 = (mode: 'encode' | 'decode') => {
    if (!base64Value) return;
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(base64Value);
        let binary = '';
        bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
        setBase64Value(btoa(binary));
      } else {
        const binary = atob(base64Value.replace(/\s/g, ''));
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        setBase64Value(new TextDecoder().decode(bytes));
      }
      setBase64Error('');
    } catch {
      setBase64Error('Could not decode this value. Check that it is valid Base64.');
    }
  };

  const generateValue = (type = generatedType, length = passwordLength) => {
    setGeneratedType(type);
    setGeneratedValue(type === 'uuid' ? secureUuid() : securePassword(length));
  };

  const selectUtility = (utility: UtilityId) => {
    setActiveUtility(utility);
    window.setTimeout(() => document.getElementById('quick-utility')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 20);
  };

  const handleSmartAction = (event: FormEvent) => {
    event.preventDefault();
    const value = searchInput.trim();
    if (!value) return;

    const [command, ...rest] = value.split(' ');
    const commandValue = rest.join(' ').trim();

    if (command.toLowerCase() === 'json') {
      setJsonValue(commandValue);
      setSearchInput('');
      selectUtility('json');
      return;
    }
    if (command.toLowerCase() === 'base64') {
      setBase64Value(commandValue);
      setSearchInput('');
      selectUtility('base64');
      return;
    }
    if (['uuid', 'password', 'pass'].includes(command.toLowerCase())) {
      const type = command.toLowerCase() === 'uuid' ? 'uuid' : 'password';
      generateValue(type);
      setSearchInput('');
      selectUtility('generate');
      return;
    }
    if (['time', 'timestamp'].includes(command.toLowerCase())) {
      if (commandValue) setTimestampValue(commandValue);
      setSearchInput('');
      selectUtility('time');
      return;
    }

    const hasProtocol = /^https?:\/\//i.test(value);
    const looksLikeDomain = /^[\w-]+(?:\.[\w-]+)+(?:\/\S*)?$/.test(value);
    if (hasProtocol || looksLikeDomain) {
      window.open(hasProtocol ? value : `https://${value}`, '_blank', 'noopener,noreferrer');
      return;
    }
    window.open(`https://duckduckgo.com/?q=${encodeURIComponent(value)}`, '_blank', 'noopener,noreferrer');
  };

  const accentClasses: Record<(typeof products)[number]['accent'], string> = {
    cyan: 'text-cyan bg-cyan/10 border-cyan/20',
    purple: 'text-purple-color bg-purple-color/10 border-purple-color/20',
    emerald: 'text-emerald-color bg-emerald-color/10 border-emerald-color/20',
    amber: 'text-amber-color bg-amber-color/10 border-amber-color/20',
  };

  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="relative pt-2 sm:pt-6" aria-labelledby="start-heading">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-color/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="rounded-full border border-amber-color/20 bg-amber-color/5 px-3 py-1 text-amber-color">{greeting}</span>
            <span>{now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={now.toISOString()}>{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</time>
          </div>

          <h1 id="start-heading" className="font-display text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
            Get useful work done <span className="text-amber-color">faster</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Search, clean data, generate secure values, convert time, calculate VAT, and launch practical apps. Everything runs locally in your browser — no account, no tracking, no uploads.
          </p>

          <form onSubmit={handleSmartAction} className="mx-auto mt-8 max-w-3xl" role="search">
            <label htmlFor="start-search" className="sr-only">Search the web, open a URL, or run a utility command</label>
            <div className="group relative rounded-2xl border border-amber-color/25 bg-[var(--linacre-panel)] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.25)] transition-all focus-within:border-amber-color/60 focus-within:shadow-[0_0_40px_rgba(34,211,238,0.12)]">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-color" aria-hidden="true" />
              <input
                id="start-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-12 w-full bg-transparent pl-12 pr-28 font-mono text-sm text-foreground placeholder:text-muted-foreground/65 focus:outline-none"
                placeholder="Search, paste a URL, or type “uuid”…"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className="absolute right-2 top-2 flex h-12 items-center gap-2 rounded-xl bg-amber-color px-4 font-mono text-xs font-bold text-[#030c14] transition-all hover:bg-amber-glow cursor-pointer">
                Go <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Quick actions">
            {[
              ['Format JSON', 'json'],
              ['New UUID', 'generate'],
              ['Decode Base64', 'base64'],
              ['Convert time', 'time'],
              ['UK VAT', 'vat'],
              ['Clean text', 'text'],
              ['SHA-256', 'hash'],
              ['Clean URL', 'url'],
            ].map(([label, utility]) => (
              <button
                key={label}
                onClick={() => {
                  if (label === 'New UUID') generateValue('uuid');
                  selectUtility(utility as UtilityId);
                }}
                className="rounded-full border border-border-color bg-muted/25 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-amber-color/35 hover:text-foreground cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="quick-utility" className="scroll-mt-28" aria-labelledby="quick-tools-heading">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-color">Works in your browser</span>
            <h2 id="quick-tools-heading" className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">Quick tools</h2>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-color" aria-hidden="true" />
            Your input stays on this device
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] shadow-[var(--linacre-card-shadow)]">
          <div className="grid grid-cols-2 border-b border-border-color bg-muted/20 sm:grid-cols-4" role="tablist" aria-label="Quick utilities">
            {utilities.map((utility) => {
              const Icon = utility.icon;
              const isActive = activeUtility === utility.id;
              return (
                <button
                  key={utility.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`utility-panel-${utility.id}`}
                  onClick={() => setActiveUtility(utility.id)}
                  className={`relative flex items-center gap-3 border-b border-r border-border-color px-4 py-4 text-left transition-colors sm:border-b-0 ${isActive ? 'bg-amber-color/[0.08] text-foreground' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-color' : ''}`} aria-hidden="true" />
                  <span>
                    <span className="block font-mono text-xs font-bold">{utility.label}</span>
                    <span className="mt-0.5 hidden text-[10px] sm:block">{utility.description}</span>
                  </span>
                  {isActive && <motion.span layoutId="utility-indicator" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-amber-color" />}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-6">
            {activeUtility === 'json' && (
              <div id="utility-panel-json" role="tabpanel" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">JSON formatter & validator</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Paste JSON, then make it readable or compact.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => formatJson(false)} className="rounded-lg bg-amber-color px-3 py-2 font-mono text-xs font-bold text-[#030c14] hover:bg-amber-glow">Format</button>
                    <button onClick={() => formatJson(true)} className="rounded-lg border border-border-color px-3 py-2 font-mono text-xs text-foreground hover:border-amber-color/40">Minify</button>
                    <button onClick={() => copyText(jsonValue, 'json')} className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-foreground" aria-label="Copy JSON">
                      {copied === 'json' ? <Check className="h-4 w-4 text-emerald-color" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button onClick={() => { setJsonValue(''); setJsonError(''); }} className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-error" aria-label="Clear JSON">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={jsonValue}
                  onChange={(event) => { setJsonValue(event.target.value); setJsonError(''); }}
                  className={`min-h-64 w-full resize-y rounded-xl border bg-[#031018] p-4 font-mono text-xs leading-6 text-[#d7dce5] focus:outline-none ${jsonError ? 'border-error' : 'border-border-color focus:border-amber-color/60'}`}
                  placeholder={'{\n  "paste": "your JSON here"\n}'}
                  spellCheck={false}
                  aria-describedby={jsonError ? 'json-error' : undefined}
                />
                <div className="flex min-h-5 items-center justify-between gap-4 font-mono text-[10px]">
                  <span id="json-error" className={jsonError ? 'text-error' : 'text-muted-foreground'}>{jsonError || 'Supports objects, arrays, strings, numbers, booleans, and null.'}</span>
                  <span className="shrink-0 text-muted-foreground">{jsonValue.length.toLocaleString()} characters</span>
                </div>
              </div>
            )}

            {activeUtility === 'base64' && (
              <div id="utility-panel-base64" role="tabpanel" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">Base64 encoder & decoder</h3>
                    <p className="mt-1 text-xs text-muted-foreground">UTF-8 safe conversion for text and small data snippets.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => transformBase64('encode')} className="rounded-lg bg-amber-color px-3 py-2 font-mono text-xs font-bold text-[#030c14] hover:bg-amber-glow">Encode</button>
                    <button onClick={() => transformBase64('decode')} className="rounded-lg border border-border-color px-3 py-2 font-mono text-xs text-foreground hover:border-amber-color/40">Decode</button>
                    <button onClick={() => copyText(base64Value, 'base64')} className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-foreground" aria-label="Copy Base64 value">
                      {copied === 'base64' ? <Check className="h-4 w-4 text-emerald-color" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button onClick={() => { setBase64Value(''); setBase64Error(''); }} className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-error" aria-label="Clear Base64 value">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={base64Value}
                  onChange={(event) => { setBase64Value(event.target.value); setBase64Error(''); }}
                  className={`min-h-64 w-full resize-y rounded-xl border bg-[#031018] p-4 font-mono text-xs leading-6 text-[#d7dce5] focus:outline-none ${base64Error ? 'border-error' : 'border-border-color focus:border-amber-color/60'}`}
                  placeholder="Type plain text to encode, or paste Base64 to decode…"
                  spellCheck={false}
                  aria-describedby={base64Error ? 'base64-error' : undefined}
                />
                <div className="flex min-h-5 items-center justify-between gap-4 font-mono text-[10px]">
                  <span id="base64-error" className={base64Error ? 'text-error' : 'text-muted-foreground'}>{base64Error || 'Conversion happens locally and is never sent to a server.'}</span>
                  <span className="shrink-0 text-muted-foreground">{base64Value.length.toLocaleString()} characters</span>
                </div>
              </div>
            )}

            {activeUtility === 'time' && (
              <div id="utility-panel-time" role="tabpanel" className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">Timestamp converter</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Enter Unix seconds, milliseconds, an ISO string, or a readable date.</p>
                  </div>
                  <button onClick={() => setTimestampValue(String(Math.floor(Date.now() / 1000)))} className="flex items-center gap-2 rounded-lg border border-border-color px-3 py-2 font-mono text-xs text-foreground hover:border-amber-color/40">
                    <RefreshCw className="h-3.5 w-3.5" /> Use now
                  </button>
                </div>
                <input
                  value={timestampValue}
                  onChange={(event) => setTimestampValue(event.target.value)}
                  className="h-12 w-full rounded-xl border border-border-color bg-[#031018] px-4 font-mono text-sm text-[#d7dce5] focus:border-amber-color/60 focus:outline-none"
                  placeholder="1721491200 or 2026-07-20T12:00:00Z"
                  spellCheck={false}
                />
                {parsedTimestamp ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['Local time', parsedTimestamp.toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'long' })],
                      ['UTC', parsedTimestamp.toUTCString()],
                      ['ISO 8601', parsedTimestamp.toISOString()],
                      ['Relative', relativeTime(parsedTimestamp)],
                      ['Unix seconds', String(Math.floor(parsedTimestamp.getTime() / 1000))],
                      ['Milliseconds', String(parsedTimestamp.getTime())],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-border-color bg-muted/15 p-4">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
                        <p className="mt-2 break-words font-mono text-xs leading-5 text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-error/40 bg-error/5 p-4 font-mono text-xs text-error">Enter a date or timestamp that the browser can understand.</div>
                )}
                <button
                  onClick={() => parsedTimestamp && copyText(parsedTimestamp.toISOString(), 'timestamp')}
                  disabled={!parsedTimestamp}
                  className="flex items-center gap-2 rounded-lg bg-amber-color px-3 py-2 font-mono text-xs font-bold text-[#030c14] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied === 'timestamp' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'timestamp' ? 'Copied ISO time' : 'Copy ISO time'}
                </button>
              </div>
            )}

            {activeUtility === 'generate' && (
              <div id="utility-panel-generate" role="tabpanel" className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">Secure value generator</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Generated with your browser&apos;s cryptographic random number generator.</p>
                  </div>
                  <div className="flex rounded-lg border border-border-color bg-[#031018] p-1">
                    {(['uuid', 'password'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => generateValue(type)}
                        className={`rounded-md px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors ${generatedType === type ? 'bg-amber-color text-[#030c14]' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-24 items-center gap-3 rounded-xl border border-amber-color/25 bg-[#031018] p-4 sm:p-5">
                  <code className="min-w-0 flex-1 break-all font-mono text-sm leading-6 text-cyan sm:text-base">{generatedValue}</code>
                  <button onClick={() => copyText(generatedValue, 'generator')} className="shrink-0 rounded-lg border border-border-color p-2 text-muted-foreground hover:text-foreground" aria-label="Copy generated value">
                    {copied === 'generator' ? <Check className="h-4 w-4 text-emerald-color" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {generatedType === 'password' && (
                  <div className="max-w-xl space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <label htmlFor="password-length" className="text-muted-foreground">Password length</label>
                      <span className="font-bold text-amber-color">{passwordLength} characters</span>
                    </div>
                    <input
                      id="password-length"
                      type="range"
                      min="12"
                      max="64"
                      value={passwordLength}
                      onChange={(event) => {
                        const length = Number(event.target.value);
                        setPasswordLength(length);
                        generateValue('password', length);
                      }}
                      className="w-full"
                    />
                  </div>
                )}

                <button onClick={() => generateValue()} className="flex items-center gap-2 rounded-lg bg-amber-color px-4 py-2 font-mono text-xs font-bold text-[#030c14] hover:bg-amber-glow">
                  <RefreshCw className="h-4 w-4" /> Generate another
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <EverydayTools />

      <section aria-labelledby="products-heading">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-color">Built by Linacre</span>
            <h2 id="products-heading" className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">Free tools for real jobs</h2>
          </div>
          <button onClick={() => navigate('projects')} className="flex items-center gap-1.5 self-start font-mono text-xs font-semibold text-muted-foreground hover:text-amber-color sm:self-auto">
            See every project <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.a
                key={product.name}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5 transition-all hover:-translate-y-1 hover:border-amber-color/35 hover:shadow-[var(--linacre-glow-soft)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accentClasses[product.accent]}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-color" aria-hidden="true" />
                </div>
                <p className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{product.eyebrow}</p>
                <h3 className="mt-1 font-display text-xl font-bold text-foreground">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-color">
                  {product.action} <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </motion.a>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="More useful areas">
        {[
          {
            title: 'Developer toolbox',
            description: 'JWT decoder, regex tester, secure generators, CSS builder, and SVG workspace.',
            action: 'Open playground',
            tab: 'playground',
            icon: Zap,
          },
          {
            title: 'Curated toolkit',
            description: 'A searchable directory of reliable tools for building, deploying, and designing.',
            action: 'Browse the toolkit',
            tab: 'toolkit',
            icon: Layers,
          },
          {
            title: 'Privacy by default',
            description: 'Homepage utilities run entirely in your browser. Pasted content is never uploaded.',
            action: 'Read the privacy policy',
            tab: 'privacy',
            icon: LockKeyhole,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={() => navigate(item.tab)}
              className="group rounded-2xl border border-border-color bg-muted/15 p-5 text-left transition-colors hover:border-amber-color/30 hover:bg-muted/25"
            >
              <Icon className="h-5 w-5 text-amber-color" aria-hidden="true" />
              <h2 className="mt-4 font-display text-base font-bold text-foreground">{item.title}</h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-color">
                {item.action} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-amber-color/20 bg-amber-color/[0.06] p-6 sm:p-8" aria-labelledby="toolbox-cta-heading">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-color/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-color">Bring the tools to your workflow</span>
            <h2 id="toolbox-cta-heading" className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">A tool box for you — and your AI.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Private, offline browser utilities that also run as an MCP server — so Claude, Cursor or any agent can call them directly. No sign-up, no tracking.</p>
          </div>
          <button onClick={() => navigate('toolkit')} className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-color px-5 py-3 font-mono text-sm font-bold text-[#030c14] shadow-[0_0_24px_rgba(34,211,238,0.25)] hover:bg-amber-glow">
            Open the toolkit <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

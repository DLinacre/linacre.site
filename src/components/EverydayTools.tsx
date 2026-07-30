import { useMemo, useState } from 'react';
import {
  Calculator,
  Check,
  Copy,
  Fingerprint,
  Link2,
  ListFilter,
  RefreshCw,
  Type,
} from 'lucide-react';

type ToolId = 'vat' | 'text' | 'hash' | 'url';

const toolTabs = [
  { id: 'vat' as const, label: 'UK VAT', detail: 'Net, VAT & gross', icon: Calculator },
  { id: 'text' as const, label: 'Text', detail: 'Clean & count', icon: Type },
  { id: 'hash' as const, label: 'SHA-256', detail: 'Hash locally', icon: Fingerprint },
  { id: 'url' as const, label: 'URL', detail: 'Parse & encode', icon: Link2 },
];

function titleCase(value: string) {
  return value.toLowerCase().replace(/\b\p{L}/gu, character => character.toUpperCase());
}

export default function EverydayTools() {
  const [activeTool, setActiveTool] = useState<ToolId>('vat');
  const [copied, setCopied] = useState<string | null>(null);

  const [vatAmount, setVatAmount] = useState('100');
  const [vatRate, setVatRate] = useState(20);
  const [vatMode, setVatMode] = useState<'net' | 'gross'>('net');

  const [text, setText] = useState('');

  const [hashInput, setHashInput] = useState('');
  const [hashOutput, setHashOutput] = useState('');
  const [hashing, setHashing] = useState(false);

  const [urlInput, setUrlInput] = useState(
    'https://www.linacre.site/projects?view=featured&utm_source=example',
  );
  const [urlError, setUrlError] = useState('');

  const copy = async (value: string, key: string) => {
    if (!value) return;
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
    window.setTimeout(() => setCopied(null), 1_500);
  };

  const vatResult = useMemo(() => {
    const amount = Number(vatAmount.replace(/[^0-9.-]/g, '')) || 0;
    const multiplier = 1 + vatRate / 100;
    const net = vatMode === 'net' ? amount : amount / multiplier;
    const gross = vatMode === 'gross' ? amount : amount * multiplier;
    return { net, vat: gross - net, gross };
  }, [vatAmount, vatMode, vatRate]);

  const textStats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.match(/[\p{L}\p{N}'’-]+/gu)?.length || 0 : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const readingMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 220));
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words,
      lines,
      readingMinutes,
    };
  }, [text]);

  const parsedUrl = useMemo(() => {
    const raw = urlInput.trim();
    if (!raw) return null;
    try {
      const normalised = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
      return new URL(normalised);
    } catch {
      return null;
    }
  }, [urlInput]);

  const cleanTracking = () => {
    if (!parsedUrl) return;
    const cleaned = new URL(parsedUrl);
    const trackingKeys = [...cleaned.searchParams.keys()].filter(
      key =>
        key.toLowerCase().startsWith('utm_') ||
        ['fbclid', 'gclid', 'mc_cid', 'mc_eid', 'ref'].includes(key.toLowerCase()),
    );
    trackingKeys.forEach(key => cleaned.searchParams.delete(key));
    setUrlInput(cleaned.toString());
  };

  const [hmacSecret, setHmacSecret] = useState('');

  const generateHash = async () => {
    setHashing(true);
    try {
      const bytes = new TextEncoder().encode(hashInput);
      if (hmacSecret.trim()) {
        const keyBytes = new TextEncoder().encode(hmacSecret);
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBytes,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign'],
        );
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, bytes);
        setHashOutput(
          [...new Uint8Array(signature)].map(byte => byte.toString(16).padStart(2, '0')).join(''),
        );
      } else {
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        setHashOutput(
          [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join(''),
        );
      }
    } finally {
      setHashing(false);
    }
  };

  const transformLines = (mode: 'trim' | 'dedupe' | 'sort' | 'blank') => {
    let lines = text.split(/\r?\n/);
    if (mode === 'trim') lines = lines.map(line => line.trim());
    if (mode === 'dedupe') lines = [...new Set(lines)];
    if (mode === 'sort')
      lines = [...lines].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    if (mode === 'blank') lines = lines.filter(line => line.trim());
    setText(lines.join('\n'));
  };

  return (
    <section id="everyday-tools" className="scroll-mt-28" aria-labelledby="everyday-tools-heading">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-color">
            Small jobs, finished quickly
          </span>
          <h2
            id="everyday-tools-heading"
            className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground"
          >
            Everyday tools
          </h2>
        </div>
        <p className="max-w-md text-xs leading-5 text-muted-foreground sm:text-right">
          No sign-up, adverts, analytics, or server round trips. These utilities run entirely in
          this page.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] shadow-[var(--linacre-card-shadow)]">
        <div
          className="grid grid-cols-2 border-b border-border-color bg-muted/20 sm:grid-cols-4"
          role="tablist"
          aria-label="Everyday utilities"
        >
          {toolTabs.map(tool => {
            const Icon = tool.icon;
            const active = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                role="tab"
                aria-selected={active}
                className={`relative flex items-center gap-3 border-b border-r border-border-color px-4 py-4 text-left transition-colors sm:border-b-0 ${active ? 'bg-amber-color/[0.07] text-foreground' : 'text-muted-foreground hover:bg-muted/25 hover:text-foreground'}`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? 'text-amber-color' : 'text-muted-foreground'}`}
                />
                <div>
                  <span className="block font-mono text-xs font-bold">{tool.label}</span>
                  <span className="block text-[10px] text-muted-foreground">{tool.detail}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-5 sm:p-6">
          {activeTool === 'vat' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  UK VAT Calculator
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Calculate Net, VAT amount, and Gross total for standard (20%), reduced (5%), or
                  custom rates.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="vat-amount-input"
                    className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                  >
                    Amount (£)
                  </label>
                  <input
                    id="vat-amount-input"
                    value={vatAmount}
                    onChange={e => setVatAmount(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-border-color bg-[#020a11] px-3 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="vat-rate-select"
                    className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                  >
                    VAT Rate (%)
                  </label>
                  <select
                    id="vat-rate-select"
                    value={vatRate}
                    onChange={e => setVatRate(Number(e.target.value))}
                    className="mt-1 h-10 w-full rounded-lg border border-border-color bg-[#020a11] px-3 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none"
                  >
                    <option value={20}>20% (Standard)</option>
                    <option value={5}>5% (Reduced)</option>
                    <option value={0}>0% (Zero-rated)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="vat-mode-select"
                    className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                  >
                    Input Mode
                  </label>
                  <div
                    id="vat-mode-select"
                    className="mt-1 flex h-10 rounded-lg border border-border-color bg-[#020a11] p-1"
                  >
                    <button
                      onClick={() => setVatMode('net')}
                      className={`flex-1 rounded-md font-mono text-[10px] font-bold ${vatMode === 'net' ? 'bg-amber-color text-[#031018]' : 'text-muted-foreground'}`}
                    >
                      Net
                    </button>
                    <button
                      onClick={() => setVatMode('gross')}
                      className={`flex-1 rounded-md font-mono text-[10px] font-bold ${vatMode === 'gross' ? 'bg-amber-color text-[#031018]' : 'text-muted-foreground'}`}
                    >
                      Gross
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-border-color bg-muted/15 p-4 text-center">
                <div>
                  <span className="block font-mono text-[9px] uppercase text-muted-foreground">
                    Net Amount
                  </span>
                  <strong className="mt-1 block font-mono text-sm text-foreground">
                    £{vatResult.net.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <span className="block font-mono text-[9px] uppercase text-amber-color">
                    VAT ({vatRate}%)
                  </span>
                  <strong className="mt-1 block font-mono text-sm text-amber-color">
                    £{vatResult.vat.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <span className="block font-mono text-[9px] uppercase text-cyan">
                    Gross Total
                  </span>
                  <strong className="mt-1 block font-mono text-sm text-cyan">
                    £{vatResult.gross.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'text' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Text Inspector & Cleaner
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Count words, characters, lines, and transform text formatting client-side.
                </p>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type or paste text here to analyze..."
                className="min-h-32 w-full resize-y rounded-xl border border-border-color bg-[#020a11] p-4 font-mono text-xs leading-6 text-foreground focus:border-amber-color focus:outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {[
                  ['UPPERCASE', () => setText(text.toUpperCase())],
                  ['lowercase', () => setText(text.toLowerCase())],
                  ['Title Case', () => setText(titleCase(text))],
                  ['Trim lines', () => transformLines('trim')],
                  ['Remove blanks', () => transformLines('blank')],
                  ['Remove duplicates', () => transformLines('dedupe')],
                  ['Sort lines', () => transformLines('sort')],
                ].map(([label, action]) => (
                  <button
                    key={label as string}
                    onClick={action as () => void}
                    className="rounded-lg border border-border-color bg-muted/15 px-3 py-2 font-mono text-[9px] font-bold text-muted-foreground hover:border-amber-color/40 hover:text-foreground"
                  >
                    {label as string}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  ['Characters', textStats.characters],
                  ['No spaces', textStats.charactersNoSpaces],
                  ['Words', textStats.words],
                  ['Lines', textStats.lines],
                  ['Read time', `${textStats.readingMinutes} min`],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-lg border border-border-color bg-background/30 p-3"
                  >
                    <span className="block font-mono text-[8px] uppercase text-muted-foreground">
                      {label}
                    </span>
                    <strong className="mt-1 block font-mono text-sm text-foreground">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'hash' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  SHA-256 & HMAC Generator
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create deterministic SHA-256 fingerprints or HMAC-SHA-256 secret signatures
                  completely offline.
                </p>
              </div>
              <textarea
                value={hashInput}
                onChange={event => {
                  setHashInput(event.target.value);
                  setHashOutput('');
                }}
                placeholder="Enter text to hash…"
                className="min-h-32 w-full resize-y rounded-xl border border-border-color bg-[#020a11] p-4 font-mono text-xs leading-6 text-foreground focus:border-amber-color focus:outline-none"
              />
              <div>
                <label
                  htmlFor="hmac-secret-key-input"
                  className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                >
                  HMAC Secret Key (Optional)
                </label>
                <input
                  id="hmac-secret-key-input"
                  value={hmacSecret}
                  onChange={e => setHmacSecret(e.target.value)}
                  placeholder="Leave blank for plain SHA-256"
                  className="mt-1 h-9 w-full rounded-lg border border-border-color bg-[#020a11] px-3 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={generateHash}
                  disabled={hashing}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-color px-4 py-2.5 font-mono text-[10px] font-bold text-[#031018] disabled:opacity-50"
                >
                  <Fingerprint className="h-4 w-4" />
                  {hashing
                    ? 'Generating…'
                    : hmacSecret.trim()
                      ? 'Generate HMAC-SHA-256'
                      : 'Generate SHA-256'}
                </button>
                <button
                  onClick={() => {
                    setHashInput('');
                    setHmacSecret('');
                    setHashOutput('');
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-color px-3 py-2.5 font-mono text-[10px] font-bold text-muted-foreground"
                >
                  <RefreshCw className="h-4 w-4" /> Clear
                </button>
              </div>
              {hashOutput && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-color/25 bg-[#020a11] p-4">
                  <code className="min-w-0 flex-1 break-all font-mono text-xs leading-6 text-cyan">
                    {hashOutput}
                  </code>
                  <button
                    onClick={() => copy(hashOutput, 'hash')}
                    className="shrink-0 rounded-lg border border-border-color p-2 text-muted-foreground"
                    aria-label="Copy hash"
                  >
                    {copied === 'hash' ? (
                      <Check className="h-4 w-4 text-emerald-color" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTool === 'url' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  URL parser and cleaner
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Inspect a link, remove common tracking parameters, or encode/decode text.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  value={urlInput}
                  onChange={event => {
                    setUrlInput(event.target.value);
                    setUrlError('');
                  }}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-border-color bg-[#020a11] px-4 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none"
                />
                <button
                  onClick={cleanTracking}
                  disabled={!parsedUrl}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-color px-4 font-mono text-[10px] font-bold text-[#031018] disabled:opacity-40"
                >
                  <ListFilter className="h-4 w-4" /> Clean
                </button>
              </div>
              {(urlError || (urlInput.trim() && !parsedUrl)) && (
                <p className="font-mono text-[10px] text-error">
                  {urlError || 'Enter a complete URL or domain.'}
                </p>
              )}
              {parsedUrl && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Protocol', parsedUrl.protocol.replace(':', '')],
                    ['Host', parsedUrl.host],
                    ['Path', parsedUrl.pathname || '/'],
                    ['Query items', String([...parsedUrl.searchParams].length)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-border-color bg-muted/15 p-4"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                      <code className="mt-2 block break-all font-mono text-xs text-foreground">
                        {value}
                      </code>
                    </div>
                  ))}
                </div>
              )}
              {parsedUrl && [...parsedUrl.searchParams].length > 0 && (
                <div className="overflow-hidden rounded-xl border border-border-color">
                  {[...parsedUrl.searchParams].map(([key, value]) => (
                    <div
                      key={`${key}-${value}`}
                      className="grid grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)] border-b border-border-color px-4 py-3 last:border-0"
                    >
                      <code className="truncate font-mono text-[10px] text-amber-color">{key}</code>
                      <code className="break-all font-mono text-[10px] text-muted-foreground">
                        {value}
                      </code>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setUrlInput(encodeURIComponent(urlInput))}
                  className="rounded-lg border border-border-color px-3 py-2 font-mono text-[9px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Encode component
                </button>
                <button
                  onClick={() => {
                    try {
                      setUrlInput(decodeURIComponent(urlInput));
                    } catch {
                      setUrlError('This value is not valid URI-encoded text.');
                    }
                  }}
                  className="rounded-lg border border-border-color px-3 py-2 font-mono text-[9px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Decode component
                </button>
                <button
                  onClick={() => copy(urlInput, 'url')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-color px-3 py-2 font-mono text-[9px] font-bold text-muted-foreground hover:text-foreground"
                >
                  {copied === 'url' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-color" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}{' '}
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

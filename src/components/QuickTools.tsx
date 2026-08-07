import { useMemo, useState } from 'react';
import {
  Binary,
  Braces,
  Check,
  Clock,
  Copy,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';

type UtilityId = 'json' | 'base64' | 'time' | 'generate';
type CopyTarget = 'json' | 'base64' | 'timestamp' | 'generator' | null;

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
  return [...random].map(value => alphabet[value % alphabet.length]).join('');
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
  const [unit, divisor] =
    units.find(([, value]) => Math.abs(seconds) >= value) || units[units.length - 1];
  return formatter.format(Math.round(seconds / divisor), unit);
}

/**
 * QuickTools — private, in-browser utilities (JSON, Base64, timestamp,
 * secure generator). Moved off the Start page onto the Tools page: every
 * keystroke stays on the device.
 */
export default function QuickTools() {
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
        bytes.forEach(byte => {
          binary += String.fromCharCode(byte);
        });
        setBase64Value(btoa(binary));
      } else {
        const binary = atob(base64Value.replace(/\s/g, ''));
        const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
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

  return (
    <section id="quick-tools" aria-labelledby="quick-tools-heading" className="scroll-mt-28">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-color">
            Works in your browser
          </span>
          <h2
            id="quick-tools-heading"
            className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground"
          >
            Quick tools
          </h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-color" aria-hidden="true" />
          Your input stays on this device
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] shadow-[var(--linacre-card-shadow)]">
        <div
          className="grid grid-cols-2 border-b border-border-color bg-muted/20 sm:grid-cols-4"
          role="tablist"
          aria-label="Quick utilities"
        >
          {utilities.map(utility => {
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
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-color' : ''}`}
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-mono text-xs font-bold">{utility.label}</span>
                  <span className="mt-0.5 hidden text-[10px] sm:block">
                    {utility.description}
                  </span>
                </span>
                {isActive && (
                  <motion.span
                    layoutId="utility-indicator"
                    className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-amber-color"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">
          {activeUtility === 'json' && (
            <div id="utility-panel-json" role="tabpanel" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    JSON formatter & validator
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Paste JSON, then make it readable or compact.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => formatJson(false)}
                    className="rounded-lg bg-amber-color px-3 py-2 font-mono text-xs font-bold text-[#030c14] hover:bg-amber-glow"
                  >
                    Format
                  </button>
                  <button
                    onClick={() => formatJson(true)}
                    className="rounded-lg border border-border-color px-3 py-2 font-mono text-xs text-foreground hover:border-amber-color/40"
                  >
                    Minify
                  </button>
                  <button
                    onClick={() => copyText(jsonValue, 'json')}
                    className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-foreground"
                    aria-label="Copy JSON"
                  >
                    {copied === 'json' ? (
                      <Check className="h-4 w-4 text-emerald-color" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setJsonValue('');
                      setJsonError('');
                    }}
                    className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-error"
                    aria-label="Clear JSON"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={jsonValue}
                onChange={event => {
                  setJsonValue(event.target.value);
                  setJsonError('');
                }}
                className={`min-h-64 w-full resize-y rounded-xl border bg-[#031018] p-4 font-mono text-xs leading-6 text-[#d7dce5] focus:outline-none ${jsonError ? 'border-error' : 'border-border-color focus:border-amber-color/60'}`}
                placeholder={'{\n  "paste": "your JSON here"\n}'}
                spellCheck={false}
                aria-describedby={jsonError ? 'json-error' : undefined}
              />
              <div className="flex min-h-5 items-center justify-between gap-4 font-mono text-[10px]">
                <span id="json-error" className={jsonError ? 'text-error' : 'text-muted-foreground'}>
                  {jsonError || 'Supports objects, arrays, strings, numbers, booleans, and null.'}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {jsonValue.length.toLocaleString()} characters
                </span>
              </div>
            </div>
          )}

          {activeUtility === 'base64' && (
            <div id="utility-panel-base64" role="tabpanel" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Base64 encoder & decoder
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    UTF-8 safe conversion for text and small data snippets.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => transformBase64('encode')}
                    className="rounded-lg bg-amber-color px-3 py-2 font-mono text-xs font-bold text-[#030c14] hover:bg-amber-glow"
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => transformBase64('decode')}
                    className="rounded-lg border border-border-color px-3 py-2 font-mono text-xs text-foreground hover:border-amber-color/40"
                  >
                    Decode
                  </button>
                  <button
                    onClick={() => copyText(base64Value, 'base64')}
                    className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-foreground"
                    aria-label="Copy Base64 value"
                  >
                    {copied === 'base64' ? (
                      <Check className="h-4 w-4 text-emerald-color" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setBase64Value('');
                      setBase64Error('');
                    }}
                    className="rounded-lg border border-border-color p-2 text-muted-foreground hover:text-error"
                    aria-label="Clear Base64 value"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={base64Value}
                onChange={event => {
                  setBase64Value(event.target.value);
                  setBase64Error('');
                }}
                className={`min-h-64 w-full resize-y rounded-xl border bg-[#031018] p-4 font-mono text-xs leading-6 text-[#d7dce5] focus:outline-none ${base64Error ? 'border-error' : 'border-border-color focus:border-amber-color/60'}`}
                placeholder="Type plain text to encode, or paste Base64 to decode…"
                spellCheck={false}
                aria-describedby={base64Error ? 'base64-error' : undefined}
              />
              <div className="flex min-h-5 items-center justify-between gap-4 font-mono text-[10px]">
                <span
                  id="base64-error"
                  className={base64Error ? 'text-error' : 'text-muted-foreground'}
                >
                  {base64Error || 'Conversion happens locally and is never sent to a server.'}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {base64Value.length.toLocaleString()} characters
                </span>
              </div>
            </div>
          )}

          {activeUtility === 'time' && (
            <div id="utility-panel-time" role="tabpanel" className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Timestamp converter
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter Unix seconds, milliseconds, an ISO string, or a readable date.
                  </p>
                </div>
                <button
                  onClick={() => setTimestampValue(String(Math.floor(Date.now() / 1000)))}
                  className="flex items-center gap-2 rounded-lg border border-border-color px-3 py-2 font-mono text-xs text-foreground hover:border-amber-color/40"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Use now
                </button>
              </div>
              <input
                value={timestampValue}
                onChange={event => setTimestampValue(event.target.value)}
                className="h-12 w-full rounded-xl border border-border-color bg-[#031018] px-4 font-mono text-sm text-[#d7dce5] focus:border-amber-color/60 focus:outline-none"
                placeholder="1721491200 or 2026-07-20T12:00:00Z"
                spellCheck={false}
              />
              {parsedTimestamp ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    [
                      'Local time',
                      parsedTimestamp.toLocaleString('en-GB', {
                        dateStyle: 'full',
                        timeStyle: 'long',
                      }),
                    ],
                    ['UTC', parsedTimestamp.toUTCString()],
                    ['ISO 8601', parsedTimestamp.toISOString()],
                    ['Relative', relativeTime(parsedTimestamp)],
                    ['Unix seconds', String(Math.floor(parsedTimestamp.getTime() / 1000))],
                    ['Milliseconds', String(parsedTimestamp.getTime())],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-border-color bg-muted/15 p-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                      <p className="mt-2 break-words font-mono text-xs leading-5 text-foreground">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-error/40 bg-error/5 p-4 font-mono text-xs text-error">
                  Enter a date or timestamp that the browser can understand.
                </div>
              )}
              <button
                onClick={() => parsedTimestamp && copyText(parsedTimestamp.toISOString(), 'timestamp')}
                disabled={!parsedTimestamp}
                className="flex items-center gap-2 rounded-lg bg-amber-color px-3 py-2 font-mono text-xs font-bold text-[#030c14] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied === 'timestamp' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied === 'timestamp' ? 'Copied ISO time' : 'Copy ISO time'}
              </button>
            </div>
          )}

          {activeUtility === 'generate' && (
            <div id="utility-panel-generate" role="tabpanel" className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Secure value generator
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Generated with your browser&apos;s cryptographic random number generator.
                  </p>
                </div>
                <div className="flex rounded-lg border border-border-color bg-[#031018] p-1">
                  {(['uuid', 'password'] as const).map(type => (
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
                <code className="min-w-0 flex-1 break-all font-mono text-sm leading-6 text-cyan sm:text-base">
                  {generatedValue}
                </code>
                <button
                  onClick={() => copyText(generatedValue, 'generator')}
                  className="shrink-0 rounded-lg border border-border-color p-2 text-muted-foreground hover:text-foreground"
                  aria-label="Copy generated value"
                >
                  {copied === 'generator' ? (
                    <Check className="h-4 w-4 text-emerald-color" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {generatedType === 'password' && (
                <div className="max-w-xl space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <label htmlFor="password-length" className="text-muted-foreground">
                      Password length
                    </label>
                    <span className="font-bold text-amber-color">
                      {passwordLength} characters
                    </span>
                  </div>
                  <input
                    id="password-length"
                    type="range"
                    min="12"
                    max="64"
                    value={passwordLength}
                    onChange={event => {
                      const length = Number(event.target.value);
                      setPasswordLength(length);
                      generateValue('password', length);
                    }}
                    className="w-full"
                  />
                </div>
              )}

              <button
                onClick={() => generateValue()}
                className="flex items-center gap-2 rounded-lg bg-amber-color px-4 py-2 font-mono text-xs font-bold text-[#030c14] hover:bg-amber-glow"
              >
                <RefreshCw className="h-4 w-4" /> Generate another
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

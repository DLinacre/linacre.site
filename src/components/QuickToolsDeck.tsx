import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Code2, 
  Binary, 
  KeyRound, 
  Hash, 
  Calculator, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { audioFx } from '../lib/audioFx';

function makeSecrets(count: number, type: 'uuid' | 'hex32' | 'apiKey'): string[] {
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    if (type === 'uuid') {
      results.push(crypto.randomUUID());
    } else if (type === 'hex32') {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      results.push(Array.from(arr, b => b.toString(16).padStart(2, '0')).join(''));
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      const arr = new Uint8Array(32);
      crypto.getRandomValues(arr);
      results.push('dl_' + Array.from(arr, b => chars[b % chars.length]).join(''));
    }
  }
  return results;
}

export default function QuickToolsDeck() {
  const [activeTool, setActiveTool] = useState<'scratchpad' | 'json' | 'base64' | 'uuid' | 'hash' | 'calc'>('scratchpad');
  
  // Scratchpad State
  const [scratchContent, setScratchContent] = useState(() => {
    return localStorage.getItem('linacre_daily_scratchpad') || 
`# Linacre Digital Mission Control // Daily Notes
- [ ] Review system automation & Port 53 DNS telemetry
- [ ] ComfyUI prompt pipeline test on RTX 3070 Ti
- [ ] Check Poco F7 sync & ADB bridge
- [ ] Work on "Proper Mad" track masters
`;
  });
  const [scratchPreview, setScratchPreview] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // JSON Tool State
  const [jsonInput, setJsonInput] = useState('{\n  "status": "nominal",\n  "rig": "i7-11700K",\n  "gpu": "RTX 3070 Ti",\n  "ram_gb": 64,\n  "dns_sinkhole": true\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Base64 Tool State
  const [b64Input, setB64Input] = useState('David Linacre // Barnsley, UK');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  const b64Output = useMemo(() => {
    try {
      if (b64Mode === 'encode') {
        return btoa(unescape(encodeURIComponent(b64Input)));
      } else {
        return decodeURIComponent(escape(atob(b64Input)));
      }
    } catch {
      return '[Error: Invalid Base64 payload]';
    }
  }, [b64Input, b64Mode]);

  // UUID & Token State
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [secretType, setSecretType] = useState<'uuid' | 'hex32' | 'apiKey'>('uuid');
  const [generatedUuids, setGeneratedUuids] = useState<string[]>(() => makeSecrets(5, 'uuid'));

  // Hasher State
  const [hashInput, setHashInput] = useState('linacre-rig-key-2026');
  const [sha256Hash, setSha256Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');

  // Tech / VAT Calculator State
  const [vatAmount, setVatAmount] = useState<number>(100);
  const [vatRate] = useState<number>(20);
  const [bytesVal, setBytesVal] = useState<number>(1073741824); // 1 GB

  // Save scratchpad
  useEffect(() => {
    localStorage.setItem('linacre_daily_scratchpad', scratchContent);
  }, [scratchContent]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    audioFx.playClick();
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1800);
  };

  // JSON Action
  const formatJson = (minify = false) => {
    audioFx.playClick();
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: unknown) {
      setJsonError((err as Error).message);
    }
  };

  // UUID / Secret Generator Handler
  const handleGenerateSecrets = (count = uuidCount, type = secretType) => {
    audioFx.playClick();
    setGeneratedUuids(makeSecrets(count, type));
  };

  // Client-side WebCrypto Hasher
  useEffect(() => {
    const computeHashes = async () => {
      const enc = new TextEncoder();
      const data = enc.encode(hashInput);
      
      // SHA-256
      const buf256 = await crypto.subtle.digest('SHA-256', data);
      setSha256Hash(Array.from(new Uint8Array(buf256), b => b.toString(16).padStart(2, '0')).join(''));

      // SHA-512
      const buf512 = await crypto.subtle.digest('SHA-512', data);
      setSha512Hash(Array.from(new Uint8Array(buf512), b => b.toString(16).padStart(2, '0')).join(''));
    };
    computeHashes();
  }, [hashInput]);

  // Scratchpad Export
  const downloadScratchpad = (ext: 'md' | 'txt') => {
    audioFx.playClick();
    const blob = new Blob([scratchContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linacre-notes-${new Date().toISOString().slice(0, 10)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = scratchContent.trim() ? scratchContent.trim().split(/\s+/).length : 0;
  const charCount = scratchContent.length;
  const lineCount = scratchContent.split('\n').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Tools Console Capsule */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1222]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        
        {/* Ambient Glow */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold uppercase tracking-wider text-white">
                  DAILY DRIVER // QUICK UTILITIES DOCK
                </h2>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                  ZERO LATENCY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                100% Client-Side • In-Browser Instant Converters & Persistent Workspace Notes
              </p>
            </div>
          </div>

          {/* Tool Navigation Pill Bar */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-1 text-xs font-mono">
            <button
              onClick={() => { setActiveTool('scratchpad'); audioFx.playClick(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
                activeTool === 'scratchpad'
                  ? 'bg-purple-500/30 text-white font-semibold border border-purple-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Scratchpad</span>
            </button>

            <button
              onClick={() => { setActiveTool('json'); audioFx.playClick(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
                activeTool === 'json'
                  ? 'bg-cyan-500/30 text-white font-semibold border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={() => { setActiveTool('base64'); audioFx.playClick(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
                activeTool === 'base64'
                  ? 'bg-pink-500/30 text-white font-semibold border border-pink-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Binary className="h-3.5 w-3.5" />
              <span>Base64</span>
            </button>

            <button
              onClick={() => { setActiveTool('uuid'); audioFx.playClick(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
                activeTool === 'uuid'
                  ? 'bg-amber-500/30 text-white font-semibold border border-amber-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>UUIDs</span>
            </button>

            <button
              onClick={() => { setActiveTool('hash'); audioFx.playClick(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
                activeTool === 'hash'
                  ? 'bg-emerald-500/30 text-white font-semibold border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>Hash</span>
            </button>

            <button
              onClick={() => { setActiveTool('calc'); audioFx.playClick(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
                activeTool === 'calc'
                  ? 'bg-indigo-500/30 text-white font-semibold border border-indigo-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Tech Calc</span>
            </button>
          </div>
        </div>

        {/* Tool Content Area */}
        <div className="relative z-10 pt-6">
          
          {/* 1. SCRATCHPAD */}
          {activeTool === 'scratchpad' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <span>Lines: <strong className="text-white">{lineCount}</strong></span>
                  <span>Words: <strong className="text-white">{wordCount}</strong></span>
                  <span>Chars: <strong className="text-white">{charCount}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-saved
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScratchPreview(prev => !prev)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    {scratchPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    <span>{scratchPreview ? 'Edit' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(scratchContent, 'scratch')}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    {copiedSection === 'scratch' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedSection === 'scratch' ? 'Copied' : 'Copy All'}</span>
                  </button>

                  <button
                    onClick={() => downloadScratchpad('md')}
                    className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-300 hover:bg-purple-500/20"
                    title="Export as Markdown"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>.md</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Clear scratchpad content?')) {
                        setScratchContent('');
                        audioFx.playClick();
                      }
                    }}
                    className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-red-300 hover:bg-red-500/20"
                    title="Clear Scratchpad"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Textarea or Preview */}
              {scratchPreview ? (
                <div className="h-80 overflow-y-auto rounded-2xl border border-white/10 bg-[#090d18]/80 p-5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {scratchContent}
                </div>
              ) : (
                <textarea
                  value={scratchContent}
                  onChange={e => setScratchContent(e.target.value)}
                  placeholder="Type anything here... Auto-saved instantly to your local storage."
                  rows={12}
                  className="w-full rounded-2xl border border-white/10 bg-[#090d18]/80 p-5 font-mono text-sm text-slate-200 placeholder-slate-500 focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30 scrollbar-thin"
                />
              )}
            </div>
          )}

          {/* 2. JSON FORMATTER */}
          {activeTool === 'json' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => formatJson(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-3 py-1.5 text-xs font-mono font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Beautify (2 Spaces)</span>
                  </button>
                  <button
                    onClick={() => formatJson(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span>Minify</span>
                  </button>
                </div>

                {jsonOutput && (
                  <button
                    onClick={() => handleCopy(jsonOutput, 'json-out')}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white"
                  >
                    {copiedSection === 'json-out' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedSection === 'json-out' ? 'Copied' : 'Copy Result'}</span>
                  </button>
                )}
              </div>

              {jsonError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-mono text-red-300">
                  JSON Syntax Error: {jsonError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <span className="block font-mono text-xs text-slate-400 mb-1.5">INPUT JSON</span>
                  <textarea
                    value={jsonInput}
                    onChange={e => setJsonInput(e.target.value)}
                    rows={10}
                    className="w-full rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="block font-mono text-xs text-slate-400 mb-1.5">FORMATTED OUTPUT</span>
                  <textarea
                    readOnly
                    value={jsonOutput || '[Click Beautify or Minify to format]'}
                    rows={10}
                    className="w-full rounded-2xl border border-white/10 bg-[#060912]/90 p-4 font-mono text-xs text-cyan-200 select-all focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. BASE64 */}
          {activeTool === 'base64' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setB64Mode('encode')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                    b64Mode === 'encode'
                      ? 'bg-pink-500/30 text-white border border-pink-500/40'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  Encode to Base64
                </button>
                <button
                  onClick={() => setB64Mode('decode')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                    b64Mode === 'decode'
                      ? 'bg-pink-500/30 text-white border border-pink-500/40'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  Decode from Base64
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <span className="block font-mono text-xs text-slate-400 mb-1.5">
                    {b64Mode === 'encode' ? 'RAW STRING / TEXT' : 'BASE64 INPUT'}
                  </span>
                  <textarea
                    value={b64Input}
                    onChange={e => setB64Input(e.target.value)}
                    rows={8}
                    className="w-full rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 font-mono text-xs text-slate-200 focus:border-pink-400/50 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-slate-400">
                      {b64Mode === 'encode' ? 'BASE64 RESULT' : 'DECODED TEXT'}
                    </span>
                    <button
                      onClick={() => handleCopy(b64Output, 'b64')}
                      className="flex items-center gap-1 text-[0.7rem] font-mono text-pink-300 hover:underline"
                    >
                      {copiedSection === 'b64' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedSection === 'b64' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={b64Output}
                    rows={8}
                    className="w-full rounded-2xl border border-white/10 bg-[#060912]/90 p-4 font-mono text-xs text-pink-200 select-all focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. UUID & SECRET GENERATOR */}
          {activeTool === 'uuid' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">Type:</span>
                  <button
                    onClick={() => { setSecretType('uuid'); handleGenerateSecrets(uuidCount, 'uuid'); }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono ${
                      secretType === 'uuid' ? 'bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40' : 'text-slate-400 bg-white/5'
                    }`}
                  >
                    UUID v4
                  </button>
                  <button
                    onClick={() => { setSecretType('hex32'); handleGenerateSecrets(uuidCount, 'hex32'); }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono ${
                      secretType === 'hex32' ? 'bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40' : 'text-slate-400 bg-white/5'
                    }`}
                  >
                    Hex 32-bit
                  </button>
                  <button
                    onClick={() => { setSecretType('apiKey'); handleGenerateSecrets(uuidCount, 'apiKey'); }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono ${
                      secretType === 'apiKey' ? 'bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40' : 'text-slate-400 bg-white/5'
                    }`}
                  >
                    API Key
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">Count:</span>
                  {[1, 5, 10].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => { setUuidCount(cnt); handleGenerateSecrets(cnt, secretType); }}
                      className={`h-7 w-7 rounded-lg text-xs font-mono ${
                        uuidCount === cnt ? 'bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40' : 'text-slate-400 bg-white/5'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                  <button
                    onClick={() => handleGenerateSecrets(uuidCount, secretType)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-mono font-semibold text-amber-300 hover:bg-amber-500/30"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {generatedUuids.map((uuid, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#090d18]/80 px-4 py-2.5 font-mono text-xs text-slate-200"
                  >
                    <span className="truncate select-all">{uuid}</span>
                    <button
                      onClick={() => handleCopy(uuid, `uuid-${i}`)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.7rem] text-amber-300 hover:bg-white/5 shrink-0"
                    >
                      {copiedSection === `uuid-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSection === `uuid-${i}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. WEBCRYPTO HASHER */}
          {activeTool === 'hash' && (
            <div className="space-y-4">
              <div>
                <span className="block font-mono text-xs text-slate-400 mb-1.5">INPUT STRING TO HASH</span>
                <input
                  type="text"
                  value={hashInput}
                  onChange={e => setHashInput(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#090d18]/80 px-4 py-2.5 font-mono text-xs text-slate-200 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">SHA-256</span>
                    <button
                      onClick={() => handleCopy(sha256Hash, 'sha256')}
                      className="flex items-center gap-1 text-[0.7rem] font-mono text-emerald-300 hover:underline"
                    >
                      {copiedSection === 'sha256' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedSection === 'sha256' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 break-all select-all">
                    {sha256Hash}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">SHA-512</span>
                    <button
                      onClick={() => handleCopy(sha512Hash, 'sha512')}
                      className="flex items-center gap-1 text-[0.7rem] font-mono text-cyan-300 hover:underline"
                    >
                      {copiedSection === 'sha512' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedSection === 'sha512' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 break-all select-all">
                    {sha512Hash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. TECH & VAT CALCULATOR */}
          {activeTool === 'calc' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* UK VAT Calculator */}
              <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Calculator className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase">UK VAT (20%) CALCULATOR</h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-400">Net Amount (£):</label>
                  <input
                    type="number"
                    value={vatAmount}
                    onChange={e => setVatAmount(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 font-mono text-xs border-t border-white/10 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>VAT ({vatRate}%):</span>
                    <span className="text-indigo-300 font-bold">£{(vatAmount * 0.20).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-200 text-sm font-bold pt-1">
                    <span>Gross (Total):</span>
                    <span className="text-emerald-400">£{(vatAmount * 1.20).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Data Byte Converter */}
              <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Binary className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase">DIGITAL STORAGE CONVERTER</h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-400">Bytes Value:</label>
                  <input
                    type="number"
                    value={bytesVal}
                    onChange={e => setBytesVal(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 font-mono text-xs border-t border-white/10 pt-3 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kilobytes (KB):</span>
                    <span>{(bytesVal / 1024).toLocaleString(undefined, { maximumFractionDigits: 2 })} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Megabytes (MB):</span>
                    <span>{(bytesVal / (1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 2 })} MB</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyan-300">
                    <span>Gigabytes (GB):</span>
                    <span>{(bytesVal / (1024 * 1024 * 1024)).toFixed(3)} GB</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

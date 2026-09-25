import { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Radio, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';
import { audioFx } from '../lib/audioFx';

interface EndpointStatus {
  name: string;
  url: string;
  port: number;
  description: string;
  status: 'checking' | 'online' | 'offline';
  category: 'ai' | 'dev' | 'network';
}

export default function LocalRigDeck() {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    {
      name: 'ComfyUI Image & Workflow Gen',
      url: 'http://localhost:8188',
      port: 8188,
      description: 'Stable Diffusion, SDXL & custom FLUX generation pipelines',
      status: 'checking',
      category: 'ai'
    },
    {
      name: 'Ollama Local LLM Gateway',
      url: 'http://localhost:11434',
      port: 11434,
      description: 'Llama 3, DeepSeek, Mistral local inference engine',
      status: 'checking',
      category: 'ai'
    },
    {
      name: 'Local Vite Dev Server',
      url: 'http://localhost:5173',
      port: 5173,
      description: 'Active client-side HMR workspace',
      status: 'checking',
      category: 'dev'
    }
  ]);

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Health ping checker for local endpoints
  const checkEndpointHealth = async () => {
    audioFx.playClick();
    setEndpoints(prev => prev.map(ep => ({ ...ep, status: 'checking' })));

    const updated = await Promise.all(
      endpoints.map(async ep => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          // Attempt fetch with no-cors so cross-origin localhost responds
          await fetch(ep.url, { mode: 'no-cors', signal: controller.signal });
          clearTimeout(timeoutId);
          return { ...ep, status: 'online' as const };
        } catch {
          return { ...ep, status: 'offline' as const };
        }
      })
    );
    setEndpoints(updated);
  };

  useEffect(() => {
    checkEndpointHealth();
  }, []);

  const handleCopyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    audioFx.playClick();
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Main Rig Capsule */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1222]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        
        {/* Glow Accents */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold uppercase tracking-wider text-white">
                  LOCAL RIG & HOMELAB ORCHESTRATION
                </h2>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                  BARNSLEY HQ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct Local Control • ComfyUI • Ollama • Poco F7 ADB Bridge • Port 53 DNS Sinkhole
              </p>
            </div>
          </div>

          <button
            onClick={checkEndpointHealth}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Ping Local Endpoints</span>
          </button>
        </div>

        {/* Rig Hardware Specs Matrix */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Cpu className="h-4 w-4 text-purple-400" />
              <span>PROCESSOR</span>
            </div>
            <div className="font-mono text-sm font-bold text-white">i7-11700K</div>
            <div className="text-[0.68rem] text-slate-400 font-mono">16 Threads @ 4.82 GHz</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span>GRAPHICS ACCEL</span>
            </div>
            <div className="font-mono text-sm font-bold text-white">RTX 3070 Ti</div>
            <div className="text-[0.68rem] text-slate-400 font-mono">8GB GDDR6X VRAM</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Radio className="h-4 w-4 text-cyan-400" />
              <span>SYSTEM MEMORY</span>
            </div>
            <div className="font-mono text-sm font-bold text-white">64 GB DDR4</div>
            <div className="text-[0.68rem] text-slate-400 font-mono">High-Speed Dual Channel</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <HardDrive className="h-4 w-4 text-amber-400" />
              <span>DRIVES & VOLUMES</span>
            </div>
            <div className="font-mono text-sm font-bold text-white">C: D: E: V:</div>
            <div className="text-[0.68rem] text-slate-400 font-mono">NVMe + HDD + Virtual V:</div>
          </div>
        </div>

        {/* Local Services & Ports Section */}
        <div className="relative z-10 pt-6 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            LOCAL DAEMON PORTS & ONE-CLICK LAUNCHERS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {endpoints.map(ep => (
              <div
                key={ep.port}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#090d18]/80 p-4 transition-all hover:border-cyan-500/40 hover:bg-[#0c1222]/90"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      PORT :{ep.port}
                    </span>
                    <div className="flex items-center gap-1.5 text-[0.68rem] font-mono">
                      {ep.status === 'checking' && (
                        <span className="text-slate-400 flex items-center gap-1">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Pinging...
                        </span>
                      )}
                      {ep.status === 'online' && (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" /> ACTIVE
                        </span>
                      )}
                      {ep.status === 'offline' && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> STANDBY
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-mono text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {ep.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ep.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <span className="font-mono text-[0.7rem] text-slate-500">{ep.url}</span>
                  <a
                    href={ep.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono font-medium text-cyan-300 hover:bg-cyan-500/20"
                  >
                    <span>Launch</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Poco F7 & Whole-Home DNS Infrastructure Cards */}
        <div className="relative z-10 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Poco F7 Android Bridge */}
          <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-purple-400" />
                <h4 className="font-mono text-xs font-bold text-white uppercase">POCO F7 ANDROID LINK (ROOT / ADB)</h4>
              </div>
              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[0.65rem] font-mono text-purple-300">
                DEVICE BRIDGE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Automated package uninstallation, APKHub deployment, Termux SSH tunneling, and wireless debugging.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-2 font-mono text-xs text-slate-300 border border-white/5">
                <span>adb devices -l</span>
                <button
                  onClick={() => handleCopyCommand('adb devices -l', 'adb-dev')}
                  className="flex items-center gap-1 text-[0.7rem] text-purple-300 hover:underline"
                >
                  {copiedCmd === 'adb-dev' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCmd === 'adb-dev' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-2 font-mono text-xs text-slate-300 border border-white/5">
                <span>scrcpy --stay-awake --video-bit-rate 16M</span>
                <button
                  onClick={() => handleCopyCommand('scrcpy --stay-awake --video-bit-rate 16M', 'scrcpy')}
                  className="flex items-center gap-1 text-[0.7rem] text-purple-300 hover:underline"
                >
                  {copiedCmd === 'scrcpy' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCmd === 'scrcpy' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Whole-Home Port 53 DNS Adblocker */}
          <div className="rounded-2xl border border-white/10 bg-[#090d18]/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h4 className="font-mono text-xs font-bold text-white uppercase">WHOLE-HOME PORT 53 DNS SINKHOLE</h4>
              </div>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-mono text-emerald-300">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Hardware-level tracker, telemetry, and advertising neutralizer protecting all LAN devices, TVs, and mobile traffic.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded-xl bg-black/40 p-2.5 border border-white/5">
                <span className="text-slate-500 block text-[0.68rem]">FILTER PROTOCOL</span>
                <span className="text-white font-bold">Standard Port 53 UDP/TCP</span>
              </div>
              <div className="rounded-xl bg-black/40 p-2.5 border border-white/5">
                <span className="text-slate-500 block text-[0.68rem]">LATENCY IMPACT</span>
                <span className="text-emerald-400 font-bold">&lt; 1ms Local Cache</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

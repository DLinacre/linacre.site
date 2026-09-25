import { useState, useEffect } from 'react';
import { 
  Github, 
  Terminal as TerminalIcon, 
  Layers, 
  Volume2, 
  VolumeX, 
  Palette,
  Music,
  Code2,
  Cpu,
  Radio
} from 'lucide-react';
import { audioFx } from '../lib/audioFx';

interface CyberHUDProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  theme: string;
  cycleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  projectCount: number;
  isPlayingMusic?: boolean;
  currentTrackTitle?: string;
}

export default function CyberHUD({
  activeTab,
  setActiveTab,
  terminalOpen,
  setTerminalOpen,
  theme,
  cycleTheme,
  soundEnabled,
  toggleSound,
  projectCount,
  isPlayingMusic,
  currentTrackTitle
}: CyberHUDProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-GB', { hour12: false }));
      setDateStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    audioFx.playClick();
  };

  return (
    <header className="sticky top-4 z-40 flex w-full flex-col items-center px-4 space-y-2">
      <div className="hud-capsule flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0d111e]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-8">
        
        {/* Top Row: Clock, Status, Active Track Pill, & Vitals */}
        <div className="flex items-center justify-between gap-4 sm:gap-8 w-full">
          
          {/* Clock */}
          <div className="font-mono text-2xl font-bold tracking-wider text-white drop-shadow-[0_0_12px_rgba(192,132,252,0.4)] sm:text-3xl">
            {timeStr || '12:00:00'}
          </div>

          <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {/* Date & System Status */}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              {dateStr || 'Today'}
            </span>
            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold tracking-wider text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </span>
              <span>SYSTEM OPTIMAL</span>
            </div>
          </div>

          {/* Active Audio Playing Pill */}
          {isPlayingMusic && currentTrackTitle && (
            <div 
              onClick={() => handleTabClick('music')}
              className="cursor-pointer hidden md:flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/15 px-3 py-1 text-xs font-mono text-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.3)] animate-pulse"
              title="Click to jump to Music Deck"
            >
              <Radio className="h-3 w-3 text-pink-400" />
              <span className="truncate max-w-[140px] font-bold">{currentTrackTitle}</span>
            </div>
          )}

          {/* Global Theme & Sound Quick Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={cycleTheme}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
              title={`Cycle Neon Theme (Active: ${theme.replace('theme-', '') || 'default'})`}
              aria-label="Cycle Theme"
            >
              <Palette className="h-4 w-4 text-pink-400" />
            </button>

            <button
              onClick={toggleSound}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
              title={soundEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>

        </div>

        {/* Bottom Row: Quick Dock Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-1.5 border-t border-white/10 pt-2.5 sm:gap-2.5 w-full">
          
          {/* Projects Tab */}
          <button
            onClick={() => handleTabClick('projects')}
            className={`dock-btn flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-purple-500/25 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(192,132,252,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Browse all software engineering projects"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Projects ({projectCount})</span>
          </button>

          {/* Music Tab */}
          <button
            onClick={() => handleTabClick('music')}
            className={`dock-btn flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
              activeTab === 'music'
                ? 'bg-pink-500/25 text-pink-200 border border-pink-500/50 shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Proper Mad Studio Audio Player, Visualizer & Live Lyrics"
          >
            <Music className={`h-3.5 w-3.5 ${isPlayingMusic ? 'text-pink-400 animate-bounce' : ''}`} />
            <span>Proper Mad</span>
          </button>

          {/* Quick Tools Tab */}
          <button
            onClick={() => handleTabClick('tools')}
            className={`dock-btn flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
              activeTab === 'tools'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Daily Scratchpad, JSON, Base64, UUIDs & Converters"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Daily Tools</span>
          </button>

          {/* Local Rig Tab */}
          <button
            onClick={() => handleTabClick('rig')}
            className={`dock-btn flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
              activeTab === 'rig'
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Local Rig Telemetry, ComfyUI, Ollama & Phone Link"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Local Rig</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-white/15 mx-1" />

          {/* Terminal Toggle */}
          <button
            onClick={() => {
              setTerminalOpen(prev => !prev);
              audioFx.playClick();
            }}
            className={`dock-btn flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
              terminalOpen
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle interactive Cyber Terminal console (~)"
          >
            <TerminalIcon className="h-3.5 w-3.5 text-amber-400" />
            <span>Terminal</span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/DLinacre"
            target="_blank"
            rel="noopener noreferrer"
            className="dock-btn hidden md:flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold text-slate-400 border border-transparent hover:text-white hover:bg-white/5 transition-all"
            title="Visit David Linacre on GitHub"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>

        </nav>

      </div>
    </header>
  );
}

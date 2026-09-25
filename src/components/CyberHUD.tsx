import { useState, useEffect } from 'react';
import { 
  Github, 
  Terminal as TerminalIcon, 
  Layers, 
  Volume2, 
  VolumeX, 
  Palette
} from 'lucide-react';

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
  projectCount
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

  return (
    <header className="sticky top-4 z-40 flex w-full justify-center px-4">
      <div className="hud-capsule flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0d111e]/85 px-6 py-3.5 shadow-2xl backdrop-blur-xl sm:px-8">
        
        {/* Top Row: Clock, Status, & Vitals */}
        <div className="flex items-center justify-between gap-6 sm:gap-10">
          <div className="font-mono text-2xl font-bold tracking-wider text-white drop-shadow-[0_0_12px_rgba(192,132,252,0.4)] sm:text-3xl">
            {timeStr || '12:00:00'}
          </div>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

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
        </div>

        {/* Bottom Row: Quick Dock Navigation */}
        <nav className="flex items-center gap-2 border-t border-white/10 pt-2.5 sm:gap-3">
          <button
            onClick={() => setActiveTab('projects')}
            className={`dock-btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(192,132,252,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Browse all software projects"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Projects ({projectCount})</span>
          </button>

          <button
            onClick={() => setTerminalOpen(prev => !prev)}
            className={`dock-btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              terminalOpen
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle interactive Cyber Terminal (~)"
          >
            <TerminalIcon className="h-3.5 w-3.5 text-cyan-400" />
            <span>Terminal</span>
          </button>

          <a
            href="https://github.com/DLinacre"
            target="_blank"
            rel="noopener noreferrer"
            className="dock-btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 border border-transparent hover:text-white hover:bg-white/5 transition-all"
            title="Visit David Linacre on GitHub"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <div className="h-4 w-px bg-white/15" />

          {/* Controls: Theme & Sound */}
          <button
            onClick={cycleTheme}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
            title={`Cycle Neon Theme (Active: ${theme.replace('theme-', '') || 'default'})`}
            aria-label="Cycle Theme"
          >
            <Palette className="h-3.5 w-3.5 text-pink-400" />
          </button>

          <button
            onClick={toggleSound}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
            title={soundEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-slate-500" />
            )}
          </button>
        </nav>

      </div>
    </header>
  );
}

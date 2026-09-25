import { useState, useEffect } from 'react';
import CyberHUD from './components/CyberHUD';
import CyberTerminal from './components/CyberTerminal';
import ProjectRadar from './components/ProjectRadar';
import CardManagerModal from './components/CardManagerModal';
import TwinkleCanvas from './components/TwinkleCanvas';
import CyberAudioPlayer from './components/CyberAudioPlayer';
import QuickToolsDeck from './components/QuickToolsDeck';
import LocalRigDeck from './components/LocalRigDeck';
import defaultProjects from './config/projects.json';
import { ProjectCard } from './types/project';
import { audioFx } from './lib/audioFx';
import { Terminal as TerminalIcon, Sparkles, Layers, Cpu, ShieldCheck, Github } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('projects');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [cardManagerOpen, setCardManagerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'theme-purple' | 'theme-cyan' | 'theme-sakura' | 'theme-emerald'>('theme-purple');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackTitle, setCurrentTrackTitle] = useState('');

  // Load cards from localStorage or default configuration
  const [cards, setCards] = useState<ProjectCard[]>(() => {
    try {
      const saved = localStorage.getItem('linacre_site_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return defaultProjects as ProjectCard[];
  });

  // Save cards to localStorage whenever modified
  const handleSaveCards = (updated: ProjectCard[]) => {
    setCards(updated);
    try {
      localStorage.setItem('linacre_site_projects', JSON.stringify(updated));
    } catch {}
    audioFx.playClick();
  };

  const handleResetDefaults = () => {
    setCards(defaultProjects as ProjectCard[]);
    try {
      localStorage.removeItem('linacre_site_projects');
    } catch {}
    audioFx.playClick();
  };

  const cycleTheme = () => {
    const themes: ('theme-purple' | 'theme-cyan' | 'theme-sakura' | 'theme-emerald')[] = [
      'theme-purple',
      'theme-cyan',
      'theme-sakura',
      'theme-emerald',
    ];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIdx]);
    audioFx.playClick();
  };

  const toggleSound = () => {
    audioFx.enabled = !audioFx.enabled;
    setSoundEnabled(audioFx.enabled);
  };

  // Keyboard shortcut: '~' or 't' toggles terminal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '`' || e.key === '~' || e.key === 't' || e.key === 'T') {
        setTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className={`min-h-screen text-slate-100 selection:bg-purple-500/30 selection:text-white ${theme}`}>
      
      {/* Background Artwork Layer */}
      <div 
        className="fixed inset-0 z-0 bg-[#080a12] bg-cover bg-center bg-no-repeat opacity-95 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundImage: `url('/anime_bg.jpg')` }}
      />

      {/* Cybernetic Dark Overlay & Radial Vignette */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#080a12]/80 via-[#080a12]/90 to-[#080a12]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, rgba(13, 17, 30, 0.4) 0%, rgba(8, 10, 18, 0.95) 100%)`
        }}
      />

      {/* Ambient Starlight Particles */}
      <TwinkleCanvas />

      {/* Main App Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        
        {/* Top Center Cyber HUD */}
        <CyberHUD
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          terminalOpen={terminalOpen}
          setTerminalOpen={setTerminalOpen}
          theme={theme}
          cycleTheme={cycleTheme}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          projectCount={cards.length}
          isPlayingMusic={isPlayingMusic}
          currentTrackTitle={currentTrackTitle}
        />

        {/* Hero Section */}
        <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12 space-y-10">
          
          <section className="flex flex-col items-center text-center space-y-4 pt-2 sm:pt-6">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.2)]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>DAVID LINACRE // DIGITAL ECOSYSTEM & MISSION CONTROL</span>
            </div>

            <h1 className="font-mono text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              ENGINEERED FOR <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">EXCELLENCE</span>
            </h1>

            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
              Autonomous digital infrastructure, daily in-browser developer utilities, Suno V6 master audio deck, and local AI orchestration. Built from first principles with zero technical debt.
            </p>

            {/* Quick Status Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <div 
                onClick={() => setActiveTab('rig')}
                className="cursor-pointer flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0d1224]/70 px-3 py-1.5 text-xs font-mono text-slate-300 backdrop-blur-md hover:border-amber-500/40 hover:text-white transition-all"
                title="View Rig Specs"
              >
                <Cpu className="h-3.5 w-3.5 text-amber-400" />
                <span>i7-11700K • RTX 3070 Ti</span>
              </div>
              <div 
                onClick={() => setActiveTab('rig')}
                className="cursor-pointer flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0d1224]/70 px-3 py-1.5 text-xs font-mono text-slate-300 backdrop-blur-md hover:border-emerald-500/40 hover:text-white transition-all"
                title="View DNS Telemetry"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Whole-Home Port 53 DNS</span>
              </div>
              <div 
                onClick={() => setActiveTab('projects')}
                className="cursor-pointer flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0d1224]/70 px-3 py-1.5 text-xs font-mono text-slate-300 backdrop-blur-md hover:border-cyan-500/40 hover:text-white transition-all"
                title="Browse Solutions"
              >
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>{cards.length} Active Solutions</span>
              </div>
            </div>

          </section>

          {/* Tab 1: Project Radar Section */}
          <div className={activeTab === 'projects' ? 'block' : 'hidden'}>
            <ProjectRadar
              cards={cards}
              onOpenCardManager={() => setCardManagerOpen(true)}
              onEditCard={() => setCardManagerOpen(true)}
              onDeleteCard={id => handleSaveCards(cards.filter(c => c.id !== id))}
            />
          </div>

          {/* Tab 2: Proper Mad Studio Audio Deck */}
          <div className={activeTab === 'music' ? 'block' : 'hidden'}>
            <CyberAudioPlayer
              onPlayingChange={(playing, title) => {
                setIsPlayingMusic(playing);
                setCurrentTrackTitle(title);
              }}
            />
          </div>

          {/* Tab 3: Daily Tools & Scratchpad */}
          <div className={activeTab === 'tools' ? 'block' : 'hidden'}>
            <QuickToolsDeck />
          </div>

          {/* Tab 4: Local Rig & Homelab Deck */}
          <div className={activeTab === 'rig' ? 'block' : 'hidden'}>
            <LocalRigDeck />
          </div>

        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/10 bg-[#080b14]/90 py-6 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span>LINACRE.SITE // ALL SYSTEMS NOMINAL</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setTerminalOpen(true)}
                className="flex items-center gap-1.5 font-mono text-purple-300 hover:text-white transition-colors"
              >
                <TerminalIcon className="h-3.5 w-3.5" />
                <span>Open Terminal (~)</span>
              </button>

              <a
                href="https://github.com/DLinacre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </footer>

      </div>

      {/* Interactive Cyber Terminal Console */}
      <CyberTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        cards={cards}
        onOpenCardManager={() => setCardManagerOpen(true)}
        cycleTheme={cycleTheme}
        playKeyTick={() => audioFx.playKeyTick()}
        onSelectTab={setActiveTab}
      />

      {/* Card Manager Modal (Add / Edit / Remove) */}
      <CardManagerModal
        isOpen={cardManagerOpen}
        onClose={() => setCardManagerOpen(false)}
        cards={cards}
        onSaveCards={handleSaveCards}
        onResetDefaults={handleResetDefaults}
      />

    </div>
  );
}

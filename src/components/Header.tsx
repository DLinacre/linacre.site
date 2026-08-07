import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, Terminal, BookOpen, Cpu, Layers, Sun, Moon, Command, Sparkles, Sliders, Bot, User, Mail, Activity, FileText, FolderCode, House, Gamepad2, Volume2, VolumeX } from 'lucide-react';
import InteractiveGlobe from './InteractiveGlobe';
import { toggleSoundFx, isSoundFxEnabled, playClick } from '../lib/audioEngine';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  openPalette: () => void;
  activeColor: { primary: string; secondary: string };
}

export default function Header({ activeTab, setActiveTab, theme, setTheme, openPalette, activeColor }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundFxEnabled());
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        requestAnimationFrame(() => {
          mobileButtonRef.current?.focus();
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const coreItems = [
    { id: 'home', label: 'Home', icon: House },
    { id: 'projects', label: 'Projects', icon: FolderCode },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'toolkit', label: 'Toolkit', icon: Layers },
    { id: 'playground', label: 'Playground', icon: Sliders },
  ];

  const moreItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'lab', label: 'AI Lab', icon: Cpu },
    { id: 'identity', label: 'Identity', icon: Sparkles },
    { id: 'status', label: 'Status', icon: Activity },
    { id: 'dashboard', label: 'Dashboard', icon: Terminal },
  ];

  const [moreOpen, setMoreOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem('linacre_theme', nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-color/10 bg-background/70 backdrop-blur-xl transition-colors" style={{ transitionDuration: 'var(--linacre-duration-base)' }} role="banner">
      {/* Skip-to-content link for keyboard/screen reader accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 font-mono font-bold text-lg tracking-tight hover:opacity-90 group focus:outline-none focus:ring-2 focus:ring-cyan/50 rounded p-1 transition-all shrink-0"
            id="nav-logo"
          >
            <div className="relative w-7 h-7 flex items-center justify-center bg-[#061923] border border-amber-color/30 rounded-lg group-hover:border-amber-color transition-colors overflow-hidden">
              <div className="absolute -inset-2 opacity-0 group-hover:opacity-15 blur-md bg-amber-color transition-opacity pointer-events-none" />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-color transform group-hover:scale-110 transition-transform duration-200"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <div className="hidden min-[430px]:flex items-center">
              <span className="text-foreground transition-colors">linacre</span>
              <span className="text-amber-color">.</span>
              <span className="text-foreground transition-colors">site</span>
            </div>
          </a>

          {/* Desktop Navigation — xl+ only. Below 1280px the hamburger menu
              is used, which guarantees the header row can never overflow the
              viewport (this was the "black stripe on the right" bug). */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Primary">
            {coreItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  href={item.id === 'home' ? '/' : `/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative px-2.5 py-2 flex items-center gap-1.5 font-mono text-sm transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan/50 ${
                    isActive ? 'text-amber-color font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-amber-color rounded-full"
                      style={{ boxShadow: '0 0 12px rgba(34,211,238,0.4)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}

            {/* More dropdown container */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={(e) => {
                  // Close dropdown on focus loss (accessibility)
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setTimeout(() => setMoreOpen(false), 150);
                  }
                }}
                className={`px-3 py-2 flex items-center gap-1 font-mono text-sm transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan/50 cursor-pointer ${
                  moreItems.some(item => item.id === activeTab) ? 'text-amber-color font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                aria-label="More options menu"
              >
                <span>More</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-1.5 w-44 bg-background border border-amber-color/10 rounded-lg shadow-xl py-1 z-50 flex flex-col"
                  >
                    {moreItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`/${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(item.id);
                            setMoreOpen(false);
                          }}
                          className={`px-4 py-2 flex items-center gap-2 font-mono text-xs transition-colors hover:bg-muted/50 ${
                            isActive ? 'text-amber-color font-semibold' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* GitHub external Link */}
            <a
              href="https://github.com/LIN4CRE/linacre.site"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md focus:outline-none"
              id="nav-github"
            >
              <Github className="w-4 h-4" />
              <span className="hidden 2xl:inline">GitHub</span>
            </a>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Primary CTA — the tool box */}
            <a
              href="/toolkit"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('toolkit');
                setMobileMenuOpen(false);
              }}
              data-analytics="nav_toolkit_cta"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-color hover:bg-amber-glow text-[#030c14] font-mono text-xs font-bold transition-all shadow-[0_0_16px_rgba(34,211,238,0.35)] hover:shadow-[0_0_24px_rgba(34,211,238,0.55)] focus:outline-none"
              id="btn-header-toolkit"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Toolkit</span>
            </a>

            {/* Interactive Globe Widget */}
            <InteractiveGlobe primaryColor={activeColor.primary} />

            {/* Command Palette Button */}
            <button
              onClick={openPalette}
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50 flex items-center gap-1.5"
              title="Open Command Palette (Press /)"
              aria-label="Open command palette"
              id="btn-command-palette"
            >
              <Command className="w-4 h-4" />
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border-color text-muted-foreground shadow-sm">
                /
              </kbd>
            </button>

            {/* Sound FX Toggle Button (hidden on small screens — the header
                row must never overflow the viewport) */}
            <button
              onClick={() => {
                const enabled = toggleSoundFx();
                setSoundOn(enabled);
              }}
              className="hidden md:inline-flex p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50"
              title={soundOn ? 'Sound FX Enabled (Click to Mute)' : 'Sound FX Muted (Click to Enable)'}
              aria-label="Toggle synthesized sound effects"
              id="btn-sound-toggle"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-color" /> : <VolumeX className="w-4 h-4 text-muted-foreground/60" />}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                playClick();
                toggleTheme();
              }}
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle visual theme"
              id="btn-theme-toggle"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-color" /> : <Moon className="w-4 h-4 text-cyan" />}
            </button>

            {/* Mobile menu button */}
            <button
              ref={mobileButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 xl:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50 shrink-0"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              id="btn-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="xl:hidden border-t border-amber-color/10 bg-background/95 backdrop-blur-xl overflow-hidden"
            id="mobile-nav-panel"
            aria-label="Mobile primary navigation"
          >
            <div className="px-4 py-3 space-y-1">
              {[...coreItems, ...moreItems].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <a
                    key={item.id}
                    id={`mobile-nav-tab-${item.id}`}
                    href={item.id === 'home' ? '/' : `/${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 flex items-center gap-2.5 font-mono text-sm transition-colors rounded-md ${
                      isActive
                        ? 'bg-amber-color/10 text-amber-color font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}

              {/* Mobile primary CTA — the tool box */}
              <a
                href="/toolkit"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('toolkit');
                  setMobileMenuOpen(false);
                }}
                data-analytics="nav_toolkit_cta_mobile"
                className="w-full px-3 py-2.5 flex items-center justify-center gap-2 rounded-md bg-amber-color text-[#030c14] font-mono text-sm font-bold shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                id="mobile-nav-toolkit-cta"
              >
                <Layers className="w-4 h-4" />
                <span>Toolkit</span>
              </a>
              <a
                href="https://github.com/LIN4CRE/linacre.site"
                target="_blank"
                rel="noopener noreferrer"
                id="mobile-nav-github"
                className="w-full px-3 py-2.5 flex items-center gap-2.5 font-mono text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors rounded-md"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

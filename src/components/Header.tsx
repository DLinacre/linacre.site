import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import Logo3D from './Logo3D';
import InteractiveGlobe from './InteractiveGlobe';

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeColor: { primary: string; secondary: string };
}

/**
 * Header — deliberately minimal: the 3D logo on the left, the interactive
 * globe and a compact theme toggle on the right, plus a thin scroll-progress
 * bar. All navigation lives in the floating bottom dock.
 */
export default function Header({ setActiveTab, theme, setTheme, activeColor }: HeaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem('linacre_theme', nextTheme);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-amber-color/10 bg-background/70 backdrop-blur-xl transition-colors"
      style={{ transitionDuration: 'var(--linacre-duration-base)' }}
      role="banner"
    >
      {/* Skip-to-content link for keyboard/screen reader accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand: 3D logo */}
          <Logo3D onNavigate={setActiveTab} />

          {/* Globe + theme toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <InteractiveGlobe primaryColor={activeColor.primary} />
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              id="btn-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-color" />
              ) : (
                <Moon className="w-4 h-4 text-cyan" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan via-emerald-color to-amber-color transition-[width] duration-100"
        style={{ width: `${Math.round(progress * 100)}%` }}
        aria-hidden="true"
      />
    </header>
  );
}

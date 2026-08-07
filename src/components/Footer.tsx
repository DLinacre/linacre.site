import { useState, useEffect } from 'react';
import { Terminal, Github, Heart, ArrowUp, Linkedin, Mail } from 'lucide-react';

const EXPLORE_LINKS = [
  { tab: 'home', label: 'Start' },
  { tab: 'tools', label: 'Tools' },
  { tab: 'games', label: 'Games' },
  { tab: 'lab', label: 'AI Lab' },
  { tab: 'identity', label: 'Identity Studio' },
  { tab: 'about', label: 'About' },
  { tab: 'contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { tab: 'privacy', label: 'Privacy' },
  { tab: 'cookie-policy', label: 'Cookie Policy' },
  { tab: 'terms', label: 'Terms' },
  { tab: 'accessibility', label: 'Accessibility' },
];

function useNav() {
  return (tab: string) => {
    const path = tab === 'home' ? '/' : `/${tab}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNav();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating back-to-top button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 p-3 bg-amber-color text-[#030c14] rounded-full hover:scale-110 transition-transform animate-slide-up focus:outline-none focus:ring-2 focus:ring-amber-color"
          style={{ boxShadow: 'var(--linacre-glow-strong)' }}
          aria-label="Scroll to top"
          id="btn-scroll-top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Amber pulse-line divider */}
      <div className="linacre-pulse-line w-full" />

      <footer
        className="w-full bg-background/50 py-12 transition-all"
        style={{ transitionDuration: 'var(--linacre-duration-base)' }}
        id="global-footer"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* Author */}
            <div className="flex flex-col gap-1.5 font-mono text-xs text-muted-foreground/80">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Terminal className="w-3.5 h-3.5 text-amber-color" />
                <span>david@linacre.site</span>
              </div>
              <p className="mt-1 max-w-sm">
                &copy; {currentYear} David Linacre. Built with React, TypeScript and Tailwind CSS v4.
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                Useful software, clear systems, CyberBlue craft.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href="https://github.com/DLinacre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/60 hover:text-amber-color transition-colors"
                  aria-label="GitHub — DLinacre"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/david-linacre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/60 hover:text-amber-color transition-colors"
                  aria-label="LinkedIn — David Linacre"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:david@linacre.site"
                  className="text-muted-foreground/60 hover:text-amber-color transition-colors"
                  aria-label="Email David"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Explore */}
            <nav aria-label="Footer — explore">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
                Explore
              </h2>
              <ul className="space-y-2">
                {EXPLORE_LINKS.map(link => (
                  <li key={link.tab}>
                    <button
                      onClick={() => navigate(link.tab)}
                      className="font-mono text-xs text-muted-foreground/80 hover:text-amber-color transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan/50 rounded"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Legal */}
            <nav aria-label="Footer — legal">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
                Legal
              </h2>
              <ul className="space-y-2">
                {LEGAL_LINKS.map(link => (
                  <li key={link.tab}>
                    <button
                      onClick={() => navigate(link.tab)}
                      className="font-mono text-xs text-muted-foreground/80 hover:text-amber-color transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan/50 rounded"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10 flex items-center justify-center gap-1.5 text-[10px] font-mono text-muted-foreground/50">
            <span>Built with passion and absolute precision</span>
            <Heart className="w-3 h-3 text-amber-color fill-amber-color linacre-animate-pulse" />
          </div>
        </div>
      </footer>
    </>
  );
}

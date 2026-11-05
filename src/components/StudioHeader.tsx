import { useEffect, useState } from 'react';

interface StudioHeaderProps {
  activeTab?: string;
}

export default function StudioHeader({ activeTab = 'home' }: StudioHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const workHref = activeTab === 'home' ? '#work' : '/#work';

  return (
    <header className="studio-header">
      <div className="studio-header__inner">
        <a href="/" className="studio-brand">
          <span className="studio-brand__mark" aria-hidden="true">
            L4
          </span>
          <span className="studio-brand__text">
            <span className="studio-brand__name">LIN4CRE</span>
            <span className="studio-brand__role">Independent Software Studio</span>
          </span>
        </a>

        <nav className="studio-nav" aria-label="Primary navigation">
          <a
            href="/"
            className="studio-nav__link"
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            Home
          </a>
          <a href={workHref} className="studio-nav__link">
            Selected Work
          </a>
          <a
            href="/games"
            className="studio-nav__link"
            aria-current={activeTab === 'games' ? 'page' : undefined}
          >
            Games
          </a>
          <a
            href="/about"
            className="studio-nav__link"
            aria-current={activeTab === 'about' ? 'page' : undefined}
          >
            About
          </a>
          <a
            href="/contact"
            className="studio-nav__link studio-nav__link--cta"
            aria-current={activeTab === 'contact' ? 'page' : undefined}
          >
            Contact
          </a>
        </nav>

        <button
          type="button"
          className="studio-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="studio-mobile-drawer"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <div
        id="studio-mobile-drawer"
        className="studio-mobile-drawer"
        data-open={menuOpen ? 'true' : 'false'}
      >
        <nav className="studio-mobile-nav" aria-label="Mobile navigation">
          <a
            href="/"
            aria-current={activeTab === 'home' ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span>Home</span>
            <span aria-hidden="true">→</span>
          </a>
          <a href={workHref} onClick={() => setMenuOpen(false)}>
            <span>Selected Work</span>
            <span aria-hidden="true">↓</span>
          </a>
          <a
            href="/games"
            aria-current={activeTab === 'games' ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span>Games</span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            href="/about"
            aria-current={activeTab === 'about' ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span>About</span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            href="/contact"
            aria-current={activeTab === 'contact' ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span>Contact</span>
            <span aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

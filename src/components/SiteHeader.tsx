import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  Clapperboard,
  Gamepad2,
  Github,
  Menu,
  Moon,
  Orbit,
  Search,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import AmbientMusicPlayer from './AmbientMusicPlayer';
import Emblem3D from './Emblem3D';
import { tabToPath } from '../config/routes';

type ThemeMode = 'dark' | 'light';

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

interface SiteHeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const PRIMARY_LINKS = [
  { tab: 'home', label: 'Projects' },
  { tab: 'tools', label: 'Tools' },
  { tab: 'games', label: 'Games' },
  { tab: 'music-videos', label: 'Music Videos' },
  { tab: 'orbit', label: 'Orbit' },
  { tab: 'about', label: 'About' },
  { tab: 'contact', label: 'Contact' },
] as const;

const MORE_GROUPS = [
  {
    heading: 'Studio',
    links: [
      { tab: 'lab', label: 'AI Lab', description: 'Experiments and model tools' },
      { tab: 'identity', label: 'Identity Studio', description: 'Create and export brand assets' },
      { tab: 'ops', label: 'Mission Control', description: 'Project operations and build status' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { tab: 'osint', label: 'OSINT HUD', description: '1,310 curated tools across 11 sectors' },
      {
        tab: 'orbit',
        label: 'Orbit Observatory',
        description: 'Live ISS track, solar terminator, seismic & launch telemetry',
      },
      { tab: 'mob-deals', label: 'Mob Deals', description: 'Compare UK SIM-only plans' },
      { tab: 'pokeguru', label: 'PokeGuru', description: 'Browse Pokémon TCG sets' },
    ],
  },
  {
    heading: 'Site information',
    links: [
      { tab: 'privacy', label: 'Privacy', description: 'How information is handled' },
      { tab: 'accessibility', label: 'Accessibility', description: 'Accessibility statement' },
      { tab: 'cookie-policy', label: 'Cookies & storage', description: 'Browser storage details' },
      { tab: 'terms', label: 'Terms', description: 'Terms of service' },
    ],
  },
] as const;

export default function SiteHeader({
  activeTab,
  onNavigate,
  onOpenSearch,
  soundOn,
  onToggleSound,
  theme,
  onThemeChange,
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const root = document.documentElement;
      const scrollable = root.scrollHeight - root.clientHeight;
      setProgress(scrollable > 0 ? Math.min(1, root.scrollTop / scrollable) : 0);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen && !moreMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (moreMenuRef.current?.open) {
        moreMenuRef.current.open = false;
        setMoreMenuOpen(false);
        moreMenuRef.current.querySelector('summary')?.focus();
        return;
      }
      setMobileMenuOpen(false);
      mobileToggleRef.current?.focus();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen, moreMenuOpen]);

  useEffect(() => {
    if (!moreMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !moreMenuRef.current?.contains(event.target)) {
        if (moreMenuRef.current) moreMenuRef.current.open = false;
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [moreMenuOpen]);

  const navigate = (tab: string) => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    if (moreMenuRef.current) moreMenuRef.current.open = false;
    onNavigate(tab);
  };

  const internalLink = (tab: string, label: string, className: string, description?: string) => (
    <a
      key={tab}
      href={tabToPath(tab)}
      aria-current={activeTab === tab ? 'page' : undefined}
      className={className}
      onClick={event => {
        if (!isPlainClick(event)) return;
        event.preventDefault();
        navigate(tab);
      }}
    >
      <span>{label}</span>
      {description && <small>{description}</small>}
    </a>
  );

  return (
    <header className="site-header" role="banner">
      <div className="site-header__top">
        <div className="site-header__top-inner">
          <div className="site-header__brand">
            <Emblem3D mode="mini" onNavigateHome={() => navigate('home')} />
            <a
              href="/"
              className="site-header__wordmark"
              onClick={event => {
                if (!isPlainClick(event)) return;
                event.preventDefault();
                navigate('home');
              }}
            >
              <span className="site-header__name">LIN4CRE</span>
              <span className="site-header__descriptor">Independent software studio</span>
            </a>
          </div>

          <div className="site-header__actions" role="group" aria-label="Site controls">
            <button
              type="button"
              onClick={onOpenSearch}
              className="site-header__search"
              aria-label="Search projects and pages"
              title="Search projects and pages (Ctrl or Command + K)"
            >
              <Search aria-hidden="true" />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>

            <a
              className="site-header__github"
              href="https://github.com/LIN4CRE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LIN4CRE on GitHub in a new tab"
            >
              <Github aria-hidden="true" />
              <span>GitHub</span>
              <ArrowUpRight aria-hidden="true" className="site-header__external-icon" />
            </a>

            <a
              className="site-header__cta"
              href="/contact"
              onClick={event => {
                if (!isPlainClick(event)) return;
                event.preventDefault();
                navigate('contact');
              }}
            >
              Let’s talk <ArrowUpRight aria-hidden="true" />
            </a>

            <button
              ref={mobileToggleRef}
              type="button"
              className="site-header__menu-toggle"
              aria-controls="primary-navigation"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => {
                if (mobileMenuOpen) {
                  if (moreMenuRef.current) moreMenuRef.current.open = false;
                  setMoreMenuOpen(false);
                }
                setMobileMenuOpen(open => !open);
              }}
            >
              {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </div>

      <nav
        id="primary-navigation"
        className={`site-nav${mobileMenuOpen ? ' is-open' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="site-nav__inner">
          <div className="site-nav__links">
            {PRIMARY_LINKS.map(({ tab, label }) => {
              if (tab === 'games') {
                return (
                  <a
                    key={tab}
                    href="/games"
                    aria-current={activeTab === tab ? 'page' : undefined}
                    className={`site-nav__link${activeTab === tab ? ' is-active' : ''}`}
                  >
                    <Gamepad2 aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                );
              }
              if (tab === 'music-videos') {
                return (
                  <a
                    key={tab}
                    href={tabToPath(tab)}
                    aria-current={activeTab === tab ? 'page' : undefined}
                    className={`site-nav__link${activeTab === tab ? ' is-active' : ''}`}
                    onClick={event => {
                      if (!isPlainClick(event)) return;
                      event.preventDefault();
                      navigate(tab);
                    }}
                  >
                    <Clapperboard aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                );
              }
              if (tab === 'orbit') {
                return (
                  <a
                    key={tab}
                    href={tabToPath(tab)}
                    aria-current={activeTab === tab ? 'page' : undefined}
                    className={`site-nav__link${activeTab === tab ? ' is-active' : ''}`}
                    onClick={event => {
                      if (!isPlainClick(event)) return;
                      event.preventDefault();
                      navigate(tab);
                    }}
                  >
                    <Orbit aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                );
              }
              return internalLink(
                tab,
                label,
                `site-nav__link${activeTab === tab ? ' is-active' : ''}`,
              );
            })}

            <details
              ref={moreMenuRef}
              className="site-nav__more"
              onToggle={event => setMoreMenuOpen(event.currentTarget.open)}
            >
              <summary className="site-nav__link site-nav__more-trigger">
                More <ChevronDown aria-hidden="true" />
              </summary>
              <div className="site-nav__panel">
                {MORE_GROUPS.map(group => (
                  <div className="site-nav__group" key={group.heading}>
                    <p className="site-nav__group-heading">{group.heading}</p>
                    {group.links.map(link =>
                      internalLink(
                        link.tab,
                        link.label,
                        `site-nav__menu-link${activeTab === link.tab ? ' is-active' : ''}`,
                        link.description,
                      ),
                    )}
                  </div>
                ))}
              </div>
            </details>
          </div>

          <div className="site-nav__footer">
            <span className="site-nav__status">
              <span aria-hidden="true" /> South Yorkshire, UK · Working independently
            </span>
            <div
              className="site-nav__preferences"
              role="group"
              aria-label="Audio and appearance controls"
            >
              <AmbientMusicPlayer compact className="site-nav__music" />
              <button
                type="button"
                onClick={onToggleSound}
                className={`site-header__icon-button site-nav__setting${soundOn ? ' is-active' : ''}`}
                aria-label={soundOn ? 'Mute interface sounds' : 'Enable interface sounds'}
                aria-pressed={soundOn}
                title={soundOn ? 'Mute interface sounds' : 'Enable interface sounds'}
              >
                {soundOn ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                className="site-header__icon-button site-nav__setting"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              </button>
            </div>
            <a href="https://github.com/LIN4CRE" target="_blank" rel="noopener noreferrer">
              View open-source work <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </nav>

      <div className="site-header__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}

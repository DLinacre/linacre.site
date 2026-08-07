import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import { getEmblemSVG } from './lib/emblemRenderer';
import { RouteHead } from './components/RouteHead';
import routeMeta from '../route-meta.json';
import TerminalIntro from './components/TerminalIntro';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { CHANGELOG } from './data/core';
import { ToolCategory } from './types';
import { type BreadcrumbPath } from './app/types';
import { resolveColorScheme, resolveFontScheme } from './config/brand';
import { APP_TABS, ROUTE_LABEL, getTabFromLocation, routeKeyForTab, shouldPreserveCurrentPath, tabToPath } from './config/routes';
import { useCommandPaletteShortcut } from './hooks/useCommandPaletteShortcut';
import { useIdleFlag } from './hooks/useIdleFlag';
import { useIdentityPreferences } from './hooks/useIdentityPreferences';
import { useKonamiUnlock } from './hooks/useKonamiUnlock';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useThemePreference } from './hooks/useThemePreference';

// Lazy-loaded page components for optimization (code splitting)
const StartPage = lazy(() => import('./components/StartPage'));
const Toolkit = lazy(() => import('./components/Toolkit'));
const Games = lazy(() => import('./components/Games'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));
const Learn = lazy(() => import('./components/Learn'));
const Lab = lazy(() => import('./components/Lab'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const IdentityHub = lazy(() => import('./components/IdentityHub'));
const DevPlayground = lazy(() => import('./components/DevPlayground'));
const Projects = lazy(() => import('./components/Projects'));
const AgentsHub = lazy(() => import('./components/AgentsHub'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Privacy = lazy(() => import('./components/Privacy'));
const AccessibilityStatement = lazy(() => import('./components/AccessibilityStatement'));
const Blog = lazy(() => import('./components/Blog'));
const StatusPage = lazy(() => import('./components/StatusPage'));
const ContactThanks = lazy(() => import('./components/ContactThanks'));
const CookiePolicy = lazy(() => import('./components/CookiePolicy'));
const Terms = lazy(() => import('./components/Terms'));
const Now = lazy(() => import('./components/Now'));
const LowStakesGuide = lazy(() => import('./components/LowStakesGuide'));
const MobDealsSwitcher = lazy(() => import('./components/MobDealsSwitcher'));
const PokeGuruExplorer = lazy(() => import('./components/PokeGuruExplorer'));
const DkmaGuide = lazy(() => import('./components/DkmaGuide'));

import { BLOG_POSTS } from './data';
import Breadcrumbs from './components/Breadcrumbs';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => getTabFromLocation(window.location.pathname, window.location.hash));
  const [locationPath, setLocationPath] = useState(() => window.location.pathname);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openPalette = useCallback(() => {
    setPaletteLoaded(true);
    setPaletteOpen(true);
  }, []);

  const isOffline = useOnlineStatus();
  const { konamiUnlocked, setKonamiUnlocked } = useKonamiUnlock();
  const { theme, setTheme } = useThemePreference('dark');
  const { identity, customEmblems } = useIdentityPreferences();
  const chatbotReady = useIdleFlag(1500, 3000);

  useCommandPaletteShortcut(openPalette);

  const getBreadcrumbPaths = () => {
    const pathname = locationPath;
    const parts = pathname.split('/').filter(Boolean);

    const paths: BreadcrumbPath[] = [
      {
        label: 'home',
        onClick: () => {
          setActiveTab('home');
          window.history.pushState(null, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }
    ];

    if (parts.length === 0) {
      if (activeTab !== 'home') {
        const pathKey = `/${activeTab}`;
        paths.push({ label: ROUTE_LABEL[pathKey] || activeTab, active: true });
      }
      return paths;
    }

    let runningPath = '';
    parts.forEach((part, idx) => {
      runningPath += `/${part}`;
      const targetPath = runningPath;
      const isLast = idx === parts.length - 1;

      let label = ROUTE_LABEL[targetPath] || decodeURIComponent(part).replace(/-/g, ' ');

      if (parts[0] === 'blog' && idx === 1) {
        const post = BLOG_POSTS.find(p => p.slug === part);
        if (post) label = post.title;
      }

      paths.push({
        label,
        active: isLast,
        onClick: isLast ? undefined : () => {
          const tab = part === 'thanks' ? 'contact-thanks' : part;
          setActiveTab(tab);
          window.history.pushState(null, '', targetPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
    });

    return paths;
  };

  // Synchronize activeTab with URL path for back/forward navigation support
  useEffect(() => {
    const handleNavigation = () => {
      setLocationPath(window.location.pathname);
      setActiveTab(getTabFromLocation(window.location.pathname, window.location.hash));
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  // Update URL path and localStorage when activeTab changes
  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = tabToPath(activeTab);
    // Preserve existing search params for /contact/thanks?ref=…
    if (currentPath !== targetPath && !shouldPreserveCurrentPath(activeTab, currentPath)) {
      const search = activeTab === 'contact-thanks' ? window.location.search : '';
      window.history.pushState(null, '', `${targetPath}${search}`);
      setLocationPath(targetPath);
    }
    try {
      localStorage.setItem('linacre_active_tab', activeTab);
    } catch (e) {
      console.error('Failed to save active tab', e);
    }
  }, [activeTab]);

  // Scroll to top on active tab navigation changes to resolve SPA scroll retention
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activeTab]);

  // Look up metadata for the current route
  const currentMeta = useMemo(() => {
    const key = routeKeyForTab(activeTab, locationPath);
    return routeMeta.routes[key as keyof typeof routeMeta.routes] || routeMeta.routes['/'];
  }, [activeTab, locationPath]);

  const activeColor = useMemo(() => resolveColorScheme(identity), [identity]);
  const activeFont = useMemo(() => resolveFontScheme(identity.fontId), [identity.fontId]);

  // Stagger & entering animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 110,
        damping: 14
      }
    }
  };

  const renderEmblem = () => {
    const p = activeColor.primary;
    const s = activeColor.secondary;
    const frame = identity.frameId;
    const glowIntensity = identity.glow;
    const motion = identity.motionId;
    const speed = identity.pulseSpeed;

    const svgString = getEmblemSVG(
      frame,
      p,
      s,
      motion,
      speed,
      glowIntensity,
      customEmblems
    );

    return (
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center select-none"
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col justify-between selection:bg-amber-color/30" style={{ background: 'var(--linacre-gradient-hero)' }}>
      <RouteHead meta={currentMeta} />
      <style dangerouslySetInnerHTML={{ __html: `
        ${activeFont.import}
        :root, .dark, .light {
          --color-amber-color: ${activeColor.primary} !important;
          --color-cyan: ${activeColor.secondary} !important;
          --font-display: ${activeFont.display} !important;
          --font-mono: ${activeFont.mono} !important;
        }
      `}} />
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-color text-[#030c14] font-mono text-[11px] font-bold text-center flex items-center justify-center gap-2 py-2 px-4 shadow-[0_4px_12px_rgba(34,211,238,0.25)] relative z-50 select-none overflow-hidden"
            id="offline-banner"
          >
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>CONNECTIVITY INTERRUPTED: Running in offline mode. Local state and custom projects are preserved.</span>
          </motion.div>
        )}
      </AnimatePresence>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        openPalette={openPalette}
        activeColor={activeColor}
      />

      <main id="main-content" role="main" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-28 space-y-12">
        <ErrorBoundary>
          {activeTab !== 'home' && (
            <Breadcrumbs paths={getBreadcrumbPaths()} />
          )}
          <Suspense fallback={
            <div className="py-20 text-center font-mono text-xs text-muted-foreground flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-amber-color border-t-transparent rounded-full animate-spin"></div>
              <span>Loading interface module...</span>
            </div>
          }>
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24 }}
              >
                <StartPage navigate={setActiveTab} />
              </motion.div>
            )}

            {activeTab === 'toolkit' && (
            <motion.div
              key="toolkit"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
              className="space-y-12"
            >
              {/* Hero Banner Section with Dynamic Identity Integration */}
              <motion.section
                variants={itemVariants}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 overflow-hidden"
                id="toolkit-hero"
              >
                {/* Hex-grid subtle background pattern */}
                <div className="absolute inset-0 linacre-grid-bg opacity-40 pointer-events-none" />
                {/* Ambient amber orb */}
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)` }} />

                <div className="md:col-span-8 space-y-5 text-center md:text-left relative z-10">
                  <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
                    Available for freelance · UK · Remote worldwide
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                    Full-stack &amp; AI systems engineer — <span className="text-amber-color animate-amber-breathe">available for freelance</span>
                  </h1>
                  <h3 className="font-mono text-sm sm:text-base text-amber-color/90 font-medium tracking-wide">
                    I build reliable React / Go / AI systems for startups who ship fast.
                  </h3>
                  <p className="text-sm sm:text-base md:text-md text-muted-foreground leading-[1.65] max-w-2xl">
                    Systems audits from £1,800. Custom builds from £6,500. Fractional retainer £2,400/mo. NDA-friendly, UK GDPR compliant, replies within 12&nbsp;hours.
                  </p>
                  {/* Primary + secondary + tertiary CTA (audit CRO-01 / UX-01) */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveTab('contact'); }}
                      data-analytics="hero_start_project"
                      className="px-5 py-2.5 bg-amber-color text-[#030c14] font-mono text-sm font-bold rounded-lg hover:bg-amber-glow transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_30px_rgba(34,211,238,0.55)] hover:-translate-y-0.5"
                      id="cta-start-project"
                    >
                      Start a project →
                    </button>
                    <button
                      onClick={() => { setActiveTab('projects'); }}
                      data-analytics="hero_case_studies"
                      className="px-5 py-2.5 bg-transparent border border-amber-color/40 text-amber-color font-mono text-sm font-bold rounded-lg hover:bg-amber-color/10 hover:border-amber-color transition-all duration-200 hover:-translate-y-0.5"
                      id="cta-view-projects"
                    >
                      View projects
                    </button>
                    <button
                      onClick={() => { setActiveTab('toolkit'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                      data-analytics="hero_toolkit"
                      className="px-3 py-2.5 text-amber-color/80 hover:text-amber-color font-mono text-sm underline underline-offset-4 decoration-amber-color/30 hover:decoration-amber-color transition-colors"
                      id="cta-explore-toolkit"
                    >
                      Browse free toolkit →
                    </button>
                  </div>
                  {/* Trust strip */}
                  <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
                    <span>🔒 UK GDPR</span>
                    <span>·</span>
                    <span>Reply &lt; 12h</span>
                    <span>·</span>
                    <span>NDA-friendly</span>
                    <span>·</span>
                    <span>Shipped 17+ production systems</span>
                  </div>
                </div>

                {/* Live Responsive Brand Signature Widget */}
                <div className="md:col-span-4 flex justify-center items-center relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="linacre-surface p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 relative group overflow-hidden w-full max-w-[240px]"
                  >
                    {/* Pulsing ambient radial aura gradient */}
                    <div
                      className="absolute -inset-10 opacity-20 group-hover:opacity-35 blur-2xl rounded-full transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${activeColor.primary} 0%, transparent 70%)` }}
                    />

                    {/* Rendered Live SVG Monogram Emblem */}
                    <div className={`relative z-10 select-none ${identity.motionId === 'spin' ? 'animate-spin-slow' : ''}`}>
                      {renderEmblem()}
                    </div>

                    <div className="relative z-10 text-center space-y-1">
                      <div className="font-display text-[11px] font-bold tracking-wider text-foreground uppercase">
                        Signature Identity
                      </div>
                      <div className="font-mono text-[9px] text-muted-foreground/80 tracking-wider uppercase">
                        {identity.colorId} · {identity.frameId} · {identity.motionId} · {identity.fontId}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.section>

              {/* Brand amber pulse-line divider */}
              <motion.div variants={itemVariants} className="linacre-pulse-line w-full" />

              {/* Typewriter Terminal */}
              <motion.div variants={itemVariants}>
                <TerminalIntro />
              </motion.div>

              {/* Filterable Toolkit directory */}
              <motion.div variants={itemVariants}>
                <Toolkit
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  openPalette={openPalette}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </motion.div>

              {/* Beautiful Releases Changelog timeline */}
              <motion.section
                variants={itemVariants}
                className="space-y-8 pt-12 border-t border-border-color/50"
                id="changelog-section"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-color bg-amber-color/10 px-2 py-0.5 rounded font-semibold">
                    Releases
                  </span>
                  <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Changelog</h2>
                </div>

                {/* Vertical line timeline */}
                <div className="relative pl-6 border-l border-border-color space-y-8" id="changelog-timeline">
                  {CHANGELOG.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative group"
                      id={`changelog-item-${item.version}`}
                    >
                      {/* node dot */}
                      <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-background dark:bg-[#030c14] border-2 border-cyan group-hover:scale-125 transition-transform" />

                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-mono text-xs font-bold text-cyan">{item.version}</span>
                          <span className="hidden sm:inline text-xs text-muted-foreground/60 font-semibold">·</span>
                          <h3 className="font-display text-sm font-bold text-foreground group-hover:text-amber-color transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-1 max-w-4xl">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </motion.div>
          )}

          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Learn />
            </motion.div>
          )}

          {activeTab === 'lab' && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Lab theme={theme} />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Dashboard />
            </motion.div>
          )}

          {activeTab === 'identity' && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <IdentityHub />
            </motion.div>
          )}

          {activeTab === 'playground' && (
            <motion.div
              key="playground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <DevPlayground />
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Projects />
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Games />
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <AgentsHub />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <About />
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Contact />
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Privacy />
            </motion.div>
          )}

          {activeTab === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <AccessibilityStatement />
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Blog />
            </motion.div>
          )}

          {activeTab === 'status' && (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <StatusPage />
            </motion.div>
          )}

          {activeTab === 'contact-thanks' && (
            <motion.div
              key="contact-thanks"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <ContactThanks />
            </motion.div>
          )}

          {activeTab === 'cookie-policy' && (
            <motion.div
              key="cookie-policy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <CookiePolicy />
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Terms />
            </motion.div>
          )}

          {activeTab === 'now' && (
            <motion.div
              key="now"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Now />
            </motion.div>
          )}

          {activeTab === 'low-stakes' && (
            <motion.div
              key="low-stakes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <LowStakesGuide />
            </motion.div>
          )}

          {activeTab === 'mob-deals' && (
            <motion.div
              key="mob-deals"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <MobDealsSwitcher />
            </motion.div>
          )}

          {activeTab === 'pokeguru' && (
            <motion.div
              key="pokeguru"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <PokeGuruExplorer />
            </motion.div>
          )}

          {activeTab === 'dkma' && (
            <motion.div
              key="dkma"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <DkmaGuide />
            </motion.div>
          )}

          {!APP_TABS.includes(activeTab as any) && (
            <motion.div
              key="404"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center space-y-6 max-w-md mx-auto"
            >
              <div className="font-mono text-5xl text-amber-color font-bold animate-pulse">&gt; 404</div>
              <h2 className="font-display text-xl font-bold text-foreground">ROUTE NOT RESOLVED</h2>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                The requested URL path could not be located in David's developer directory files.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2 bg-amber-color text-black font-mono text-xs font-bold rounded-lg hover:bg-amber-glow transition-all cursor-pointer"
                >
                  Return home
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-4 py-2 bg-transparent border border-amber-color/40 text-amber-color font-mono text-xs font-bold rounded-lg hover:bg-amber-color/10 transition-all cursor-pointer"
                >
                  Start a project
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </Suspense>
        </ErrorBoundary>
      </main>

      {/* Global command palette — chunk loads on first open */}
      {paletteLoaded && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            setActiveTab={setActiveTab}
            setSearchQuery={setSearchQuery}
            setActiveCategory={setActiveCategory}
          />
        </Suspense>
      )}

      {/* Chatbot loads after first paint so it never blocks initial render */}
      {chatbotReady && (
        <Suspense fallback={null}>
          <AIChatbot />
        </Suspense>
      )}

      {/* Konami Code Secret Achievement Unlock Modal */}
      <AnimatePresence>
        {konamiUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 inset-x-4 z-50 mx-auto max-w-sm rounded-2xl border-2 border-amber-color bg-[#030c14]/95 backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-color text-[#030c14] font-mono text-xl font-bold">
                🏆
              </div>
              <div className="space-y-1">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-color">
                  Secret Overdrive Unlocked!
                </h3>
                <p className="text-[11px] text-foreground/90 font-mono leading-relaxed">
                  You triggered the Konami Code sequence! Cyber Synthesizer &amp; Arcade Overdrive enabled.
                </p>
                <button
                  onClick={() => setKonamiUnlocked(false)}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-color hover:underline cursor-pointer"
                >
                  Dismiss &amp; Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openMore={openPalette}
      />
      <Footer />
    </div>
  );
}

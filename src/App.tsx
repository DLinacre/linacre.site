import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import { RouteHead } from './components/RouteHead';
import routeMeta from '../route-meta.json';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
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
const Tools = lazy(() => import('./components/Tools'));
const Games = lazy(() => import('./components/Games'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));
const Lab = lazy(() => import('./components/Lab'));
const IdentityHub = lazy(() => import('./components/IdentityHub'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Privacy = lazy(() => import('./components/Privacy'));
const AccessibilityStatement = lazy(() => import('./components/AccessibilityStatement'));
const ContactThanks = lazy(() => import('./components/ContactThanks'));
const CookiePolicy = lazy(() => import('./components/CookiePolicy'));
const Terms = lazy(() => import('./components/Terms'));
const MobDealsSwitcher = lazy(() => import('./components/MobDealsSwitcher'));
const PokeGuruExplorer = lazy(() => import('./components/PokeGuruExplorer'));

import Breadcrumbs from './components/Breadcrumbs';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => getTabFromLocation(window.location.pathname, window.location.hash));
  const [locationPath, setLocationPath] = useState(() => window.location.pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);

  const openPalette = useCallback(() => {
    setPaletteLoaded(true);
    setPaletteOpen(true);
  }, []);

  const isOffline = useOnlineStatus();
  const { konamiUnlocked, setKonamiUnlocked } = useKonamiUnlock();
  const { theme, setTheme } = useThemePreference('dark');
  const { identity } = useIdentityPreferences();
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

      const label = ROUTE_LABEL[targetPath] || decodeURIComponent(part).replace(/-/g, ' ');

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
      ` }} />
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
        setActiveTab={setActiveTab}
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

            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <Tools theme={theme} />
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
            theme={theme}
            setTheme={setTheme}
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

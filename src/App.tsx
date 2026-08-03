import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import { getEmblemSVG, CustomEmblem } from './lib/emblemRenderer';
import { RouteHead } from './components/RouteHead';
import routeMeta from '../route-meta.json';
import TerminalIntro from './components/TerminalIntro';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { CHANGELOG } from './data/core';
import { ToolCategory } from './types';

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

type BreadcrumbPath = { label: string; onClick?: () => void; active?: boolean };

const ROUTE_LABEL: Record<string, string> = {
  '/now': 'Now',
  '/projects': 'Projects',
  '/games': 'Games',
  '/toolkit': 'Toolkit',
  '/learn': 'Learn',
  '/blog': 'Blog',
  '/playground': 'Playground',
  '/lab': 'AI Lab',
  '/agents': 'Agents',
  '/identity': 'Identity',
  '/about': 'About',
  '/contact': 'Contact',
  '/contact/thanks': 'Thanks',
  '/privacy': 'Privacy',
  '/cookie-policy': 'Cookie Policy',
  '/terms': 'Terms',
  '/accessibility': 'Accessibility',
  '/status': 'Status',
  '/low-stakes': 'Low Stakes',
  '/tools/mob-deals': 'Mob Deals',
  '/tools/pokeguru': 'PokeGuru',
  '/tools/dkma': 'DKMA Guide',
};

export default function App() {
  const getTabFromPath = () => {
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const hash = window.location.hash.replace(/^#/, '');
    const validTabs = [
      'toolkit',
      'games',
      'learn',
      'lab',
      'dashboard',
      'identity',
      'playground',
      'projects',
      'agents',
      'about',
      'contact',
      'privacy',
      'accessibility',
      'blog',
      'status',
      'contact/thanks',
      'cookie-policy',
      'terms',
      'now',
      'low-stakes',
      'tools/mob-deals',
      'tools/pokeguru',
      'tools/dkma',
    ];

    // Route path -> internal tab id (colons/paths kept as-is where safe).
    if (pathname === 'contact/thanks') return 'contact-thanks';
    if (pathname === 'cookie-policy') return 'cookie-policy';
    if (pathname === 'terms') return 'terms';

    // 1. Authoritative: check window.location.pathname first
    if (validTabs.includes(pathname)) {
      return pathname;
    }
    if (pathname.startsWith('blog/')) {
      return 'blog';
    }
    // 2. Fallback: check hash
    if (validTabs.includes(hash)) {
      return hash;
    }
    // 3. Root path mapping: the dedicated utility-first start page.
    if (window.location.pathname === '/' || window.location.pathname === '') {
      return 'home';
    }
    // 4. Default fallback
    return 'projects';
  };

  const [activeTab, setActiveTab] = useState<string>(() => getTabFromPath());
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const [chatbotReady, setChatbotReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  const getBreadcrumbPaths = () => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean);

    const paths: BreadcrumbPath[] = [
      {
        label: 'home',
        onClick: () => {
          setActiveTab('home');
          window.history.pushState(null, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        },
      },
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
      const isLast = idx === parts.length - 1;

      let label = ROUTE_LABEL[runningPath] || decodeURIComponent(part).replace(/-/g, ' ');

      if (parts[0] === 'blog' && idx === 1) {
        const post = BLOG_POSTS.find(p => p.slug === part);
        if (post) label = post.title;
      }

      paths.push({
        label,
        active: isLast,
        onClick: isLast
          ? undefined
          : () => {
              const tab = part === 'thanks' ? 'contact-thanks' : part;
              setActiveTab(tab);
              window.history.pushState(null, '', runningPath);
              window.dispatchEvent(new PopStateEvent('popstate'));
            },
      });
    });

    return paths;
  };

  const [konamiUnlocked, setKonamiUnlocked] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Secret Konami Code Listener: ↑ ↑ ↓ ↓ ← → ← → b a
    const konamiSequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected =
        konamiSequence[konamiIndex].length === 1
          ? konamiSequence[konamiIndex].toLowerCase()
          : konamiSequence[konamiIndex];

      if (key === expected) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          setKonamiUnlocked(true);
          import('./lib/audioEngine').then(m => m.playKonamiSound());
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Synchronize activeTab with URL path for back/forward navigation support
  useEffect(() => {
    const handleNavigation = () => {
      setActiveTab(getTabFromPath());
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  // Map internal tab id back to a real URL path.
  const tabToPath = (tab: string): string => {
    if (tab === 'home') return '/';
    if (tab === 'contact-thanks') return '/contact/thanks';
    return `/${tab}`;
  };

  // Update URL path and localStorage when activeTab changes
  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = tabToPath(activeTab);
    // Preserve existing search params for /contact/thanks?ref=…
    if (
      currentPath !== targetPath &&
      !(activeTab === 'blog' && currentPath.startsWith('/blog/')) &&
      !(activeTab === 'contact-thanks' && currentPath === '/contact/thanks')
    ) {
      const search = activeTab === 'contact-thanks' ? window.location.search : '';
      window.history.pushState(null, '', `${targetPath}${search}`);
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
  const getRouteMeta = () => {
    const pathname = window.location.pathname;
    if (activeTab === 'blog' && pathname.startsWith('/blog/') && pathname.length > 6) {
      const match = routeMeta.routes[pathname as keyof typeof routeMeta.routes];
      if (match) return match;
    }
    // Map new synthetic tabs -> canonical route keys.
    let key: string;
    if (activeTab === 'home') key = '/';
    else if (activeTab === 'contact-thanks') key = '/contact/thanks';
    else key = `/${activeTab}`;
    return routeMeta.routes[key as keyof typeof routeMeta.routes] || routeMeta.routes['/'];
  };

  const currentMeta = getRouteMeta();

  // Identity and Brand custom values synchronized from localStorage
  const [customEmblems, setCustomEmblems] = useState<CustomEmblem[]>([]);
  const [identity, setIdentity] = useState({
    colorId: 'cyber',
    fontId: 'cyber',
    frameId: 'dl-geo',
    motionId: 'pulse',
    pulseSpeed: 'slow',
    name: 'DAVID LINACRE',
    title: 'Software engineer · useful tools · AI systems',
    bio: 'Building practical software, open-source tools, and reliable automation systems.',
    glow: 2,
    customPrimary: '#22D3EE',
    customSecondary: '#34D399',
  });

  const syncIdentity = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pColor = params.get('brand_color');
      const pFont = params.get('brand_font');
      const pFrame = params.get('brand_frame');
      const pMotion = params.get('brand_motion');
      const pPulseSpeed = params.get('brand_pulse_speed');
      const pGlow = params.get('brand_glow');
      const pName = params.get('brand_name');
      const pPrimary = params.get('brand_primary');
      const pSecondary = params.get('brand_secondary');

      if (pColor) localStorage.setItem('linacre_brand_color', pColor);
      if (pFont) localStorage.setItem('linacre_brand_font', pFont);
      if (pFrame) localStorage.setItem('linacre_brand_frame', pFrame);
      if (pMotion) localStorage.setItem('linacre_brand_motion', pMotion);
      if (pPulseSpeed) localStorage.setItem('linacre_brand_pulse_speed', pPulseSpeed);
      if (pGlow) localStorage.setItem('linacre_brand_glow', pGlow);
      if (pName) localStorage.setItem('linacre_brand_name', pName);
      if (pPrimary) localStorage.setItem('linacre_brand_custom_primary', pPrimary);
      if (pSecondary) localStorage.setItem('linacre_brand_custom_secondary', pSecondary);
    } catch (e) {
      console.error('Failed to parse search params', e);
    }

    const storedColor = localStorage.getItem('linacre_brand_color');
    const colorId = !storedColor || storedColor === 'amber' ? 'cyber' : storedColor;
    if (storedColor === 'amber') localStorage.setItem('linacre_brand_color', 'cyber');
    const fontId = localStorage.getItem('linacre_brand_font') || 'cyber';
    const frameId = localStorage.getItem('linacre_brand_frame') || 'dl-geo';
    const motionId = localStorage.getItem('linacre_brand_motion') || 'pulse';
    const pulseSpeed = localStorage.getItem('linacre_brand_pulse_speed') || 'slow';
    const name = localStorage.getItem('linacre_brand_name') || 'DAVID LINACRE';
    const title =
      localStorage.getItem('linacre_brand_title') ||
      'Software engineer · useful tools · AI systems';
    const bio =
      localStorage.getItem('linacre_brand_bio') ||
      'Building practical software, open-source tools, and reliable automation systems.';
    const glow = Number(localStorage.getItem('linacre_brand_glow') || '2');
    const customPrimary = localStorage.getItem('linacre_brand_custom_primary') || '#22D3EE';
    const customSecondary = localStorage.getItem('linacre_brand_custom_secondary') || '#34D399';

    try {
      const savedEmblems = localStorage.getItem('linacre_custom_emblems');
      setCustomEmblems(savedEmblems ? JSON.parse(savedEmblems) : []);
    } catch (e) {
      console.error('Failed to parse custom emblems in App.tsx', e);
    }

    setIdentity({
      colorId,
      fontId,
      frameId,
      motionId,
      pulseSpeed,
      name,
      title,
      bio,
      glow,
      customPrimary,
      customSecondary,
    });
  };

  useEffect(() => {
    syncIdentity();
    window.addEventListener('linacre-identity-updated', syncIdentity);
    return () => window.removeEventListener('linacre-identity-updated', syncIdentity);
  }, []);

  // Defer the chatbot chunk to idle time after first paint
  useEffect(() => {
    const start = () => setChatbotReady(true);
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(start, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const t = setTimeout(start, 1500);
    return () => clearTimeout(t);
  }, []);

  // Synchronize theme on initial mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('linacre_theme') || 'dark';
      setTheme(savedTheme as 'dark' | 'light');
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    } catch (e) {
      console.error('Failed to sync theme', e);
    }
  }, []);

  // Keyboard shortcut listener to open command palette on "/" or "Cmd+K"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return; // Skip if focused on input fields
        }
        e.preventDefault();
        (setPaletteLoaded(true), setPaletteOpen(true));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Define brand configuration maps to inject into styles and SVGs
  const colorsMap: Record<string, { primary: string; secondary: string }> = {
    cyber: { primary: '#22D3EE', secondary: '#34D399' },
    ocean: { primary: '#38BDF8', secondary: '#2DD4BF' },
    matrix: { primary: '#2DD4BF', secondary: '#A3E635' },
    violet: { primary: '#818CF8', secondary: '#22D3EE' },
    mono: { primary: '#E2F7FA', secondary: '#7DD3FC' },
    // Fully custom two-colour system tuned in the Identity Studio colour lab.
    custom: { primary: identity.customPrimary, secondary: identity.customSecondary },
    // Compatibility aliases for previously shared theme links.
    amber: { primary: '#22D3EE', secondary: '#34D399' },
    cyan: { primary: '#38BDF8', secondary: '#2DD4BF' },
    emerald: { primary: '#2DD4BF', secondary: '#A3E635' },
    crimson: { primary: '#818CF8', secondary: '#22D3EE' },
  };

  const fontsMap: Record<string, { display: string; mono: string; import: string }> = {
    cyber: {
      display: '"Space Grotesk", "Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
      import: '' /* default fonts are self-hosted in /fonts — no external CSS */,
    },
    neotech: {
      display: '"Orbitron", sans-serif',
      mono: '"Share Tech Mono", monospace',
      import:
        "@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800&family=Share+Tech+Mono&display=swap');",
    },
    brutalist: {
      display: '"Plus Jakarta Sans", sans-serif',
      mono: '"Fira Code", monospace',
      import:
        "@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Plus+Jakarta+Sans:wght@500;800&display=swap');",
    },
    editorial: {
      display: '"Playfair Display", serif',
      mono: '"Fira Mono", monospace',
      import:
        "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Fira+Mono&display=swap');",
    },
  };

  const activeColor = colorsMap[identity.colorId] || colorsMap.cyber;
  const activeFont = fontsMap[identity.fontId] || fontsMap.cyber;

  // Stagger & entering animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 110,
        damping: 14,
      },
    },
  };

  const renderEmblem = () => {
    const p = activeColor.primary;
    const s = activeColor.secondary;
    const frame = identity.frameId;
    const glowIntensity = identity.glow;
    const motion = identity.motionId;
    const speed = identity.pulseSpeed;

    const svgString = getEmblemSVG(frame, p, s, motion, speed, glowIntensity, customEmblems);

    return (
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center select-none"
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
  };

  return (
    <div
      className="min-h-[100dvh] bg-background text-foreground flex flex-col justify-between selection:bg-amber-color/30"
      style={{ background: 'var(--linacre-gradient-hero)' }}
    >
      <RouteHead meta={currentMeta} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        ${activeFont.import}
        :root, .dark, .light {
          --color-amber-color: ${activeColor.primary} !important;
          --color-cyan: ${activeColor.secondary} !important;
          --font-display: ${activeFont.display} !important;
          --font-mono: ${activeFont.mono} !important;
        }
      `,
        }}
      />
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
            <span>
              CONNECTIVITY INTERRUPTED: Running in offline mode. Local state and custom projects are
              preserved.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        openPalette={() => (setPaletteLoaded(true), setPaletteOpen(true))}
        activeColor={activeColor}
      />

      <main
        id="main-content"
        role="main"
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12"
      >
        <ErrorBoundary>
          {activeTab !== 'home' && <Breadcrumbs paths={getBreadcrumbPaths()} />}
          <Suspense
            fallback={
              <div className="py-20 min-h-[100svh] text-center font-mono text-xs text-muted-foreground flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-color border-t-transparent rounded-full animate-spin"></div>
                <span>Loading interface module...</span>
              </div>
            }
          >
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
                    <div
                      className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)`,
                      }}
                    />

                    <div className="md:col-span-8 space-y-5 text-center md:text-left relative z-10">
                      <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
                        Available for freelance · UK · Remote worldwide
                      </span>
                      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                        Full-stack &amp; AI systems engineer —{' '}
                        <span className="text-amber-color animate-amber-breathe">
                          available for freelance
                        </span>
                      </h1>
                      <h3 className="font-mono text-sm sm:text-base text-amber-color/90 font-medium tracking-wide">
                        I build reliable React / Go / AI systems for startups who ship fast.
                      </h3>
                      <p className="text-sm sm:text-base md:text-md text-muted-foreground leading-[1.65] max-w-2xl">
                        Systems audits from £1,800. Custom builds from £6,500. Fractional retainer
                        £2,400/mo. NDA-friendly, UK GDPR compliant, replies within 12&nbsp;hours.
                      </p>
                      {/* Primary + secondary + tertiary CTA (audit CRO-01 / UX-01) */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setActiveTab('contact');
                          }}
                          data-analytics="hero_start_project"
                          className="px-5 py-2.5 bg-amber-color text-[#030c14] font-mono text-sm font-bold rounded-lg hover:bg-amber-glow transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_30px_rgba(34,211,238,0.55)] hover:-translate-y-0.5"
                          id="cta-start-project"
                        >
                          Start a project →
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('projects');
                          }}
                          data-analytics="hero_case_studies"
                          className="px-5 py-2.5 bg-transparent border border-amber-color/40 text-amber-color font-mono text-sm font-bold rounded-lg hover:bg-amber-color/10 hover:border-amber-color transition-all duration-200 hover:-translate-y-0.5"
                          id="cta-view-projects"
                        >
                          View projects
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('toolkit');
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
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
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="linacre-surface p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 relative group overflow-hidden w-full max-w-[240px]"
                      >
                        {/* Pulsing ambient radial aura gradient */}
                        <div
                          className="absolute -inset-10 opacity-20 group-hover:opacity-35 blur-2xl rounded-full transition-opacity pointer-events-none"
                          style={{
                            background: `radial-gradient(circle, ${activeColor.primary} 0%, transparent 70%)`,
                          }}
                        />

                        {/* Rendered Live SVG Monogram Emblem */}
                        <div
                          className={`relative z-10 select-none ${identity.motionId === 'spin' ? 'animate-spin-slow' : ''}`}
                        >
                          {renderEmblem()}
                        </div>

                        <div className="relative z-10 text-center space-y-1">
                          <div className="font-display text-[11px] font-bold tracking-wider text-foreground uppercase">
                            Signature Identity
                          </div>
                          <div className="font-mono text-[9px] text-muted-foreground/80 tracking-wider uppercase">
                            {identity.colorId} · {identity.frameId} · {identity.motionId} ·{' '}
                            {identity.fontId}
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
                      openPalette={() => (setPaletteLoaded(true), setPaletteOpen(true))}
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
                      <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                        Changelog
                      </h2>
                    </div>

                    {/* Vertical line timeline */}
                    <div
                      className="relative pl-6 border-l border-border-color space-y-8"
                      id="changelog-timeline"
                    >
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
                              <span className="font-mono text-xs font-bold text-cyan">
                                {item.version}
                              </span>
                              <span className="hidden sm:inline text-xs text-muted-foreground/60 font-semibold">
                                ·
                              </span>
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <LowStakesGuide />
                </motion.div>
              )}

              {activeTab === 'tools/mob-deals' && (
                <motion.div
                  key="tools-mob-deals"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <MobDealsSwitcher />
                </motion.div>
              )}

              {activeTab === 'tools/pokeguru' && (
                <motion.div
                  key="tools-pokeguru"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <PokeGuruExplorer />
                </motion.div>
              )}

              {activeTab === 'tools/dkma' && (
                <motion.div
                  key="tools-dkma"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <DkmaGuide />
                </motion.div>
              )}

              {![
                'home',
                'toolkit',
                'games',
                'learn',
                'lab',
                'dashboard',
                'identity',
                'playground',
                'projects',
                'agents',
                'about',
                'contact',
                'privacy',
                'accessibility',
                'blog',
                'status',
                'contact-thanks',
                'cookie-policy',
                'terms',
                'now',
                'low-stakes',
                'tools/mob-deals',
                'tools/pokeguru',
                'tools/dkma',
              ].includes(activeTab) && (
                <motion.div
                  key="404"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20 text-center space-y-6 max-w-md mx-auto"
                >
                  <div className="font-mono text-5xl text-amber-color font-bold animate-pulse">
                    &gt; 404
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    ROUTE NOT RESOLVED
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    The requested URL path could not be located in David's developer directory
                    files.
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
                  You triggered the Konami Code sequence! Cyber Synthesizer &amp; Arcade Overdrive
                  enabled.
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
        openMore={() => (setPaletteLoaded(true), setPaletteOpen(true))}
      />
      <Footer />
    </div>
  );
}

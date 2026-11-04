import { useState, useEffect, lazy, Suspense } from 'react';
import { getTabFromLocation, tabToPath, type AppTab } from './config/routes';
import StartPage from './components/StartPage';
import StudioHeader from './components/StudioHeader';
import Games from './components/Games';
import './editorial.css';
import { RouteHead, type RouteMeta } from './components/RouteHead';
import routeMetaJson from '../route-meta.json';

const Tools = lazy(() => import('./components/Tools'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const ContactThanks = lazy(() => import('./components/ContactThanks'));
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const AccessibilityStatement = lazy(() => import('./components/AccessibilityStatement'));
const CookiePolicy = lazy(() => import('./components/CookiePolicy'));
const Lab = lazy(() => import('./components/Lab'));
const IdentityHub = lazy(() => import('./components/IdentityHub'));
const OpsHUD = lazy(() => import('./components/OpsHUD'));
const MobDealsSwitcher = lazy(() => import('./components/MobDealsSwitcher'));
const PokeGuruExplorer = lazy(() => import('./components/PokeGuruExplorer'));
const MusicVideos = lazy(() => import('./components/MusicVideos'));
const OsintHud = lazy(() => import('./components/OsintHud'));
const OrbitObservatory = lazy(() => import('./components/OrbitObservatory'));

function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__spinner" aria-hidden="true" />
      <span>Loading page…</span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab | string>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromLocation(window.location.pathname, window.location.hash);
    }
    return 'home';
  });
  useEffect(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  const currentPath = tabToPath(activeTab);
  const currentMeta: RouteMeta =
    (routeMetaJson.routes as Record<string, RouteMeta>)[currentPath] || routeMetaJson.routes['/'];

  useEffect(() => {
    const onPopState = () => {
      setActiveTab(getTabFromLocation(window.location.pathname, window.location.hash));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="portfolio-shell min-h-screen">
      {/* WCAG 2.2 AA Skip to Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Dynamic Route Title & SEO Sync */}
      <RouteHead meta={currentMeta} />

      <StudioHeader />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="portfolio-main"
      >
        <Suspense fallback={<RouteLoading />}>
          {activeTab === 'home' && <StartPage />}
          {activeTab === 'games' && <Games />}
          {activeTab === 'tools' && <Tools />}
          {activeTab === 'about' && <About />}
          {activeTab === 'contact' && <Contact />}
          {activeTab === 'contact-thanks' && <ContactThanks />}
          {activeTab === 'privacy' && <Privacy />}
          {activeTab === 'terms' && <Terms />}
          {activeTab === 'accessibility' && <AccessibilityStatement />}
          {activeTab === 'cookie-policy' && <CookiePolicy />}
          {activeTab === 'lab' && <Lab />}
          {activeTab === 'identity' && <IdentityHub />}
          {activeTab === 'ops' && <OpsHUD />}
          {activeTab === 'mob-deals' && <MobDealsSwitcher />}
          {activeTab === 'pokeguru' && <PokeGuruExplorer />}
          {activeTab === 'music-videos' && <MusicVideos />}
          {activeTab === 'osint' && <OsintHud />}
          {activeTab === 'orbit' && <OrbitObservatory />}
        </Suspense>
      </main>

      <footer className="studio-footer"><span>© {new Date().getFullYear()} David Linacre</span><span>Independent software · South Yorkshire</span><nav aria-label="Footer navigation"><a href="https://github.com/LIN4CRE">GitHub ↗</a><a href="/privacy">Privacy</a><a href="/accessibility">Accessibility</a><a href="/terms">Terms</a></nav></footer>
    </div>
  );
}

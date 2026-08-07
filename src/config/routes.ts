import type { AppTab } from '../app/types';

export const ROUTE_LABEL: Record<string, string> = {
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
  '/mob-deals': 'Mob Deals',
  '/pokeguru': 'PokeGuru',
  '/dkma': 'DKMA Guide'
};

export const ROUTE_TAB_IDS = [
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
  'mob-deals',
  'pokeguru',
  'dkma'
] as const;

export const APP_TABS: readonly AppTab[] = [
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
  'mob-deals',
  'pokeguru',
  'dkma'
];

const routeTabSet = new Set<string>(ROUTE_TAB_IDS);

export function tabToPath(tab: string): string {
  if (tab === 'home') return '/';
  if (tab === 'contact-thanks') return '/contact/thanks';
  return `/${tab}`;
}

export function isKnownAppTab(tab: string): tab is AppTab {
  return (APP_TABS as readonly string[]).includes(tab);
}

export function getTabFromLocation(pathname: string, hash = ''): AppTab | string {
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');
  const normalizedHash = hash.replace(/^#/, '');

  if (normalizedPath === 'contact/thanks') return 'contact-thanks';
  if (normalizedPath === 'cookie-policy') return 'cookie-policy';
  if (normalizedPath === 'terms') return 'terms';

  if (routeTabSet.has(normalizedPath)) return normalizedPath;
  if (normalizedPath.startsWith('blog/')) return 'blog';
  if (routeTabSet.has(normalizedHash)) return normalizedHash;
  if (pathname === '/' || pathname === '') return 'home';

  return 'projects';
}

export function shouldPreserveCurrentPath(activeTab: string, currentPath: string): boolean {
  return (
    activeTab === 'blog' && currentPath.startsWith('/blog/')
  ) || (
    activeTab === 'contact-thanks' && currentPath === '/contact/thanks'
  );
}

export function routeKeyForTab(activeTab: string, pathname: string): string {
  if (activeTab === 'blog' && pathname.startsWith('/blog/') && pathname.length > 6) {
    return pathname;
  }
  return tabToPath(activeTab);
}

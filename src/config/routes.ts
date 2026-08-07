import type { AppTab } from '../app/types';

export const ROUTE_LABEL: Record<string, string> = {
  '/': 'Home',
  '/tools': 'Tools',
  '/games': 'Games',
  '/lab': 'AI Lab',
  '/identity': 'Identity',
  '/about': 'About',
  '/contact': 'Contact',
  '/contact/thanks': 'Thanks',
  '/privacy': 'Privacy',
  '/cookie-policy': 'Cookie Policy',
  '/terms': 'Terms',
  '/accessibility': 'Accessibility',
  '/mob-deals': 'Mob Deals',
  '/pokeguru': 'PokeGuru'
};

export const ROUTE_TAB_IDS = [
  'tools',
  'games',
  'lab',
  'identity',
  'about',
  'contact',
  'privacy',
  'accessibility',
  'contact/thanks',
  'cookie-policy',
  'terms',
  'mob-deals',
  'pokeguru'
] as const;

export const APP_TABS: readonly AppTab[] = [
  'home',
  'tools',
  'games',
  'lab',
  'identity',
  'about',
  'contact',
  'privacy',
  'accessibility',
  'contact-thanks',
  'cookie-policy',
  'terms',
  'mob-deals',
  'pokeguru'
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
  if (routeTabSet.has(normalizedHash)) return normalizedHash;
  if (pathname === '/' || pathname === '') return 'home';

  return 'home';
}

export function shouldPreserveCurrentPath(activeTab: string, currentPath: string): boolean {
  return activeTab === 'contact-thanks' && currentPath === '/contact/thanks';
}

export function routeKeyForTab(activeTab: string, _pathname: string): string {
  return tabToPath(activeTab);
}

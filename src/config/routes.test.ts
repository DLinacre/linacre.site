import { describe, expect, it } from 'vitest';
import { getTabFromLocation, routeKeyForTab, shouldPreserveCurrentPath, tabToPath } from './routes';

describe('route configuration contracts', () => {
  it('maps public URL paths to stable internal tab ids', () => {
    expect(getTabFromLocation('/')).toBe('home');
    expect(getTabFromLocation('/tools')).toBe('tools');
    expect(getTabFromLocation('/games')).toBe('games');
    expect(getTabFromLocation('/mob-deals')).toBe('mob-deals');
    expect(getTabFromLocation('/contact/thanks')).toBe('contact-thanks');
    expect(getTabFromLocation('/cookie-policy')).toBe('cookie-policy');
  });

  it('supports legacy hash navigation without overriding known paths', () => {
    expect(getTabFromLocation('/unknown', '#tools')).toBe('tools');
    expect(getTabFromLocation('/games', '#tools')).toBe('games');
  });

  it('falls back to home for unknown paths', () => {
    expect(getTabFromLocation('/projects')).toBe('home');
    expect(getTabFromLocation('/learn')).toBe('home');
  });

  it('serialises tabs back to canonical paths without breaking deep routes', () => {
    expect(tabToPath('home')).toBe('/');
    expect(tabToPath('contact-thanks')).toBe('/contact/thanks');
    expect(tabToPath('tools')).toBe('/tools');
    expect(tabToPath('pokeguru')).toBe('/pokeguru');
    expect(routeKeyForTab('tools', '/tools')).toBe('/tools');
  });

  it('guards paths that must not be rewritten by tab state effects', () => {
    expect(shouldPreserveCurrentPath('contact-thanks', '/contact/thanks')).toBe(true);
    expect(shouldPreserveCurrentPath('home', '/')).toBe(false);
    expect(shouldPreserveCurrentPath('tools', '/tools')).toBe(false);
  });
});

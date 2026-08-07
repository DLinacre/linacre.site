import { describe, expect, it } from 'vitest';
import { getTabFromLocation, routeKeyForTab, shouldPreserveCurrentPath, tabToPath } from './routes';

describe('route configuration contracts', () => {
  it('maps public URL paths to stable internal tab ids', () => {
    expect(getTabFromLocation('/')).toBe('home');
    expect(getTabFromLocation('/toolkit')).toBe('toolkit');
    expect(getTabFromLocation('/contact/thanks')).toBe('contact-thanks');
    expect(getTabFromLocation('/cookie-policy')).toBe('cookie-policy');
    expect(getTabFromLocation('/blog/dynamic-hsl-theme-variables')).toBe('blog');
  });

  it('supports legacy hash navigation without overriding known paths', () => {
    expect(getTabFromLocation('/unknown', '#toolkit')).toBe('toolkit');
    expect(getTabFromLocation('/projects', '#toolkit')).toBe('projects');
  });

  it('serialises tabs back to canonical paths without breaking deep routes', () => {
    expect(tabToPath('home')).toBe('/');
    expect(tabToPath('contact-thanks')).toBe('/contact/thanks');
    expect(tabToPath('projects')).toBe('/projects');
    expect(routeKeyForTab('blog', '/blog/dynamic-hsl-theme-variables')).toBe('/blog/dynamic-hsl-theme-variables');
    expect(routeKeyForTab('blog', '/blog')).toBe('/blog');
  });

  it('guards paths that must not be rewritten by tab state effects', () => {
    expect(shouldPreserveCurrentPath('blog', '/blog/dynamic-hsl-theme-variables')).toBe(true);
    expect(shouldPreserveCurrentPath('contact-thanks', '/contact/thanks')).toBe(true);
    expect(shouldPreserveCurrentPath('projects', '/projects')).toBe(false);
  });
});

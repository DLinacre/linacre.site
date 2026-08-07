import { describe, expect, it } from 'vitest';
import { DEFAULT_IDENTITY, resolveColorScheme, resolveFontScheme } from './brand';

describe('brand configuration contracts', () => {
  it('resolves canonical and custom colour schemes', () => {
    expect(resolveColorScheme(DEFAULT_IDENTITY)).toEqual({ primary: '#22D3EE', secondary: '#34D399' });
    expect(resolveColorScheme({ colorId: 'custom', customPrimary: '#111111', customSecondary: '#eeeeee' })).toEqual({
      primary: '#111111',
      secondary: '#eeeeee'
    });
  });

  it('keeps compatibility aliases for existing shared URLs', () => {
    expect(resolveColorScheme({ colorId: 'amber', customPrimary: '#000000', customSecondary: '#ffffff' })).toEqual({
      primary: '#22D3EE',
      secondary: '#34D399'
    });
  });

  it('falls back to cyber typography for unknown font ids', () => {
    expect(resolveFontScheme('unknown')).toEqual(resolveFontScheme('cyber'));
  });
});

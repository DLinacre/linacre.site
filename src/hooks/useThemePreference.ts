import { useEffect, useState } from 'react';
import type { ThemeMode } from '../app/types';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'dark' || value === 'light';
}

export function applyThemeMode(theme: ThemeMode) {
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
}

export function useThemePreference(defaultTheme: ThemeMode = 'dark') {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('linacre_theme');
      const nextTheme = isThemeMode(savedTheme) ? savedTheme : defaultTheme;
      setTheme(nextTheme);
      applyThemeMode(nextTheme);
    } catch (error) {
      console.error('Failed to sync theme', error);
    }
  }, [defaultTheme]);

  return { theme, setTheme };
}

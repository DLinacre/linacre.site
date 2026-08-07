import type { Dispatch, SetStateAction } from 'react';

export type ThemeMode = 'dark' | 'light';

export type AppTab =
  | 'home'
  | 'tools'
  | 'games'
  | 'lab'
  | 'identity'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'accessibility'
  | 'contact-thanks'
  | 'cookie-policy'
  | 'terms'
  | 'mob-deals'
  | 'pokeguru';

export type SetAppTab = Dispatch<SetStateAction<string>> | ((tab: string) => void);

export interface BreadcrumbPath {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BrandColorScheme {
  primary: string;
  secondary: string;
}

export interface BrandFontScheme {
  display: string;
  mono: string;
  import: string;
}

export interface IdentityPreferences {
  colorId: string;
  fontId: string;
  frameId: string;
  motionId: string;
  pulseSpeed: string;
  name: string;
  title: string;
  bio: string;
  glow: number;
  customPrimary: string;
  customSecondary: string;
}

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_IDENTITY } from '../config/brand';
import type { IdentityPreferences } from '../app/types';
import type { CustomEmblem } from '../lib/emblemRenderer';

function safeGet(key: string, fallback: string): string {
  return localStorage.getItem(key) || fallback;
}

function syncQueryParamsToStorage() {
  const params = new URLSearchParams(window.location.search);
  const mappings: Array<[string, string]> = [
    ['brand_color', 'linacre_brand_color'],
    ['brand_font', 'linacre_brand_font'],
    ['brand_frame', 'linacre_brand_frame'],
    ['brand_motion', 'linacre_brand_motion'],
    ['brand_pulse_speed', 'linacre_brand_pulse_speed'],
    ['brand_glow', 'linacre_brand_glow'],
    ['brand_name', 'linacre_brand_name'],
    ['brand_primary', 'linacre_brand_custom_primary'],
    ['brand_secondary', 'linacre_brand_custom_secondary']
  ];

  mappings.forEach(([paramKey, storageKey]) => {
    const value = params.get(paramKey);
    if (value) localStorage.setItem(storageKey, value);
  });
}

function readIdentity(): IdentityPreferences {
  syncQueryParamsToStorage();

  const storedColor = localStorage.getItem('linacre_brand_color');
  const colorId = !storedColor || storedColor === 'amber' ? DEFAULT_IDENTITY.colorId : storedColor;

  // Preserve legacy shared links while normalising future stored values.
  if (storedColor === 'amber') localStorage.setItem('linacre_brand_color', DEFAULT_IDENTITY.colorId);

  return {
    colorId,
    fontId: safeGet('linacre_brand_font', DEFAULT_IDENTITY.fontId),
    frameId: safeGet('linacre_brand_frame', DEFAULT_IDENTITY.frameId),
    motionId: safeGet('linacre_brand_motion', DEFAULT_IDENTITY.motionId),
    pulseSpeed: safeGet('linacre_brand_pulse_speed', DEFAULT_IDENTITY.pulseSpeed),
    name: safeGet('linacre_brand_name', DEFAULT_IDENTITY.name),
    title: safeGet('linacre_brand_title', DEFAULT_IDENTITY.title),
    bio: safeGet('linacre_brand_bio', DEFAULT_IDENTITY.bio),
    glow: Number(localStorage.getItem('linacre_brand_glow') || DEFAULT_IDENTITY.glow),
    customPrimary: safeGet('linacre_brand_custom_primary', DEFAULT_IDENTITY.customPrimary),
    customSecondary: safeGet('linacre_brand_custom_secondary', DEFAULT_IDENTITY.customSecondary)
  };
}

function readCustomEmblems(): CustomEmblem[] {
  const savedEmblems = localStorage.getItem('linacre_custom_emblems');
  return savedEmblems ? JSON.parse(savedEmblems) : [];
}

export function useIdentityPreferences() {
  const [identity, setIdentity] = useState<IdentityPreferences>(DEFAULT_IDENTITY);
  const [customEmblems, setCustomEmblems] = useState<CustomEmblem[]>([]);

  const syncIdentity = useCallback(() => {
    try {
      setIdentity(readIdentity());
    } catch (error) {
      console.error('Failed to parse brand identity preferences', error);
    }

    try {
      setCustomEmblems(readCustomEmblems());
    } catch (error) {
      console.error('Failed to parse custom emblems', error);
      setCustomEmblems([]);
    }
  }, []);

  useEffect(() => {
    syncIdentity();
    window.addEventListener('linacre-identity-updated', syncIdentity);
    return () => window.removeEventListener('linacre-identity-updated', syncIdentity);
  }, [syncIdentity]);

  return { identity, customEmblems, syncIdentity };
}

import { useEffect, useState } from 'react';

const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'] as const;

function normalizeKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : key;
}

export function useKonamiUnlock() {
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);

  useEffect(() => {
    let konamiIndex = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = normalizeKey(event.key);
      const expected = normalizeKey(KONAMI_SEQUENCE[konamiIndex]);

      if (key === expected) {
        konamiIndex += 1;
        if (konamiIndex === KONAMI_SEQUENCE.length) {
          setKonamiUnlocked(true);
          void import('../lib/audioEngine').then((module) => module.playKonamiSound());
          konamiIndex = 0;
        }
        return;
      }

      konamiIndex = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { konamiUnlocked, setKonamiUnlocked };
}

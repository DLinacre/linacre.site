import { useEffect } from 'react';

function isTextEntryElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || (element as HTMLElement).isContentEditable;
}

export function useCommandPaletteShortcut(openPalette: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandK = event.key === 'k' && (event.metaKey || event.ctrlKey);
      const isSlash = event.key === '/';

      if (!isCommandK && !isSlash) return;
      if (isTextEntryElement(document.activeElement)) return;

      event.preventDefault();
      openPalette();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPalette]);
}

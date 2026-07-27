import { useEffect, useState } from 'react';

export function useIdleFlag(fallbackDelayMs = 1500, timeoutMs = 3000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: timeoutMs });
      return () => window.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(start, fallbackDelayMs);
    return () => window.clearTimeout(timer);
  }, [fallbackDelayMs, timeoutMs]);

  return ready;
}

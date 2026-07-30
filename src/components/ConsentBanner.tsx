import { useEffect, useState } from 'react';

/**
 * UK GDPR / PECR minimal storage-consent banner (audit #007).
 *
 * Stores a single key: linacre_consent_v1 with value "all" | "essential" | "rejected".
 * The banner only appears when no decision has been recorded. It never sets any
 * marketing / tracking cookies — the site doesn&#39;t use any. The banner simply
 * records the user&#39;s preference so we know whether to gate non-essential
 * LocalStorage writes elsewhere in the app.
 */
const KEY = 'linacre_consent_v1';
const ESSENTIAL_KEYS = new Set(['linacre_theme', 'linacre_consent_v1']);
// Non-essential storage keys the site may write when consent is "all".
// Provider secrets (linacre_openai_key, linacre_claude_key, linacre_litellm_key)
// were removed in v4.6 — they are held in tab-scoped memory only, never in storage.
const OPTIONAL_KEYS = [
  'linacre_active_tab',
  'linacre_brand_color',
  'linacre_brand_font',
  'linacre_brand_frame',
  'linacre_brand_motion',
  'linacre_brand_pulse_speed',
  'linacre_brand_glow',
  'linacre_brand_name',
  'linacre_lab_sessions_v1',
];

export type ConsentValue = 'all' | 'essential' | 'rejected';

export function getConsent(): ConsentValue | null {
  try {
    return (localStorage.getItem(KEY) as ConsentValue) || null;
  } catch {
    return null;
  }
}

function setConsent(v: ConsentValue) {
  try {
    localStorage.setItem(KEY, v);
    document.dispatchEvent(new CustomEvent('linacre:consent', { detail: v }));
  } catch {
    /* No-op — storage blocked / private mode */
  }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Wait one tick to avoid hydration flash before the banner decides whether to render.
    const t = setTimeout(() => {
      if (!getConsent()) setVisible(true);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const close = (v: ConsentValue) => {
    setConsent(v);
    if (v === 'rejected' || v === 'essential') {
      // Purge any non-essential keys the user has previously accepted (defensive).
      try {
        for (const k of OPTIONAL_KEYS) {
          if (!ESSENTIAL_KEYS.has(k)) localStorage.removeItem(k);
        }
      } catch {
        /* ignore */
      }
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="lc-consent-title"
      aria-describedby="lc-consent-desc"
      className="fixed left-0 right-0 bottom-0 z-[9999] bg-[#061923] border-t border-amber-color/30 text-foreground px-5 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]"
      id="lc-consent"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex-1 space-y-1">
          <p id="lc-consent-title" className="font-display text-sm font-bold text-foreground">
            Storage preferences
          </p>
          <p
            id="lc-consent-desc"
            className="text-xs text-muted-foreground leading-relaxed max-w-2xl"
          >
            We use essential browser storage for your theme and workspace state. Optional storage
            saves AI Lab chats and your own API keys locally. No tracking cookies.{' '}
            <a href="/cookie-policy" className="text-cyan hover:underline">
              Cookie Policy
            </a>{' '}
            &middot;{' '}
            <a href="/privacy" className="text-cyan hover:underline">
              Privacy
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => close('all')}
            className="px-4 py-2 rounded-lg bg-amber-color text-[#030c14] font-mono text-xs font-bold hover:bg-amber-glow transition-colors"
            data-analytics="consent_accept_all"
          >
            Accept all
          </button>
          <button
            onClick={() => close('essential')}
            className="px-4 py-2 rounded-lg bg-transparent border border-amber-color text-amber-color font-mono text-xs font-bold hover:bg-amber-color/10 transition-colors"
            data-analytics="consent_essential"
          >
            Essential only
          </button>
          <button
            onClick={() => close('rejected')}
            className="px-4 py-2 rounded-lg bg-transparent border border-border-color text-muted-foreground font-mono text-xs font-bold hover:bg-muted/40 transition-colors"
            data-analytics="consent_reject"
          >
            Reject non-essential
          </button>
        </div>
      </div>
    </div>
  );
}

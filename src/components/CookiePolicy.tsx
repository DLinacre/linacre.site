import { motion } from 'motion/react';

/**
 * /cookie-policy — UK PECR / GDPR disclosure page (audit #007).
 *
 * The site itself does not set marketing / analytics cookies. It does use
 * LocalStorage for stateful user preferences and (optionally) local API keys.
 * PECR requires disclosure and consent for anything that isn't strictly
 * necessary to deliver the service the user asked for.
 */
const KEYS: Array<{
  key: string;
  purpose: string;
  category: 'Essential' | 'Functional' | 'Optional';
  retention: string;
}> = [
  {
    key: 'linacre_consent_v1',
    purpose: 'Records your storage-preference decision so you are not asked repeatedly.',
    category: 'Essential',
    retention: '12 months',
  },
  {
    key: 'linacre_theme',
    purpose: 'Persists dark / light theme choice across visits.',
    category: 'Functional',
    retention: '12 months',
  },
  {
    key: 'linacre_active_tab',
    purpose: 'Restores the last section you were viewing.',
    category: 'Functional',
    retention: '12 months',
  },
  {
    key: 'linacre_brand_*',
    purpose:
      'Stores Identity Hub customisations (colour, frame, motion, monogram) for the live brand builder.',
    category: 'Functional',
    retention: '12 months',
  },
  {
    key: 'linacre_lab_sessions_v1',
    purpose: 'Keeps your AI Lab chat history in-browser only, so you can resume conversations.',
    category: 'Optional',
    retention: 'Until you clear it',
  },
];

export default function CookiePolicy() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 14 }}
      className="max-w-3xl mx-auto space-y-8 py-6"
      id="cookie-policy"
    >
      <header className="space-y-2">
        <p className="font-mono text-xs text-amber-color uppercase tracking-widest">
          Cookie &amp; storage policy
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Cookies &amp; browser storage
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Version 1.1 &middot; Last updated 11 July 2026
        </p>
      </header>

      <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          linacre.site does <strong>not</strong> use tracking cookies, advertising cookies,
          cross-site trackers, or third-party analytics scripts. We do use{' '}
          <strong>browser LocalStorage</strong> on your device to remember your preferences, restore
          what you were doing, and (if you opt in) power the AI Lab.
        </p>
        <p>
          Under the UK GDPR and PECR, we need your permission before storing anything that isn&#39;t
          strictly necessary to deliver the service you asked for. That&#39;s what the small banner
          at the bottom of the page is for. You can change your mind at any time by clearing site
          data in your browser or using the &quot;Reset preferences&quot; link on the Privacy page.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">What we store</h2>
        <div className="overflow-x-auto rounded-xl border border-border-color">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-color/5">
              <tr className="text-foreground">
                <th className="p-3 font-display font-bold">Key</th>
                <th className="p-3 font-display font-bold">Purpose</th>
                <th className="p-3 font-display font-bold">Category</th>
                <th className="p-3 font-display font-bold">Retention</th>
              </tr>
            </thead>
            <tbody>
              {KEYS.map(row => (
                <tr key={row.key} className="border-t border-border-color/40 align-top">
                  <td className="p-3 font-mono text-amber-color">{row.key}</td>
                  <td className="p-3 text-muted-foreground">{row.purpose}</td>
                  <td className="p-3 font-mono text-cyan">{row.category}</td>
                  <td className="p-3 text-muted-foreground">{row.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <h2 className="font-display text-xl font-bold text-foreground">
          What we deliberately do not store
        </h2>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Provider API keys</strong> (OpenAI, Anthropic, LiteLLM). When you paste an
            optional key into the AI Lab, it lives in memory for that tab only. It is never written
            to LocalStorage, SessionStorage, cookies, or IndexedDB, and is never sent to
            linacre.site servers. Refresh the tab and you&#39;ll need to paste again &mdash;
            that&#39;s intentional.
          </li>
          <li>
            <strong>Contact form contents.</strong> The form posts once to our own API and the
            message is used only to reply. Nothing is written to your browser.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <h2 className="font-display text-xl font-bold text-foreground">Third parties</h2>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Vercel</strong> hosts the site. Vercel sets a short-lived security/rate-limit
            cookie only for edge protection, never for tracking.
          </li>
          <li>
            <strong>AI Lab providers</strong> (Google Gemini, optionally OpenAI or Anthropic if you
            supply your own key) &mdash; requests are proxied server-side, and no chat content is
            stored on our servers.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <h2 className="font-display text-xl font-bold text-foreground">Changing your choice</h2>
        <p>
          Reject non-essential storage at any time by clearing site data for linacre.site in your
          browser. The consent banner will re-appear on your next visit.
        </p>
        <p>
          Questions? Email{' '}
          <a href="mailto:david@linacre.site" className="text-amber-color hover:underline">
            david@linacre.site
          </a>
          .
        </p>
      </section>
    </motion.article>
  );
}

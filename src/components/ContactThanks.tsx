import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Calendar, ArrowLeft } from 'lucide-react';

/**
 * /contact/thanks — conversion page (audit #017).
 *
 * Purpose:
 * - Give the form submission a distinct, canonical URL so an analytics tool can
 *   attribute this as a conversion event without any additional client script.
 * - Offer a strong secondary CTA (Calendly) to reduce cold-lead drop-off.
 */
export default function ContactThanks() {
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setRef(params.get('ref'));
      // Push a lightweight analytics event object — a downstream analytics
      // library (Plausible / Vercel Analytics) can pick this up without keys.
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'contact_form_submitted',
        page: '/contact/thanks',
      });
    } catch (_) {
      // No-op — this page is a decorative confirmation.
    }
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 110, damping: 14 }}
      className="max-w-2xl mx-auto text-center space-y-6 py-16"
      id="contact-thanks"
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-amber-color/10 border border-amber-color/30 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-amber-color" aria-hidden="true" />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        Transmission received &mdash; <span className="text-amber-color">thanks!</span>
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        I&#39;ll reply from{' '}
        <a href="mailto:david@linacre.site" className="text-amber-color hover:underline">
          david@linacre.site
        </a>{' '}
        within 12 hours.
        {ref && (
          <>
            {' '}
            Your reference: <span className="font-mono text-amber-color font-bold">{ref}</span>.
          </>
        )}
      </p>

      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <a
          href="mailto:david@linacre.site?subject=Book%20a%2015-min%20intro%20call"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-color text-black font-mono text-sm font-bold rounded-lg hover:bg-amber-glow transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          data-analytics="thanks_book_email"
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>Email to book a 15-min call</span>
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-color/40 text-amber-color font-mono text-sm font-bold rounded-lg hover:bg-amber-color/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to home</span>
        </a>
      </div>

      <p className="pt-6 text-xs text-muted-foreground/60 font-mono">
        Prefer email? Just hit reply once mine lands &mdash; or add project links / a Loom to speed
        things up.
      </p>
    </motion.section>
  );
}

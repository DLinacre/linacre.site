import { motion } from 'motion/react';

/**
 * /terms — Terms of service (audit #007 / CT-05).
 *
 * Plain-English contract terms for freelance engineering work, covering IP,
 * confidentiality, liability caps, and governing law (England &amp; Wales).
 */
export default function Terms() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 14 }}
      className="max-w-3xl mx-auto space-y-8 py-6 text-sm text-muted-foreground leading-relaxed"
      id="terms"
    >
      <header className="space-y-2">
        <p className="font-mono text-xs text-amber-color uppercase tracking-widest">Terms</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Terms of service
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Version 1.1 &middot; Last updated 11 July 2026 &middot; Governed by the laws of England
          &amp; Wales.
        </p>
      </header>

      <section className="space-y-3">
        <p>
          These terms cover use of{' '}
          <a href="/" className="text-amber-color hover:underline">
            linacre.site
          </a>{' '}
          (&ldquo;the site&rdquo;) and any engagement between you (&ldquo;client&rdquo;) and{' '}
          <strong>David Linacre</strong>, sole trader operating as Linacre (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;David&rdquo;). Individual client engagements are governed by a
          written Statement of Work that supersedes anything on this page if the two conflict.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">1. Using the site</h2>
        <p>
          The site, the free toolkit, the AI Lab, and other public content are provided &quot;as
          is&quot;. You may use them for lawful personal and commercial purposes. You may not
          attempt to break, scrape at scale, or reverse-engineer paid or private features (the API,
          the private dashboard, or the Identity Hub&#39;s server routes).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">
          2. Engagements &amp; deliverables
        </h2>
        <p>
          Every paid engagement is scoped in a written Statement of Work covering scope, milestones,
          price, timeline, and acceptance criteria. Invoices are issued in GBP, payable within 14
          days of receipt unless the SoW says otherwise. Ownership of deliverables transfers to the
          client on full payment of the associated invoice; David retains the right to reuse generic
          components, patterns, and know-how developed in the process.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">
          3. Confidentiality &amp; NDAs
        </h2>
        <p>
          NDA-friendly by default. We keep client business information, source code, credentials,
          and pre-release plans confidential during the engagement and for two years afterwards.
          Client credentials are stored in a password manager, not in email or chat.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">
          4. Warranty &amp; liability
        </h2>
        <p>
          Deliverables come with a 30-day post-launch fix window for defects against the agreed
          acceptance criteria. Beyond that, our aggregate liability under any engagement is capped
          at the fees paid in the six months prior to the incident giving rise to the claim. We do
          not exclude liability for death, personal injury, fraud, or anything else that cannot be
          excluded by law.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">5. Third-party services</h2>
        <p>
          Some deliverables integrate with third-party APIs (for example Vercel, Google Gemini,
          OpenAI, Anthropic, GitHub, Cloudflare). Those services have their own terms, rate limits,
          and pricing. We&#39;re not liable for outages, price changes, or policy changes on those
          services.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">6. Data &amp; privacy</h2>
        <p>
          We handle personal data according to the{' '}
          <a href="/privacy" className="text-amber-color hover:underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/cookie-policy" className="text-amber-color hover:underline">
            Cookie Policy
          </a>
          . A Data Processing Agreement is available on request for client engagements that involve
          processing personal data on your behalf.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">7. Governing law</h2>
        <p>
          These terms and any engagement are governed by the laws of England &amp; Wales. Disputes
          are subject to the exclusive jurisdiction of the courts of England &amp; Wales.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">8. Contact</h2>
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

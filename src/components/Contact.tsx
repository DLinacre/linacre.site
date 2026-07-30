import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, ShieldAlert, Lock, Calendar } from 'lucide-react';
import FAQ from './FAQ';

/**
 * Plain-English contact form (audit CRO-01 / UX-03 / #006 / #017).
 *
 * Key changes:
 * - Cyber jargon removed on the commercial surface ("Transmission Body" -> "Project details").
 * - Fields: Name, Work email, Company, Budget, Timeline, Project details, Consent.
 * - Honeypot field renamed on the UI to "website"; wire field stays "company" so the
 *   existing server validator continues to reject bots without any API change.
 * - Trust row under submit: UK GDPR / Reply < 12h / NDA-friendly with lock icon.
 * - On success, redirect to /contact/thanks (secondary Calendly CTA lives there too).
 */
export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyOrg, setCompanyOrg] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
    consent?: string;
  }>({});
  const [requestId, setRequestId] = useState('');
  const [company, setCompany] = useState('');
  const [startedAt] = useState(() => Date.now());

  // Access request handoff from Projects page (unchanged behaviour)
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem('linacre_pending_request');
      if (pending) {
        const parsed = JSON.parse(pending);
        if (parsed && parsed.projectName) {
          setSubject(`Access request: ${parsed.projectName}`);
          setMessage(
            `Hi David,\n\nI'd like to request details/access for your project "${parsed.projectName}" (${parsed.projectType || 'Internal'}).\n\nBackground: `,
          );
        }
        sessionStorage.removeItem('linacre_pending_request');
      }
    } catch (e) {
      console.error('Failed to parse pending request', e);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 110, damping: 14 },
    },
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: typeof fieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!email.trim() || !emailRegex.test(email.trim()))
      errors.email = 'Please enter a valid email address.';
    if (!message.trim() || message.trim().length < 10)
      errors.message = 'Message must be at least 10 characters long.';
    if (!consent) errors.consent = 'You must agree to the privacy policy before sending.';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(firstKey);
      el?.focus();
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const composedSubject =
      subject ||
      `[${budget || 'Budget TBD'} / ${timeline || 'Timeline TBD'}] Project enquiry - ${name}`;
    const composedMessage =
      `From: ${name}${companyOrg ? ` (${companyOrg})` : ''}\n` +
      `Budget: ${budget || '-'}\n` +
      `Timeline: ${timeline || '-'}\n` +
      `\n${message}`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          subject: composedSubject,
          message: composedMessage,
          company,
          startedAt,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof body.error === 'string' ? body.error : 'Your enquiry could not be sent.',
        );
      }

      setRequestId(body.requestId);
      setStatus('success');
      setFieldErrors({});
      setName('');
      setEmail('');
      setCompanyOrg('');
      setBudget('');
      setTimeline('');
      setSubject('');
      setMessage('');

      // Redirect to /contact/thanks (conversion URL for analytics).
      try {
        const ref = body.requestId ? `?ref=${encodeURIComponent(body.requestId)}` : '';
        window.history.pushState(null, '', `/contact/thanks${ref}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch (_) {
        /* non-fatal */
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        err.message || 'Connection failed. Please try again or email david@linacre.site directly.',
      );
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 animate-fade-in"
    >
      {/* Title hero - plain English (audit UX-03) */}
      <motion.section
        variants={itemVariants}
        className="text-center md:text-left space-y-4 max-w-3xl"
        id="contact-hero"
      >
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          Contact
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          Let&#39;s build something <span className="text-amber-color">reliable</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Custom software, pipeline automation, or an infrastructure audit? Tell me what you&#39;re
          building &mdash; I reply within 12 hours.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info column */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          <div className="bg-muted/10 border border-border-color rounded-xl p-6 space-y-4 text-sm text-muted-foreground">
            <h3 className="text-foreground font-bold text-sm font-display">What to include</h3>
            <ul className="space-y-1.5 text-xs leading-relaxed list-disc pl-4">
              <li>What are you building, and why now?</li>
              <li>Rough budget and timeline (best guess is fine)</li>
              <li>Any constraints &mdash; stack, compliance, incumbent tooling</li>
              <li>Links to docs, repos, or Figma if useful</li>
            </ul>
            <div className="border-t border-border-color/30 pt-4 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan" aria-hidden="true" />
                <span>HTTPS &middot; UK GDPR &middot; NDA-friendly</span>
              </div>
              <p className="text-muted-foreground/70">
                We use your email and message only to reply. Retained max 30 days post-resolution.
                See{' '}
                <a href="/privacy" className="text-amber-color hover:underline">
                  Privacy
                </a>{' '}
                and{' '}
                <a href="/cookie-policy" className="text-amber-color hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </div>
          </div>

          <div className="bg-amber-color/5 border border-border-color rounded-xl p-6 space-y-3">
            <h3 className="text-amber-color font-bold text-sm font-display">Prefer to talk?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Email a couple of time slots that suit you and I&#39;ll send a calendar invite for a
              free 15-minute discovery call.
            </p>
            <a
              href="mailto:david@linacre.site?subject=Book%20a%2015-min%20intro%20call"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-color hover:bg-amber-glow text-black font-mono text-xs font-bold transition-all shadow-sm focus:outline-none"
              data-analytics="contact_book_email"
            >
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Email to book a 15-min call</span>
            </a>
          </div>
        </motion.div>

        {/* Form column */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="linacre-surface p-6 sm:p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <CheckCircle
                    className="w-12 h-12 text-emerald-color mx-auto"
                    aria-hidden="true"
                  />
                  <h2 className="font-display text-lg font-bold text-foreground">Message sent</h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto font-mono">
                    Reference <span className="text-amber-color font-bold">{requestId}</span>{' '}
                    &mdash; I&#39;ll reply from david@linacre.site within 12 hours.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <a
                      href="mailto:david@linacre.site?subject=Book%20a%2015-min%20intro%20call"
                      className="px-4 py-2 bg-amber-color text-black font-mono text-xs font-bold rounded-lg hover:bg-amber-glow transition-all"
                    >
                      Email to book a 15-min call
                    </a>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-4 py-2 border border-border-color hover:border-amber-color text-amber-color font-mono text-xs rounded-lg hover:bg-amber-color/10 transition-all cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Honeypot */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                    }}
                  >
                    <label htmlFor="website">Leave this field blank</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                    />
                  </div>

                  {Object.keys(fieldErrors).length > 0 && (
                    <div
                      id="form-errors"
                      role="alert"
                      aria-live="assertive"
                      tabIndex={-1}
                      className="p-3 bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs rounded-lg space-y-1"
                    >
                      <h4 className="font-bold flex items-center gap-1.5 text-rose-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                        Check highlighted fields
                      </h4>
                      <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-rose-200/90">
                        {Object.values(fieldErrors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block font-mono text-[11px] text-muted-foreground uppercase font-bold"
                    >
                      Name <span className="text-amber-color">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        if (fieldErrors.name)
                          setFieldErrors(prev => ({ ...prev, name: undefined }));
                      }}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                      className={`w-full bg-background/50 border ${fieldErrors.name ? 'border-rose-500' : 'border-border-color'} rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:border-amber-color`}
                    />
                    {fieldErrors.name && (
                      <p id="name-error" className="text-xs text-rose-400 font-mono" role="alert">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block font-mono text-[11px] text-muted-foreground uppercase font-bold"
                    >
                      Work email <span className="text-amber-color">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (fieldErrors.email)
                          setFieldErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      className={`w-full bg-background/50 border ${fieldErrors.email ? 'border-rose-500' : 'border-border-color'} rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:border-amber-color`}
                    />
                    {fieldErrors.email && (
                      <p id="email-error" className="text-xs text-rose-400 font-mono" role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="companyOrg"
                      className="block font-mono text-[11px] text-muted-foreground uppercase font-bold"
                    >
                      Company{' '}
                      <span className="text-muted-foreground/60 normal-case font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="companyOrg"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Corp"
                      value={companyOrg}
                      onChange={e => setCompanyOrg(e.target.value)}
                      className="w-full bg-background/50 border border-border-color rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:border-amber-color"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="budget"
                        className="block font-mono text-[11px] text-muted-foreground uppercase font-bold"
                      >
                        Budget
                      </label>
                      <select
                        id="budget"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        className="w-full bg-background/50 border border-border-color rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:border-amber-color"
                      >
                        <option value="">Select&hellip;</option>
                        <option value="Under £2k">Under £2k</option>
                        <option value="£2-6k">£2-6k</option>
                        <option value="£6-15k">£6-15k</option>
                        <option value="£15k+">£15k+</option>
                        <option value="Retainer / Not sure">Retainer / Not sure</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="timeline"
                        className="block font-mono text-[11px] text-muted-foreground uppercase font-bold"
                      >
                        Timeline
                      </label>
                      <select
                        id="timeline"
                        value={timeline}
                        onChange={e => setTimeline(e.target.value)}
                        className="w-full bg-background/50 border border-border-color rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:border-amber-color"
                      >
                        <option value="">Select&hellip;</option>
                        <option value="ASAP">ASAP</option>
                        <option value="2-4 weeks">2-4 weeks</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="Exploring">Exploring</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="message"
                      className="block font-mono text-[11px] text-muted-foreground uppercase font-bold"
                    >
                      Project details <span className="text-amber-color">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      placeholder="What are you building? Goals, current stack, constraints, links..."
                      value={message}
                      onChange={e => {
                        setMessage(e.target.value);
                        if (fieldErrors.message)
                          setFieldErrors(prev => ({ ...prev, message: undefined }));
                      }}
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                      className={`w-full bg-background/50 border ${fieldErrors.message ? 'border-rose-500' : 'border-border-color'} rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus-visible:border-amber-color`}
                    />
                    {fieldErrors.message && (
                      <p
                        id="message-error"
                        className="text-xs text-rose-400 font-mono"
                        role="alert"
                      >
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="consent"
                      className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer"
                    >
                      <input
                        id="consent"
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={e => {
                          setConsent(e.target.checked);
                          if (fieldErrors.consent)
                            setFieldErrors(prev => ({ ...prev, consent: undefined }));
                        }}
                        aria-invalid={Boolean(fieldErrors.consent)}
                        aria-describedby={fieldErrors.consent ? 'consent-error' : undefined}
                        className="mt-0.5 accent-[color:var(--color-amber-color)]"
                      />
                      <span>
                        I agree to the{' '}
                        <a href="/privacy" className="text-amber-color hover:underline">
                          Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a href="/terms" className="text-amber-color hover:underline">
                          Terms
                        </a>
                        . <span className="text-amber-color">*</span>
                      </span>
                    </label>
                    {fieldErrors.consent && (
                      <p
                        id="consent-error"
                        className="text-xs text-rose-400 font-mono pl-6"
                        role="alert"
                      >
                        {fieldErrors.consent}
                      </p>
                    )}
                  </div>
                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex flex-col gap-2"
                        role="alert"
                        aria-live="assertive"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldAlert
                            className="w-4 h-4 text-rose-400 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{errorMessage}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/80 pl-6">
                          Fallback: email me directly at{' '}
                          <a
                            href={`mailto:david@linacre.site?subject=${encodeURIComponent(subject || 'Enquiry')}&body=${encodeURIComponent(message)}`}
                            className="text-amber-color hover:underline font-bold"
                          >
                            david@linacre.site
                          </a>
                          .
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border-color/30">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-cyan" aria-hidden="true" /> UK GDPR
                      </span>
                      <span>&middot;</span>
                      <span>Reply &lt; 12h</span>
                      <span>&middot;</span>
                      <span>NDA-friendly</span>
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'submitting' || !consent}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-color hover:bg-amber-glow text-black font-bold rounded-lg text-sm font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                      data-analytics="contact_submit"
                    >
                      {status === 'submitting' ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full"
                            aria-hidden="true"
                          />
                          <span>Sending&hellip;</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Send message &rarr;</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="linacre-pulse-line w-full my-8" />

      <motion.div variants={itemVariants}>
        <FAQ />
      </motion.div>
    </motion.div>
  );
}

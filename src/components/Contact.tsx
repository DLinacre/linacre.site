import React, { useState } from 'react';

interface ContactProps {
  theme?: 'dark' | 'light';
}

export default function Contact(_props: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please enter your name.';
    if (!email.trim()) {
      next.email = 'Please enter an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!message.trim() || message.trim().length < 10) {
      next.message = 'Please include a short message (at least 10 characters).';
    }
    if (!consent) {
      next.consent = 'Please confirm you agree to the Privacy Policy before sending.';
    }
    return next;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('submitting');
    setErrorMsg('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          message: message.trim(),
          consent: true,
          website: honeypot,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${response.status})`);
      }
      const data = await response.json().catch(() => ({}));
      setStatus('sent');
      const ref = data?.requestId ? `?ref=${encodeURIComponent(data.requestId)}` : '';
      window.location.assign(`/contact/thanks${ref}`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not send message right now. Please email david@linacre.site directly.',
      );
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-page-title">
      <header className="page-hero">
        <p className="eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          Contact · LIN4CRE
        </p>
        <h1 id="contact-page-title" className="page-title">
          Get in touch.
        </h1>
        <p className="page-lead">
          Questions about a project, software collaboration, or feedback on an open-source release?
          Send a note below or email{' '}
          <a href="mailto:david@linacre.site" style={{ color: 'var(--studio-ink)' }}>
            david@linacre.site
          </a>{' '}
          directly.
        </p>
      </header>

      <div className="contact-page-grid">
        <aside className="contact-sidebar" aria-label="Contact details">
          <div className="contact-sidebar__block">
            <h2>Direct Email</h2>
            <p>
              <a href="mailto:david@linacre.site">david@linacre.site</a>
            </p>
          </div>

          <div className="contact-sidebar__block">
            <h2>Helpful Context</h2>
            <ul>
              <li>What you are building, testing, or enquiring about</li>
              <li>Relevant links, repositories, or platform constraints</li>
              <li>Rough timeline if the enquiry is project-related</li>
            </ul>
          </div>

          <div className="contact-sidebar__block">
            <h2>Privacy</h2>
            <p>
              Messages are sent over HTTPS solely to respond to your enquiry. See{' '}
              <a href="/privacy">Privacy Policy</a> and <a href="/cookie-policy">Storage Policy</a>.
            </p>
          </div>
        </aside>

        <form onSubmit={handleSubmit} noValidate className="studio-form">
          {/* Honeypot field for automated spam filtering */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <label htmlFor="contact-website">
              Website
              <input
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          <div className="studio-form__row">
            <div className="studio-field">
              <label htmlFor="contact-name">Name *</label>
              <input
                id="contact-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'err-name' : undefined}
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p id="err-name" role="alert" className="studio-field__error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="studio-field">
              <label htmlFor="contact-email">Email *</label>
              <input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'err-email' : undefined}
                placeholder="jane@example.com"
              />
              {errors.email && (
                <p id="err-email" role="alert" className="studio-field__error">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="studio-field">
            <label htmlFor="contact-company">Organisation or Subject (optional)</label>
            <input
              id="contact-company"
              type="text"
              autoComplete="organization"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Project collaboration, bug report, or general question"
            />
          </div>

          <div className="studio-field">
            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              required
              rows={6}
              value={message}
              onChange={e => setMessage(e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'err-message' : undefined}
              placeholder="Share a few details about what you have in mind…"
            />
            {errors.message && (
              <p id="err-message" role="alert" className="studio-field__error">
                {errors.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-consent" className="studio-consent">
              <input
                id="contact-consent"
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? 'err-consent' : undefined}
              />
              <span>
                I agree to my message being processed to reply in accordance with the{' '}
                <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>. *
              </span>
            </label>
            {errors.consent && (
              <p id="err-consent" role="alert" className="studio-field__error" style={{ marginTop: '0.4rem' }}>
                {errors.consent}
              </p>
            )}
          </div>

          {status === 'error' && (
            <div role="alert" className="studio-field__error">
              {errorMsg} — or email{' '}
              <a href="mailto:david@linacre.site" style={{ color: 'var(--studio-ink)' }}>
                david@linacre.site
              </a>
              .
            </div>
          )}

          <div className="studio-form__footer">
            <span className="status-line">Direct delivery · UK GDPR compliant</span>
            <button type="submit" disabled={status === 'submitting'} className="btn-primary">
              <span>{status === 'submitting' ? 'Sending…' : 'Send message'}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

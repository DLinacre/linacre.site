import { useEffect, useState } from 'react';

export default function ContactThanks() {
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setRef(params.get('ref'));
    } catch {
      // Ignore query parsing issues in constrained environments.
    }
  }, []);

  return (
    <section id="contact-thanks" aria-labelledby="thanks-heading">
      <header className="page-hero">
        <p className="eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          Message Received
        </p>
        <h1 id="thanks-heading" className="page-title">
          Thank you—your message is on its way.
        </h1>
        <p className="page-lead">
          I’ll reply from{' '}
          <a href="mailto:david@linacre.site" style={{ color: 'var(--studio-ink)' }}>
            david@linacre.site
          </a>{' '}
          as soon as possible.
          {ref ? ` Reference: ${ref}.` : ''}
        </p>
      </header>

      <div className="hero-actions" style={{ marginTop: '2rem' }}>
        <a href="/" className="btn-primary">
          <span>Return home</span>
          <span aria-hidden="true">→</span>
        </a>
        <a href="/games" className="btn-secondary">
          <span>Browse games</span>
        </a>
      </div>
    </section>
  );
}

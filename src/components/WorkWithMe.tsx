import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { WORK_FAQS, WORK_NEXT_AVAILABLE } from '../data';

interface Offering {
  id: string;
  title: string;
  price: string;
  description: string;
  deliverables: string[];
  cta: string;
  ctaHref: string;
  isExternal: boolean;
  popular?: boolean;
}

export default function WorkWithMe() {
  const offerings: Offering[] = [
    {
      id: 'audit',
      title: 'Systems & Infrastructure Audit',
      price: 'From £1,800',
      description: 'Deep technical review of your architecture, security, performance, and developer experience.',
      deliverables: [
        'Full architecture review + report',
        'Security & performance recommendations',
        'Implementation roadmap (30/60/90 days)',
        '2x 45-min follow-up consulting calls'
      ],
      // Calendly event 404'd (audit Issue 1, 12 Jul 2026) — route to the
      // contact form (prefilled project type) until a scheduler is restored.
      cta: 'Book an Audit',
      ctaHref: '/contact?project=audit',
      isExternal: false
    },
    {
      id: 'development',
      title: 'Custom Development Project',
      price: 'From £6,500',
      description: 'End-to-end build of production-grade tools, automation platforms, or AI integrations.',
      deliverables: [
        'Full-stack React + TypeScript / Go / Python',
        'Production deployment (Vercel / Cloud)',
        'Documentation + system handoff',
        '30 days of direct post-launch support'
      ],
      cta: 'Start Project',
      ctaHref: '/contact?project=custom',
      isExternal: false,
      popular: true
    },
    {
      id: 'retainer',
      title: 'Ongoing Engineering Retainer',
      price: '£2,400 / month',
      description: 'Dedicated fractional engineering time for ongoing improvements and rapid iteration.',
      deliverables: [
        '20 hours / month priority access',
        'Architecture guidance + code reviews',
        'Rapid prototyping & API support',
        'Monthly systems strategy calls'
      ],
      cta: 'Discuss Retainer',
      ctaHref: '/contact?project=retainer',
      isExternal: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 14 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-16 pb-16 animate-fade-in"
      id="work-with-me-container"
    >
      {/* Title Hero */}
      <motion.section variants={itemVariants} className="text-center space-y-4 max-w-3xl mx-auto" id="work-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          Services &amp; Engagement
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-3">
          Work with <span className="text-amber-color">David</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          I help engineering groups ship faster, automate operations, and implement secure, high-throughput systems. Select contract services are outlined below.
        </p>
        {/* Availability indicator (audit Roadmap #15, 12 Jul 2026) —
            WORK_NEXT_AVAILABLE lives in src/data.ts; update it there. */}
        <p className="inline-flex items-center gap-2 font-mono text-xs text-emerald-color bg-emerald-color/10 border border-emerald-color/25 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-pulse" aria-hidden="true" />
          <span>Next available: <strong className="font-bold">{WORK_NEXT_AVAILABLE}</strong></span>
        </p>
      </motion.section>

      {/* Offerings Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6" id="work-offerings">
        {offerings.map((offering) => (
          <div
            key={offering.id}
            className={`relative rounded-xl p-6 border flex flex-col justify-between transition-all ${
              offering.popular
                ? 'border-amber-color/50 bg-amber-color/5 shadow-[0_0_15px_rgba(34,211,238,0.06)]'
                : 'border-border-color bg-muted/10'
            }`}
          >
            {offering.popular && (
              <div className="absolute -top-3 right-6 px-3 py-0.5 bg-amber-color text-black text-[9px] font-mono font-bold tracking-wider rounded-full shadow-sm">
                MOST POPULAR
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5 border-b border-border-color/30 pb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight">{offering.title}</h2>
                <div className="text-2xl font-mono font-bold text-amber-color">{offering.price}</div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed min-h-[48px]">{offering.description}</p>

              <ul className="space-y-2 border-t border-border-color/30 pt-4 text-xs font-mono">
                {offering.deliverables.map((del, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-amber-color shrink-0">→</span>
                    <span className="leading-snug">{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              {offering.isExternal ? (
                <a
                  href={offering.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full block text-center py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    offering.popular
                      ? 'bg-amber-color hover:bg-amber-color/90 text-black shadow-md'
                      : 'bg-muted/40 border border-border-color hover:bg-muted text-foreground'
                  }`}
                >
                  {offering.cta}
                </a>
              ) : (
                <button
                  onClick={() => {
                    // Navigate to Contact tab via URL pushState + custom event
                    window.history.pushState({}, '', offering.ctaHref);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    offering.popular
                      ? 'bg-amber-color hover:bg-amber-color/90 text-black shadow-md'
                      : 'bg-muted/40 border border-border-color hover:bg-muted text-foreground'
                  }`}
                >
                  {offering.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </motion.section>

      {/* FAQ — visible copy of the /work FAQPage JSON-LD (audit TASK-006,
          12 Jul 2026). Both render from WORK_FAQS in src/data.ts so the
          schema and on-page text always match. */}
      <motion.section variants={itemVariants} className="space-y-6" id="work-faq" aria-labelledby="work-faq-heading">
        <h2 id="work-faq-heading" className="font-display text-2xl font-bold tracking-tight text-foreground text-center">
          Frequently asked <span className="text-amber-color">questions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {WORK_FAQS.map((faq) => (
            <div key={faq.question} className="bg-muted/10 border border-border-color rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-foreground leading-snug">{faq.question}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Honest next step — no fake download or mailing-list promise. */}
      <motion.section variants={itemVariants} className="rounded-3xl border border-amber-color/20 bg-amber-color/[0.05] p-6 sm:p-8" id="work-project-brief">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">A better first step</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">Send the problem, constraints, and desired outcome.</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              You do not need a polished specification. A useful project brief can be five sentences: who the user is, what is failing now, what success looks like, the deadline, and the available budget. I will reply with the clearest next step — including when the honest answer is that you do not need a custom build.
            </p>
          </div>
          <a href="/contact?project=brief" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-color px-5 py-3 font-mono text-xs font-bold text-[#031018] hover:bg-amber-glow">
            Send a project brief <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.section>
    </motion.div>
  );
}

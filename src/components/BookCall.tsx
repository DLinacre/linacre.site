import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Mail,
  ArrowRight,
  Video,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import FAQ from './FAQ';

interface BookCallProps {
  navigate?: (tab: string) => void;
}

export default function BookCall({ navigate }: BookCallProps) {
  const [selectedCallType, setSelectedCallType] = useState<'discovery' | 'architecture'>(
    'discovery',
  );
  const [copiedEmail, setCopiedEmail] = useState(false);

  const callTypes = [
    {
      id: 'discovery' as const,
      title: '15-Min Discovery Call',
      price: 'Free',
      badge: 'Recommended for new projects',
      description:
        'A quick intro call to discuss your goals, system constraints, timeline, and whether my services are the right fit.',
      deliverables: [
        'High-level scope alignment',
        'Stack & feasibility feedback',
        'Estimated project cost range',
        'Direct follow-up summary email',
      ],
    },
    {
      id: 'architecture' as const,
      title: '45-Min Systems Architecture Review',
      price: 'Included with Audits',
      badge: 'For complex systems',
      description:
        'Deep dive into existing software, pipeline bottlenecks, API integrations, security concerns, or migration plans.',
      deliverables: [
        'Technical bottleneck diagnosis',
        'Security & IAM review',
        'Recommended architecture roadmap',
        'Written assessment within 24h',
      ],
    },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('david@linacre.site');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 animate-fade-in"
      id="book-call-page"
    >
      {/* Title Hero */}
      <motion.section
        variants={itemVariants}
        className="text-center md:text-left space-y-4 max-w-3xl"
        id="book-hero"
      >
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          Schedule a Call
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          Book a <span className="text-amber-color">Discovery Call</span> with David
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          No automated calendar loops or pushy sales reps. Pick your topic below and send two
          preferred time slots &mdash; I reply with a calendar invite within 12 hours.
        </p>
      </motion.section>

      {/* Call options selection */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {callTypes.map(type => {
          const isSelected = selectedCallType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => setSelectedCallType(type.id)}
              className={`linacre-surface p-6 rounded-2xl border transition-all cursor-pointer space-y-4 relative overflow-hidden ${
                isSelected
                  ? 'border-amber-color shadow-[0_0_24px_rgba(34,211,238,0.25)] bg-amber-color/5'
                  : 'border-border-color hover:border-amber-color/40 bg-background/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-color/10 text-amber-color border border-amber-color/20">
                  {type.badge}
                </span>
                <span className="font-mono text-sm font-bold text-cyan">{type.price}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-color" aria-hidden="true" />
                  {type.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
              </div>

              <div className="border-t border-border-color/40 pt-3 space-y-2">
                <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  What&#39;s included:
                </span>
                <ul className="space-y-1.5 text-xs text-foreground/90 font-mono">
                  {type.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-emerald-color shrink-0"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Main booking card */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-7 linacre-surface p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-color" aria-hidden="true" />
              Request your time slot
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Selected call:{' '}
              <span className="text-amber-color font-bold font-mono">
                {callTypes.find(c => c.id === selectedCallType)?.title}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-background/50 border border-border-color rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground border-b border-border-color/30 pb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan" aria-hidden="true" /> Timezone
                </span>
                <span className="text-foreground font-bold">UK Time (GMT / BST)</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground border-b border-border-color/30 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-color" aria-hidden="true" />{' '}
                  Availability
                </span>
                <span className="text-foreground font-bold">
                  Mon &ndash; Fri · 09:00 &ndash; 18:00
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-color" aria-hidden="true" />{' '}
                  Confidentiality
                </span>
                <span className="text-foreground font-bold">NDA-friendly by default</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`mailto:david@linacre.site?subject=${encodeURIComponent(`Book ${callTypes.find(c => c.id === selectedCallType)?.title}`)}&body=${encodeURIComponent(`Hi David,\n\nI'd like to book a ${callTypes.find(c => c.id === selectedCallType)?.title}.\n\nPreferred times (UK time):\n1. [Date & Time]\n2. [Date & Time]\n\nProject overview:\n[Brief summary of what you are building]\n\nThanks,\n[Your Name]`)}`}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-amber-color hover:bg-amber-glow text-black font-mono text-sm font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
                id="btn-confirm-booking-email"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Send booking request by email →</span>
              </a>

              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                <span>
                  Direct email: <strong className="text-foreground">david@linacre.site</strong>
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="text-amber-color hover:underline cursor-pointer"
                >
                  {copiedEmail ? 'Copied!' : 'Copy address'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info & Preparation Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-muted/10 border border-border-color rounded-xl p-6 space-y-4 text-xs text-muted-foreground">
            <h3 className="text-foreground font-bold text-sm font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan" aria-hidden="true" />
              How to prepare
            </h3>
            <ul className="space-y-2 leading-relaxed list-disc pl-4">
              <li>Think about your top 1&ndash;2 outcomes for the call.</li>
              <li>
                Have links to current repositories, Figma, or staging environments handy if
                applicable.
              </li>
              <li>Rough target budget and timeline (estimates are completely fine).</li>
              <li>You will receive a Google Meet or Zoom video link prior to the call.</li>
            </ul>
          </div>

          <div className="bg-amber-color/5 border border-border-color rounded-xl p-6 space-y-3">
            <h3 className="text-amber-color font-bold text-sm font-display flex items-center gap-2">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              Prefer text first?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you prefer to outline your requirements in writing before jumping on a call, use
              the direct contact form.
            </p>
            <button
              onClick={() => navigate?.('contact')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-amber-color/30 hover:bg-amber-color/10 text-amber-color font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>Fill out project form</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="linacre-pulse-line w-full my-8" />

      <motion.div variants={itemVariants}>
        <FAQ />
      </motion.div>
    </motion.div>
  );
}

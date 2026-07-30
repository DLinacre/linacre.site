import { motion } from 'motion/react';
import { ShieldCheck, Lock, Database, UserCheck } from 'lucide-react';

export default function Privacy() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
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
      className="space-y-12 max-w-4xl mx-auto font-mono text-xs text-muted-foreground leading-relaxed py-6"
    >
      <motion.section
        variants={itemVariants}
        className="text-center md:text-left space-y-4"
        id="privacy-hero"
      >
        <span className="text-cyan tracking-widest uppercase font-semibold bg-cyan/10 border border-cyan/20 px-2.5 py-1 rounded-full">
          Compliance & Disclosures
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mt-3">
          Privacy <span className="text-cyan">Policy</span>
        </h1>
        <p className="text-sm">// Last updated: 10 July 2026. Zero tracking cookies active.</p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <h2 className="flex items-center gap-2 text-foreground font-bold text-xs">
            <Lock className="w-4 h-4 text-cyan" />
            <span>1. DATA COLLECTION PROTOCOLS</span>
          </h2>
          <p>
            linacre.site does not collect or log personal telemetry, tracking analytics, or
            behavioral advertising cookies. We use browser Local Storage solely for functional user
            preferences (such as light/dark theme selection and active tab state).
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <h2 className="flex items-center gap-2 text-foreground font-bold text-xs">
            <Database className="w-4 h-4 text-cyan" />
            <span>2. SECURE CONTACT FIELDS</span>
          </h2>
          <p>
            Submissions via the Contact Form are transmitted securely over SSL to our contact API.
            Message contents are processed solely to address your inquiries and are retained for a
            maximum of 30 days following resolution.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <h2 className="flex items-center gap-2 text-foreground font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan" />
            <span>3. CHATBOT PROCESSING</span>
          </h2>
          <p>
            The floating AI chatbot processes prompts statelessly via our secure rate-limited API,
            which forwards queries directly to the Gemini API. Chat history is held in transient
            memory for the current session only and is not retained.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <h2 className="flex items-center gap-2 text-foreground font-bold text-xs">
            <UserCheck className="w-4 h-4 text-cyan" />
            <span>4. DATA CONTROLLER & RIGHTS</span>
          </h2>
          <p>
            David Linacre is the Data Controller. You can clear all local storage cache items
            directly via browser controls or inside the Identity Hub. For questions, data access, or
            deletion requests, contact us at david@linacre.site.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <h2 className="flex items-center gap-2 text-foreground font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan" />
            <span>5. SUB-PROCESSORS & TRANSFERS</span>
          </h2>
          <p>
            We share contact submissions and prompt queries with our sub-processors, Vercel Inc.
            (hosting & serverless functions) and Google Cloud Platform (Gemini API calls). Since
            these third parties operate in the United States, we rely on standard contract clauses
            (SCCs) to guarantee equivalent data protection levels.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <h2 className="flex items-center gap-2 text-foreground font-bold text-xs">
            <Lock className="w-4 h-4 text-cyan" />
            <span>6. LEGAL BASIS FOR PROCESSING</span>
          </h2>
          <p>
            We process data under the legal basis of your explicit consent (when you fill in the
            contact form or configure custom model API credentials) and our legitimate interest in
            securing our website infrastructure, maintaining operational pings, and providing an
            interactive chatbot.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 md:col-span-2 space-y-3"
        >
          <h2 className="flex items-center gap-2 text-foreground font-bold text-xs">
            <Database className="w-4 h-4 text-cyan" />
            <span>7. COOKIE & LOCAL STORAGE INVENTORY</span>
          </h2>
          <p>
            This site does not use cookies. We use browser Local Storage solely to persist
            functional workspace settings:
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
            <li>
              <strong>linacre_consent_v1</strong> — Records your storage-preference decision so we
              don&#39;t ask again.
            </li>
            <li>
              <strong>linacre_active_tab</strong> — Remembers your active dashboard panel state.
            </li>
            <li>
              <strong>linacre_theme</strong> — Stores your light/dark display mode preference.
            </li>
            <li>
              <strong>linacre_brand_*</strong> — Persists Identity Hub customisations (colour,
              frame, motion, monogram).
            </li>
            <li>
              <strong>linacre_lab_sessions_v1</strong> — Saves your AI Lab local conversation
              blueprints.
            </li>
          </ul>
          <p className="text-[11px] text-amber-color/90 mt-2">
            Provider API keys (OpenAI, Anthropic, LiteLLM) are <em>not</em> written to browser
            storage. If you paste one into the AI Lab it stays in memory for that tab only and is
            never sent to linacre.site servers. Full detail: see{' '}
            <a href="/cookie-policy" className="underline hover:text-amber-color">
              Cookie Policy
            </a>
            .
          </p>
        </motion.div>
      </div>

      <motion.section
        variants={itemVariants}
        className="border-t border-border-color/30 pt-6 text-center"
      >
        <p className="text-[10px] text-muted-foreground/60">
          For technical security disclosures or registry complaints, dispatch a transmission using
          the main Contact Hub.
        </p>
      </motion.section>
    </motion.div>
  );
}

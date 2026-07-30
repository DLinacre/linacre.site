import { motion } from 'motion/react';
import { Eye, HelpCircle, Shield, Award } from 'lucide-react';

export default function AccessibilityStatement() {
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
        id="a11y-hero"
      >
        <span className="text-purple-color tracking-widest uppercase font-semibold bg-purple-color/10 border border-purple-color/20 px-2.5 py-1 rounded-full">
          Accessibility Policy
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mt-3">
          Accessibility <span className="text-purple-color">Statement</span>
        </h1>
        <p className="text-sm">// Last reviewed: July 10, 2026. Factual status overview.</p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Award className="w-4 h-4 text-purple-color" />
            <span>1. CONFORMANCE OBJECTIVE</span>
          </div>
          <p>
            We want linacre.site to be usable by as many people as possible. We are working toward
            WCAG 2.2 AA guidelines and test key journeys with automated checks and manual keyboard
            reviews. This statement describes the current status; it is not a claim of full
            conformance.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Eye className="w-4 h-4 text-purple-color" />
            <span>2. ACTIVE IMPROVEMENTS</span>
          </div>
          <p>
            We are actively providing proper HTML landmarks, a keyboard skip-to-content link,
            semantic headings, native controls, focusable code output regions, and explicit focus
            outline states. Visual contrast ratios across dark and light themes are continuously
            verified.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Shield className="w-4 h-4 text-purple-color" />
            <span>3. KNOWN LIMITATIONS</span>
          </div>
          <p>
            Certain experimental features, simulated logs, and graphical charts in the AI Agents or
            Labs regions may have limited screen-reader description support. Please submit a
            feedback transmission if you require alternative ways of accessing this content.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3"
        >
          <div className="flex items-center gap-2 text-foreground font-bold">
            <HelpCircle className="w-4 h-4 text-purple-color" />
            <span>4. ASSESSMENT & FEEDBACK</span>
          </div>
          <p>
            This statement was assessed using Axe DevTools and manual keyboard reviews across major
            browsers. If you encounter any barriers on linacre.site, please contact us at
            david@linacre.site or via the Contact page. We acknowledge reports within 2 business
            days.
          </p>
        </motion.div>
      </div>

      <motion.section
        variants={itemVariants}
        className="border-t border-border-color/30 pt-6 text-center"
      >
        <p className="text-[10px] text-muted-foreground/60">
          Continuing to refine layout semantic structures for maximum inclusivity.
        </p>
      </motion.section>
    </motion.div>
  );
}

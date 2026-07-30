import { motion } from 'motion/react';
import { Clock, BookOpen, Cpu, Sparkles } from 'lucide-react';

export default function Now() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
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
      className="space-y-12 animate-fade-in"
    >
      {/* Title Hero */}
      <motion.section
        variants={itemVariants}
        className="text-center md:text-left space-y-4 max-w-3xl"
        id="now-hero"
      >
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          The /now Page
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          What I'm Up To <span className="text-amber-color">Now</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Following the Derek Sivers convention, this page details my current professional focus,
          active learning, and personal interests. Updated mid-2026.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Working on */}
        <motion.div
          variants={itemVariants}
          className="bg-muted/15 border border-border-color/60 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-amber-color font-bold">
            <Cpu className="w-5 h-5" />
            <h2 className="font-display text-base">Working On</h2>
          </div>
          <ul className="space-y-3 font-mono text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-cyan font-bold shrink-0">&gt;</span>
              <span>
                Refining my custom React brand monogram creator engine with drag-and-drop support.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan font-bold shrink-0">&gt;</span>
              <span>
                Building high-throughput Model Context Protocol (MCP) servers to bridge local LLM
                workspaces with terminal environments.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan font-bold shrink-0">&gt;</span>
              <span>
                Providing fractional platform engineering and security reviews for contract clients.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Learning */}
        <motion.div
          variants={itemVariants}
          className="bg-muted/15 border border-border-color/60 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-cyan font-bold">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-display text-base">Learning</h2>
          </div>
          <ul className="space-y-3 font-mono text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-amber-color font-bold shrink-0">&gt;</span>
              <span>
                Advanced WebGPU shaders for client-side fluid dynamics and rendering optimization.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-color font-bold shrink-0">&gt;</span>
              <span>
                Rust systems programming, specifically memory allocation patterns in bare-metal
                environments.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-color font-bold shrink-0">&gt;</span>
              <span>
                In-depth WebAssembly compilation from C++ targets for speed improvements in media
                assets.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Reading & Watching */}
        <motion.div
          variants={itemVariants}
          className="bg-muted/15 border border-border-color/60 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-emerald-color font-bold">
            <BookOpen className="w-5 h-5" />
            <h2 className="font-display text-base">Reading / Watching</h2>
          </div>
          <ul className="space-y-3 font-mono text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-cyan font-bold shrink-0">&gt;</span>
              <span>
                Reading: "Designing Data-Intensive Applications" by Martin Kleppmann (re-reading for
                system tuning).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan font-bold shrink-0">&gt;</span>
              <span>Reading: "The Staff Engineer's Path" by Tanya Reilly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan font-bold shrink-0">&gt;</span>
              <span>Watching: MIT 6.824 Distributed Systems lectures online.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="linacre-pulse-line w-full" />

      {/* Footer Timestamp */}
      <motion.div
        variants={itemVariants}
        className="text-center font-mono text-[10px] text-muted-foreground flex items-center justify-center gap-2"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>Last updated: July 16, 2026</span>
      </motion.div>
    </motion.div>
  );
}

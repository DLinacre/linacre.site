import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ExternalLink, Check } from 'lucide-react';
import { ROADMAP_STEPS, LEARNING_RESOURCES } from '../data';

export default function Learn() {
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('linacre_completed_steps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('linacre_completed_steps', JSON.stringify(completedSteps));
    } catch (e) {
      console.error('Failed to save completed steps', e);
    }
  }, [completedSteps]);

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepNum) ? prev.filter(n => n !== stepNum) : [...prev, stepNum],
    );
  };

  const progressPercent = Math.round((completedSteps.length / ROADMAP_STEPS.length) * 100) || 0;

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Title section */}
      <section className="text-center md:text-left space-y-4 max-w-3xl" id="learn-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold">
          Curriculum & Resources
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Learn to build <span className="text-amber-color">from scratch</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          The exact route I followed and recommendations I'd give to any beginner: a curated list of
          top-tier, 100% free learning resources, followed by a roadmap to go from absolute zero to
          shipping full-stack applications.
        </p>
      </section>

      {/* The Timeline Roadmap */}
      <section className="space-y-8" id="roadmap-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color/30 pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-color" />
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              The Roadmap
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-muted/10 border border-border-color/30 rounded-xl px-4 py-2 text-xs font-mono w-full sm:w-[320px]">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold mb-1">
                <span>Progress Log</span>
                <span>
                  {completedSteps.length} / {ROADMAP_STEPS.length} Completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-border-color/20">
                <div
                  className="h-full bg-amber-color transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Steps container */}
        <div
          className="relative pl-8 sm:pl-10 space-y-8 border-l-2 border-border-color"
          id="roadmap-timeline"
        >
          {ROADMAP_STEPS.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.n);
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="relative group space-y-2"
                id={`roadmap-step-${step.n}`}
              >
                {/* Bullet Node */}
                <div className="absolute -left-[45px] sm:-left-[49px] top-0.5 flex items-center justify-center">
                  <button
                    onClick={() => toggleStep(step.n)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer shadow-sm select-none z-10 ${
                      isCompleted
                        ? 'bg-amber-color border-amber-color text-black shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105'
                        : 'bg-background dark:bg-[#030c14] border-border-color text-muted-foreground hover:border-amber-color hover:text-amber-color hover:scale-105'
                    }`}
                    aria-label={`Mark step ${step.n} as ${isCompleted ? 'uncompleted' : 'completed'}`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.n}
                  </button>
                </div>

                {/* Step Content */}
                <div
                  onClick={() => toggleStep(step.n)}
                  className={`bg-muted/10 border p-5 rounded-2xl transition-all cursor-pointer shadow-sm text-left ${
                    isCompleted
                      ? 'border-amber-color/55 bg-amber-color/5 dark:bg-amber-color/5 shadow-[0_0_15px_rgba(34,211,238,0.03)]'
                      : 'border-amber-color/12 dark:bg-[#0B1220]/70 hover:border-amber-color/25 hover:bg-muted/20 dark:hover:bg-[#111827]/95'
                  }`}
                  style={{ transitionDuration: 'var(--linacre-duration-base)' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleStep(step.n);
                    }
                  }}
                >
                  <h3
                    className={`font-mono text-sm font-semibold transition-colors flex items-center gap-2 ${isCompleted ? 'text-amber-color' : 'text-foreground group-hover:text-amber-color'}`}
                  >
                    <span>{step.title}</span>
                    {isCompleted && (
                      <span className="text-[9px] uppercase bg-amber-color/10 px-1.5 py-0.5 rounded font-bold border border-amber-color/20">
                        LOGGED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5 font-sans">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Curated Resources Grid */}
      <section className="space-y-8 pt-6 border-t border-border-color/50" id="resources-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan" />
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Curated Resources
            </h2>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground/60">
            // 100% Free resources only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="resources-grid">
          {LEARNING_RESOURCES.map((res, idx) => (
            <motion.a
              key={idx}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="group flex flex-col justify-between bg-muted/20 dark:bg-[#0B1220]/80 border border-amber-color/12 rounded-2xl p-5 hover:bg-muted/35 dark:hover:bg-[#111827] hover:border-amber-color/30 hover:-translate-y-1 transition-all border-l-[3px] border-l-purple-color text-left"
              style={{
                transitionDuration: 'var(--linacre-duration-base)',
                boxShadow: 'var(--linacre-card-shadow)',
              }}
              id={`resource-card-${res.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-amber-color transition-colors">
                    {res.name}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded text-purple-color bg-purple-color/10">
                    {res.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-sans">
                  {res.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/70 border-t border-border-color/40 pt-3">
                <span>{res.host}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}

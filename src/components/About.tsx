import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Github,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Briefcase,
  Clock,
} from 'lucide-react';

const skillGroups = [
  { title: 'Product Engineering', items: ['React', 'TypeScript', 'Vue 3', 'Vite', 'Canvas 2D'] },
  { title: 'Systems & Backend', items: ['Python', 'FastAPI', 'Node.js / Express', 'Docker', 'GitHub Actions'] },
  { title: 'Mobile & Local-First', items: ['Kotlin', 'Android SDK', 'Capacitor', 'Dexie / IndexedDB', 'Offline-first UX'] },
  { title: 'Operational Discipline', items: ['Health & Safety Compliance', 'Stock Management', 'Customer Communication', 'Time Management'] },
];

const principles = [
  ['Useful Before Impressive', 'A project should solve a real, recognizable problem before adding extra frameworks, dashboards, or AI layers.'],
  ['Claims Must Be Inspectable', 'Live links, public source code, clear data provenance, and honest limitations matter more than inflated metrics.'],
  ['Local-First Architecture', 'Browser storage and offline functionality remove server dependence, lower latency, and protect visitor privacy.'],
];

const careerTimeline = [
  {
    period: 'Oct 2020 — Oct 2024',
    role: 'Garden Centre Assistant',
    company: 'Tudor Rose Nurseries, Barnsley',
    desc: 'Managed daily operations independently (opening & closing), designed pricing signs using Designer 3 software, handled cash and card transactions, managed plant care and delivery stock.'
  },
  {
    period: 'May 2020 — Oct 2020',
    role: 'Kitchen Assistant',
    company: 'Cubley Hall, Sheffield',
    desc: 'Maintained sanitation and safety standards in accordance with health guidelines, managed waste disposal, and operated high-throughput kitchen utility equipment.'
  },
  {
    period: 'Mar 2013 — Jan 2020',
    role: 'Customer Service Representative',
    company: 'Five A Day, Barnsley',
    desc: 'Resolved customer complaints calmly, operated registers with end-of-day accuracy, developed inventory organization systems, and initiated timely product reordering.'
  },
  {
    period: 'Feb 2008 — Mar 2013',
    role: 'Market Stall Assistant',
    company: 'Fresh Today, Barnsley',
    desc: 'Demonstrated early punctuality and time management setting up market stalls, rotated produce for quality control, maintained strict stall hygiene and waste recycling.'
  },
  {
    period: 'Sep 2002 — Aug 2007',
    role: 'Secondary Education',
    company: 'Darton High School, Barnsley',
    desc: 'Completed secondary education in Barnsley, South Yorkshire.'
  }
];

export default function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid gap-8 overflow-hidden rounded-3xl border border-border-color bg-[var(--linacre-panel)] p-6 shadow-[var(--linacre-card-shadow)] sm:p-8 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:p-10">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-10 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border-color bg-background/30 p-3">
            <img src="/profile_avatar.webp" alt="David Linacre" width="520" height="520" className="aspect-square w-full rounded-2xl object-cover" />
            <div className="mt-3 flex items-center justify-between rounded-xl border border-border-color bg-background/40 px-3 py-2 font-mono text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-color"><span className="h-2 w-2 rounded-full bg-emerald-color animate-pulse" /> Self-Taught Software Developer</span>
              <span className="text-muted-foreground">Barnsley, UK</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-color"><ShieldCheck className="h-4 w-4" /> About David Linacre</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl">16 years of real work before the code.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            I am a self-taught software developer based in Barnsley, South Yorkshire. With over 16 years of hands-on experience in customer service, health & safety compliance, and inventory management, I bring a practical, disciplined mindset to software engineering.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            I build software designed for real users: browser games like KushCloud, Android debloat tools like Linacre Uninstaller, and local-first web applications like Apex POS. Everything I ship is open source and open for inspection on GitHub.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://github.com/LIN4CRE" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018] hover:bg-amber-glow"><Github className="h-4 w-4" /> GitHub profile</a>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-border-color bg-muted/20 px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50">Start a conversation <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </motion.div>
      </section>

      {/* Principles */}
      <section className="space-y-5" aria-labelledby="principles-title">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">Working principles</span>
          <h2 id="principles-title" className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">How I decide what is worth building</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map(([title, detail], index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-color/20 bg-amber-color/10 font-mono text-xs font-bold text-amber-color">0{index + 1}</span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Profile JSON & Capabilities */}
      <section className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <div className="rounded-2xl border border-border-color bg-[#020a11] p-5 font-mono shadow-[var(--linacre-card-shadow)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[10px] text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" /><span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" /><span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" /><span className="ml-2">david_linacre.json</span></div>
          <pre className="mt-4 whitespace-pre-wrap text-[11px] leading-6 text-[#9ab7c3]">{`{
  "name": "David Linacre",
  "role": "Self Taught Developer",
  "email": "davidlinacre@hotmail.co.uk",
  "phone": "07391 428996",
  "location": "Barnsley, South Yorkshire, UK",
  "licence": "Driving licence Class B",
  "education": "Darton High School (2002 - 2007)",
  "hobbies": [
    "Learning New Skills",
    "Pool / Snooker",
    "DIY Projects",
    "Computers & Gaming",
    "Gardening",
    "Painting / Drawing"
  ],
  "motto": "Build, verify, improve"
}`}</pre>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-color/20 bg-emerald-color/5 p-3 text-[10px] text-emerald-color"><MapPin className="h-4 w-4" /> Barnsley, South Yorkshire, United Kingdom</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2"><Code2 className="h-5 w-5 text-amber-color" /><h2 className="font-display text-2xl font-bold text-foreground">Skills & Strengths</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <article key={group.title} className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-color">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-amber-color" /> {item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Experience Timeline */}
      <section className="space-y-5" aria-labelledby="timeline-title">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-amber-color" />
          <h2 id="timeline-title" className="font-display text-2xl font-bold text-foreground sm:text-3xl">Employment & Education History</h2>
        </div>
        <div className="grid gap-4">
          {careerTimeline.map((item, index) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-amber-color font-bold flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> {item.period}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">{item.role}</h3>
                <p className="font-mono text-xs text-emerald-color">{item.company}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-3xl">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Support / Open Source CTA */}
      <section className="rounded-2xl border border-border-color bg-muted/10 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl"><span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color"><Sparkles className="h-4 w-4" /> Open source keeps the work honest</span><h2 className="mt-2 font-display text-2xl font-bold text-foreground">Try the applications. Inspect the code.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Every project is built in public with zero hidden tracking or commercial tricks.</p></div>
          <a href="https://paypal.me/DLinacre16" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border-color px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50"><Heart className="h-4 w-4 text-emerald-color" /> Support the work</a>
        </div>
      </section>
    </div>
  );
}

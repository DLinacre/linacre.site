import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Play,
  Code2,
  Layers,
  CheckCircle2,
  Clock,
  ChevronDown,
  Gamepad2,
  Smartphone,
  Tablet,
  Monitor,
  ImageOff,
  Tag,
  Download,
} from 'lucide-react';
import manifest from '../data/slime-factory-tycoon.json';

/**
 * GameShowcase — a detailed, data-driven panel for a flagship game project.
 *
 * Everything rendered here comes from the game's own `game.manifest.json`,
 * which is copied verbatim from the game repository. Nothing is hand-typed
 * into this component, so the site can never drift from the project.
 *
 * Honesty rules enforced structurally:
 *  - `links.roblox` / `links.play` are null until the game is published, and
 *    the Play button renders as a disabled "Not Yet Available" state.
 *  - `screenshots` is empty, so the gallery renders an explicit
 *    "Screenshots coming soon" panel rather than placeholder images.
 *  - `stats.players` / `visits` / `rating` are null and are never displayed.
 *    No fabricated numbers appear anywhere on this page.
 */

type Feature = { title: string; desc: string };
type ChangeEntry = { version: string; date: string; title: string; changes: string[] };
type RoadmapItem = { item: string; status: string };

const DEVICE_ICON: Record<string, typeof Smartphone> = {
  Phone: Smartphone,
  Tablet: Tablet,
  Desktop: Monitor,
};

const TABS = [
  ['features', 'Features'],
  ['systems', 'Systems'],
  ['changelog', 'Changelog'],
  ['roadmap', 'Roadmap'],
] as const;

const STATUS_STYLE: Record<string, string> = {
  'In development': 'bg-amber-color/10 text-amber-color border-amber-color/30',
  Live: 'bg-emerald-500/10 text-emerald-color border-emerald-500/30',
  Planned: 'bg-muted/40 text-muted-foreground border-border-color',
};

export default function GameShowcase() {
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<'features' | 'systems' | 'changelog' | 'roadmap'>('features');
  const [logOpen, setLogOpen] = useState<string | null>(manifest.changelog[0]?.version ?? null);

  const base = '/games/slime-factory-tycoon';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareSourceCode',
        name: manifest.name,
        description: manifest.description,
        codeRepository: manifest.links.github,
        programmingLanguage: {
          '@type': 'ComputerLanguage',
          name: 'Luau',
          url: 'https://luau-lang.org/',
        },
        runtimePlatform: manifest.platform,
        license: 'https://opensource.org/licenses/MIT',
        author: { '@type': 'Person', name: 'David Linacre', url: 'https://www.linacre.site' },
        image: `https://www.linacre.site${base}/banner.webp`,
        isAccessibleForFree: true,
        keywords: manifest.genre.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.linacre.site/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Games',
            item: 'https://www.linacre.site/games',
          },
        ],
      },
    ],
  };
  const hasRoblox = Boolean(manifest.links.roblox);
  const hasShots = manifest.screenshots.length > 0;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-amber-color/20 bg-muted/20 dark:bg-[#0B1220]/80 overflow-hidden shadow-[var(--linacre-card-shadow)]"
      itemScope
      itemType="https://schema.org/VideoGame"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------------------------------------------------- banner */}
      <div className="relative">
        <picture>
          <source srcSet={`${base}/banner.webp`} type="image/webp" />
          <img
            src={`${base}/banner.webp`}
            alt={`${manifest.name} — ${manifest.tagline}`}
            width={1600}
            height={800}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full aspect-[2/1] object-cover"
            itemProp="image"
          />
        </picture>

        <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end">
          <span
            className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md ${STATUS_STYLE[manifest.status] ?? STATUS_STYLE.Planned}`}
          >
            {manifest.status}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/15 bg-black/50 text-white/90 backdrop-blur-md">
            {manifest.platform}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ------------------------------------------------------- heading */}
        <header className="flex items-start gap-4">
          <picture className="shrink-0">
            <source srcSet={`${base}/icon.webp`} type="image/webp" />
            <img
              src={`${base}/icon-256.png`}
              alt={`${manifest.name} icon`}
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="w-16 h-16 rounded-xl border border-amber-color/25"
            />
          </picture>

          <div className="min-w-0 space-y-1">
            <h3
              className="font-display text-2xl font-bold text-foreground leading-tight"
              itemProp="name"
            >
              {manifest.name}
            </h3>
            <p className="font-mono text-xs text-amber-color">{manifest.tagline}</p>
            <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
              <Clock className="w-3 h-3" />
              {manifest.statusDetail}
            </p>
          </div>
        </header>

        <p className="text-sm text-muted-foreground leading-relaxed" itemProp="description">
          {manifest.description}
        </p>

        {/* --------------------------------------------------- genre/device */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex flex-wrap gap-1.5">
            {manifest.genre.map(g => (
              <span
                key={g}
                className="font-mono text-[10px] bg-muted/40 px-2 py-0.5 rounded border border-border-color/50 text-muted-foreground"
                itemProp="genre"
              >
                {g}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            {manifest.devices.map(d => {
              const Icon = DEVICE_ICON[d] ?? Monitor;
              return (
                <span key={d} className="flex items-center gap-1" title={`${d} supported`}>
                  <Icon className="w-3.5 h-3.5 text-emerald-color" />
                  {d}
                </span>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------- code stats */}
        {/* Only verifiable code metrics. No player/visit/rating numbers exist
            for an unpublished game, so none are shown. */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Luau modules', value: manifest.stats.luauModules },
            { label: 'Lines of Luau', value: manifest.stats.linesOfLuau?.toLocaleString() },
            { label: 'Achievements', value: manifest.stats.achievements },
            { label: 'Cosmetics', value: manifest.stats.cosmetics },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl border border-border-color/60 bg-muted/25 px-3 py-2.5"
            >
              <div className="font-display text-lg font-bold text-amber-color leading-none">
                {s.value ?? '—'}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------ gallery */}
        <section aria-label="Screenshots">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            Screenshots
          </h4>
          {hasShots ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {manifest.screenshots.map((src: string, i: number) => (
                <img
                  key={src}
                  src={src}
                  alt={`${manifest.name} screenshot ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="rounded-lg border border-border-color/60 w-full aspect-video object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border-color bg-muted/15 py-7 grid place-items-center text-center gap-1.5">
              <ImageOff className="w-5 h-5 text-muted-foreground" />
              <p className="font-mono text-xs text-muted-foreground">Screenshots — Coming Soon</p>
              <p className="font-mono text-[10px] text-muted-foreground/70">
                Captured once the art pass is complete
              </p>
            </div>
          )}
        </section>

        {/* --------------------------------------------------------- tabs */}
        <div
          role="tablist"
          aria-label="Project details"
          className="border-b border-border-color/60 flex flex-wrap gap-1"
          onKeyDown={e => {
            // ARIA authoring practice: arrow keys move between tabs.
            const i = TABS.findIndex(([id]) => id === tab);
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
              setTab(TABS[next][0]);
              document.getElementById(`sft-tab-${TABS[next][0]}`)?.focus();
            }
          }}
        >
          {TABS.map(([id, label]) => (
            <button
              key={id}
              id={`sft-tab-${id}`}
              onClick={() => setTab(id)}
              role="tab"
              aria-selected={tab === id}
              aria-controls={`sft-panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              className={`px-3 py-2 min-h-[44px] font-mono text-xs rounded-t-lg border-b-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-color ${
                tab === id
                  ? 'border-amber-color text-amber-color font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            role="tabpanel"
            id={`sft-panel-${tab}`}
            aria-labelledby={`sft-tab-${tab}`}
            tabIndex={0}
          >
            {tab === 'features' && (
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {(manifest.features as Feature[]).map(f => (
                  <li
                    key={f.title}
                    className="rounded-xl border border-border-color/60 bg-muted/20 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-color shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{f.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'systems' && (
              <div className="flex flex-wrap gap-1.5">
                {manifest.systems.map((s: string) => (
                  <span
                    key={s}
                    className="font-mono text-[11px] bg-muted/40 px-2.5 py-1 rounded-lg border border-border-color/50 text-muted-foreground flex items-center gap-1.5"
                  >
                    <Layers className="w-3 h-3 text-amber-color" />
                    {s}
                  </span>
                ))}
              </div>
            )}

            {tab === 'changelog' && (
              <div className="space-y-2">
                {(manifest.changelog as ChangeEntry[]).map(entry => {
                  const open = logOpen === entry.version;
                  return (
                    <div
                      key={entry.version}
                      className="rounded-xl border border-border-color/60 bg-muted/20 overflow-hidden"
                    >
                      <button
                        onClick={() => setLogOpen(open ? null : entry.version)}
                        aria-expanded={open}
                        aria-controls={`sft-log-${entry.version}`}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 min-h-[44px] text-left cursor-pointer hover:bg-muted/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset--2 focus-visible:outline-amber-color"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-color/15 text-amber-color border border-amber-color/25 shrink-0">
                            v{entry.version}
                          </span>
                          <span className="text-xs font-bold text-foreground truncate">
                            {entry.title}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          <time
                            className="font-mono text-[10px] text-muted-foreground"
                            dateTime={entry.date}
                          >
                            {entry.date}
                          </time>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </button>
                      {open && (
                        <ul
                          id={`sft-log-${entry.version}`}
                          className="px-3 pb-3 pt-0 space-y-1.5 border-t border-border-color/40"
                        >
                          {entry.changes.map((c, i) => (
                            <li
                              key={i}
                              className="text-[11px] text-muted-foreground leading-relaxed flex gap-2 pt-1.5"
                            >
                              <span className="text-amber-color shrink-0">›</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'roadmap' && (
              <ul className="space-y-2">
                {(manifest.roadmap as RoadmapItem[]).map(r => (
                  <li
                    key={r.item}
                    className="flex items-center gap-2.5 rounded-xl border border-border-color/60 bg-muted/20 px-3 py-2.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-foreground flex-1">{r.item}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded border border-border-color/60">
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>

        {/* --------------------------------------------------------- links */}
        <footer className="pt-4 border-t border-border-color/50 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            {manifest.engine} · {manifest.license} licence
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={manifest.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 min-h-[36px] rounded-lg border border-border-color hover:border-amber-color/40 text-foreground text-xs font-mono font-bold hover:bg-muted/40 transition-all flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>

            {manifest.links.release && (
              <a
                href={manifest.links.release}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 min-h-[36px] rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-color text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download v{manifest.version}</span>
              </a>
            )}

            {manifest.links.play && (
              <a
                href={manifest.links.play}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 min-h-[36px] rounded-lg bg-amber-color text-[#030c14] font-mono text-xs font-bold hover:bg-amber-glow transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Web Demo</span>
              </a>
            )}

            {hasRoblox ? (
              <a
                href={manifest.links.roblox!}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-amber-color text-[#030c14] font-mono text-xs font-bold hover:bg-amber-glow transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play on Roblox</span>
              </a>
            ) : !manifest.links.play ? (
              <span
                aria-disabled="true"
                title="This game has not been published to Roblox yet"
                className="px-3 py-1.5 rounded-lg border border-dashed border-border-color text-muted-foreground font-mono text-xs font-bold flex items-center gap-1.5 cursor-not-allowed select-none"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Play — Not Yet Available</span>
              </span>
            ) : null}
          </div>
        </footer>
      </div>
    </motion.article>
  );
}

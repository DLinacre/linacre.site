import {
  ArrowUpRight,
  Clapperboard,
  Cpu,
  Gamepad2,
  Globe2,
  Orbit,
  Sparkles,
} from 'lucide-react';
import Card3DTilt from './Card3DTilt';

interface ExperienceShowcaseProps {
  navigate: (tab: string) => void;
}

interface DestinationItem {
  id: string;
  tab: string;
  title: string;
  kicker: string;
  metric: string;
  description: string;
  accent: string;
  icon: typeof Gamepad2;
  artworkType: 'games' | 'cinema' | 'osint' | 'orbit' | 'lab' | 'identity';
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest-games',
    tab: 'games',
    title: 'Tabulous Games Vault',
    kicker: 'GAME DIRECTORY',
    metric: 'Browser game links',
    description:
      'Browse a directory of browser games and external hosts. Availability and requirements vary by game.',
    accent: '#38bdf8',
    icon: Gamepad2,
    artworkType: 'games',
  },
  {
    id: 'dest-cinema',
    tab: 'music-videos',
    title: 'Proper Mad Cinema',
    kicker: 'MASTER COLLECTION',
    metric: '10 Lyric-Video Masters',
    description:
      'Original full-length music videos with synchronised time-coded lyrics, custom cover art and studio EQ profiles.',
    accent: '#f472b6',
    icon: Clapperboard,
    artworkType: 'cinema',
  },
  {
    id: 'dest-osint',
    tab: 'osint',
    title: 'OSINT Intelligence HUD',
    kicker: 'RECON DIRECTORY',
    metric: '1,310 Research Nodes',
    description:
      'Search and bookmark 1,310 public intelligence resources across 11 operational sectors and 77 specialist categories.',
    accent: '#34d399',
    icon: Globe2,
    artworkType: 'osint',
  },
  {
    id: 'dest-orbit',
    tab: 'orbit',
    title: 'Orbit & Earth Observatory',
    kicker: 'PLANETARY TELEMETRY',
    metric: 'Live ISS · Seismic · Launches',
    description:
      'Real-time International Space Station ground track, interactive 3D globe, solar terminator, M4.5+ earthquakes and rocket countdowns.',
    accent: '#8fd6ff',
    icon: Orbit,
    artworkType: 'orbit',
  },
  {
    id: 'dest-lab',
    tab: 'lab',
    title: 'AI Lab & Model Workbench',
    kicker: 'NEURAL SANDBOX',
    metric: 'Multi-Model Terminal',
    description:
      'Interactive AI engineering terminal, prompt benchmarking suite, and structured output inspector in the browser.',
    accent: '#c084fc',
    icon: Cpu,
    artworkType: 'lab',
  },
  {
    id: 'dest-identity',
    tab: 'identity',
    title: '3D Identity Studio',
    kicker: 'PROCEDURAL DESIGN',
    metric: 'SVG & 4K Export',
    description:
      'Generate custom geometric emblems, holographic social banners, and coordinated colour systems ready for instant export.',
    accent: '#fbbf24',
    icon: Sparkles,
    artworkType: 'identity',
  },
];

function DestinationArtwork({ type }: { type: DestinationItem['artworkType'] }) {
  switch (type) {
    case 'games':
      return (
        <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="artGamesBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#071526" />
              <stop offset="55%" stopColor="#0c2340" />
              <stop offset="100%" stopColor="#050b14" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#artGamesBg)" />
          {/* Perspective synthwave horizon grid */}
          <g stroke="rgba(56,189,248,0.22)" strokeWidth="0.7">
            <line x1="0" y1="74" x2="320" y2="74" />
            <line x1="0" y1="88" x2="320" y2="88" />
            <line x1="0" y1="104" x2="320" y2="104" />
            <line x1="160" y1="60" x2="20" y2="120" />
            <line x1="160" y1="60" x2="90" y2="120" />
            <line x1="160" y1="60" x2="160" y2="120" />
            <line x1="160" y1="60" x2="230" y2="120" />
            <line x1="160" y1="60" x2="300" y2="120" />
          </g>
          {/* Wireframe 3D polyhedron */}
          <polygon
            points="160,16 196,38 182,74 138,74 124,38"
            fill="rgba(56,189,248,0.14)"
            stroke="#38bdf8"
            strokeWidth="1.4"
          />
          <path
            d="M124,38 L160,48 L196,38 M160,16 L160,48 L182,74 M160,48 L138,74"
            fill="none"
            stroke="#8fd6ff"
            strokeWidth="0.9"
          />
          <circle cx="72" cy="40" r="14" fill="none" stroke="rgba(192,132,252,0.45)" strokeWidth="1.2" />
          <circle cx="248" cy="36" r="10" fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="1" />
        </svg>
      );

    case 'cinema':
      return (
        <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="artCinemaBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1f091d" />
              <stop offset="50%" stopColor="#120c24" />
              <stop offset="100%" stopColor="#070810" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#artCinemaBg)" />
          {/* Acoustic spectrum bars */}
          {[
            22, 38, 54, 30, 68, 84, 52, 92, 64, 40, 76, 88, 48, 62, 34, 72, 56, 30, 44, 24,
          ].map((h, i) => (
            <rect
              key={i}
              x={34 + i * 13}
              y={102 - h * 0.72}
              width="7"
              height={h * 0.72}
              rx="3"
              fill={i % 2 === 0 ? '#f472b6' : '#8fd6ff'}
              opacity={0.35 + (i % 4) * 0.14}
            />
          ))}
          <circle cx="160" cy="54" r="24" fill="rgba(7,8,16,0.78)" stroke="#f472b6" strokeWidth="1.4" />
          <polygon points="154,44 172,54 154,64" fill="#fbcfe8" />
        </svg>
      );

    case 'osint':
      return (
        <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="artOsintBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#041c18" />
              <stop offset="55%" stopColor="#071722" />
              <stop offset="100%" stopColor="#05080f" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#artOsintBg)" />
          {/* Radar sweep & network graph */}
          <circle cx="160" cy="60" r="46" fill="none" stroke="rgba(52,211,153,0.28)" strokeWidth="1" />
          <circle
            cx="160"
            cy="60"
            r="30"
            fill="none"
            stroke="rgba(52,211,153,0.4)"
            strokeWidth="0.9"
            strokeDasharray="4 3"
          />
          <path d="M160,60 L198,34 A46,46 0 0,1 206,60 Z" fill="rgba(52,211,153,0.22)" />
          <g stroke="rgba(143,214,255,0.35)" strokeWidth="0.9">
            <line x1="74" y1="34" x2="134" y2="48" />
            <line x1="134" y1="48" x2="160" y2="60" />
            <line x1="160" y1="60" x2="236" y2="38" />
            <line x1="160" y1="60" x2="246" y2="84" />
            <line x1="86" y1="86" x2="160" y2="60" />
          </g>
          {[
            [74, 34],
            [134, 48],
            [160, 60],
            [236, 38],
            [246, 84],
            [86, 86],
          ].map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={idx === 2 ? 4 : 2.8}
              fill={idx === 2 ? '#34d399' : '#8fd6ff'}
            />
          ))}
        </svg>
      );

    case 'orbit':
      return (
        <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="artOrbitBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#061224" />
              <stop offset="55%" stopColor="#091d36" />
              <stop offset="100%" stopColor="#04070f" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#artOrbitBg)" />
          {/* Globe & inclined orbital track */}
          <circle cx="160" cy="60" r="36" fill="#0d233d" stroke="#38bdf8" strokeWidth="1.2" />
          <ellipse
            cx="160"
            cy="60"
            rx="18"
            ry="36"
            fill="none"
            stroke="rgba(143,214,255,0.25)"
            strokeWidth="0.8"
          />
          <line x1="124" y1="60" x2="196" y2="60" stroke="rgba(143,214,255,0.25)" strokeWidth="0.8" />
          <ellipse
            cx="160"
            cy="60"
            rx="78"
            ry="22"
            transform="rotate(-18 160 60)"
            fill="none"
            stroke="#8fd6ff"
            strokeWidth="1.3"
            strokeDasharray="5 3"
          />
          <circle cx="226" cy="40" r="4.2" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="96" cy="78" r="2.6" fill="#fbbf24" />
        </svg>
      );

    case 'lab':
      return (
        <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="artLabBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#160c29" />
              <stop offset="55%" stopColor="#0d1326" />
              <stop offset="100%" stopColor="#06070d" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#artLabBg)" />
          {/* Neural tensor layers */}
          {[70, 160, 250].map((x, layer) =>
            [30, 60, 90].map((y, row) => (
              <g key={`${layer}-${row}`}>
                {layer < 2 &&
                  [30, 60, 90].map((ny, nrow) => (
                    <line
                      key={`l-${nrow}`}
                      x1={x}
                      y1={y}
                      x2={x + 90}
                      y2={ny}
                      stroke="rgba(192,132,252,0.22)"
                      strokeWidth="0.9"
                    />
                  ))}
                <circle
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill={layer === 1 ? '#c084fc' : '#8fd6ff'}
                  stroke="#0b0d14"
                  strokeWidth="1.2"
                />
              </g>
            )),
          )}
        </svg>
      );

    case 'identity':
      return (
        <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="artIdBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1f1608" />
              <stop offset="55%" stopColor="#121420" />
              <stop offset="100%" stopColor="#07080c" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#artIdBg)" />
          <polygon
            points="160,18 198,40 198,80 160,102 122,80 122,40"
            fill="rgba(251,191,36,0.12)"
            stroke="#fbbf24"
            strokeWidth="1.3"
          />
          <polygon
            points="160,30 186,45 186,75 160,90 134,75 134,45"
            fill="none"
            stroke="#8fd6ff"
            strokeWidth="1"
          />
          <circle cx="160" cy="60" r="8" fill="#fbbf24" />
        </svg>
      );
  }
}

export default function ExperienceShowcase({ navigate }: ExperienceShowcaseProps) {
  return (
    <section aria-labelledby="destinations-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#8fd6ff]">
            INTERACTIVE COMMAND DECK
          </p>
          <h2
            id="destinations-heading"
            className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5"
          >
            Built-in Studios, Hubs &amp; Live Observatories
          </h2>
        </div>
        <p className="text-xs text-[#9aa3b2]">
          Six self-contained applications running natively inside linacre.site
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map(item => {
          const Icon = item.icon;
          const href = item.tab === 'games' ? '/games' : `/${item.tab}`;
          return (
            <Card3DTilt key={item.id} className="flex flex-col h-full">
              <a
                href={href}
                onClick={e => {
                  if (item.tab === 'games') return;
                  e.preventDefault();
                  navigate(item.tab);
                }}
                className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c0f17] transition-all duration-200 hover:border-[#8fd6ff]/50 hover:shadow-[0_14px_38px_rgba(0,0,0,0.55)]"
              >
                {/* Bespoke Procedural Vector Banner */}
                <div className="relative h-28 w-full overflow-hidden border-b border-white/[0.07]">
                  <DestinationArtwork type={item.artworkType} />
                  <div className="absolute inset-x-3 top-2.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      <Icon
                        className="h-3 w-3"
                        style={{ color: item.accent }}
                        aria-hidden="true"
                      />
                      <span>{item.kicker}</span>
                    </span>
                    <span
                      className="rounded-full border border-white/10 bg-black/75 px-2.5 py-0.5 font-mono text-[10px] font-semibold backdrop-blur-md"
                      style={{ color: item.accent }}
                    >
                      {item.metric}
                    </span>
                  </div>
                </div>

                {/* Copy */}
                <div className="flex flex-1 flex-col justify-between p-4 gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-white group-hover:text-[#8fd6ff] transition-colors flex items-center justify-between gap-2">
                      <span>{item.title}</span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-[#9aa3b2] group-hover:text-[#8fd6ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#9aa3b2]">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono text-[11px] text-[#9aa3b2]">
                    <span>Route: {href}</span>
                    <span className="font-semibold text-[#8fd6ff] group-hover:underline">
                      Launch experience →
                    </span>
                  </div>
                </div>
              </a>
            </Card3DTilt>
          );
        })}
      </div>
    </section>
  );
}

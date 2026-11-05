import { useState, useRef, MouseEvent } from 'react';

interface Emblem3DProps {
  mode?: 'hero' | 'mini';
  className?: string;
  onNavigateHome?: () => void;
}

/**
 * Emblem3D — LIN4CRE Architectural Brand Monolith.
 *
 * Designed to be memorable, small, sophisticated, simple, stand out, and smart.
 * Precision-engineered with hairline vector geometry, obsidian facets,
 * laser-cut electric cyan accents, and subtle gyroscopic mouse tilt.
 */
export default function Emblem3D({
  mode = 'hero',
  className = '',
  onNavigateHome,
}: Emblem3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isEngaged, setIsEngaged] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (mode === 'mini') return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Sophisticated micro-tilt (-10 to +10 degrees max)
    const tiltX = -(y / (rect.height / 2)) * 10;
    const tiltY = (x / (rect.width / 2)) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleInteract = () => {
    setIsEngaged(true);
    setTimeout(() => setIsEngaged(false), 1600);
  };

  // Mini Brand Mark (Topbar / Header, 32px)
  if (mode === 'mini') {
    return (
      <button
        type="button"
        onClick={onNavigateHome}
        className={`group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0b0e14] transition-all duration-300 hover:border-[#8fd6ff]/60 hover:shadow-[0_0_12px_rgba(143,214,255,0.25)] cursor-pointer ${className}`}
        title="LIN4CRE // Home"
        aria-label="LIN4CRE Brand Home"
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5 transition-transform duration-300 group-hover:scale-105">
          <defs>
            <linearGradient id="mini-monolith-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#8fd6ff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Micro Reticle Ring */}
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="rgba(143, 214, 255, 0.35)"
            strokeWidth="0.8"
            strokeDasharray="14 8 2 8"
            className="origin-center"
            style={{ animation: 'spin 20s linear infinite' }}
          />

          {/* Center Monolith */}
          <polygon points="16,6 23,10 23,20 16,24 9,20 9,10" fill="#07080b" stroke="url(#mini-monolith-top)" strokeWidth="1" />
          <path d="M14 11 L14 18 L18.5 18" fill="none" stroke="#8fd6ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  }

  // Hero Brand Mark (Small, Sophisticated, Geometric Centerpiece, ~180px)
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleInteract}
      className={`relative mx-auto flex h-[180px] w-[180px] sm:h-[210px] sm:w-[210px] items-center justify-center select-none cursor-pointer ${className}`}
      style={{ perspective: '900px' }}
      title="LIN4CRE Architectural Core — Click to cycle status"
    >
      <div
        className="relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle, restrained ambient aura */}
        <div
          className={`absolute inset-4 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            isEngaged ? 'bg-[#8fd6ff]/30 scale-110' : 'bg-[#8fd6ff]/10 group-hover:bg-[#8fd6ff]/20'
          }`}
        />

        <svg viewBox="0 0 160 160" className="relative h-full w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          <defs>
            <linearGradient id="brand-hairline" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#8fd6ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="face-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="face-left" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#070c14" />
            </linearGradient>

            <linearGradient id="face-right" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#131d2e" />
              <stop offset="100%" stopColor="#090f19" />
            </linearGradient>

            <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Precision Celestial Compass Ring (Single, Minimal, Elegant) */}
          <g className="origin-center" style={{ animation: `spin ${isEngaged ? 8 : 36}s linear infinite` }}>
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.75"
            />
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="url(#brand-hairline)"
              strokeWidth="1.2"
              strokeDasharray="24 48 8 24 2 24"
            />
            {/* Cardinal Micro Coordinates */}
            <circle cx="80" cy="8" r="1.75" fill="#8fd6ff" />
            <circle cx="152" cy="80" r="1.75" fill="#8fd6ff" />
            <circle cx="80" cy="152" r="1.75" fill="#8fd6ff" />
            <circle cx="8" cy="80" r="1.75" fill="#8fd6ff" />
          </g>

          {/* Secondary Counter-Reticle (Hairline Dashes) */}
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="rgba(143, 214, 255, 0.2)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            className="origin-center"
            style={{ animation: 'spin 24s linear infinite reverse' }}
          />

          {/* The Geometric Monolith */}
          <g className="origin-center">
            {/* Top Lit Facet */}
            <polygon
              points="80,48 106,62 80,76 54,62"
              fill="url(#face-top)"
              stroke="url(#brand-hairline)"
              strokeWidth="1"
            />
            {/* Left Dark Obsidian Facet */}
            <polygon
              points="54,62 80,76 80,108 54,94"
              fill="url(#face-left)"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.75"
            />
            {/* Right Reflective Titanium Facet */}
            <polygon
              points="106,62 80,76 80,108 106,94"
              fill="url(#face-right)"
              stroke="rgba(143, 214, 255, 0.3)"
              strokeWidth="0.75"
            />

            {/* Precision Laser-Etched "L" Monogram */}
            <g
              stroke="#8fd6ff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#laser-glow)"
            >
              <path d="M74 72 L74 90 L86 90" />
            </g>

            {/* Micro Coordinates: Barnsley, South Yorkshire (53.55° N, 1.48° W) */}
            <text
              x="80"
              y="126"
              textAnchor="middle"
              fill="rgba(143, 214, 255, 0.6)"
              fontSize="6"
              fontFamily="monospace"
              letterSpacing="0.18em"
            >
              53.55°N · 1.48°W
            </text>
          </g>
        </svg>

        {/* Sophisticated status pill */}
        <div className="absolute -bottom-1 flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#07080b]/90 px-2.5 py-0.5 font-mono text-[9px] text-[#8fd6ff] backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-[#8fd6ff] animate-pulse" />
          <span className="tracking-widest">LIN4CRE · STUDIO</span>
        </div>
      </div>
    </div>
  );
}

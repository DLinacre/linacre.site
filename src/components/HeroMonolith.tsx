import { useState, type PointerEvent } from 'react';

/**
 * Interactive 3D Holographic Monolith & Planetary Astrolabe for the homepage hero.
 * Preserves thesix preserve-3d cube faces (.hero-art and .hero-art__cube) and
 * aria-hidden="true" while adding pointer-reactive 3D perspective, an intricate
 * SVG astrolabe & radar reticle, volumetric inner core, and live studio telemetry nodes.
 */
export default function HeroMonolith() {
  const [tilt, setTilt] = useState<{ rx: number; ry: number; gx: number; gy: number }>({
    rx: 0,
    ry: 0,
    gx: 50,
    gy: 50,
  });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - ny) * 22,
      ry: (nx - 0.5) * 28,
      gx: Math.round(nx * 100),
      gy: Math.round(ny * 100),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <div
      className="hero-art"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        ['--pointer-x' as string]: `${tilt.gx}%`,
        ['--pointer-y' as string]: `${tilt.gy}%`,
      }}
    >
      <div className="hero-art__grid" />
      <div className="hero-art__glow" />

      {/* Precision SVG Planetary Astrolabe & Telemetry Reticle */}
      <svg
        className="hero-art__astrolabe"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="heroCorePulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8fd6ff" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#07080b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="heroRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8fd6ff" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="200" r="175" fill="url(#heroCorePulse)" />
        <circle
          cx="200"
          cy="200"
          r="168"
          stroke="url(#heroRingGrad)"
          strokeWidth="0.8"
          strokeDasharray="3 6"
          opacity="0.65"
        />
        <circle
          cx="200"
          cy="200"
          r="142"
          stroke="rgba(143, 214, 255, 0.22)"
          strokeWidth="1"
        />
        <circle
          cx="200"
          cy="200"
          r="112"
          stroke="rgba(52, 211, 153, 0.2)"
          strokeWidth="0.8"
          strokeDasharray="12 8 2 8"
        />

        {/* Cardinal & Diagonal Telemetry Ticks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 200 + Math.cos(rad) * 136;
          const y1 = 200 + Math.sin(rad) * 136;
          const x2 = 200 + Math.cos(rad) * 148;
          const y2 = 200 + Math.sin(rad) * 148;
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(143, 214, 255, 0.42)"
              strokeWidth={deg % 90 === 0 ? '1.6' : '0.8'}
            />
          );
        })}

        {/* Horizon Crosshairs */}
        <line x1="24" y1="200" x2="82" y2="200" stroke="rgba(143,214,255,0.25)" strokeWidth="0.8" />
        <line
          x1="318"
          y1="200"
          x2="376"
          y2="200"
          stroke="rgba(143,214,255,0.25)"
          strokeWidth="0.8"
        />
        <line x1="200" y1="24" x2="200" y2="82" stroke="rgba(143,214,255,0.25)" strokeWidth="0.8" />
        <line
          x1="200"
          y1="318"
          x2="200"
          y2="376"
          stroke="rgba(143,214,255,0.25)"
          strokeWidth="0.8"
        />
      </svg>

      <div className="hero-art__orbit hero-art__orbit--outer">
        <span />
      </div>
      <div className="hero-art__orbit hero-art__orbit--inner">
        <span />
      </div>

      {/* 3D Monolith Cube Stage with Pointer-Reactive Offset */}
      <div
        className="hero-art__cube-stage"
        style={{
          transform: `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
        }}
      >
        <div className="hero-art__cube">
          <div className="hero-art__core" />
          <div className="hero-art__face hero-art__face--front">
            <span className="hero-art__mark">L</span>
            <span className="hero-art__face-caption">LIN4CRE / 001</span>
            <span className="hero-art__face-rule" />
          </div>
          <div className="hero-art__face hero-art__face--back">
            <span className="hero-art__face-index">INDEPENDENT BY DESIGN</span>
            <span className="hero-art__back-mark">L / 4</span>
            <span className="hero-art__face-index">MADE IN THE NORTH · UK</span>
          </div>
          <div className="hero-art__face hero-art__face--right">
            <span className="hero-art__face-index">SYSTEMS</span>
            <span className="hero-art__side-mark">//</span>
            <span className="hero-art__face-index">SOFTWARE</span>
          </div>
          <div className="hero-art__face hero-art__face--left">
            <span className="hero-art__face-index">BUILD / TEST / SHIP</span>
            <span className="hero-art__face-rule" />
            <span className="hero-art__face-index">LIN4CRE</span>
          </div>
          <div className="hero-art__face hero-art__face--top">
            <span className="hero-art__top-mark">L</span>
          </div>
          <div className="hero-art__face hero-art__face--bottom">
            <span className="hero-art__bottom-mark">LIN4CRE</span>
          </div>
        </div>
      </div>

      {/* Floating Holographic Telemetry Chips */}
      <div className="hero-art__chip hero-art__chip--nw">
        <span className="hero-art__chip-dot hero-art__chip-dot--cyan" />
        <span>BROWSER GAMES</span>
      </div>
      <div className="hero-art__chip hero-art__chip--ne">
        <span className="hero-art__chip-dot hero-art__chip-dot--emerald" />
        <span>RESEARCH TOOLS</span>
      </div>
      <div className="hero-art__chip hero-art__chip--sw">
        <span className="hero-art__chip-dot hero-art__chip-dot--purple" />
        <span>MUSIC VIDEOS</span>
      </div>
      <div className="hero-art__chip hero-art__chip--se">
        <span className="hero-art__chip-dot hero-art__chip-dot--amber" />
        <span>EARTH OBSERVATORY</span>
      </div>

      <div className="hero-art__label hero-art__label--top">
        <span>FIELD NOTES / 01</span>
        <span>DESIGN · BUILD · REFINE</span>
      </div>
      <div className="hero-art__label hero-art__label--bottom">
        <span className="hero-art__live-dot" />
        <span>INDEPENDENT DIGITAL STUDIO</span>
        <span className="hero-art__label-coordinate">53° 33′ N · 1° 28′ W</span>
      </div>
      <span className="hero-art__cross hero-art__cross--one" />
      <span className="hero-art__cross hero-art__cross--two" />
    </div>
  );
}

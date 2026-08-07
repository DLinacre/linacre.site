/**
 * Logo3D — the linacre.site brand mark.
 *
 * An isometric cube emblem (cyan extrusion, dark faces, glowing "L") beside a
 * clean 3D wordmark: gradient text with a layered "extrusion" built from
 * chained drop-shadows and a subtle perspective tilt. Renders in dark and
 * light theme via CSS variables (see .logo3d-* in index.css).
 */
interface Logo3DProps {
  onNavigate?: (tab: string) => void;
  /** Render size of the emblem in px (default 28). */
  size?: number;
}

export default function Logo3D({ onNavigate, size = 28 }: Logo3DProps) {
  return (
    <a
      href="/"
      onClick={e => {
        e.preventDefault();
        onNavigate?.('home');
      }}
      className="logo3d group flex shrink-0 items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-cyan/50 rounded-lg p-1"
      aria-label="Linacre site — home"
      id="nav-logo"
    >
      {/* Emblem: isometric cube with an "L" cut into the lit top face */}
      <span
        className="logo3d-emblem relative inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none">
          <defs>
            <linearGradient id="lg3d-top" x1="4" y1="3" x2="28" y2="17" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="45%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="lg3d-left" x1="4" y1="10" x2="16" y2="29" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0e2a3a" />
              <stop offset="100%" stopColor="#071b28" />
            </linearGradient>
            <linearGradient id="lg3d-right" x1="28" y1="10" x2="16" y2="29" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#11536b" />
              <stop offset="100%" stopColor="#0a2c3e" />
            </linearGradient>
          </defs>

          {/* left face */}
          <polygon points="4,10 16,17 16,29 4,22" fill="url(#lg3d-left)" />
          {/* right face */}
          <polygon points="28,10 16,17 16,29 28,22" fill="url(#lg3d-right)" />
          {/* top face */}
          <polygon points="16,3 28,10 16,17 4,10" fill="url(#lg3d-top)" />

          {/* "L" monogram cut into the top face */}
          <g stroke="#04121c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.2 7.2 L11.2 12.4" />
            <path d="M11.2 12.4 L16.8 12.4" />
          </g>

          {/* subtle top highlight */}
          <polygon points="16,3 28,10 24,8.4 16,5.4" fill="#ffffff" opacity="0.28" />
        </svg>
        <span className="logo3d-emblem-glow absolute -inset-1.5 rounded-full blur-md bg-cyan/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </span>

      {/* Wordmark with 3D extrusion */}
      <span className="logo3d-word">
        <span className="logo3d-word-main">Linacre</span>
        <span className="logo3d-word-dot">.site</span>
      </span>
    </a>
  );
}

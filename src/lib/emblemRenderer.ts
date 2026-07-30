import { getGenerativeEmblemContents, isGenFrame } from './emblemLab';

export interface CustomEmblem {
  id: string;
  name: string;
  type: 'svg' | 'image';
  content: string;
}

export function getEmblemSVG(
  frame: string,
  p: string,
  s: string,
  activeMotion: string,
  activePulseSpeed: string,
  glowIntensity: number,
  customEmblems: CustomEmblem[],
): string {
  const shadowSize = glowIntensity * 4;

  let styleBlock = '';
  const speedSeconds =
    activePulseSpeed === 'fast' ? '1.0s' : activePulseSpeed === 'breathe' ? '5.0s' : '2.5s';
  const reducedMotionStyle = `
      @media (prefers-reduced-motion: reduce) {
        .g-rotate-cw, .g-rotate-ccw, .scanline-bar, .char-layer, .glowing-eye, .d-pulse-path, .spin-logo-g {
          animation: none !important;
          transform: none !important;
        }
      }`;

  if (frame === 'streetwear') {
    styleBlock = `
    <style>
      @keyframes rotateCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes rotateCCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
      @keyframes scanline {
        0% { transform: translateY(-36px); }
        100% { transform: translateY(36px); }
      }
      @keyframes characterMorph {
        0%, 28% { opacity: 1; transform: translate(0, 0) scale(1); }
        33%, 95% { opacity: 0; transform: translate(0, 2px) scale(0.92); }
        100% { opacity: 1; transform: translate(0, 0) scale(1); }
      }
      @keyframes eyeGlow {
        0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 1px #00F0FF); }
        50% { opacity: 1; filter: drop-shadow(0 0 4px #00F0FF); }
      }
      .g-rotate-cw {
        transform-origin: 50px 50px;
        animation: rotateCW 25s linear infinite;
      }
      .g-rotate-ccw {
        transform-origin: 50px 50px;
        animation: rotateCCW 20s linear infinite;
      }
      .scanline-bar {
        animation: scanline 4s linear infinite;
      }
      .char-layer {
        transform-origin: 50px 50px;
        animation: characterMorph 15s ease-in-out infinite;
      }
      .char-ape {
        animation-delay: 0s;
      }
      .char-skull {
        animation-delay: 5s;
      }
      .char-cat {
        animation-delay: 10s;
      }
      .glowing-eye {
        animation: eyeGlow 2s ease-in-out infinite;
      }
      ${reducedMotionStyle}
    </style>`;
  } else if (activeMotion === 'pulse') {
    styleBlock = `
    <style>
      @keyframes dPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.95; }
      }
      .d-pulse-path {
        animation: dPulse ${speedSeconds} ease-in-out infinite;
      }
      ${reducedMotionStyle}
    </style>`;
  } else if (activeMotion === 'spin') {
    styleBlock = `
    <style>
      @keyframes spinLogo {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin-logo-g {
        transform-origin: 50px 50px;
        animation: spinLogo 8s linear infinite;
      }
      ${reducedMotionStyle}
    </style>`;
  }

  let emblemContents = '';
  if (frame === 'dl-mushroom') {
    emblemContents = `
  <!-- Cyber Mushroom Emblem -->
  <circle cx="50" cy="50" r="45" fill="none" stroke="${p}" stroke-width="2" filter="url(#glow)" opacity="0.3" />
  <!-- Mushroom Stem -->
  <path d="M 42,48 C 41,68 43,82 50,82 C 57,82 59,68 58,48 Z" fill="url(#brandGrad)" opacity="0.9" stroke="${p}" stroke-width="1.5" />
  <!-- Stem Gill Shading -->
  <path d="M 45,52 Q 50,55 55,52 M 46,58 Q 50,61 54,58 M 47,64 Q 50,67 53,64" fill="none" stroke="${s}" stroke-width="1" opacity="0.6" />
  <!-- Mushroom Cap -->
  <path d="M 16,48 C 16,18 84,18 84,48 C 84,52 74,52 66,48 C 58,44 42,44 34,48 C 26,52 16,52 16,48 Z" fill="url(#brandGrad)" filter="url(#glow)" stroke="${p}" stroke-width="2" />
  <!-- Cap Spots -->
  <circle cx="34" cy="30" r="5" fill="#ffffff" opacity="0.9" />
  <circle cx="50" cy="24" r="6" fill="#ffffff" opacity="0.9" />
  <circle cx="66" cy="30" r="5" fill="#ffffff" opacity="0.9" />
  <circle cx="26" cy="40" r="3.5" fill="#ffffff" opacity="0.8" />
  <circle cx="74" cy="40" r="3.5" fill="#ffffff" opacity="0.8" />
  <circle cx="48" cy="38" r="4" fill="#ffffff" opacity="0.85" />`;
  } else if (frame === 'hexagon') {
    emblemContents = `
  <!-- Pipeline Nexus Hexagon -->
  <polygon points="50,3 91,25 91,75 50,97 9,75 9,25" fill="none" stroke="${p}" stroke-width="3" stroke-linejoin="round" filter="url(#glow)" />
  <polygon points="50,8 87,28 87,72 50,92 13,72 13,28" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="6 4" opacity="0.3" />

  <g transform="translate(20, 20)" fill="url(#brandGrad)" filter="url(#glow)">
    <rect x="5" y="5" width="8" height="8" rx="2" opacity="0.4" />
    <rect x="18" y="5" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="31" y="5" width="8" height="8" rx="2" />
    <rect x="44" y="5" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="5" y="18" width="8" height="8" rx="2" opacity="0.5" />
    <rect x="18" y="18" width="8" height="8" rx="2" opacity="0.8" />
    <rect x="31" y="18" width="8" height="8" rx="2" fill="${s}" />
    <rect x="44" y="18" width="8" height="8" rx="2" opacity="0.5" />
    <rect x="18" y="31" width="22" height="8" rx="2" fill="${s}" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />
    <rect x="5" y="31" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="44" y="31" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="5" y="44" width="8" height="8" rx="2" opacity="0.4" />
    <rect x="18" y="44" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="31" y="44" width="8" height="8" rx="2" />
    <rect x="44" y="44" width="8" height="8" rx="2" opacity="0.4" />
  </g>`;
  } else if (frame === 'circle') {
    emblemContents = `
  <!-- Aether Orb Center -->
  <circle cx="50" cy="50" r="44" fill="none" stroke="${p}" stroke-width="2.5" filter="url(#glow)" />
  <circle cx="50" cy="50" r="39" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="5 3" opacity="0.4" />

  <circle cx="50" cy="50" r="16" fill="url(#brandGrad)" filter="url(#glow)" />
  <circle cx="50" cy="50" r="22" fill="none" stroke="${s}" stroke-width="1.5" filter="url(#glow)" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />
  <path d="M 50,43 L 52,48 L 57,50 L 52,52 L 50,57 L 48,52 L 43,50 L 48,48 Z" fill="#ffffff" filter="url(#glow)" />`;
  } else if (frame === 'brackets') {
    emblemContents = `
  <!-- Code Brackets Frame -->
  <path d="M 24,12 L 10,12 L 10,88 L 24,88" fill="none" stroke="${p}" stroke-width="4.5" stroke-linecap="round" filter="url(#glow)" />
  <path d="M 76,12 L 90,12 L 90,88 L 76,88" fill="none" stroke="${p}" stroke-width="4.5" stroke-linecap="round" filter="url(#glow)" />

  <g transform="translate(34, 40)" fill="url(#brandGrad)" filter="url(#glow)">
    <path d="M 0,4 L 12,10 L 0,16" fill="none" stroke="${p}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="18" y="15" width="14" height="3" rx="1.5" fill="${s}" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />
  </g>`;
  } else if (frame === 'minimal') {
    emblemContents = `
  <!-- Minimalist Spark Frame -->
  <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke="${p}" stroke-width="2.5" opacity="0.3" filter="url(#glow)" />
  <path d="M 50,22 Q 50,50 22,50 Q 50,50 50,78 Q 50,50 78,50 Q 50,50 50,22 Z" fill="url(#brandGrad)" filter="url(#glow)" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />`;
  } else if (frame === 'streetwear') {
    emblemContents = `
  <!-- Background Component: Cybernetic Circular Ring Base -->
  <circle cx="50" cy="50" r="47" fill="url(#darkMetalGrad)" stroke="#1a1a26" stroke-width="1.5" />

  <!-- Rotating Technical Rings -->
  <circle cx="50" cy="50" r="44" fill="none" stroke="url(#brandGrad)" stroke-width="0.8" stroke-dasharray="16 28 8 12" class="g-rotate-cw" opacity="0.9" filter="url(#glow)" />
  <circle cx="50" cy="50" r="41.8" fill="none" stroke="${s}" stroke-width="0.5" stroke-dasharray="6 30 18 6" class="g-rotate-ccw" opacity="0.6" />
  <circle cx="50" cy="50" r="39.5" fill="none" stroke="#ffffff" stroke-width="0.25" stroke-dasharray="1 4" opacity="0.2" />

  <!-- Corner Crosshair Brackets -->
  <g stroke="#ffffff" stroke-width="0.5" opacity="0.3" fill="none">
    <path d="M 13.5,35 L 13.5,32.5 L 16,32.5" />
    <path d="M 86.5,35 L 86.5,32.5 L 84,32.5" />
    <path d="M 13.5,65 L 13.5,67.5 L 16,67.5" />
    <path d="M 86.5,65 L 86.5,67.5 L 84,67.5" />
  </g>

  <!-- Masked Moving Scanline Overlay -->
  <g clip-path="url(#charClip)">
    <line x1="20" y1="50" x2="80" y2="50" stroke="#00F0FF" stroke-width="0.4" opacity="0.3" class="scanline-bar" filter="url(#glow)" />
  </g>

  <!-- CHARACTER 1: THE HIGH-FIDELITY CYBER APE -->
  <g class="char-layer char-ape">
    <!-- Drop Shadow Base -->
    <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />

    <!-- Ribbed Beanie Hat (Graphite) -->
    <path d="M 33.5,41 C 33.5,24 66.5,24 66.5,41 Z" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.8" />
    <!-- Beanie Ribbed Texture Lines -->
    <g stroke="#121217" stroke-width="0.6" opacity="0.5">
      <path d="M 38,28 C 39,32 40,36 40,41" />
      <path d="M 43,26 C 44,30 45,35 45,41" />
      <path d="M 48,25.2 C 49,30 49,35 49,41" />
      <path d="M 52,25.2 C 51,30 51,35 51,41" />
      <path d="M 57,26 C 56,30 55,35 55,41" />
      <path d="M 62,28 C 61,32 60,36 60,41" />
    </g>
    <!-- Beanie Fold-up Band -->
    <path d="M 31.5,39 C 31.5,38 68.5,38 68.5,39 L 67.5,43.5 C 67.5,44.5 32.5,44.5 32.5,43.5 Z" fill="url(#darkMetalGrad)" stroke="#121217" stroke-width="0.6" />
    <!-- Specular shine on beanie fold -->
    <path d="M 32.5,39 H 67.5 V 40.5 H 32.5 Z" fill="url(#specularGrad)" />
    <!-- Beanie Woven Label (Carbon-Fiber with cyan branding) -->
    <rect x="45.5" y="39.5" width="9" height="3.5" rx="0.5" fill="url(#carbonFiber)" stroke="url(#brandGrad)" stroke-width="0.4" />
    <text x="50" y="42" font-family="'JetBrains Mono', monospace" font-size="1.8" font-weight="900" fill="#00F0FF" text-anchor="middle" letter-spacing="0.1">LNC</text>

    <!-- Ape Head Structure (Graphite & Details) -->
    <!-- Ears -->
    <circle cx="32" cy="51" r="4.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" />
    <circle cx="32" cy="51" r="2.8" fill="#15151f" stroke="#00f0ff" stroke-width="0.4" />
    <circle cx="68" cy="51" r="4.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" />
    <circle cx="68" cy="51" r="2.8" fill="#15151f" stroke="#00f0ff" stroke-width="0.4" />

    <!-- Main Face Area -->
    <path d="M 34.5,48.5 C 34.5,64.5 65.5,64.5 65.5,48.5 C 65.5,42.5 61.5,39.5 50,39.5 C 38.5,39.5 34.5,42.5 34.5,48.5 Z" fill="url(#darkMetalGrad)" stroke="#121217" stroke-width="0.8" />

    <!-- Visor Sunglasses (Carbon Fiber Frame with Specular Visor) -->
    <!-- Visor Frame -->
    <path d="M 33.5,44 C 35,42 65,42 66.5,44 L 64.5,52.5 C 63,54.5 37,54.5 35.5,52.5 Z" fill="url(#carbonFiber)" stroke="#121217" stroke-width="0.8" />
    <!-- Visor Lens -->
    <path d="M 35,45 C 36.5,43.5 63.5,43.5 65,45 L 63.2,51.2 C 62,52.8 38,52.8 36.8,51.2 Z" fill="url(#visorGrad)" stroke="#ffffff" stroke-width="0.3" opacity="0.9" />
    <!-- Visor Specular Sheen -->
    <path d="M 35.5,45.2 C 37,44.2 63,44.2 64.5,45.2 L 63.8,47 C 62.5,46.2 37.5,46.2 36.2,47 Z" fill="#ffffff" opacity="0.4" />
    <line x1="39" y1="46" x2="42" y2="50" stroke="#ffffff" stroke-width="0.6" opacity="0.3" stroke-linecap="round" />
    <line x1="40.5" y1="46" x2="43.5" y2="50" stroke="#ffffff" stroke-width="0.3" opacity="0.2" stroke-linecap="round" />

    <!-- Muzzle / Snout (Graphite with detailed creases) -->
    <path d="M 40.5,54.5 C 40.5,63.5 59.5,63.5 59.5,54.5 C 59.5,51.5 40.5,51.5 40.5,54.5 Z" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" />
    <!-- Nose Creases / Nostrils -->
    <path d="M 48.5,53.8 Q 50,55.2 51.5,53.8" fill="none" stroke="#121217" stroke-width="0.8" stroke-linecap="round" />
    <ellipse cx="48.2" cy="55.2" rx="0.8" ry="0.5" fill="#121217" />
    <ellipse cx="51.8" cy="55.2" rx="0.8" ry="0.5" fill="#121217" />
    <!-- Mouth Grin (Streetwear stitching look) -->
    <path d="M 44.5,58 Q 50,60.8 55.5,58" fill="none" stroke="#00F0FF" stroke-width="0.6" stroke-linecap="round" />

    <!-- Hoodie Collar & Strings (Carbon Fiber) -->
    <path d="M 35,63.5 C 32,71.5 68,71.5 65,63.5 L 59,71 H 41 Z" fill="url(#carbonFiber)" stroke="#121217" stroke-width="0.8" />
    <!-- Metallic Drawstring Grommets -->
    <circle cx="44" cy="68.5" r="1.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.3" />
    <circle cx="56" cy="68.5" r="1.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.3" />
    <!-- Hanging Strings with Metallic Tips -->
    <path d="M 44,69.5 C 43,72 45,74 44.5,76.5" fill="none" stroke="#1a1a24" stroke-width="0.8" stroke-linecap="round" />
    <rect x="43.8" y="76.5" width="1.4" height="2.5" rx="0.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.2" />
    <path d="M 56,69.5 C 57,72 55,74 55.5,76.5" fill="none" stroke="#1a1a24" stroke-width="0.8" stroke-linecap="round" />
    <rect x="54.8" y="76.5" width="1.4" height="2.5" rx="0.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.2" />
  </g>

  <!-- CHARACTER 2: THE HIGH-FIDELITY CYBER SKULL -->
  <g class="char-layer char-skull" opacity="0">
    <!-- Drop Shadow Base -->
    <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />

    <!-- Crossed Bones (Graphite with outline) -->
    <g stroke="url(#brandGrad)" stroke-width="3" stroke-linecap="round" opacity="0.95">
      <line x1="28" y1="28" x2="72" y2="72" />
      <line x1="72" y1="28" x2="28" y2="72" />
    </g>
    <!-- Bone End Lobes -->
    <g fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.5">
      <!-- Top Left -->
      <circle cx="26" cy="26" r="2.2" /><circle cx="29" cy="27" r="1.8" />
      <!-- Top Right -->
      <circle cx="74" cy="26" r="2.2" /><circle cx="71" cy="27" r="1.8" />
      <!-- Bottom Left -->
      <circle cx="26" cy="74" r="2.2" /><circle cx="29" cy="73" r="1.8" />
      <!-- Bottom Right -->
      <circle cx="74" cy="74" r="2.2" /><circle cx="71" cy="73" r="1.8" />
    </g>

    <!-- Skull Structure (Polished Graphite) -->
    <path d="M 36.5,45 C 36.5,33.5 63.5,33.5 63.5,45 C 63.5,55.5 60.5,56.5 57,58.5 L 56.5,65.5 C 56.5,67 43.5,67 43.5,65.5 L 43,58.5 C 39.5,56.5 36.5,55.5 36.5,45 Z" fill="url(#graphiteGrad)" stroke="#15151f" stroke-width="0.8" />

    <!-- Specular Highlight on Skull Forehead -->
    <path d="M 37.5,44.5 C 37.5,34.5 62.5,34.5 62.5,44.5 C 62.5,41 37.5,41 37.5,44.5 Z" fill="url(#specularGrad)" opacity="0.6" />

    <!-- Deep Temporal Shading -->
    <path d="M 37,45 Q 40,43 40,48 Q 40,53 37,51 Z" fill="#121217" opacity="0.3" />
    <path d="M 63,45 Q 60,43 60,48 Q 60,53 63,51 Z" fill="#121217" opacity="0.3" />

    <!-- Backward Cap -->
    <path d="M 36,43 C 36,31 64,31 64,43 Z" fill="url(#carbonFiber)" stroke="#121217" stroke-width="0.6" />
    <path d="M 31.8,42 Q 50,38 68.2,42" fill="none" stroke="url(#brandGrad)" stroke-width="1.2" stroke-linecap="round" filter="url(#glow)" />
    <!-- Snapback strap -->
    <rect x="42.5" y="42.5" width="15" height="3" rx="0.5" fill="#121217" stroke="#333" stroke-width="0.3" />
    <circle cx="44.5" cy="44" r="0.4" fill="${p}" />
    <circle cx="46.5" cy="44" r="0.4" fill="${p}" />
    <circle cx="48.5" cy="44" r="0.4" fill="${p}" />
    <circle cx="50.5" cy="44" r="0.4" fill="${p}" />
    <circle cx="52.5" cy="44" r="0.4" fill="${p}" />
    <circle cx="54.5" cy="44" r="0.4" fill="${p}" />
    <circle cx="56.5" cy="44" r="0.4" fill="${p}" />

    <!-- Eye Sockets -->
    <!-- Left Socket -->
    <polygon points="38.5,46.5 41.5,43.5 46.5,45.5 46.5,49.5 43,51.5 39.5,49.8" fill="#111116" stroke="#252530" stroke-width="0.4" />
    <!-- Right Socket -->
    <polygon points="61.5,46.5 58.5,43.5 53.5,45.5 53.5,49.5 57,51.5 60.5,49.8" fill="#111116" stroke="#252530" stroke-width="0.4" />

    <!-- Glowing Cyber HUD Eyes -->
    <circle cx="42.8" cy="47.2" r="2.2" fill="none" stroke="${p}" stroke-width="0.3" stroke-dasharray="1.5 1.5" class="glowing-eye" />
    <circle cx="42.8" cy="47.2" r="0.8" fill="${p}" />
    <circle cx="57.2" cy="47.2" r="2.2" fill="none" stroke="${p}" stroke-width="0.3" stroke-dasharray="1.5 1.5" class="glowing-eye" />
    <circle cx="57.2" cy="47.2" r="0.8" fill="${p}" />

    <!-- Nose Cavity -->
    <path d="M 50,50 L 48,53 Q 50,54 52,53 Z" fill="#111116" stroke="#252530" stroke-width="0.3" />

    <!-- Teeth and Jaw -->
    <rect x="44" y="56" width="12" height="4.5" rx="0.8" fill="#111116" stroke="#1d1d26" stroke-width="0.4" />
    <!-- Top Teeth -->
    <rect x="45.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="47.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="49.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="51.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="53.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <!-- Bottom Teeth -->
    <rect x="45.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="47.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="49.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="51.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="53.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <line x1="44" y1="58.1" x2="56" y2="58.1" stroke="#111116" stroke-width="0.3" />
  </g>

  <!-- CHARACTER 3: THE HIGH-FIDELITY CYBER CAT/BEAR -->
  <g class="char-layer char-cat" opacity="0">
    <!-- Drop Shadow Base -->
    <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />

    <!-- Neck Collar -->
    <path d="M 37.5,61 Q 50,66.5 62.5,61 L 59.5,68.5 Q 50,71.5 40.5,68.5 Z" fill="url(#darkMetalGrad)" stroke="${s}" stroke-width="0.5" />

    <!-- Stitched Ears -->
    <g>
      <polygon points="35.5,41.5 25.5,21.5 45,35.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" stroke-linejoin="round" />
      <polygon points="34.2,39 27.5,24.5 42,34.8" fill="url(#pinkGrad)" />
      <line x1="28" y1="26" x2="31" y2="28" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
      <line x1="32" y1="31" x2="35" y2="33" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
    </g>
    <g>
      <polygon points="64.5,41.5 74.5,21.5 55,35.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" stroke-linejoin="round" />
      <polygon points="65.8,39 72.5,24.5 58,34.8" fill="url(#pinkGrad)" />
      <line x1="72" y1="26" x2="69" y2="28" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
      <line x1="68" y1="31" x2="65" y2="33" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
    </g>

    <!-- Head Base Structure -->
    <path d="M 34.5,41 C 29,49.2 30.2,60 37,64 C 43.8,67.8 56.2,67.8 63,64 C 69.8,60 71,49.2 65.5,41 C 65.5,38 34.5,38 34.5,41 Z" fill="url(#darkMetalGrad)" stroke="#121217" stroke-width="0.8" />
    <path d="M 35.5,40.5 C 38,39 62,39 64.5,40.5 Z" fill="url(#specularGrad)" opacity="0.5" />

    <!-- Forehead Stitching -->
    <g stroke="${s}" stroke-width="0.4" stroke-linecap="round" opacity="0.8">
      <line x1="50" y1="38" x2="50" y2="44" />
      <line x1="48" y1="40" x2="52" y2="40" /><line x1="48.5" y1="42.5" x2="51.5" y2="42.5" />
    </g>

    <!-- Headphones -->
    <path d="M 31,34.5 C 31,18 69,18 69,34.5" fill="none" stroke="url(#graphiteGrad)" stroke-width="3" />
    <path d="M 32.5,34 C 32.5,19 67.5,19 67.5,34" fill="none" stroke="url(#specularGrad)" stroke-width="1" />
    <g>
      <ellipse cx="29.5" cy="41" rx="4.5" ry="8" fill="url(#graphiteGrad)" stroke="${s}" stroke-width="0.6" />
      <ellipse cx="27.8" cy="41" rx="2.5" ry="5" fill="url(#carbonFiber)" />
      <rect x="29" y="32" width="1.5" height="3" fill="#ffffff" opacity="0.6" />
    </g>
    <g>
      <ellipse cx="70.5" cy="41" rx="4.5" ry="8" fill="url(#graphiteGrad)" stroke="${s}" stroke-width="0.6" />
      <ellipse cx="72.2" cy="41" rx="2.5" ry="5" fill="url(#carbonFiber)" />
      <rect x="69.5" y="32" width="1.5" height="3" fill="#ffffff" opacity="0.6" />
    </g>

    <!-- Cross-Stitch Glowing Eyes (X X Pink Neon) -->
    <g filter="url(#glow)">
      <line x1="36.5" y1="46" x2="43.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
      <line x1="43.5" y1="46" x2="36.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
    </g>
    <g filter="url(#glow)">
      <line x1="56.5" y1="46" x2="63.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
      <line x1="63.5" y1="46" x2="56.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
    </g>

    <polygon points="49,54.5 51,54.5 50,56" fill="${s}" />

    <!-- Cheek stitches -->
    <g stroke="${s}" stroke-width="0.3" stroke-linecap="round" opacity="0.7">
      <line x1="32" y1="53.5" x2="34.5" y2="55.5" /><line x1="34" y1="53" x2="32.5" y2="56" />
      <line x1="68" y1="53.5" x2="65.5" y2="55.5" /><line x1="66" y1="53" x2="67.5" y2="56" />
    </g>

    <!-- Mouth -->
    <path d="M 40,58 Q 50,65.5 60,58 Q 50,61 40,58 Z" fill="#111116" stroke="${s}" stroke-width="0.6" stroke-linejoin="round" />
    <polygon points="42.8,58.4 44.8,58.4 43.8,61.2" fill="#ffffff" />
    <polygon points="57.2,58.4 55.2,58.4 56.2,61.2" fill="#ffffff" />
  </g>

  <!-- Foreground Badge / Brand Label -->
  <g fill="none" stroke="url(#brandGrad)" stroke-width="0.4" opacity="0.8">
    <path d="M 23.5,88.5 C 36,93 64,93 76.5,88.5" />
    <path d="M 23.5,11.5 C 36,7 64,7 76.5,11.5" />
  </g>
  <rect x="42.5" y="87" width="15" height="3.8" rx="0.8" fill="#121217" stroke="url(#brandGrad)" stroke-width="0.3" />
  <text x="50" y="89.8" font-family="'JetBrains Mono', monospace" font-size="1.8" font-weight="900" fill="#00F0FF" text-anchor="middle" letter-spacing="0.2">MORPH.v2</text>`;
  } else if (frame === 'dl-geo') {
    emblemContents = `
  <!-- DL Geometric Shield Monogram -->
  <polygon points="50,5 88,27 88,73 50,95 12,73 12,27" fill="none" stroke="${p}" stroke-width="3" stroke-linejoin="round" filter="url(#glow)" />
  <polygon points="50,11 83,30 83,70 50,89 17,70 17,30" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="4 3" opacity="0.4" />
  <g stroke="url(#brandGrad)" filter="url(#glow)" class="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}">
    <path d="M32,30 V70 H48 C60,70 68,61 68,50 C 68,39 60,30 48,30 Z" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M42,42 V58 H54" fill="none" stroke="${s}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
  </g>`;
  } else if (frame === 'dl-terminal') {
    emblemContents = `
  <!-- DL Terminal Box Monogram -->
  <rect x="8" y="8" width="84" height="84" rx="12" fill="none" stroke="${p}" stroke-width="3" filter="url(#glow)" />
  <path d="M 8,24 H 92 M 22,16 H 24 M 30,16 H 32" stroke="${s}" stroke-width="1.5" opacity="0.5" />
  <g stroke="url(#brandGrad)" filter="url(#glow)" class="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}">
    <path d="M 18,36 L 24,41 L 18,46" fill="none" stroke="${s}" stroke-width="2" stroke-linecap="round" />
    <path d="M 38,34 H 54 C 64,34 68,41 68,48 C 68,55 64,62 54,62 H 38 Z" fill="none" stroke-width="4.5" stroke-linejoin="round" />
    <path d="M 46,43 V 56 H 58" fill="none" stroke="${s}" stroke-width="4" stroke-linecap="round" />
    <rect x="62" y="55" width="5" height="5" fill="${s}" stroke="none" />
  </g>`;
  } else if (frame === 'dl-sacred') {
    emblemContents = `
  <!-- DL Sacred Geometry Monogram -->
  <circle cx="50" cy="50" r="45" fill="none" stroke="${p}" stroke-width="2" filter="url(#glow)" />
  <circle cx="50" cy="50" r="41" fill="none" stroke="${s}" stroke-width="0.75" stroke-dasharray="3 3" opacity="0.5" />
  <circle cx="50" cy="50" r="28" fill="none" stroke="${p}" stroke-width="1" opacity="0.3" />
  <path d="M 50,5 L 95,50 L 50,95 L 5,50 Z" fill="none" stroke="${s}" stroke-width="0.5" opacity="0.25" />
  <path d="M 18,18 L 82,82 M 18,82 L 82,18" stroke="${s}" stroke-width="0.5" opacity="0.25" />
  <g stroke="url(#brandGrad)" filter="url(#glow)" class="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}">
    <path d="M 32,32 H 50 A 18,18 0 0,1 50,68 H 32 Z" fill="none" stroke-width="4.5" stroke-linejoin="round" />
    <path d="M 40,40 V 60 H 50" fill="none" stroke="${s}" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="50" cy="50" r="3" fill="${s}" stroke="none" />
  </g>`;
  } else if (frame === 'dl-crest') {
    emblemContents = `
  <!-- DL Cyberpunk Crest Monogram -->
  <path d="M 15,15 H 85 L 92,45 L 50,92 L 8,45 Z" fill="none" stroke="${p}" stroke-width="3" stroke-linejoin="round" filter="url(#glow)" />
  <path d="M 20,20 H 80 L 86,43 L 50,84 L 14,43 Z" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="5 4" opacity="0.3" />
  <path d="M 50,5 V 15 M 50,85 V 95 M 5,50 H 15 M 85,50 H 95" stroke="${s}" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
  <g stroke="url(#brandGrad)" filter="url(#glow)" class="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}">
    <path d="M 35,32 H 48 A 12,12 0 0,1 60,44 V 44 A 12,12 0 0,1 48,56 H 35 Z" fill="none" stroke-width="4.5" stroke-linejoin="round" />
    <path d="M 42,42 V 50 H 52" fill="none" stroke="${s}" stroke-width="3.5" stroke-linecap="round" />
  </g>`;
  } else if (isGenFrame(frame)) {
    emblemContents = `\n  <!-- Emblem Lab generated mark (${frame}) -->\n  ${getGenerativeEmblemContents(frame, p, s, activeMotion === 'pulse')}`;
  } else if (frame.startsWith('custom-')) {
    const custom = customEmblems.find(e => e.id === frame);
    if (custom) {
      if (custom.type === 'svg') {
        let customInner = custom.content;
        const svgStartIdx = customInner.indexOf('<svg');
        if (svgStartIdx !== -1) {
          const innerStart = customInner.indexOf('>', svgStartIdx) + 1;
          const innerEnd = customInner.lastIndexOf('</svg>');
          if (innerEnd !== -1) {
            customInner = customInner.substring(innerStart, innerEnd);
          }
        }
        customInner = customInner
          .replace(/stroke="currentColor"/g, `stroke="${p}"`)
          .replace(/fill="currentColor"/g, `fill="${p}"`);

        emblemContents = `
  <!-- Custom SVG Upload -->
  <g class="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}" filter="url(#glow)">
    <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke="${p}" stroke-width="2.5" opacity="0.3" />
    <svg x="15" y="15" width="70" height="70" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      ${customInner}
    </svg>
  </g>`;
      } else {
        emblemContents = `
  <!-- Custom Image Upload -->
  <g class="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}" filter="url(#glow)">
    <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke="${p}" stroke-width="2.5" opacity="0.3" />
    <clipPath id="customImgClip">
      <rect x="15" y="15" width="70" height="70" rx="12" />
    </clipPath>
    <image x="15" y="15" width="70" height="70" href="${custom.content}" clip-path="url(#customImgClip)" preserveAspectRatio="xMidYMid slice" />
  </g>`;
      }
    } else {
      emblemContents = `
  <!-- Minimalist Spark Frame Fallback -->
  <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke="${p}" stroke-width="2.5" opacity="0.3" filter="url(#glow)" />
  <path d="M 50,22 Q 50,50 22,50 Q 50,50 50,78 Q 50,50 78,50 Q 50,50 50,22 Z" fill="url(#brandGrad)" filter="url(#glow)" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />`;
    }
  } else {
    emblemContents = `
  <!-- Minimalist Spark Frame -->
  <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke="${p}" stroke-width="2.5" opacity="0.3" filter="url(#glow)" />
  <path d="M 50,22 Q 50,50 22,50 Q 50,50 50,78 Q 50,50 78,50 Q 50,50 50,22 Z" fill="url(#brandGrad)" filter="url(#glow)" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />`;
  }

  if (activeMotion === 'spin' && frame !== 'streetwear') {
    emblemContents = `<g class="spin-logo-g">${emblemContents}</g>`;
  }

  let extraDefs = '';
  if (frame === 'streetwear') {
    extraDefs = `
  <!-- Carbon Fiber Pattern -->
  <pattern id="carbonFiber" width="6" height="6" patternUnits="userSpaceOnUse">
    <rect width="6" height="6" fill="#121217" />
    <path d="M0,3 L6,3 M3,0 L3,6" stroke="#1d1d26" stroke-width="0.8" />
    <path d="M0,0 L6,6 M0,6 L6,0" stroke="#0a0a0f" stroke-width="0.4" opacity="0.8" />
    <rect width="3" height="3" fill="#1a1a24" opacity="0.4" />
    <rect x="3" y="3" width="3" height="3" fill="#0d0d12" opacity="0.4" />
  </pattern>

  <!-- Metallic Graphite Gradients -->
  <linearGradient id="graphiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#555566" />
    <stop offset="20%" stop-color="#2a2a35" />
    <stop offset="40%" stop-color="#15151f" />
    <stop offset="60%" stop-color="#3d3d4f" />
    <stop offset="80%" stop-color="#111116" />
    <stop offset="100%" stop-color="#22222d" />
  </linearGradient>

  <linearGradient id="darkMetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#2d2d3a" />
    <stop offset="50%" stop-color="#181822" />
    <stop offset="100%" stop-color="#09090d" />
  </linearGradient>

  <!-- Specular Highlight Overlay -->
  <linearGradient id="specularGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
    <stop offset="35%" stop-color="#ffffff" stop-opacity="0.08" />
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
  </linearGradient>

  <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${s}" />
    <stop offset="100%" stop-color="#6c63ff" />
  </linearGradient>

  <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#00F0FF" />
    <stop offset="50%" stop-color="#6c63ff" />
    <stop offset="100%" stop-color="${s}" />
  </linearGradient>

  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="2.5" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>

  <clipPath id="charClip">
    <circle cx="50" cy="50" r="36" />
  </clipPath>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${shadowSize / 4}" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p}" />
      <stop offset="100%" stop-color="${s}" />
    </linearGradient>${extraDefs}${styleBlock}
  </defs>
  ${emblemContents}
</svg>`;
}

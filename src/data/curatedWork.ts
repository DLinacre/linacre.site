export interface ActionLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SelectedProject {
  id: string;
  index: string;
  name: string;
  category: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
  status: string;
  image: string;
  imageAlt: string;
  primaryAction: ActionLink;
  secondaryAction?: ActionLink;
  sourceUrl: string;
  featured?: boolean;
}

export interface SelectedGame {
  id: string;
  index: string;
  name: string;
  genre: string;
  summary: string;
  controls: string;
  modes: string;
  stack: readonly string[];
  status: string;
  image: string;
  imageAlt: string;
  playAction: ActionLink;
  sourceUrl: string;
}

export const selectedWork: readonly SelectedProject[] = [
  {
    id: 'dual-audio-synchronizer',
    index: '01',
    name: 'Dual Audio Synchronizer',
    category: 'Systems & Audio DSP · Windows Desktop',
    summary:
      'Native Windows WASAPI utility that routes desktop audio to two or more speakers or headphones simultaneously, holding inter-device drift within ±1 ms via continuous phase-locked resampling.',
    highlights: [
      '4-point Cubic Hermite resampler with continuous drift correction across Bluetooth, USB, SPDIF and HDMI outputs',
      'Optional 2.8 kHz Biquad Vocal Clarity EQ and mono dialogue blend for mixed-hearing living rooms',
      'Per-speaker millisecond offset controls, L/R stereo split routing, and standalone ~360 KB Windows x64 executable',
    ],
    stack: ['C#', 'Windows WASAPI', 'WinForms', 'Real-Time DSP'],
    status: 'v2.0 Release · Windows 10/11 x64',
    image: '/showcase/dual-audio-synchronizer.webp',
    imageAlt:
      'Dual Audio Synchronizer v2.0 Windows desktop interface showing active phase-locked multi-speaker WASAPI loopback sync and 2.8 kHz Vocal Clarity DSP controls',
    primaryAction: {
      label: 'Download v2.0 (.exe)',
      href: 'https://github.com/LIN4CRE/dual-audio-synchronizer/releases/latest',
      external: true,
    },
    secondaryAction: {
      label: 'Product & docs',
      href: 'https://lin4cre.github.io/dual-audio-synchronizer/',
      external: true,
    },
    sourceUrl: 'https://github.com/LIN4CRE/dual-audio-synchronizer',
    featured: true,
  },
  {
    id: 'cubelab',
    index: '02',
    name: 'CubeLab',
    category: '3D Interactive Web · Solver & Trainer',
    summary:
      'Interactive 3D Rubik’s Cube solver, 7-stage beginner method trainer, and verified algorithm studio running Kociemba’s two-phase solver in a background Web Worker.',
    highlights: [
      'Near-optimal two-phase solver (≤21 moves) offloaded to a Web Worker with step-by-step 3D playback',
      'Sticker painter, WCA scramble generator, notation parser, and uniform random-state cube generator',
      'Unit-verified OLL/PLL algorithm library, inspection timer, and installable offline PWA',
    ],
    stack: ['TypeScript', 'Three.js', 'Web Workers', 'PWA'],
    status: 'Live Web App · Offline-Capable',
    image: '/showcase/cubelab.webp',
    imageAlt:
      'CubeLab interactive 3D Rubik’s Cube solver displaying a scrambled cube, unfolded colour net, and 21-move Kociemba solution sequence',
    primaryAction: {
      label: 'Launch CubeLab',
      href: 'https://dlinacre.github.io/cubelab/',
      external: true,
    },
    sourceUrl: 'https://github.com/LIN4CRE/cubelab',
  },
  {
    id: 'helix',
    index: '03',
    name: 'HELIX',
    category: 'Computational Simulation · Bytecode VM',
    summary:
      'Zero-dependency artificial-life observatory where a living population of tiny programs competes, crosses, and mutates inside a custom 20-opcode register virtual machine.',
    highlights: [
      'Custom 20-opcode bytecode VM executing evolved genomes entirely in the browser with zero server uploads',
      'Composite fitness scoring with Shannon entropy penalties to prevent trivial constant-loop collapse',
      'Live double-helix champion visualiser, extinction/rebirth epochs, and interactive genome disassembler',
    ],
    stack: ['JavaScript', '20-Opcode VM', 'HTML5 Canvas', 'Web Audio'],
    status: 'Hosted on linacre.site',
    image: '/showcase/helix.webp',
    imageAlt:
      'HELIX artificial-life observatory showing luminous orbital rings, epoch telemetry, and the live genome bytecode inspector drawer',
    primaryAction: {
      label: 'Open Observatory',
      href: '/helix/',
    },
    sourceUrl: 'https://github.com/DLinacre/helix',
  },
  {
    id: 'orbit',
    index: '04',
    name: 'Orbit & Earth Observatory',
    category: 'Geospatial & Orbital Telemetry',
    summary:
      'Real-time planetary telemetry desk tracking the International Space Station, solar day/night terminator, global M4.5+ seismic activity, rocket launches, and South Yorkshire sky conditions.',
    highlights: [
      'Live ISS orbital position, altitude, velocity, and 90-minute ground track with deterministic Keplerian fallback',
      'Equirectangular world projection paired with a 3D orthographic vector sphere (ISS, UK, and sub-solar locks)',
      'Live USGS M4.5+ earthquake feed, Launch Library 2 T-minus manifest, and local stargazing index',
    ],
    stack: ['React 19', 'TypeScript', 'Orbital Math', 'SVG Projections'],
    status: 'Hosted on linacre.site',
    image: '/showcase/orbit.webp',
    imageAlt:
      'Orbit and Earth Observatory interface showing live ISS telemetry, equirectangular solar terminator world map, and 3D orthographic hemisphere projection',
    primaryAction: {
      label: 'Open Observatory',
      href: '/orbit',
    },
    sourceUrl: 'https://github.com/LIN4CRE/linacre.site/blob/main/src/components/OrbitObservatory.tsx',
  },
  {
    id: 'speedread',
    index: '05',
    name: 'SpeedRead',
    category: 'Reading & Document Engine',
    summary:
      'Focused Rapid Serial Visual Presentation (RSVP) reader featuring Optimal Recognition Point reticles, adaptive punctuation cadence, bundled classics, and local PDF/EPUB import.',
    highlights: [
      'Nine Optimal Recognition Point (ORP) reticle modes with automatic pause weighting on punctuation and long words',
      'Client-side PDF and EPUB parsing via PDF.js Worker and JSZip—documents never leave the browser',
      '19 bundled public-domain books, saved reading states, comprehension quizzes, and full keyboard control',
    ],
    stack: ['TypeScript', 'Vite', 'PDF.js Worker', 'JSZip'],
    status: 'Live Web App · Offline-Capable',
    image: '/showcase/speedread.webp',
    imageAlt:
      'SpeedRead RSVP reader streaming Bram Stoker’s Dracula at 600 WPM with Optimal Recognition Point red letter highlighting inside the Cinema Notch reticle',
    primaryAction: {
      label: 'Launch SpeedRead',
      href: 'https://lin4cre.github.io/SpeedRead/',
      external: true,
    },
    sourceUrl: 'https://github.com/LIN4CRE/SpeedRead',
  },
];

export const selectedGames: readonly SelectedGame[] = [
  {
    id: 'afterglow',
    index: '01',
    name: 'Afterglow',
    genre: 'Generative Light Painting',
    summary:
      'Paint with long-exposure light in a quiet darkroom canvas—trace constellation targets to unlock luminous brushes and palettes, or sketch freeform ribbons with live ambient synthesis.',
    controls: 'Pointer or touch drag · Undo / Redo · Brush & palette selector',
    modes: 'Guided constellation targets & freeform darkroom',
    stack: ['HTML5 Canvas', 'Web Audio', 'Zero Dependencies'],
    status: 'Instant Play · GitHub Pages',
    image: '/showcase/game-afterglow.webp',
    imageAlt:
      'Afterglow browser game showing a luminous cyan and violet figure-eight long-exposure light ribbon against a dark starfield canvas',
    playAction: {
      label: 'Play Afterglow',
      href: 'https://dlinacre.github.io/afterglow/',
      external: true,
    },
    sourceUrl: 'https://github.com/DLinacre/afterglow',
  },
  {
    id: 'circuit',
    index: '02',
    name: 'Circuit',
    genre: 'Spatial Logic Puzzle',
    summary:
      'Rotate conduit tiles until every terminal connects back to the power core in a single closed network, with live current propagation and zero dead ends.',
    controls: 'Tap or click to rotate clockwise · Right-click, hold, or Shift+Space to rotate back',
    modes: '3×3 to 7×7 campaign progression & seeded 5×5 daily grid',
    stack: ['JavaScript', 'Seeded PRNG', 'Web Audio'],
    status: 'Hosted on linacre.site',
    image: '/showcase/game-circuit.webp',
    imageAlt:
      'Circuit browser puzzle game showing a 5x5 conduit board with an illuminated amber power core and cyan energized wire paths',
    playAction: {
      label: 'Play Circuit',
      href: '/games/circuit',
    },
    sourceUrl: 'https://github.com/LIN4CRE/linacre.site/blob/main/public/games/circuit.js',
  },
  {
    id: 'decrypt',
    index: '03',
    name: 'Decrypt',
    genre: 'Codebreaking Deduction',
    summary:
      'Deduce a hidden four-symbol sequence from six colour-coded tokens within eight guesses, guided by exact-position and misplaced feedback pegs.',
    controls: 'Tap symbol pads or press keys A–F · Enter to submit · Backspace to clear',
    modes: 'Shared daily cipher & unlimited practice rounds with local streak tracking',
    stack: ['JavaScript', 'Daily Seed', 'Local Storage'],
    status: 'Hosted on linacre.site',
    image: '/showcase/game-decrypt.webp',
    imageAlt:
      'Decrypt browser deduction game displaying colour-coded letter guesses A through F alongside exact and misplaced feedback pegs',
    playAction: {
      label: 'Play Decrypt',
      href: '/games/decrypt',
    },
    sourceUrl: 'https://github.com/LIN4CRE/linacre.site/blob/main/public/games/decrypt.js',
  },
  {
    id: 'gridlock',
    index: '04',
    name: 'Gridlock',
    genre: 'Turn-Based Territory Strategy',
    summary:
      'Claim one edge per turn on a crisp lattice board; completing the fourth wall of a square captures it and grants an immediate bonus move.',
    controls: 'Click, tap, or arrow-key navigate edges · Enter or Space to claim',
    modes: 'Solo vs chain-aware machine opponent & 2-player pass-and-play (3×3, 4×4, 5×5)',
    stack: ['SVG', 'Tactical AI', 'Web Audio'],
    status: 'Hosted on linacre.site',
    image: '/showcase/game-gridlock.webp',
    imageAlt:
      'Gridlock strategy board game showing cyan and amber claimed edges across a 4x4 grid against the machine opponent',
    playAction: {
      label: 'Play Gridlock',
      href: '/games/gridlock',
    },
    sourceUrl: 'https://github.com/LIN4CRE/linacre.site/blob/main/public/games/gridlock.js',
  },
];

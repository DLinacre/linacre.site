/**
 * SITE PROJECTS — Curated catalogue of David Linacre's active projects.
 *
 * Exclusively features verified live apps, active tools, games, and repositories from
 * the LIN4CRE and DLinacre GitHub accounts.
 * Each project includes authentic, high-definition 16:9 artwork banners.
 */

export type ProjectKind =
  | 'App' // consumer web app / PWA
  | 'Tool' // utility / calculator / directory
  | 'AI' // AI-powered product
  | 'Game' // playable game
  | 'DevOps' // backend / infra / pipeline / library
  | 'Source' // open-source project / collection
  | 'Private'; // private repo (listed, not linked)

export interface SiteProject {
  name: string;
  kind: ProjectKind;
  blurb: string;
  url?: string; // primary destination (live app or repo)
  repo?: string; // repository URL when different from url
  tags: string[]; // search keywords
  emoji?: string;
  private?: boolean; // hidden from external links (private repo)
  badge?: 'NEW'; // highlights recently shipped work
  artwork?: string; // image path in /banners or /projects (used for thumbnails)
  highlights?: string[]; // 2–3 bullet takeaways for the detail view
  tech?: string[]; // language / stack
  year?: number; // launch / release year
  featured?: boolean; // shown in the hero spotlight on the start page
  pinned?: boolean; // prioritised in the library based on owner preference
  downloadUrl?: string; // known download/release destination; never guessed from a repo
}

export const SITE_PROJECTS: SiteProject[] = [
  // ──────────────────────────── Flagship Work ────────────────────────────
  {
    name: 'Fire TV Setup Kit',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'Tool',
    emoji: '🔥',
    artwork: '/banners/firetv-kit.png',
    blurb:
      'Turnkey Fire TV & Android TV deployment & recovery toolkit: Stremio with ExoPlayer trailer bugfix, SmartTube 4K, TiviMate IPTV, multi-profile Private DNS (AdGuard/Cloudflare/Quad9), tiered telemetry debloat with auto-snapshot rollback, and 46-point AST & live device test suite.',
    url: 'https://lin4cre.github.io/firetv-kit/',
    repo: 'https://github.com/LIN4CRE/firetv-kit',
    tags: ['firetv', 'stremio', 'smarttube', 'tivimate', 'androidtv', 'adguard', 'streaming', 'adb', 'debloat', 'diagnostics'],
    highlights: [
      'ExoPlayer deadlock permanently fixed — trailers never required to unfreeze video.',
      'Selectable Private DNS over TLS (AdGuard, Cloudflare, Quad9) blocks ads system-wide with zero VPN.',
      'Multi-adapter concurrent scanner with 2026 hardware fingerprinting, deep diagnostics, and tiered debloat rollback.',
    ],
    tech: ['PowerShell', 'Bash', 'Android ADB', 'Fire OS', 'DNS over TLS', 'Diagnostics'],
    year: 2026,
    downloadUrl: 'https://github.com/LIN4CRE/firetv-kit/archive/refs/heads/main.zip',
  },
  {
    name: 'Tabulous Games',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'Game',
    emoji: '🎮',
    artwork: '/banners/tabulous-games.webp',
    blurb:
      'A directory of browser game links, including retro-inspired titles, multiplayer games and WebAssembly projects. Availability varies by host.',
    url: '/games',
    repo: 'https://github.com/LIN4CRE/tabulous-games',
    tags: ['games', 'vault', 'retro', 'wasm', 'fps', 'emulator', 'webassembly', 'offline'],
    highlights: [
      'Explore browser game links by genre; third-party hosts may change or become unavailable.',
      'Instant-play WebAssembly engine with local game saves and fullscreen HUD.',
      '100% self-hosted on linacre.site with zero external dependencies.',
    ],
    tech: ['WebAssembly', 'HTML5', 'Emscripten', 'Canvas', 'Web Audio'],
    year: 2026,
  },
  {
    name: 'APKHub',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'App',
    emoji: '📱',
    artwork: '/banners/apkhub.jpg',
    blurb:
      'Curated Android APK intelligence portal, build artifact manager, and automated inspection toolkit for TV and mobile packages.',
    url: 'https://lin4cre.github.io/APKHub/',
    repo: 'https://github.com/LIN4CRE/APKHub',
    tags: ['android', 'apk', 'firetv', 'artifacts', 'inspector', 'tooling'],
    highlights: [
      'Automated manifest inspection and architecture validation (armeabi-v7a / arm64-v8a).',
      'Version indexing and change telemetry across sideload packages.',
      'Integrated security and permission boundary auditing.',
    ],
    tech: ['TypeScript', 'Next.js', 'Android SDK', 'Tailwind CSS'],
    year: 2026,
  },
  {
    name: 'PokéFlip AI',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'AI',
    emoji: '🃏',
    artwork: '/banners/pokeflip-ai.jpg',
    blurb:
      'Intelligent collectible card pricing index, condition grading analyzer, and predictive market intelligence engine powered by Google Gemini.',
    url: 'https://pok-flip-ai.vercel.app/',
    repo: 'https://github.com/LIN4CRE/Pok-Flip-AI',
    tags: ['ai', 'gemini', 'pokemon', 'pricing', 'analytics', 'vision'],
    highlights: [
      'Computer vision centering, edge-wear, and surface flaw evaluation for grading prediction.',
      'Historical auction price aggregation and volatility indexing.',
      'Multi-modal prompt workflows tuned specifically for trading card collectibles.',
    ],
    tech: ['Google Gemini API', 'Python', 'FastAPI', 'React', 'OpenCV'],
    year: 2026,
  },
  {
    name: 'Retro Arcade Vault',
    pinned: true,
    featured: false,
    kind: 'Game',
    emoji: '🕹️',
    artwork: '/banners/retro-arcade-vault.jpg',
    blurb:
      'Zero-install browser retro arcade preloaded with 63+ legendary PS1, GBA, NDS, SNES, and Genesis titles, responsive gamepad mapping, and authentic CRT shaders.',
    url: 'https://lin4cre.github.io/retro-arcade-vault/',
    repo: 'https://github.com/LIN4CRE/retro-arcade-vault',
    tags: ['retro', 'emulator', 'ps1', 'gba', 'arcade', 'webassembly'],
    highlights: [
      'Instant-play WebAssembly cores: PCSX ReARMed, mGBA, DeSmuME, Snes9x, and Genesis Plus GX.',
      'Real-time retro scanline and CRT phosphor bloom shaders.',
      'Automatic state saving and Bluetooth gamepad vibration integration.',
    ],
    tech: ['WebAssembly', 'HTML5 Canvas', 'Web Audio API', 'Gamepad API'],
    year: 2026,
  },
  {
    name: 'Dual Audio Synchronizer',
    pinned: true,
    featured: false,
    kind: 'Tool',
    emoji: '🔊',
    artwork: '/banners/dual-audio-synchronizer.png',
    blurb:
      'Studio-grade WASAPI multi-speaker synchronizer for Windows with automatic ±1 ms clock-drift phase lock and 2.8 kHz Hearing Clarity DSP.',
    url: 'https://lin4cre.github.io/dual-audio-synchronizer/',
    repo: 'https://github.com/LIN4CRE/dual-audio-synchronizer',
    tags: ['audio', 'wasapi', 'synchronizer', 'dsp', 'windows', 'csharp', 'clarity'],
    highlights: [
      'Independent sub-millisecond circular buffer drift correction prevents acoustic echo.',
      'Hearing Clarity DSP emphasizes dialogue frequencies at 2.8 kHz without volume spikes.',
      'Lightweight Windows tray application with zero CPU throttling.',
    ],
    tech: ['C#', '.NET 9', 'WASAPI', 'DirectSound', 'WPF'],
    year: 2026,
  },
  {
    name: 'Music Videos',
    pinned: true,
    featured: false,
    kind: 'App',
    emoji: '🎬',
    artwork: '/music-videos/covers/the-road-beyond.jpg',
    blurb:
      'The official Proper Mad cinema: ten original lyric-video masters with interactive timed lyrics, artwork, theatre mode, playback controls and studio audio profiles.',
    url: '/music-videos',
    repo: 'https://github.com/LIN4CRE/linacre-music-videos',
    tags: ['music', 'videos', 'proper mad', 'lyrics', 'cinema', 'audio', 'playlist'],
    highlights: [
      'Ten original 1080p music videos with album artwork and synchronized lyric navigation.',
      'Playback speed, shuffle, repeat, theatre mode, keyboard shortcuts and MediaSession support.',
      'Embedded from the canonical player so its video masters and Web Audio profiles remain intact.',
    ],
    tech: ['HTML5 Video', 'Web Audio API', 'MediaSession', 'Responsive player'],
    year: 2026,
  },
  {
    name: 'Karaoke Pulse',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🎤',
    artwork: '/banners/karaoke-pulse.png',
    blurb:
      'Full-stack YouTube Karaoke Studio featuring synced synchronized lyrics, AI dual-stem vocal removal, live microphone reverb, and pitch detection.',
    url: 'https://lin4cre.github.io/karaoke-pulse/',
    repo: 'https://github.com/LIN4CRE/karaoke-pulse',
    tags: ['karaoke', 'music', 'vocal-remover', 'youtube', 'dsp', 'audio'],
    highlights: [
      'Real-time stem separation isolates backing tracks and removes lead vocals cleanly.',
      'Live microphone monitoring with studio hall reverb and pitch accuracy scoring.',
      'Responsive synchronized lyrics display with auto-scroll and romanized lyrics.',
    ],
    tech: ['TypeScript', 'Web Audio API', 'React', 'FastAPI', 'Spleeter'],
    year: 2026,
  },
  {
    name: 'KushCloud',
    pinned: false,
    featured: false,
    kind: 'Game',
    emoji: '🌿',
    artwork: '/banners/kushcloud.webp',
    blurb:
      'A chill one-tap arcade flyer with responsive physics calibration, procedural synthesized chillwave audio, and unlockable cosmetics.',
    url: 'https://dlinacre.github.io/KushCloud/',
    repo: 'https://github.com/DLinacre/KushCloud',
    tags: ['game', 'arcade', 'chill', 'procedural', 'canvas', 'react'],
    highlights: [
      'Smooth 120 FPS high-refresh physics engine with responsive tap mechanics.',
      'Procedural Web Audio chiptune synthesizer with dynamic pitch transitions.',
      'Local-first high score persistence with zero external tracking.',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'HTML5 Canvas', 'Web Audio API'],
    year: 2026,
  },
  {
    name: 'Afterglow',
    pinned: false,
    featured: false,
    kind: 'Game',
    emoji: '✨',
    artwork: '/banners/afterglow.webp',
    blurb:
      'Paint with long-exposure light — a novel, endless HTML5 light-painting game. Steer glowing lights to burn shimmering trails onto a night sky.',
    url: 'https://dlinacre.github.io/afterglow/',
    repo: 'https://github.com/DLinacre/afterglow',
    tags: ['game', 'light-painting', 'canvas', 'art', 'ambient', 'creative'],
    highlights: [
      'Real-time particle phosphor persistence mimicking long-exposure camera sensors.',
      'Responsive multitouch and stylus pressure integration.',
      'Harmonic ambient audio synthesis that modulates with light trail speed.',
    ],
    tech: ['HTML5 Canvas', 'JavaScript', 'Web Audio', 'CSS3'],
    year: 2026,
  },
  {
    name: 'Easy Audiobook Player',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🎧',
    artwork: '/banners/easy-audiobook-player.jpg',
    blurb:
      'A zero-dependency standalone HTML5 audiobook player for local files and legal web audio with chapter bookmarks, playback speed memory, sleep timer, and hotkeys.',
    url: 'https://lin4cre.github.io/easy-audiobook-player/',
    repo: 'https://github.com/LIN4CRE/easy-audiobook-player',
    tags: ['audiobook', 'player', 'offline', 'single-file', 'html5'],
    highlights: [
      'Single self-contained HTML file running 100% client-side with zero external requests.',
      'IndexedDB chapter resume state, playback rate memory (0.75x–2.5x), and sleep timer.',
      'Direct drag-and-drop support for M4B, MP3, and AAC audiobooks.',
    ],
    tech: ['HTML5', 'Vanilla JavaScript', 'IndexedDB', 'Web Audio API'],
    year: 2026,
  },
  {
    name: 'Linacre Uninstaller',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🧹',
    artwork: '/banners/linacre-uninstaller.jpg',
    blurb:
      'Android debloating suite & interactive web console: native Kotlin mobile app and ADB studio for Fire OS, Samsung One UI, Xiaomi HyperOS, and AOSP.',
    url: 'https://lin4cre.github.io/LinacreUninstaller/',
    repo: 'https://github.com/LIN4CRE/LinacreUninstaller',
    tags: ['android', 'debloat', 'uninstaller', 'security', 'adb', 'cleaner'],
    highlights: [
      'Automated safety tier classification (Safe to remove, Warning, Critical system).',
      'One-click disable/uninstall commands executable over wireless ADB or on-device.',
      'Backup and restore state tracking to revert uninstalled packages instantly.',
    ],
    tech: ['Android SDK', 'Kotlin', 'Material Design 3', 'Shell Scripting'],
    year: 2026,
  },
  {
    name: 'SpeedRead',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '⚡',
    artwork: '/banners/speedread.jpg',
    blurb:
      'Rapid Serial Visual Presentation (RSVP) speed-reading engine that flashes words at optimal optical fixation points up to 1,000 WPM.',
    url: 'https://lin4cre.github.io/SpeedRead/',
    repo: 'https://github.com/LIN4CRE/SpeedRead',
    tags: ['speedread', 'rsvp', 'productivity', 'reading', 'tool'],
    highlights: [
      'Optimal Recognition Point (ORP) colored letter alignment minimizes eye saccades.',
      'Adaptive punctuation cadence pauses naturally on commas, periods, and paragraphs.',
      'Supports pasted text, EPUB files, and clipboard reading.',
    ],
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
    year: 2026,
  },
  {
    name: 'Whole-Home AdBlocker',
    pinned: false,
    featured: false,
    kind: 'DevOps',
    emoji: '🛡️',
    artwork: '/banners/whole-home-adblocker.jpg',
    blurb:
      'One-click whole-home network ad blocker for Windows: AdGuard Home in Docker with a friendly setup wizard, interactive live DNS telemetry HUD, and router guides.',
    url: 'https://lin4cre.github.io/whole-home-adblocker/',
    repo: 'https://github.com/LIN4CRE/whole-home-adblocker',
    tags: ['adblock', 'adguard', 'docker', 'dns', 'windows', 'networking'],
    highlights: [
      'Single-click setup orchestrates Docker Desktop, container provisioning, and DNS bindings.',
      'Preloaded with optimized blocklists stopping telemetry, malware, and video tracking.',
      'Encrypted DNS upstream configuration supporting DoH, DoT, and DNSCrypt.',
    ],
    tech: ['Docker', 'PowerShell', 'AdGuard Home', 'DNS over TLS'],
    year: 2026,
  },
  {
    name: 'Linacre System Monitor Wallpaper',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🖥️',
    artwork: '/banners/linacre-wallpaper.jpg',
    blurb:
      'Cyberpunk desktop HUD & real-time system monitoring wallpaper with Matrix digital rain, CPU/GPU vitals, audio visualizer, and command palette.',
    url: 'https://lin4cre.github.io/linacre-wallpaper/',
    repo: 'https://github.com/LIN4CRE/linacre-wallpaper',
    tags: ['wallpaper', 'hardware', 'telemetry', 'system-monitor', 'lively', 'hud'],
    highlights: [
      'Hardware-accelerated Canvas graphs render at 60 FPS with sub-1% CPU consumption.',
      'Dual-monitor adaptive grid layout with customizable sensor refresh intervals.',
      'Integrated quick-action command palette for system utilities and shortcuts.',
    ],
    tech: ['HTML5 Canvas', 'Lively Wallpaper API', 'WebSockets', 'CSS3'],
    year: 2026,
  },
  {
    name: 'CubeLab',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🎲',
    artwork: '/banners/cubelab.jpg',
    blurb:
      'Free offline-first 3D Rubik\'s Cube solver, trainer, timer, and PWA featuring CFOP algorithms, scramble generation, and real-time step visualization.',
    url: 'https://lin4cre.github.io/cubelab/',
    repo: 'https://github.com/LIN4CRE/cubelab',
    tags: ['rubiks-cube', 'solver', 'threejs', '3d', 'pwa', 'algorithms'],
    highlights: [
      'Interactive 3D WebGL cube with smooth touch gestures and keyboard shortcuts.',
      'Algorithmic two-phase Kociemba solver finding optimal solutions in under 20 moves.',
      'WCA-compliant inspection timer with millisecond accuracy and scramble histories.',
    ],
    tech: ['Three.js', 'WebGL', 'TypeScript', 'PWA'],
    year: 2026,
  },
  {
    name: '1Files Repository',
    pinned: false,
    featured: false,
    kind: 'Source',
    emoji: '📄',
    artwork: '/banners/1files.jpg',
    blurb:
      'Curated collection of complete, useful web apps and utilities, each shipped as a SINGLE self-contained HTML file with zero build steps and zero runtime dependencies.',
    url: 'https://lin4cre.github.io/1files/',
    repo: 'https://github.com/LIN4CRE/1files',
    tags: ['single-file', 'html', 'zero-dependency', 'utilities', 'open-source'],
    highlights: [
      'Every tool runs completely offline directly by double-clicking the .html file.',
      'Inline CSS, JavaScript, and SVGs ensure 100-year digital preservation.',
      'Includes text tools, calculators, network diagnostics, and visual utilities.',
    ],
    tech: ['HTML5', 'Vanilla JavaScript', 'CSS3', 'Embedded SVG'],
    year: 2026,
  },
  {
    name: 'Bonny Bats',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🦇',
    artwork: '/banners/bonny-bats.jpg',
    blurb:
      'A friendly client-facing guide to bats in buildings: species identification, UK wildlife laws, roost safety, and humane exclusion methodologies.',
    url: 'https://lin4cre.github.io/bonny-bats/',
    repo: 'https://github.com/LIN4CRE/bonny-bats',
    tags: ['bats', 'wildlife', 'architecture', 'conservation', 'uk-law'],
    highlights: [
      'Visual roost identification matrix for UK species (Pipistrelles, Brown Long-eared).',
      'Plain-English breakdown of the Wildlife and Countryside Act 1981 compliance.',
      'Print-friendly roost survey checklists and contractor guidelines.',
    ],
    tech: ['HTML5', 'Tailwind CSS', 'Responsive Design'],
    year: 2026,
  },
  {
    name: 'Bonny Bakes',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🧁',
    artwork: '/banners/bonny-bakes.jpg',
    blurb:
      'Warm, friendly home-baking recipe companion with an ingredient quantity scaler, recipe favorites, dynamic shopping lists, and print-friendly cards.',
    url: 'https://lin4cre.github.io/bonny-bakes/',
    repo: 'https://github.com/LIN4CRE/bonny-bakes',
    tags: ['baking', 'recipes', 'calculator', 'lifestyle', 'pwa'],
    highlights: [
      'Dynamic serving scaler recalculates flour, sugar, and yeast ratios accurately.',
      'Offline-capable PWA with local recipe bookmarks and printable kitchen cards.',
      'Automatic ingredient grouping into organized shopping checklist categories.',
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'PWA'],
    year: 2026,
  },
  {
    name: 'Linacre OSINT HUD',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🛰️',
    artwork: '/banners/linacre-osint-hud.jpg',
    blurb:
      'A local-first OSINT research directory with 1,310 curated resources across 11 sectors and 77 categories, integrated into Linacre’s site design system.',
    url: '/osint',
    repo: 'https://github.com/LIN4CRE/linacre-osint-hud',
    tags: ['osint', 'cybersecurity', 'intelligence', 'recon', 'console', 'hud', 'research'],
    highlights: [
      'Browse 1,310 linked resources across 11 sectors and 77 focused categories.',
      'Fuzzy search, shareable filters, local bookmarks, recent tools and 11 world clocks.',
      'Runs client-side with no third-party favicon requests or background lookups.',
    ],
    tech: ['React', 'TypeScript', 'Fuse.js', 'LocalStorage'],
    year: 2026,
  },
  {
    name: 'Linacre Global Monitor',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '📡',
    artwork: '/banners/linacre-global-monitor.jpg',
    blurb:
      'Real-time geopolitical and environmental situational awareness dashboard powered by live telemetry from NASA, USGS, and Open-Meteo.',
    url: 'https://lin4cre.github.io/linacre-global-monitor/',
    repo: 'https://github.com/LIN4CRE/linacre-global-monitor',
    tags: ['geopolitical', 'nasa', 'usgs', 'earthquake', 'weather', 'dashboard'],
    highlights: [
      'Live seismic event streaming directly from the USGS earthquake API.',
      'NASA active wildfire hotspot and atmospheric anomaly feeds.',
      'Interactive dark-mode GIS map with real-time weather alerts and telemetry.',
    ],
    tech: ['JavaScript', 'Leaflet GIS', 'NASA API', 'USGS API', 'CSS3'],
    year: 2026,
  },
  {
    name: 'Smart Email',
    badge: 'NEW',
    pinned: false,
    featured: false,
    kind: 'AI',
    emoji: '✉️',
    artwork: '/banners/smart-mail.webp',
    blurb:
      'AI-powered unified email client (Google Gemini) featuring multi-account inbox sync, smart categorization, importance highlighting, and automated drafting.',
    url: 'https://smart-mail-gamma.vercel.app',
    repo: 'https://github.com/DLinacre/smart-mail',
    tags: ['ai', 'email', 'gemini', 'inbox', 'react', 'pwa', 'gmail', 'productivity'],
    highlights: [
      'Multi-account Google Workspace & Gmail synchronization in a clean unified interface.',
      'Gemini AI importance scoring highlights critical messages and generates action items.',
      'One-click newsletter detection and bulk subscription cleanup.',
    ],
    tech: ['React 19', 'TypeScript', 'Google Gemini API', 'Tailwind CSS', 'PWA'],
    year: 2026,
  },
  {
    name: 'PokeGuru',
    badge: 'NEW',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🃏',
    artwork: '/banners/pokeguru.webp',
    blurb:
      'High-performance UK Pokémon TCG intelligence database and portfolio tracker with real-time GBP (£) card valuations and full 15,000+ card set archives.',
    url: 'https://dlinacre.github.io/PokeGuru/',
    repo: 'https://github.com/DLinacre/PokeGuru',
    tags: ['pokemon', 'tcg', 'cards', 'pricing', 'react', 'portfolio', 'indexeddb'],
    highlights: [
      'Real-time UK GBP (£) currency conversions for collectors and trade valuations.',
      'Local IndexedDB binder portfolio vault tracking card condition and collection value.',
      'Deep query search across 15,000+ cards from 1999 to present.',
    ],
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'IndexedDB'],
    year: 2026,
  },
  {
    name: 'Life Hacks',
    badge: 'NEW',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '💡',
    artwork: '/banners/life-hacks.png',
    blurb:
      'Practical life hacks and hardware fix PWA, featuring a step-by-step DIY capacitive stylus build guide for phones and drawing tablets.',
    url: 'https://dlinacre.github.io/life-hacks/',
    repo: 'https://github.com/DLinacre/life-hacks',
    tags: ['hacks', 'diy', 'hardware', 'stylus', 'pwa', 'offline', 'lifestyle'],
    highlights: [
      'Step-by-step DIY capacitive stylus tutorial with diagrammatic build flow.',
      'Works 100% offline as an installable Progressive Web App.',
      'Tested companion stylus designed specifically for digital sketch and touch apps.',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'PWA', 'Offline-First'],
    year: 2026,
  },
  {
    name: "Nic's Food Decider",
    badge: 'NEW',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🍽️',
    artwork: '/banners/nic-food-decider.png',
    blurb:
      'One-click dinner decision engine solving meal paralysis with Cook vs Takeaway modes, 3× favourite weighting, and dietary filters.',
    url: 'https://nic-food-decider.vercel.app',
    repo: 'https://github.com/DLinacre/nic-food-decider',
    tags: ['food', 'decider', 'dinner', 'recipes', 'python', 'flask', 'sqlite'],
    highlights: [
      'Dual Cook vs Takeaway engine with dynamic probability weighting for favorites.',
      'Dietary filters (vegetarian, vegan, gluten-free) across 50+ pre-seeded meals.',
      'Decision history logging to avoid repeating recent meals.',
    ],
    tech: ['Python', 'Flask', 'SQLAlchemy', 'SQLite', 'Vercel Serverless'],
    year: 2026,
  },
];

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const gamesJsonPath = path.join(root, 'public', 'games', 'games.json');
const indexHtmlPath = path.join(root, 'public', 'games', 'index.html');
const distOnly = process.argv.includes('--dist');

const raw = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));

// 1. Filter out all games requiring files
const existingInstantGames = raw.games.filter(g => {
  if (g.status === 'files') return false;
  const text = (JSON.stringify(g) || '').toLowerCase();
  if (
    text.includes('own the game') ||
    text.includes('bring your own') ||
    text.includes('custom files')
  ) {
    return false;
  }
  return true;
});

// Final instant play list
const finalGames = existingInstantGames;
console.log(`[build-games] Assembling ${finalGames.length} listed browser game links...`);

// Production builds write only to dist; the explicit games:build command
// refreshes checked-in generated files and must be reviewed before committing.
const jsonOutput = distOnly ? path.join(root, 'dist', 'games', 'games.json') : gamesJsonPath;
fs.mkdirSync(path.dirname(jsonOutput), { recursive: true });
fs.writeFileSync(jsonOutput, JSON.stringify({ games: finalGames }, null, 2), 'utf8');

function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const catLabels = {
  survivors: 'Survivors & Roguelite',
  zombies: 'Zombies & Co-op',
  shooters: 'Shooters & FPS',
  'classic-pc': 'Classic PC & Retro Ports',
  openworld: 'Open World & Action',
  strategy: 'Strategy & Sim',
  sports: 'Sports & Arcade',
};

const catCounts = {};
const statusCounts = {};

finalGames.forEach(g => {
  catCounts[g.category] = (catCounts[g.category] || 0) + 1;
  statusCounts[g.status] = (statusCounts[g.status] || 0) + 1;
});

// Category pills
const catOrder = [
  'survivors',
  'zombies',
  'shooters',
  'classic-pc',
  'openworld',
  'strategy',
  'sports',
];
let catPillsHtml = `\n          <button class="pill active" data-category="all">All <span>${finalGames.length}</span></button>`;
for (const cat of catOrder) {
  const count = catCounts[cat] || 0;
  if (count > 0) {
    const label = catLabels[cat] || cat;
    catPillsHtml += `\n          <button class="pill" data-category="${escapeHtml(cat)}">${escapeHtml(label)} <span>${count}</span></button>`;
  }
}
catPillsHtml += '\n';

// Status pills (Instant & Online only)
let statusPillsHtml = '\n          <button class="seg active" data-status="all">Any</button>';
if (statusCounts['instant']) {
  statusPillsHtml += `\n          <button class="seg" data-status="instant" title="Listed as browser games">Browser <span>${statusCounts['instant']}</span></button>`;
}
if (statusCounts['multiplayer']) {
  statusPillsHtml += `\n          <button class="seg" data-status="multiplayer" title="Multiplayer">Online <span>${statusCounts['multiplayer']}</span></button>`;
}
statusPillsHtml += '\n';

// Cards HTML
let cardsHtml = '';
for (const g of finalGames) {
  const platform = g.engine?.includes('WebGPU')
    ? 'WebGPU'
    : g.engine?.includes('WebGL')
      ? 'WebGL'
      : g.engine?.includes('WebAssembly') || g.engine?.includes('WASM')
        ? 'Wasm'
        : 'HTML5';

  const tagsArr = [
    g.title,
    g.shortTitle,
    ...(g.tags || []),
    g.categoryLabel,
    g.dev,
    g.engine,
    ...(g.alsoKnownAs || []),
    'new tab games',
    'instant play',
    'browser game',
    platform,
  ].filter(Boolean);
  const tagsStr = tagsArr.join(' ').toLowerCase();
  const isNew = Boolean(g.isNew);
  const statusBadgeClass = g.status === 'multiplayer' ? 'is-multiplayer' : 'is-instant';
  const statusBadgeText = g.status === 'multiplayer' ? 'Online' : 'Browser';

  let coverSrc = g.cover || '/games/assets/brand/banner.svg';
  if (!coverSrc.startsWith('/') && !coverSrc.startsWith('http')) {
    coverSrc = '/games/' + coverSrc;
  }

  cardsHtml += `
        <article class="game-card" id="game-${escapeHtml(g.id)}" data-id="${escapeHtml(g.id)}" data-category="${escapeHtml(g.category)}" data-status="${escapeHtml(g.status)}" data-platform="${escapeHtml(platform)}" data-title="${escapeHtml(g.title.toLowerCase())}" data-year="${escapeHtml(g.year)}" data-tags="${escapeHtml(tagsStr)}">
          <a class="cover" href="${escapeHtml(g.url)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
            <img src="${escapeHtml(coverSrc)}" alt="" loading="lazy" decoding="async" width="640" height="360" onerror="this.onerror=null;this.src='/games/assets/brand/banner.svg'">
            <div class="cover-overlay"><span class="cover-play-badge">↗ Open game</span></div>
            <span class="badge ${statusBadgeClass}">${statusBadgeText}</span>
            ${isNew ? '<span class="badge badge--new">New</span>' : ''}
            <span class="badge badge--platform badge--${escapeHtml(platform.toLowerCase())}">${escapeHtml(platform)}</span>
          </a>
          <div class="card-body">
            <h3 class="game-title"><a href="${escapeHtml(g.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(g.title)}</a></h3>
            <p class="game-meta">${escapeHtml(g.categoryLabel)} · ${g.year}</p>
            <p class="game-desc">${escapeHtml(g.desc)}</p>
            <div class="card-info" hidden>
              ${g.goodToKnow ? `<p><b>Good to know</b> ${escapeHtml(g.goodToKnow)}</p>` : ''}
              ${g.controls ? `<p><b>Controls</b> ${escapeHtml(g.controls)}</p>` : ''}
              <p class="card-dev">${escapeHtml(g.dev)} · ${escapeHtml(g.engine)}</p>
            </div>
            <div class="card-actions">
              <a class="btn-play" href="${escapeHtml(g.url)}" target="_blank" rel="noopener noreferrer">Open game</a>
              <button class="btn-info" type="button" aria-expanded="false">Info</button>
              <button class="btn-share" type="button" data-id="${escapeHtml(g.id)}" data-title="${escapeHtml(g.title)}" title="Copy direct link to ${escapeHtml(g.title)}" aria-label="Copy direct link to ${escapeHtml(g.title)}"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
            </div>
          </div>
        </article>`;
}
cardsHtml += '\n';

// Replace inside public/games/index.html
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace pills & cards
html = html.replace(
  /<!-- CATEGORY-PILLS:START -->[\s\S]*?<!-- CATEGORY-PILLS:END -->/,
  `<!-- CATEGORY-PILLS:START -->${catPillsHtml}<!-- CATEGORY-PILLS:END -->`,
);
html = html.replace(
  /<!-- STATUS-PILLS:START -->[\s\S]*?<!-- STATUS-PILLS:END -->/,
  `<!-- STATUS-PILLS:START -->${statusPillsHtml}<!-- STATUS-PILLS:END -->`,
);
html = html.replace(
  /<!-- GAMES:START -->[\s\S]*?<!-- GAMES:END -->/,
  `<!-- GAMES:START -->${cardsHtml}<!-- GAMES:END -->`,
);

// Replace count references
html = html.replace(
  /<strong data-count-games>\d+<\/strong>/,
  `<strong data-count-games>${finalGames.length}</strong>`,
);
html = html.replace(
  /Showing <strong>\d+<\/strong> of \d+ games/,
  `Showing <strong>${finalGames.length}</strong> of ${finalGames.length} games`,
);
html = html.replace(
  /placeholder="Search games, series, studios…"|placeholder="Search games, series, new tab games…" aria-label="Search games"/,
  'placeholder="Search games, series, new tab games…" aria-label="Search games"',
);

// Add styles for hover overlays, sound toggle, and platform badges if not present
if (!html.includes('.cover-play-badge')) {
  const extraStyles = `
    /* Enhanced Card Hover & Overlays */
    .game-card {
      position: relative;
      transition: transform 0.22s var(--ease), border-color 0.22s var(--ease), box-shadow 0.22s var(--ease);
    }
    .game-card:hover {
      transform: translateY(-4px);
      border-color: rgba(143, 214, 255, 0.48);
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.65), 0 0 20px rgba(143, 214, 255, 0.16);
    }
    .cover-overlay {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background: rgba(7, 8, 12, 0.45); backdrop-filter: blur(2px);
      opacity: 0; transition: opacity 0.2s var(--ease); pointer-events: none;
    }
    .game-card:hover .cover-overlay { opacity: 1; }
    .cover-play-badge {
      display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px;
      background: #00f0ff; color: #04121c; font: 800 0.74rem/1 var(--display);
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.55); transform: scale(0.92);
      transition: transform 0.2s var(--ease);
    }
    .game-card:hover .cover-play-badge { transform: scale(1); }

    /* Platform badge specific glows */
    .badge--webgpu { color: #d8b4fe !important; border-color: rgba(192, 132, 252, 0.4) !important; background: rgba(88, 28, 135, 0.4) !important; }
    .badge--webgl { color: #7dd3fc !important; border-color: rgba(56, 189, 248, 0.4) !important; background: rgba(3, 105, 161, 0.4) !important; }
    .badge--wasm { color: #6ee7b7 !important; border-color: rgba(52, 211, 153, 0.4) !important; background: rgba(6, 95, 70, 0.4) !important; }
    .badge--html5 { color: #fde047 !important; border-color: rgba(250, 204, 21, 0.4) !important; background: rgba(133, 77, 14, 0.4) !important; }

    /* Sound FX Toggle Button */
    .btn-sound {
      display: inline-flex; align-items: center; gap: 5px;
      height: 34px; padding: 0 11px; border-radius: 999px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--line-2);
      color: var(--muted); font: 700 0.74rem/1 var(--display);
      cursor: pointer; transition: color 0.15s, border-color 0.15s, background-color 0.15s;
    }
    .btn-sound:hover, .btn-sound.is-on {
      color: #fff; border-color: var(--accent); background: rgba(143, 214, 255, 0.1);
    }
    .btn-sound.is-on { color: var(--accent); }

    /* Featured AAA Hits Ribbon */
    .featured-ribbon {
      margin-top: 14px; padding: 10px 14px; border-radius: 12px;
      background: linear-gradient(90deg, rgba(143, 214, 255, 0.08), rgba(0, 240, 255, 0.02));
      border: 1px solid rgba(143, 214, 255, 0.22);
      display: flex; flex-direction: column; gap: 8px;
    }
    .featured-ribbon-header {
      display: flex; align-items: center; gap: 7px;
      font: 800 0.72rem/1 var(--display); letter-spacing: 0.5px;
    }
    .ribbon-glow-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #00f0ff; box-shadow: 0 0 8px #00f0ff;
    }
    .ribbon-title { color: #fff; font-weight: 800; }
    .ribbon-subtitle { color: var(--dim); font-size: 0.68rem; margin-left: auto; }
    .featured-ribbon-chips {
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    .chip {
      height: 28px; padding: 0 10px; border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.03);
      color: var(--muted); font: 700 0.72rem/1 var(--display);
      cursor: pointer; transition: all 0.15s var(--ease);
      display: inline-flex; align-items: center; gap: 5px;
    }
    .chip:hover {
      color: #fff; border-color: var(--accent); background: rgba(143, 214, 255, 0.12);
      transform: translateY(-1px);
    }
  `;
  html = html.replace('</style>', `${extraStyles}\n  </style>`);
}

// Add the sound toggle button in topbar if not present
if (!html.includes('id="soundToggle"')) {
  html = html.replace(
    '<button class="btn-surprise" id="surpriseBtn"',
    '<button class="btn-sound" id="soundToggle" type="button" title="Toggle retro audio FX">🔊 Sound: Off</button>\n        <button class="btn-surprise" id="surpriseBtn"',
  );
}

// Add the featured ribbon after intro if not present
if (!html.includes('class="featured-ribbon"')) {
  const ribbonHtml = `
      <div class="featured-ribbon" aria-label="Featured instant AAA browser hits">
        <div class="featured-ribbon-header">
          <span class="ribbon-glow-dot"></span>
          <span class="ribbon-title">FEATURED AAA INSTANT HITS</span>
          <span class="ribbon-subtitle">Click to jump or filter</span>
        </div>
        <div class="featured-ribbon-chips">
          <button class="chip" type="button" data-chip="Need for Speed">🏎️ NFS Most Wanted</button>
          <button class="chip" type="button" data-chip="Super Mario 64">⭐ Super Mario 64</button>
          <button class="chip" type="button" data-chip="Lethal Company">🧟 Lethal Company</button>
          <button class="chip" type="button" data-chip="ChronoDivide">⚔️ C&amp;C: Red Alert</button>
          <button class="chip" type="button" data-chip="Quake">💥 Quake III Arena</button>
          <button class="chip" type="button" data-chip="Stardew Valley">🌾 Stardew Valley</button>
          <button class="chip" type="button" data-chip="Cuphead">🥊 Cuphead</button>
          <button class="chip" type="button" data-chip="Slow Roads">🌄 Slow Roads</button>
          <button class="chip" type="button" data-chip="Townscaper">🏰 Townscaper</button>
          <button class="chip" type="button" data-chip="Wolfenstein">🔫 Wolfenstein 3D</button>
        </div>
      </div>`;
  html = html.replace(
    '</section>\n\n    <section class="container" id="library"',
    `${ribbonHtml}\n    </section>\n\n    <section class="container" id="library"`,
  );
}

// Add the Web Audio FX script into the bottom script if not present
if (!html.includes('audioEngine')) {
  const audioScript = `
      /* ---- Procedural Web Audio Synth FX Engine ---- */
      const audioEngine = (() => {
        let ctx = null;
        let enabled = localStorage.getItem('tabulous_audio') === '1';

        function init() {
          if (!ctx && window.AudioContext) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
          }
          if (ctx && ctx.state === 'suspended') ctx.resume();
        }

        function playTone(freq, dur = 0.05, type = 'sine') {
          if (!enabled) return;
          init();
          if (!ctx) return;
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + dur);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
          } catch (e) {}
        }

        return {
          toggle() {
            enabled = !enabled;
            localStorage.setItem('tabulous_audio', enabled ? '1' : '0');
            if (enabled) { init(); playTone(650, 0.06); }
            return enabled;
          },
          isEnabled() { return enabled; },
          click() { playTone(480, 0.03, 'sine'); },
          coin() {
            if (!enabled) return;
            init();
            [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
              setTimeout(() => playTone(f, 0.08, 'triangle'), i * 40);
            });
          },
          chime() {
            if (!enabled) return;
            init();
            playTone(880, 0.06, 'sine');
            setTimeout(() => playTone(1320, 0.08, 'sine'), 60);
          }
        };
      })();

      const soundBtn = $('#soundToggle');
      if (soundBtn) {
        const updateSoundLabel = () => {
          const on = audioEngine.isEnabled();
          soundBtn.classList.toggle('is-on', on);
          soundBtn.textContent = on ? '🔊 Sound: On' : '🔈 Sound: Off';
        };
        updateSoundLabel();
        soundBtn.addEventListener('click', () => {
          audioEngine.toggle();
          updateSoundLabel();
        });
      }

      // Hook chip clicks
      $$('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          audioEngine.click();
          const query = btn.dataset.chip || '';
          search.value = query;
          state.q = query.toLowerCase().trim();
          apply();
          const first = grid.querySelector('.game-card:not([hidden])');
          if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
  `;
  html = html.replace(
    "$('#surpriseBtn')?.addEventListener('click', surpriseMe);",
    `$('#surpriseBtn')?.addEventListener('click', () => { audioEngine.coin(); surpriseMe(); });\n${audioScript}`,
  );
}

// Keep generated HTML deterministic and free of whitespace-only lines.
html = html.replace(/[\t ]+$/gm, '');
const htmlOutput = distOnly ? path.join(root, 'dist', 'games', 'index.html') : indexHtmlPath;
fs.mkdirSync(path.dirname(htmlOutput), { recursive: true });
fs.writeFileSync(htmlOutput, html, 'utf8');

console.log('[build-games] Successfully refreshed games index with audio FX and featured ribbon!');

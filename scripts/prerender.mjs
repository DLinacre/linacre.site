/**
 * Static prerenderer for linacre.site
 * -----------------------------------
 * Runs after `vite build`. For every route in route-meta.json it emits
 * dist/<route>/index.html containing:
 *   1. A single, correctly ordered head (charset/viewport first, one OG set,
 *      one Twitter set, canonical, robots) sourced only from route-meta.json.
 *   2. Route-appropriate JSON-LD (Person/WebSite everywhere; ItemList on /).
 *   3. A semantic static content snapshot inside #root so crawlers and no-JS
 *      visitors get real page content. React replaces it on hydration.
 * It also generates dist/sitemap.xml (index:true routes only, real lastmod)
 * and FAILS THE BUILD if any sitemap URL lacks an emitted file.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as esbuild } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender] dist/index.html not found — run vite build first.');
  process.exit(1);
}

// ---------------------------------------------------------------- utilities
const esc = (s = '') =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// ------------------------------------------------------------- site content
// Strip a possible UTF-8 BOM before parsing -- some Windows editors/tools
// save JSON with a leading BOM, which breaks JSON.parse silently otherwise.
const stripBom = s => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);
const meta = JSON.parse(stripBom(fs.readFileSync(path.join(root, 'route-meta.json'), 'utf8')));

// Bundle the typed data module, then import it.
const dataBundle = path.join(distDir, '.prerender-data.mjs');
await esbuild({
  entryPoints: [path.join(root, 'scripts', 'prerender-data.entry.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: dataBundle,
  logLevel: 'silent',
});
const { data } = await import(pathToFileURL(dataBundle).href);
fs.rmSync(dataBundle, { force: true });

const SITE = 'https://www.linacre.site';
const PERSON = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'David Christopher Linacre',
  alternateName: 'David Linacre',
  url: `${SITE}/`,
  image: `${SITE}/profile_avatar.webp`,
  email: 'mailto:david@linacre.site',
  jobTitle: 'Full-Stack Engineer & AI Systems Builder',
  description:
    'UK-based freelance full-stack & AI engineer. React, TypeScript, Go, Python. Systems audits, custom builds, fractional retainer.',
  address: { '@type': 'PostalAddress', addressCountry: 'GB', addressRegion: 'England' },
  sameAs: ['https://github.com/DLinacre', 'https://linkedin.com/in/david-linacre', `${SITE}/`],
  knowsAbout: [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Go',
    'Python',
    'PostgreSQL',
    'AI engineering',
    'DevOps',
    'Developer Tools',
  ],
  worksFor: { '@id': `${SITE}/#org` },
};
const ORGANIZATION = {
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#org`,
  name: 'Linacre — David Linacre Freelance Engineering',
  alternateName: 'linacre.site',
  url: `${SITE}/`,
  logo: `${SITE}/icon-512.png`,
  image: `${SITE}/og.png`,
  priceRange: '£££',
  email: 'david@linacre.site',
  founder: { '@id': `${SITE}/#person` },
  areaServed: ['GB', 'EU', 'US', 'Worldwide'],
  slogan: 'Reliable web applications, developer tools and automation systems.',
  sameAs: ['https://github.com/DLinacre', 'https://linkedin.com/in/david-linacre'],
};
const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'linacre.site',
  description:
    "Selected software, browser tools and games by David Linacre.",
  inLanguage: 'en-GB',
  publisher: { '@id': `${SITE}/#org` },
};

const ROUTE_LABEL = Object.fromEntries(
  Object.entries(meta.routes).map(([route, m]) => [route, m.title.split(' — ')[0].split(' | ')[0]]),
);

const publicProjects = data.projects.filter(p => p.url);
const osintPayload = JSON.parse(
  fs.readFileSync(path.join(root, 'public', 'data', 'osint-hud.json'), 'utf8'),
);
const osintCounts = osintPayload.groups.reduce(
  (counts, group) => {
    counts.sectors += 1;
    counts.categories += group.cats.length;
    counts.tools += group.cats.reduce((total, category) => total + category.links.length, 0);
    return counts;
  },
  { tools: 0, categories: 0, sectors: 0 },
);

function breadcrumbFor(route) {
  if (route === '/') return null;
  const parts = route.split('/').filter(Boolean);
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }];
  let running = '';
  parts.forEach((p, i) => {
    running += `/${p}`;
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: ROUTE_LABEL[running] || decodeURIComponent(p).replace(/-/g, ' '),
      item: `${SITE}${running}`,
    });
  });
  return { '@type': 'BreadcrumbList', itemListElement: items };
}

function jsonLdFor(route, m) {
  const graph = [PERSON, ORGANIZATION, WEBSITE];
  const bc = breadcrumbFor(route);
  if (bc) graph.push(bc);
  if (route === '/') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${SITE}/#work`,
      name: 'Projects by David Linacre',
      itemListElement: publicProjects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': p.name === 'Music Videos' ? 'CreativeWork' : 'SoftwareApplication',
          name: p.name,
          url: p.url.startsWith('/') ? `${SITE}${p.url}` : p.url,
          description: p.blurb,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          author: { '@id': `${SITE}/#person` },
        },
      })),
    });
  }
  if (route === '/') {
    graph.push({
      '@type': 'WebPage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: m.title,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#person` },
      primaryImageOfPage: `${SITE}/og.png`,
      inLanguage: 'en-GB',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#main-content h1', '#main-content p'],
      },
    });
  }
  if (route === '/contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${SITE}/contact#page`,
      url: `${SITE}/contact`,
      name: m.title,
      mainEntity: {
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#service`,
        name: 'David Linacre Consulting',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'david@linacre.site',
          url: `${SITE}/contact`,
        },
      },
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function headFor(route, m) {
  const robots = m.index ? 'index, follow' : 'noindex, nofollow';
  const image = m.image || meta.site.defaultImage;
  const title = esc(m.title);
  const desc = esc(m.description);
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${m.canonical}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(meta.site.name)}" />`,
    `<meta property="og:locale" content="${esc(meta.site.locale)}" />`,
    `<meta property="og:url" content="${m.canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${title}" />`,
    `<meta name="twitter:card" content="${esc(meta.site.twitterCard)}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  // PERF-02: preload the avatar only where it renders as an above-the-fold
  // LCP candidate — /about alone.
  if (route === '/about') {
    lines.push(
      `<link rel="preload" as="image" href="/profile_avatar.webp" type="image/webp" fetchpriority="high" />`,
    );
  }
  lines.push(`<script type="application/ld+json">${jsonLdFor(route, m)}</script>`);
  return lines.join('\n    ');
}

// ------------------------------------------------- static content snapshots
const NAV = [
  ['/', 'Home'],
  ['/tools', 'Tools'],
  ['/games', 'Games'],
  ['/music-videos', 'Music Videos'],
  ['/osint', 'OSINT HUD'],
  ['/orbit', 'Orbit'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const SHELL_CSS = `
#prerender-shell{position:absolute;top:0;left:0;right:0;max-width:60rem;margin:0 auto;padding:2rem 1.25rem;background:#030c14;color:#e5e5e5;
font-family:Inter,ui-sans-serif,system-ui,sans-serif;line-height:1.65;min-height:100vh}
#prerender-shell a{color:#22d3ee;text-decoration:none}#prerender-shell a:hover{text-decoration:underline}
#prerender-shell nav{display:flex;flex-wrap:wrap;gap:.9rem;margin:1rem 0 2rem;font-family:'JetBrains Mono',monospace;font-size:.85rem}
#prerender-shell h1,#prerender-shell h2,#prerender-shell h3{font-family:'Space Grotesk',Inter,sans-serif;line-height:1.25}
#prerender-shell h1{font-size:1.9rem;margin:.25rem 0 .75rem}#prerender-shell h2{font-size:1.3rem;margin:2rem 0 .5rem;color:#22d3ee}
#prerender-shell h3{font-size:1.05rem;margin:1.25rem 0 .4rem}
#prerender-shell pre{background:#061923;border:1px solid #232838;border-radius:8px;padding:1rem;overflow:auto;font-size:.85rem}
#prerender-shell code{font-family:'JetBrains Mono',monospace;color:#9fe8ff}
#prerender-shell ul{padding-left:1.25rem}#prerender-shell li{margin:.3rem 0}
#prerender-shell .brand{font-family:'JetBrains Mono',monospace;font-weight:700;color:#22d3ee;font-size:1rem}
#prerender-shell .meta{color:#8b93a7;font-size:.85rem;font-family:'JetBrains Mono',monospace}
#prerender-shell .cta{display:inline-block;background:#22d3ee;color:#030c14;font-weight:700;padding:.6rem 1.1rem;border-radius:8px;margin:.5rem .75rem .5rem 0}
#prerender-shell .cta.alt{background:transparent;color:#22d3ee;border:1px solid #22d3ee}
#prerender-shell footer{margin-top:3rem;border-top:1px solid #232838;padding-top:1.25rem;font-size:.85rem;color:#8b93a7}
#prerender-shell .skip-link{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}
#prerender-shell .skip-link:focus,#prerender-shell .skip-link:focus-visible{left:1rem;top:1rem;width:auto;height:auto;
padding:.6rem 1rem;background:#030c14;color:#22d3ee;border:2px solid #22d3ee;border-radius:8px;z-index:9999;
font-family:'JetBrains Mono',monospace;font-weight:700;overflow:visible}
#prerender-shell a:focus-visible,#prerender-shell button:focus-visible,#prerender-shell input:focus-visible,
#prerender-shell select:focus-visible,#prerender-shell textarea:focus-visible{outline:2px solid #22d3ee;outline-offset:2px;border-radius:4px}
@media (prefers-reduced-motion: reduce){#prerender-shell *{animation:none!important;transition:none!important}}
`.trim();

const CTA_BLOCK = `
<p>
  <a class="cta" href="/contact">Start a project — get in touch</a>
  <a class="cta alt" href="/#work">See selected work</a>
</p>`;

function pageBody(route) {
  switch (route) {
    case '/':
      return `<h1>Independent software, made with purpose.</h1>
<p>Selected work by David Linacre, a self-taught developer in South Yorkshire.</p>
<h2>Selected work</h2><ul><li><a href="/tools">Browser Tools</a> — useful utilities in your browser.</li><li><a href="/osint">OSINT HUD</a> — a searchable directory of research resources.</li><li><a href="/music-videos">Music Videos</a> — the Proper Mad collection.</li></ul>
<h2>Games</h2><p><a href="/games">Explore Circuit, Decrypt and Gridlock.</a></p>
<p><a href="/about">About David</a> · <a href="/contact">Contact</a></p>`;

    case '/tools': {
      const byCat = {};
      for (const t of data.tools) (byCat[t.category] ||= []).push(t);
      const catRows = Object.entries(byCat)
        .map(
          ([cat, tools]) =>
            `### ${esc(cat)}\n${tools.map(t => `- ${esc(t.name)}${t.url ? ` (${esc(t.url)})` : ''} — ${esc(t.description)}`).join('\n')}`,
        )
        .join('\n\n');
      return `
<h1>Tools that actually do the job</h1>
<p>Browser utilities that run entirely on your device — nothing you paste leaves your machine —
plus a curated directory of external tools used daily.</p>
<h2>Quick tools</h2>
<ul>
  <li><strong>JSON formatter</strong> — validate, format and minify JSON.</li>
  <li><strong>Base64 converter</strong> — encode and decode UTF-8 text.</li>
  <li><strong>Timestamp converter</strong> — Unix, ISO, local and UTC time.</li>
  <li><strong>Secure generator</strong> — UUIDs and strong passwords with browser cryptography.</li>
  <li><strong>UK VAT calculator</strong> — add or extract VAT at any rate.</li>
  <li><strong>Text cleaner</strong> — count, re-case, deduplicate, sort and trim.</li>
  <li><strong>SHA-256 generator</strong> — local text fingerprint with Web Crypto.</li>
  <li><strong>URL cleaner</strong> — remove common tracking parameters.</li>
  <li><strong>Playground</strong> — JWT decoder, regex tester, JSON→TS, cron explainer and more.</li>
</ul>
<p class="meta">Enable JavaScript to use the interactive utilities on this page.</p>
<h2>Curated directory</h2>
${catRows}
${CTA_BLOCK}`;
    }

    case '/games':
      return `<h1>Games for the in-between</h1><p>Three browser games from LIN4CRE.</p><ul><li><a href="/games/circuit">Circuit</a> — rotate the wires.</li><li><a href="/games/decrypt">Decrypt</a> — crack the code.</li><li><a href="/games/gridlock">Gridlock</a> — claim the board.</li></ul>`;

    case '/music-videos': {
      const tracks = data.musicVideos
        .map(
          (track, index) =>
            `  <li><a href="https://lin4cre.github.io/linacre-music-videos/#${esc(track.id)}">${esc(track.title)}</a> <span class="meta">${String(index + 1).padStart(2, '0')} · ${esc(track.duration)} · ${esc(track.genre)}</span></li>`,
        )
        .join('\n');
      return `
<h1>Music Videos — The Proper Mad collection</h1>
<p>The official cinema player hosts ${data.musicVideos.length} original lyric-video masters, with the original artwork, timed lyrics, playlist, playback controls, theatre mode and audio profiles.</p>
<p><a href="https://lin4cre.github.io/linacre-music-videos/#the-road-beyond">Open The Road Beyond in the official player</a></p>
<h2>Track collection</h2>
<ul>
${tracks}
</ul>
<p>The video masters remain on the official project host rather than being duplicated into this site.</p>
`;
    }

    case '/osint': {
      const sectors = osintPayload.groups
        .map(
          group =>
            `  <li><strong>${esc(group.name)}</strong> — ${group.cats.length} categories and ${group.cats.reduce((total, category) => total + category.links.length, 0)} resources.</li>`,
        )
        .join('\n');
      return `
<h1>OSINT HUD — ${osintCounts.tools.toLocaleString('en-GB')} curated resources</h1>
<p>Search and browse ${osintCounts.tools.toLocaleString('en-GB')} public research links across ${osintCounts.sectors} sectors and ${osintCounts.categories} categories. Search, favorites, recents, and world clocks run client-side.</p>
<h2>Research sectors</h2>
<ul>
${sectors}
</ul>
<p>Use these third-party resources lawfully, respect privacy and provider terms, and obtain appropriate consent. The curated directory is available from the <a href="https://github.com/LIN4CRE/linacre-osint-hud">original project source</a>.</p>
<p class="meta">Enable JavaScript to search and interact with the directory. Search filters are stored in the URL fragment, not sent to the site server.</p>
`;
    }

    case '/orbit':
      return `
<h1>Orbit &amp; Earth Observatory</h1>
<p>Real-time planetary desk tracking the International Space Station, the solar day/night terminator, global M4.5+ seismic events, upcoming orbital launches, and live sky conditions over Barnsley (53.55°N, 1.48°W).</p>
<ul>
  <li><strong>ISS Live Telemetry</strong> — real-time latitude, longitude, altitude, velocity and 90-minute orbital ground track.</li>
  <li><strong>Solar Terminator &amp; Lunar Phase</strong> — live sub-solar point, day/night boundary and moon illumination.</li>
  <li><strong>USGS M4.5+ Seismic Feed</strong> — past 24 hours of global earthquakes plotted on an equirectangular world map.</li>
  <li><strong>Orbital Launch Schedule</strong> — upcoming rocket launches with live T-minus countdowns.</li>
</ul>
`;

    case '/about':
      return `<h1>About David Linacre</h1><p>David is a self-taught software developer based in Barnsley, South Yorkshire, building browser tools, games and creative experiments.</p><p><a href="https://github.com/LIN4CRE">GitHub</a> · <a href="/contact">Contact</a></p>`;

    case '/contact':
      return `<h1>Contact David Linacre</h1><p>Send an enquiry through the contact form, or email david@linacre.site.</p>`;

    case '/lab':
      return `
<h1>AI Lab</h1>
<p>An interactive AI sandbox: chat with models, inspect provider configurations and run browser experiments. Enable JavaScript to use the lab.</p>
${CTA_BLOCK}`;

    case '/identity':
      return `
<h1>Identity Studio</h1>
<p>Export coordinated SVG and PNG logos, GitHub banners, avatars and social cards — endless generated emblems and full-spectrum custom colour boxes. Enable JavaScript to use the studio.</p>
${CTA_BLOCK}`;

    case '/mob-deals':
      return `
<h1>Mob Deals — UK SIM-only comparison</h1>
<p>Filter UK 5G SIM-only contracts by budget and data allowance, then follow the 3-step PAC code guide to switch networks seamlessly. Enable JavaScript to use the interactive filters.</p>
${CTA_BLOCK}`;

    case '/pokeguru':
      return `
<h1>PokeGuru — Pokémon TCG price search</h1>
<p>Browse UK Pokémon TCG set expansions, track chase-card market values in GBP and evaluate rarity tiers. Enable JavaScript to use the search.</p>
${CTA_BLOCK}`;

    case '/ops':
      return `
<h1>Ecosystem Operations HUD</h1>
<p>Unified operations HUD for David Linacre's 60 repositories across GitHub and GitLab Ultimate, CI/CD telemetry, and one-click automation controls. Enable JavaScript to interact with the HUD.</p>
${CTA_BLOCK}`;

    default:
      return `
<h1>${esc(meta.routes[route]?.title.split(' — ')[0] || 'linacre.site')}</h1>
<p>${esc(meta.routes[route]?.description || '')}</p>`;
  }
}

const viteHtml = fs.readFileSync(templatePath, 'utf8');

function buildShell(route, m) {
  const hreflang =
    route === '/'
      ? ''
      : `    <link rel="alternate" hreflang="en-GB" href="${m.canonical}" />\n    <link rel="alternate" hreflang="x-default" href="${m.canonical}" />\n`;

  let html = viteHtml;

  // Replace head metadata block with route-specific head & JSON-LD
  if (html.includes('<!--ROUTE_HEAD-->') && html.includes('<!--/ROUTE_HEAD-->')) {
    html = html.replace(
      /<!--ROUTE_HEAD-->[\s\S]*?<!--\/ROUTE_HEAD-->/,
      `<!--ROUTE_HEAD-->\n    ${headFor(route, m)}\n${hreflang}    <!--/ROUTE_HEAD-->`
    );
  }

  // Inject semantic content into #root for crawlers / noscript
  const fallback = `
    <noscript>
      <div id="prerender-shell" style="max-width:60rem;margin:0 auto;padding:2rem 1.25rem;color:#e5e5e5;font-family:sans-serif;">
        <span class="brand" style="font-weight:bold;color:#22d3ee;font-size:1.2rem;">linacre.site</span>
        <nav style="display:flex;gap:1rem;margin:1rem 0;">${NAV.map(([href, label]) => `<a href="${href}" style="color:#22d3ee;">${label}</a>`).join('')}</nav>
        <div id="main-content">${pageBody(route)}</div>
        <footer style="margin-top:2rem;border-top:1px solid #333;padding-top:1rem;color:#888;">© ${new Date().getFullYear()} David Linacre</footer>
      </div>
    </noscript>
  `;

  if (html.includes('<!--ROUTE_CONTENT-->')) {
    html = html.replace('<!--ROUTE_CONTENT-->', fallback);
  }

  return html;
}

// ---------------------------------------------------------------- emit pages
const written = [];
for (const [route, m] of Object.entries(meta.routes)) {
  const out =
    route === '/' ? templatePath : path.join(distDir, route.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buildShell(route, m));
  written.push(route);
  console.log(`[prerender] ${route} → ${path.relative(distDir, out)}`);
}

// ---------------------------------------------------------- sitemap.xml
// SEO: derive lastmod from the actual mtime of the file that drives each
// page's content, not the build timestamp.
const isoDate = d => (d && d.length === 10 ? `${d}T00:00:00+00:00` : d);
const indexable = Object.entries(meta.routes).filter(([, m]) => m.index);

const ROUTE_LASTMOD_SOURCES = {
  '/': ['route-meta.json', 'src/App.tsx', 'src/data/siteProjects.ts'],
  '/tools': ['src/components/Tools.tsx', 'src/components/QuickTools.tsx', 'src/data.ts'],
  '/games': ['public/games/index.html', 'public/games/games.json'],
  '/music-videos': ['src/components/MusicVideos.tsx', 'src/data/musicVideos.ts'],
  '/osint': ['src/components/OsintHud.tsx', 'public/data/osint-hud.json'],
  '/orbit': ['src/components/OrbitObservatory.tsx', 'src/lib/orbit.ts', 'src/data/worldLand.ts'],
  '/about': ['src/components/About.tsx'],
  '/lab': ['src/components/Lab.tsx'],
  '/identity': ['src/components/IdentityHub.tsx'],
  '/contact': ['src/components/Contact.tsx'],
  '/privacy': ['src/components/Privacy.tsx'],
  '/cookie-policy': ['src/components/CookiePolicy.tsx'],
  '/terms': ['src/components/Terms.tsx'],
  '/accessibility': ['src/components/AccessibilityStatement.tsx'],
  '/mob-deals': ['src/components/MobDealsSwitcher.tsx'],
  '/pokeguru': ['src/components/PokeGuruExplorer.tsx'],
  '/ops': ['src/components/OpsHUD.tsx', 'src/data/siteProjects.ts'],
};

function sourceMtimeMs(files = []) {
  let latest = 0;
  for (const rel of files) {
    try {
      const stat = fs.statSync(path.join(root, rel));
      if (stat.mtimeMs > latest) latest = stat.mtimeMs;
    } catch {
      /* file missing — skip */
    }
  }
  return latest;
}

let routeMetaMtimeMs;
try {
  routeMetaMtimeMs = fs.statSync(path.join(root, 'route-meta.json')).mtimeMs;
} catch {
  routeMetaMtimeMs = Date.now();
}

const lastmodMsByRoute = new Map();
for (const [route, m] of indexable) {
  if (route === '/') continue;
  const ts = m.published
    ? Date.parse(isoDate(m.published))
    : sourceMtimeMs(ROUTE_LASTMOD_SOURCES[route]);
  lastmodMsByRoute.set(route, ts || routeMetaMtimeMs);
}

lastmodMsByRoute.set(
  '/',
  Math.max(sourceMtimeMs(ROUTE_LASTMOD_SOURCES['/']), ...lastmodMsByRoute.values()) ||
    routeMetaMtimeMs,
);

const lastmodFor = route => new Date(lastmodMsByRoute.get(route)).toISOString();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    ([route, m]) => `  <url>
    <loc>${m.canonical}</loc>
    <lastmod>${lastmodFor(route)}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

// Validation: every sitemap URL must have an emitted file; fail the build otherwise.
let failed = false;
for (const [route] of indexable) {
  const f =
    route === '/' ? templatePath : path.join(distDir, route.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(f)) {
    console.error(`[prerender] SITEMAP VALIDATION FAILED: ${route} has no output file`);
    failed = true;
  }
}
if (failed) process.exit(1);

// --------------------------------------------------------------- llms-full.txt
// AI discoverability: emit a full-content Markdown export so LLMs / answer
// engines can retrieve substantive site content.
function buildLlmsFull() {
  const lines = ['# LIN4CRE', '', 'Independent software, browser tools and games by David Linacre in South Yorkshire.', '', '## Selected work'];
  for (const p of publicProjects) {
    lines.push(`### ${p.name}`, p.blurb, `Link: ${SITE}${p.url}`, `Source: ${p.repo}`, '');
  }
  lines.push('## Games', '- Circuit — /games/circuit', '- Decrypt — /games/decrypt', '- Gridlock — /games/gridlock', '', 'Contact: https://www.linacre.site/contact', '');
  return lines.join('\n');
}
fs.writeFileSync(path.join(distDir, 'llms-full.txt'), buildLlmsFull(), 'utf8');
console.log('[prerender] llms-full.txt written');

console.log(`[prerender] done — ${written.length} routes, sitemap has ${indexable.length} URLs.`);

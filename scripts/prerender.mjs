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
const esc = (s = '') => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

// ------------------------------------------------------------- site content
// Strip a possible UTF-8 BOM before parsing -- some Windows editors/tools
// save JSON with a leading BOM, which breaks JSON.parse silently otherwise.
const stripBom = (s) => (s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s);
const meta = JSON.parse(stripBom(fs.readFileSync(path.join(root, 'route-meta.json'), 'utf8')));

// Bundle the typed data module, then import it.
const dataBundle = path.join(distDir, '.prerender-data.mjs');
await esbuild({
  entryPoints: [path.join(root, 'scripts', 'prerender-data.entry.ts')],
  bundle: true, format: 'esm', platform: 'node', outfile: dataBundle, logLevel: 'silent',
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
  description: 'UK-based freelance full-stack & AI engineer. React, TypeScript, Go, Python. Systems audits, custom builds, fractional retainer.',
  address: { '@type': 'PostalAddress', addressCountry: 'GB', addressRegion: 'England' },
  sameAs: [
    'https://github.com/DLinacre',
    'https://linkedin.com/in/david-linacre',
    `${SITE}/`
  ],
  knowsAbout: [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Go', 'Python',
    'PostgreSQL', 'AI engineering', 'DevOps', 'Developer Tools'
  ],
  worksFor: { '@id': `${SITE}/#org` }
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
  sameAs: [
    'https://github.com/DLinacre',
    'https://linkedin.com/in/david-linacre'
  ]
};
const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'linacre.site',
  description: "David Linacre's complete project index: live apps, AI products, developer tools and games, with private in-browser utilities.",
  inLanguage: 'en-GB',
  publisher: { '@id': `${SITE}/#org` },
};

const ROUTE_LABEL = Object.fromEntries(
  Object.entries(meta.routes).map(([route, m]) => [route, m.title.split(' — ')[0].split(' | ')[0]])
);

const publicProjects = data.projects.filter(p => p.url);

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
      item: `${SITE}${running}`
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
      '@type': 'ItemList', '@id': `${SITE}/#projects`, name: 'Projects by David Linacre',
      itemListElement: publicProjects.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': p.kind === 'Game' ? 'VideoGame' : 'SoftwareApplication',
          'name': p.name,
          'url': p.url,
          'description': p.blurb,
          'applicationCategory': 'DeveloperApplication',
          'operatingSystem': 'Web',
          'author': { '@id': `${SITE}/#person` }
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
      'url': `${SITE}/contact`,
      'name': m.title,
      'mainEntity': {
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#service`,
        'name': 'David Linacre Consulting',
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'sales',
          'email': 'david@linacre.site',
          'url': `${SITE}/contact`
        }
      }
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function headFor(route, m) {
  const robots = m.index ? 'index, follow' : 'noindex, nofollow';
  const image = m.image || meta.site.defaultImage;
  const title = esc(m.title); const desc = esc(m.description);
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
    lines.push(`<link rel="preload" as="image" href="/profile_avatar.webp" type="image/webp" fetchpriority="high" />`);
  }
  lines.push(`<script type="application/ld+json">${jsonLdFor(route, m)}</script>`);
  return lines.join('\n    ');
}

// ------------------------------------------------- static content snapshots
const NAV = [
  ['/', 'Home'], ['/tools', 'Tools'], ['/games', 'Games'], ['/about', 'About'], ['/contact', 'Contact'],
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
  <a class="cta alt" href="/#projects">See all projects</a>
</p>`;

function pageBody(route) {
  switch (route) {
    case '/': {
      const featured = publicProjects.filter(p => p.featured);
      const featuredRows = featured.map(p =>
        `  <li><a href="${esc(p.url)}" rel="noopener">${esc(p.name)}</a> <span class="meta">[${esc(p.kind)}]${p.tech && p.tech.length ? ` · ${esc(p.tech.slice(0, 3).join(' · '))}` : ''}</span> — ${esc(p.blurb)}</li>`).join('\n');
      const rows = publicProjects.map((p, i) =>
        `  <li><a href="${esc(p.url)}" rel="noopener">${esc(p.name)}</a> <span class="meta">[${esc(p.kind)}]</span> — ${esc(p.blurb)}</li>`).join('\n');
      return `
<h1>Everything David builds — one search away</h1>
<p>${publicProjects.length} live apps, AI products, developer tools and games, ordered by usefulness.
Every project below is real, shipped, and either live on the web or open source on GitHub.
Use the search bar on the page to filter the full catalogue.</p>
<h2>Featured work</h2>
<ul>
${featuredRows}
</ul>
<h2>All projects</h2>
<ul>
${rows}
</ul>
<h2>Also on this site</h2>
<ul>
  <li><a href="/tools">Tools</a> — private in-browser utilities (JSON, Base64, timestamps, secure generators) plus a curated directory.</li>
  <li><a href="/games">Games</a> — playable browser games, no install.</li>
  <li><a href="/about">About</a> — career, skills and changelog.</li>
</ul>
${CTA_BLOCK}`;
    }

    case '/tools': {
      const byCat = {};
      for (const t of data.tools) (byCat[t.category] ||= []).push(t);
      const catRows = Object.entries(byCat).map(([cat, tools]) =>
        `### ${esc(cat)}\n${tools.map(t => `- ${esc(t.name)}${t.url ? ` (${esc(t.url)})` : ''} — ${esc(t.description)}`).join('\n')}`).join('\n\n');
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

    case '/games': {
      const games = data.projects.filter(p => p.kind === 'Game' && p.url);
      const rows = games.map(g =>
        `  <li><a href="${esc(g.url)}" rel="noopener">${esc(g.name)}</a> — ${esc(g.blurb)}</li>`).join('\n');
      return `
<h1>Playable browser games</h1>
<p>Free, instant-play games built by David — no install, no account, no tracking.</p>
<ul>
${rows}
</ul>
<h2>Roblox projects</h2>
<ul>
  <li><a href="https://dlinacre.github.io/slime-factory-tycoon/" rel="noopener">Slime Factory Tycoon</a> — open-source Roblox idle-tycoon template with an interactive web demo.</li>
  <li><a href="https://github.com/DLinacre/BloxCapital" rel="noopener">BloxCapital</a> — Roblox monetization &amp; game-performance suite.</li>
  <li><a href="https://github.com/DLinacre/Blox-Capital" rel="noopener">Blox-Capital</a> — Roblox money-making extension.</li>
</ul>
${CTA_BLOCK}`;
    }

    case '/about':
      return `
<h1>About David Linacre</h1>
<p>I'm a self-taught full-stack engineer focused on developer experience, automation and AI systems.
I build with React, TypeScript, Node.js, Python and Go, and I ship on Vercel, Docker and self-hosted infrastructure.</p>
<p>This site is my working environment as much as a portfolio: a complete project index, a tool box,
an AI lab and a set of browser utilities — all open to use.</p>
<ul>
  <li><a href="https://github.com/DLinacre" rel="noopener noreferrer">GitHub — github.com/DLinacre</a></li>
  <li><a href="https://linkedin.com/in/david-linacre" rel="noopener noreferrer">LinkedIn — david-linacre</a></li>
</ul>
${CTA_BLOCK}`;

    case '/contact':
      return `
<h1>Contact David Linacre</h1>
<p>Have a project, a problem or a question? Use the form on this page — David replies within 12 hours from david@linacre.site.</p>
<ul>
  <li>Systems &amp; infrastructure audits from £1,800.</li>
  <li>Custom builds from £6,500.</li>
  <li>Fractional engineering retainer £2,400/mo.</li>
  <li>NDA-friendly · UK GDPR compliant.</li>
</ul>
${CTA_BLOCK}`;

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

    default:
      return `
<h1>${esc(meta.routes[route]?.title.split(' — ')[0] || 'linacre.site')}</h1>
<p>${esc(meta.routes[route]?.description || '')}</p>`;
  }
}

function buildShell(route, m) {
  const hreflang = route === '/'
    ? ''
    : `    <link rel="alternate" hreflang="en-GB" href="${m.canonical}" />\n    <link rel="alternate" hreflang="x-default" href="${m.canonical}" />\n`;
  return `<!doctype html>
<html lang="en-GB" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headFor(route, m)}
${hreflang}  </head>
  <body>
    <div id="root">
      <div id="prerender-shell">
        <a class="skip-link" href="#main-content">Skip to content</a>
        <span class="brand">linacre.site</span>
        <nav>${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav>
        <div id="main-content">${pageBody(route)}</div>
        <footer>© ${new Date().getFullYear()} David Linacre — built with React, TypeScript and Tailwind CSS. <a href="/about">About</a> · <a href="/privacy">Privacy</a></footer>
      </div>
    </div>
    <script type="module" src="/assets/index.js" crossorigin></script>
  </body>
</html>`;
}

// ---------------------------------------------------------------- emit pages
const written = [];
for (const [route, m] of Object.entries(meta.routes)) {
  const out = route === '/' ? templatePath : path.join(distDir, route.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buildShell(route, m));
  written.push(route);
  console.log(`[prerender] ${route} → ${path.relative(distDir, out)}`);
}

// ---------------------------------------------------------- sitemap.xml
// SEO: derive lastmod from the actual mtime of the file that drives each
// page's content, not the build timestamp.
const isoDate = (d) => (d && d.length === 10 ? `${d}T00:00:00+00:00` : d);
const indexable = Object.entries(meta.routes).filter(([, m]) => m.index);

const ROUTE_LASTMOD_SOURCES = {
  '/': ['route-meta.json', 'src/App.tsx', 'src/data/siteProjects.ts'],
  '/tools': ['src/components/Tools.tsx', 'src/components/QuickTools.tsx', 'src/data.ts'],
  '/games': ['src/components/Games.tsx', 'public/games/index.html'],
  '/about': ['src/components/About.tsx'],
  '/lab': ['src/components/Lab.tsx'],
  '/identity': ['src/components/IdentityHub.tsx'],
  '/contact': ['src/components/Contact.tsx'],
  '/privacy': ['src/components/Privacy.tsx'],
  '/cookie-policy': ['src/components/CookiePolicy.tsx'],
  '/terms': ['src/components/Terms.tsx'],
  '/accessibility': ['src/components/AccessibilityStatement.tsx'],
  '/mob-deals': ['src/components/MobDealsSwitcher.tsx'],
  '/pokeguru': ['src/components/PokeGuruExplorer.tsx']
};

function sourceMtimeMs(files = []) {
  let latest = 0;
  for (const rel of files) {
    try {
      const stat = fs.statSync(path.join(root, rel));
      if (stat.mtimeMs > latest) latest = stat.mtimeMs;
    } catch { /* file missing — skip */ }
  }
  return latest;
}

let routeMetaMtimeMs;
try { routeMetaMtimeMs = fs.statSync(path.join(root, 'route-meta.json')).mtimeMs; }
catch { routeMetaMtimeMs = Date.now(); }

const lastmodMsByRoute = new Map();
for (const [route, m] of indexable) {
  if (route === '/') continue;
  const ts = m.published
    ? Date.parse(isoDate(m.published))
    : sourceMtimeMs(ROUTE_LASTMOD_SOURCES[route]);
  lastmodMsByRoute.set(route, ts || routeMetaMtimeMs);
}

lastmodMsByRoute.set('/', Math.max(
  sourceMtimeMs(ROUTE_LASTMOD_SOURCES['/']),
  ...lastmodMsByRoute.values(),
) || routeMetaMtimeMs);

const lastmodFor = (route) => new Date(lastmodMsByRoute.get(route)).toISOString();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(([route, m]) => `  <url>
    <loc>${m.canonical}</loc>
    <lastmod>${lastmodFor(route)}</lastmod>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

// Validation: every sitemap URL must have an emitted file; fail the build otherwise.
let failed = false;
for (const [route] of indexable) {
  const f = route === '/' ? templatePath : path.join(distDir, route.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(f)) { console.error(`[prerender] SITEMAP VALIDATION FAILED: ${route} has no output file`); failed = true; }
}
if (failed) process.exit(1);

// --------------------------------------------------------------- llms-full.txt
// AI discoverability: emit a full-content Markdown export so LLMs / answer
// engines can retrieve substantive site content.
function buildLlmsFull() {
  const L = [];
  const push = (...lines) => L.push(...lines);

  push('# linacre.site — full content export for LLMs');
  push('');
  push('> David Christopher Linacre — UK-based freelance full-stack & AI systems engineer (React, TypeScript, Go, Python). Systems audits, custom builds, and fractional engineering retainers.');
  push('> This file mirrors the substantive content of https://www.linacre.site/ for AI retrieval. Contact: david@linacre.site');
  push('');

  push('## About David Linacre');
  push('- Full name: David Christopher Linacre');
  push('- Location: United Kingdom (England)');
  push('- Role: Full-Stack Engineer & AI Systems Builder');
  push('- Contact: david@linacre.site');
  push('- GitHub: https://github.com/DLinacre');
  push('- LinkedIn: https://linkedin.com/in/david-linacre');
  push('- Expertise: React, TypeScript, Next.js, Node.js, Go, Python, PostgreSQL, Docker, AI engineering, DevOps, developer tooling');
  push('');

  push('## Services & pricing');
  push('- Systems & Infrastructure Audit — deep technical review of architecture, security, performance, and developer experience. From £1,800.');
  push('- Custom Development Project — end-to-end build of production-grade tools, automation platforms, or AI integrations. From £6,500.');
  push('- Ongoing Engineering Retainer — dedicated fractional engineering time for ongoing improvements and rapid iteration. £2,400 / month.');
  push('- Reply within 12 hours from david@linacre.site. NDA-friendly. UK GDPR compliant.');
  push('');

  const pubProjects = (data.projects || []).filter(p => p.url);
  if (pubProjects.length) {
    push('## Projects');
    for (const p of pubProjects) {
      push(`### ${p.name} [${p.kind}]`);
      if (p.blurb) push(p.blurb);
      if (p.repo) push(`Source: ${p.repo}`);
      if (p.url) push(`Link: ${p.url}`);
      push('');
    }
  }

  if (Array.isArray(data.tools) && data.tools.length) {
    push('## Free developer toolkit');
    const byCat = {};
    for (const t of data.tools) (byCat[t.category] ||= []).push(t);
    for (const [cat, tools] of Object.entries(byCat)) {
      push(`### ${cat}`);
      for (const t of tools) push(`- ${t.name}${t.url ? ` (${t.url})` : ''} — ${t.description}`);
      push('');
    }
  }

  push('## Contact & engagement process');
  push('1. Send an enquiry at https://www.linacre.site/contact (name, work email, optional company, budget, timeline, project details).');
  push('2. Reply within 12 hours from david@linacre.site.');
  push('3. Short discovery call to scope the work.');
  push('4. Written Statement of Work — scope, milestones, price, timeline, acceptance criteria.');
  push('');
  push(`_Generated at build: ${new Date().toISOString()}_`);

  return L.join('\n') + '\n';
}
fs.writeFileSync(path.join(distDir, 'llms-full.txt'), buildLlmsFull(), 'utf8');
console.log('[prerender] llms-full.txt written');

console.log(`[prerender] done — ${written.length} routes, sitemap has ${indexable.length} URLs.`);

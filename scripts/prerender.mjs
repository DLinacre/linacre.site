/**
 * Static prerenderer for linacre.site
 * -----------------------------------
 * Runs after `vite build`. For every route in route-meta.json it emits
 * dist/<route>/index.html containing:
 *   1. A single, correctly ordered head (charset/viewport first, one OG set,
 *      one Twitter set, canonical, robots) sourced only from route-meta.json.
 *   2. Route-appropriate JSON-LD (Person/WebSite everywhere; BlogPosting +
 *      BreadcrumbList on articles; ItemList on / and /projects).
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

/* mdToHtml now lives in src/lib/markdown.ts — shared with the React blog
   modal so JS and no-JS visitors render identically (TASK-001, 12 Jul 2026).
   It is imported from the bundled data module below. */

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
const { data, mdToHtml } = await import(pathToFileURL(dataBundle).href);
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
    'https://github.com/LIN4CRE',
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
    'https://github.com/LIN4CRE',
    'https://linkedin.com/in/david-linacre'
  ]
};
const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'linacre.site',
  description: 'A useful start page with private browser utilities, free decision tools, developer resources, and software by David Linacre.',
  publisher: { '@id': `${SITE}/#person` },
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE}/toolkit?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

// Human-readable label used in BreadcrumbList
const ROUTE_LABEL = {
  '/': 'Home',
  '/work': 'Work',
  '/book': 'Book Call',
  '/projects': 'Projects',
  '/games': 'Games',
  '/toolkit': 'Toolkit',
  '/learn': 'Learn',
  '/blog': 'Blog',
  '/playground': 'Playground',
  '/lab': 'AI Lab',
  '/agents': 'Agents',
  '/identity': 'Identity',
  '/about': 'About',
  '/contact': 'Contact',
  '/contact/thanks': 'Thanks',
  '/privacy': 'Privacy',
  '/cookie-policy': 'Cookie Policy',
  '/terms': 'Terms',
  '/accessibility': 'Accessibility',
  '/status': 'Status',
  '/low-stakes': 'Low Stakes',
  '/mob-deals': 'Mob Deals',
  '/pokeguru': 'PokeGuru',
  '/dkma': 'DKMA Guide'
};

const featured = data.projects.filter(p => p.url).slice(0, 6);
const publicProjects = data.projects.filter(p => p.url);
const caseStudies = data.projects.filter(p => ['Mob Deals', 'PokeGuru', 'DKMA Monster'].includes(p.name));

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
  if (route === '/' || route === '/projects') {
    graph.push({
      '@type': 'ItemList', '@id': `${SITE}${route === '/' ? '/' : route}#projects`, name: 'Featured Projects',
      itemListElement: publicProjects.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          'name': p.name,
          'url': p.url || `${SITE}/projects`,
          'description': p.description,
          'applicationCategory': p.category === 'deploy' ? 'DevOpsApplication' : 'DeveloperApplication',
          'operatingSystem': 'Web',
          'author': { '@id': `${SITE}/#person` }
        },
      })),
    });
    // linacre.site itself as a SoftwareApplication
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${SITE}/#app`,
      name: 'linacre.site',
      description: 'A useful start page with private JSON, Base64, timestamp and secure-value tools, plus free practical web applications.',
      url: `${SITE}/`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      creator: { '@id': `${SITE}/#person` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    });
  }
  if (route === '/') {
    // Speakable (audit v5, SEO & AI Discoverability): point voice/AI assistants
    // at the hero heading + lead copy. #main-content exists in both the
    // prerendered snapshot and the hydrated React app (src/App.tsx), so the
    // selectors always resolve. Attached to a WebPage node (schema-correct
    // domain for `speakable`), not to Person.
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
  if (m.type === 'article') {
    const post = data.posts.find(p => `/blog/${p.slug}` === route);
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${m.canonical}#article`,
      'headline': m.title.split(' | ')[0],
      'description': m.description,
      'datePublished': m.published,
      'dateModified': m.published,
      'inLanguage': 'en-GB',
      'author': { '@id': `${SITE}/#person` },
      'publisher': {
        '@type': 'Organization',
        'name': 'Linacre',
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE}/favicon.svg`
        }
      },
      'image': m.image || meta.site.defaultImage,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': m.canonical
      },
      'keywords': post ? post.tags.join(', ') : undefined,
      'timeRequired': post ? post.readTime : undefined,
    });
    // BreadcrumbList: prefer the article-specific one over the generic top-level breadcrumb.
    for (let i = graph.length - 1; i >= 0; i--) {
      if (graph[i]['@type'] === 'BreadcrumbList') { graph.splice(i, 1); }
    }
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: m.title.split(' | ')[0], item: m.canonical },
      ],
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
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE}/contact#faq`,
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Are you available for freelance or contract projects?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, I am open to select freelance consulting and systems engineering contracts. My primary areas of focus are CI/CD pipelining, cloud migrations (GCP/AWS), backend engineering in Go/Node.js, and containerizing legacy systems. Reach out via the form above with your requirements.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What is your primary technology stack?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'I specialize in TypeScript/React on the frontend, Go and Node.js on the backend, Docker/Kubernetes for containerization, and Terraform for Infrastructure as Code. I am also highly comfortable with database administration across PostgreSQL, MySQL, and Redis.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do you handle project privacy and client security?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Security is baked into my design process from day one. I never hardcode credentials, using centralized secret architectures instead. I sign NDAs before discussing proprietary details, and all client repositories are fully isolated with strict IAM roles.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How can I request access to one of your private projects?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Click the \'Request Details / Access\' button on any project card in the Projects tab. It will automatically populate the contact form with a structured request. Once validated, I can arrange repository access or share architectural documents.'
          }
        }
      ]
    });
  }
  if (route === '/work') {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': `${SITE}/work#service`,
      'name': 'David Linacre Consulting',
      'url': `${SITE}/work`,
      'logo': `${SITE}/favicon.svg`,
      'image': `${SITE}/favicon.svg`,
      'priceRange': '£££',
      'telephone': '',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Bradford',
        'addressRegion': 'West Yorkshire',
        'addressCountry': 'GB'
      },
      'serviceType': ['Freelance Full-Stack Developer', 'Contract AI Automation Systems Builder'],
      'provider': { '@id': `${SITE}/#person` },
      'areaServed': 'GB',
      'hasOfferCatalog': { '@id': `${SITE}/work#services` }
    });
    graph.push({
      '@type': 'OfferCatalog',
      '@id': `${SITE}/work#services`,
      'name': 'David Linacre Consulting & Development Offerings',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Systems & Infrastructure Audit',
            'description': 'Deep technical review of your architecture, security, performance, and developer experience.'
          },
          'priceSpecification': {
            '@type': 'PriceSpecification',
            'price': '1800',
            'priceCurrency': 'GBP',
            'valueAddedTaxIncluded': true
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Custom Development Project',
            'description': 'End-to-end build of production-grade tools, automation platforms, or AI integrations.'
          },
          'priceSpecification': {
            '@type': 'PriceSpecification',
            'price': '6500',
            'priceCurrency': 'GBP',
            'valueAddedTaxIncluded': true
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Ongoing Engineering Retainer',
            'description': 'Dedicated fractional engineering time for ongoing improvements and rapid iteration.'
          },
          'priceSpecification': {
            '@type': 'PriceSpecification',
            'price': '2400',
            'priceCurrency': 'GBP',
            'valueAddedTaxIncluded': true
          }
        }
      ]
    });
    // FAQPage (audit TASK-006 residual, 12 Jul 2026). Questions/answers come
    // from WORK_FAQS in src/data.ts — the same array rendered visibly on the
    // page (React + static snapshot), as Google requires for FAQ rich results.
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE}/work#faq`,
      'mainEntity': data.workFaqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.answer },
      })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}


function headFor(route, m) {
  const robots = m.index ? 'index, follow' : 'noindex, nofollow';
  const ogType = m.type === 'article' ? 'article' : 'website';
  const image = m.image || meta.site.defaultImage;
  const title = esc(m.title); const desc = esc(m.description);
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${m.canonical}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${esc(meta.site.name)}" />`,
    `<meta property="og:locale" content="${esc(meta.site.locale)}" />`,
    `<meta property="og:url" content="${m.canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    // og.png is 1200×630 (verified 12 Jul 2026); all routes share it — see
    // route-meta.json (no per-route image overrides).
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${title}" />`,
    `<meta name="twitter:card" content="${esc(meta.site.twitterCard)}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="alternate" type="application/rss+xml" title="Linacre Blog" href="/feed.xml" />`,
  ];
  if (m.type === 'article' && m.published) {
    const isoDate = new Date(m.published).toISOString();
    lines.push(`<meta property="article:published_time" content="${isoDate}" />`);
    lines.push(`<meta property="article:modified_time" content="${isoDate}" />`);
    lines.push(`<meta property="article:author" content="https://www.linacre.site/about" />`);
  }
  // PERF-02 (audit 11 Jul 2026): preload the avatar only where it renders as
  // an above-the-fold LCP candidate — /about alone. The homepage does not
  // render the avatar (checked src/components: only About.tsx uses it), so the
  // former global preload in index.html was wasted bandwidth everywhere else.
  if (route === '/about') {
    lines.push(`<link rel="preload" as="image" href="/profile_avatar.webp" type="image/webp" fetchpriority="high" />`);
  }
  lines.push(`<script type="application/ld+json">${jsonLdFor(route, m)}</script>`);
  return lines.join('\n    ');
}

// ------------------------------------------------- static content snapshots
const NAV = [
  ['/', 'Home'], ['/toolkit', 'Toolkit'], ['/projects', 'Projects'], ['/learn', 'Learn'],
  ['/blog', 'Blog'], ['/playground', 'Playground'], ['/about', 'About'], ['/contact', 'Contact'],
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
/* Skip link — mirrors .skip-link in index.css so the bypass-blocks affordance
   exists before hydration, not just in the React app. Scoped to the shell so it
   disappears with it. */
#prerender-shell .skip-link{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}
#prerender-shell .skip-link:focus,#prerender-shell .skip-link:focus-visible{left:1rem;top:1rem;width:auto;height:auto;
padding:.6rem 1rem;background:#030c14;color:#22d3ee;border:2px solid #22d3ee;border-radius:8px;z-index:9999;
font-family:'JetBrains Mono',monospace;font-weight:700;overflow:visible}
/* Keyboard focus must stay visible on every interactive element in the shell. */
#prerender-shell a:focus-visible,#prerender-shell button:focus-visible,#prerender-shell input:focus-visible,
#prerender-shell select:focus-visible,#prerender-shell textarea:focus-visible{outline:2px solid #22d3ee;outline-offset:2px;border-radius:4px}
/* The shell renders before the app's fonts/JS; respect motion preferences anyway. */
@media (prefers-reduced-motion: reduce){#prerender-shell *{animation:none!important;transition:none!important}}
`.trim();

const CTA_BLOCK = `
<p>
  <a class="cta" href="/contact">Start a project — get in touch</a>
  <a class="cta alt" href="/projects">See selected work</a>
</p>`;

function pageBody(route, m) {
  const posts = data.posts;
  switch (true) {
    case route === '/':
      return `
<h1>Get something useful done</h1>
<p>linacre.site is a practical start page: search the web, clean up data, generate secure values,
or open a free tool for a real job. The quick utilities run locally in your browser — no account,
no upload, and nothing you paste is sent to a server.</p>
<h2>Private browser utilities</h2>
<ul>
  <li><strong>JSON formatter</strong> — validate, format and minify JSON.</li>
  <li><strong>Base64 converter</strong> — encode and decode UTF-8 text.</li>
  <li><strong>Timestamp converter</strong> — switch between Unix, ISO, local and UTC time.</li>
  <li><strong>Secure generator</strong> — create UUIDs and strong passwords with browser cryptography.</li>
  <li><strong>UK VAT calculator</strong> — add or extract standard, reduced, and zero-rate VAT.</li>
  <li><strong>Text cleaner</strong> — count, re-case, deduplicate, sort, and trim text.</li>
  <li><strong>SHA-256 generator</strong> — create a local text fingerprint with Web Crypto.</li>
  <li><strong>URL cleaner</strong> — inspect links and remove common tracking parameters.</li>
</ul>
<p class="meta">Enable JavaScript to use the interactive utilities on this page.</p>
<h2>Free tools for real jobs</h2>
<ul>
  <li><a href="https://dlinacre.github.io/mob-deals/" rel="noopener">Mob Deals</a> — compare UK SIM-only deals and follow a plain-English keep-your-number guide.</li>
  <li><a href="https://dlinacre.github.io/PokeGuru/" rel="noopener">PokeGuru</a> — search Pokémon cards, browse UK sets and track a collection in GBP.</li>
  <li><a href="https://dlinacre.github.io/dkma-monster/" rel="noopener">DKMA Monster</a> — find exact Android battery and autostart steps for 15 phone families.</li>
  <li><a href="https://dlinacre.github.io/Apex-POS/" rel="noopener">Apex POS</a> — an offline-first point of sale with stock, receipts and reports.</li>
</ul>
<h2>More useful areas</h2>
<p>Open the <a href="/playground">developer utility playground</a>, browse the
<a href="/toolkit">curated toolkit</a>, or see <a href="/projects">all projects</a>.</p>
<h2>Need something that does not exist yet?</h2>
<p>I build focused web tools and production systems with clear scope and straightforward handover.</p>
${CTA_BLOCK}`;

    case route === '/projects': {
      const rows = publicProjects.map(p =>
        `  <li><a href="${esc(p.url)}" rel="noopener">${esc(p.name)}</a> <span class="meta">[${esc(p.category)}]</span> — ${esc(p.description)}</li>`).join('\n');
      const cs = caseStudies.map(p => `
<h3 id="${esc(p.name.toLowerCase())}">${esc(p.name)} — case study</h3>
<p>${esc(p.description)}</p>
${p.role ? `<p><strong>Role:</strong> ${esc(p.role)}</p>` : ''}
${p.challenges ? `<p><strong>Problem:</strong> ${esc(p.challenges)}</p>` : ''}
${p.solution ? `<p><strong>Approach:</strong> ${esc(p.solution)}</p>` : ''}
${p.tech?.length ? `<p><strong>Stack:</strong> ${esc(p.tech.join(', '))}</p>` : ''}
${p.url ? `<p><a href="${esc(p.url)}" rel="noopener">Source &amp; docs →</a></p>` : ''}`).join('\n');
      return `
<h1>Projects</h1>
<p>Selected tools and applications. Open-source work is linked directly; private and client work is available on request.</p>
<h2>Public projects</h2>
<ul>
${rows}
</ul>
<h2>Case studies</h2>
${cs}
${CTA_BLOCK}`;
    }

    case route === '/about':
      return `
<h1>About David Linacre</h1>
<p>I&#39;m a self-taught full-stack engineer focused on developer experience, automation and AI systems.
I build with React, TypeScript, Node.js, Python and Go, and I ship on Vercel, Docker and self-hosted infrastructure.</p>
<p>This site is my working environment as much as a portfolio: a free tool directory, a learning roadmap,
an AI lab and a set of browser utilities — all open to use.</p>
<ul>
  <li><a href="https://github.com/LIN4CRE" rel="noopener noreferrer">GitHub — github.com/LIN4CRE</a></li>
  <li><a href="https://linkedin.com/in/david-linacre" rel="noopener noreferrer">LinkedIn — david-linacre</a></li>
</ul>
${CTA_BLOCK}`;

    case route === '/toolkit': {
      const byCat = {};
      for (const t of data.tools) (byCat[t.category] ||= []).push(t);
      return `
<h1>Free developer toolkit</h1>
<p>${data.tools.length} curated free tools for building, deploying, designing and learning. No sign-up, no tracking — just links that earn their place.</p>
${Object.entries(byCat).map(([cat, tools]) => `
<h2>${esc(cat)}</h2>
<ul>
${tools.map(t => `  <li>${t.url ? `<a href="${esc(t.url)}" rel="noopener">${esc(t.name)}</a>` : esc(t.name)} — ${esc(t.description)}</li>`).join('\n')}
</ul>`).join('\n')}`;
    }

    case route === '/learn':
      return `
<h1>Learn web development from scratch</h1>
<p>A practical six-step roadmap I recommend to self-taught engineers — free resources only.</p>
${data.roadmap.map((s, i) => `<h2>Step ${i + 1}: ${esc(s.title)}</h2>\n<p>${esc(s.description)}</p>`).join('\n')}
<p>Pair the roadmap with the <a href="/toolkit">free toolkit directory</a>.</p>`;

    case route === '/blog':
      return `
<h1>Engineering notes</h1>
<p>Technical write-ups from real projects — concurrency, theming, caching and tooling.</p>
<ul>
${posts.map(p => `  <li>
    <h2><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h2>
    <p class="meta">${esc(p.date)} · ${esc(p.readTime)} · ${p.tags.map(esc).join(', ')}</p>
    <p>${esc(p.excerpt)}</p>
  </li>`).join('\n')}
</ul>`;

    case route.startsWith('/blog/'): {
      const post = posts.find(p => `/blog/${p.slug}` === route);
      if (!post) return `<h1>${esc(m.title)}</h1><p>${esc(m.description)}</p>`;
      return `
<article>
  <h1>${esc(post.title)}</h1>
  <p class="meta">By David Linacre · ${esc(post.date)} · ${esc(post.readTime)} · ${post.tags.map(esc).join(', ')}</p>
  ${mdToHtml(post.content)}
</article>
<p><a href="/blog">← All engineering notes</a></p>`;
    }

    case route === '/playground':
      return `
<h1>Developer utility playground</h1>
<p>Browser-based utilities that run entirely client-side — nothing you paste ever leaves your machine:</p>
<ul>
  <li><strong>JWT inspector</strong> — decode and verify token structure.</li>
  <li><strong>Regex tester</strong> — live pattern matching with explanations.</li>
  <li><strong>Secure value generator</strong> — passwords, UUIDs and keys via the Web Crypto API.</li>
  <li><strong>Encoders &amp; formatters</strong> — Base64, URL, JSON and more.</li>
</ul>
<p class="meta">These tools require JavaScript. Enable JS to use the playground.</p>`;

    case route === '/work':
      return `
<h1>Work with David Linacre</h1>
<p>I help engineering groups ship faster, automate operations, and implement secure, high-throughput systems. Select contract services are outlined below.</p>
<p><strong>Next available:</strong> ${esc(data.workNextAvailable)} — <a href="/contact">start an enquiry</a> to reserve the slot.</p>
<h2>Offerings</h2>
<ul>
  <li><strong>Systems &amp; Infrastructure Audit</strong> — Deep technical review of your architecture, security, performance, and developer experience. From £1,800.</li>
  <li><strong>Custom Development Project</strong> — End-to-end build of production-grade tools, automation platforms, or AI integrations. From £6,500.</li>
  <li><strong>Ongoing Engineering Retainer</strong> — Dedicated fractional engineering time for ongoing improvements and rapid iteration. £2,400 / month.</li>
</ul>
<h2>Frequently asked questions</h2>
${data.workFaqs.map(f => `<h3>${esc(f.question)}</h3>\n<p>${esc(f.answer)}</p>`).join('\n')}
<p>The interactive Work page includes service details, current availability, FAQs, and a direct project-brief route.</p>
${CTA_BLOCK}`;

    case route === '/contact':
      return `
<h1>Contact David Linacre</h1>
<p><strong>Available for freelance and contract work.</strong> Tell me what you&#39;re building — I reply from david@linacre.site within 12 hours.</p>
<form action="/api/contact" method="POST" style="display: flex; flex-direction: column; gap: 15px; margin: 20px 0; max-width: 520px;">
  <input type="hidden" name="startedAt" value="${Date.now()}" />
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="name" style="font-size: 11px; color: #a1a8b8; text-transform: uppercase; font-weight: bold;">Name *</label>
    <input type="text" id="name" name="name" required placeholder="Jane Doe" style="background: #030c14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 14px;" />
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="email" style="font-size: 11px; color: #a1a8b8; text-transform: uppercase; font-weight: bold;">Work email *</label>
    <input type="email" id="email" name="email" required placeholder="you@company.com" style="background: #030c14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 14px;" />
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="companyOrg" style="font-size: 11px; color: #a1a8b8; text-transform: uppercase; font-weight: bold;">Company (optional)</label>
    <input type="text" id="companyOrg" name="companyOrg" placeholder="Acme Corp" style="background: #030c14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 14px;" />
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="budget" style="font-size: 11px; color: #a1a8b8; text-transform: uppercase; font-weight: bold;">Budget</label>
    <select id="budget" name="budget" style="background: #030c14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 14px;">
      <option value="">Select…</option>
      <option>Under £2k</option>
      <option>£2-6k</option>
      <option>£6-15k</option>
      <option>£15k+</option>
      <option>Retainer / Not sure</option>
    </select>
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="timeline" style="font-size: 11px; color: #a1a8b8; text-transform: uppercase; font-weight: bold;">Timeline</label>
    <select id="timeline" name="timeline" style="background: #030c14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 14px;">
      <option value="">Select…</option>
      <option>ASAP</option>
      <option>2-4 weeks</option>
      <option>1-3 months</option>
      <option>Exploring</option>
    </select>
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="message" style="font-size: 11px; color: #a1a8b8; text-transform: uppercase; font-weight: bold;">Project details *</label>
    <textarea id="message" name="message" required rows="6" placeholder="What are you building? Goals, current stack, constraints, links…" style="background: #030c14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 14px; resize: vertical;"></textarea>
  </div>
  <!-- The checkbox is explicitly labelled and the policy links sit outside the
       label: a <label> may not contain interactive content, and nesting links
       inside one makes the control's accessible name ambiguous. -->
  <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #a1a8b8;">
    <input type="checkbox" id="consent" name="consent" required style="margin-top: 3px; flex-shrink: 0;" />
    <span>
      <label for="consent">I agree to the Privacy Policy and Terms. *</label>
      <span class="meta">(<a href="/privacy">read Privacy</a> · <a href="/terms">read Terms</a>)</span>
    </span>
  </div>
  <p class="meta">🔒 UK GDPR · Reply &lt; 12h · NDA-friendly</p>
  <button type="submit" style="background: #22d3ee; border: none; border-radius: 6px; padding: 12px; color: #030c14; font-weight: 700; cursor: pointer; font-size: 14px;">Send message →</button>
</form>
<ul>
  <li>Email: <a href="mailto:david@linacre.site">david@linacre.site</a></li>
  <li>GitHub: <a href="https://github.com/LIN4CRE" rel="noopener noreferrer">github.com/LIN4CRE</a></li>
  <li>LinkedIn: <a href="https://linkedin.com/in/david-linacre" rel="noopener noreferrer">david-linacre</a></li>
</ul>`;

    case route === '/book':
      return `
<h1>Book a Discovery Call</h1>
<p>Schedule a direct 15-minute intro or system architecture review with David Linacre. No automated calendar loops — send two preferred time slots in UK time (GMT/BST) and receive a direct calendar invite within 12 hours.</p>
<h2>Available Call Formats</h2>
<ul>
  <li><strong>15-Min Discovery Call (Free):</strong> High-level scope alignment, stack feasibility feedback, estimated cost range, and written follow-up summary.</li>
  <li><strong>45-Min Systems Architecture Review:</strong> Technical bottleneck diagnosis, IAM/security review, and recommended architecture roadmap.</li>
</ul>
<p><a class="cta" href="mailto:david@linacre.site?subject=Book%20a%2015-min%20discovery%20call">Email david@linacre.site to book →</a> <a class="cta alt" href="/contact">Fill out project form</a></p>
<p class="meta">🔒 UK GDPR · Reply &lt; 12h · NDA-friendly by default</p>`;

    case route === '/contact/thanks':
      return `
<h1>Thanks — message received</h1>
<p>Your enquiry has been received. I&#39;ll reply from <a href="mailto:david@linacre.site">david@linacre.site</a> within 12 hours.</p>
<p><a class="cta" href="mailto:david@linacre.site?subject=Book%20a%2015-min%20intro%20call">Email to book a 15-min call</a> <a class="cta alt" href="/">Back to home</a></p>`;

    case route === '/cookie-policy':
      return `
<h1>Cookie &amp; storage policy</h1>
<p class="meta">Version 1.1 · Last updated 11 July 2026</p>
<p>linacre.site does not use tracking cookies, advertising cookies, or third-party analytics scripts. We do use browser LocalStorage on your device for essential preferences (theme, workspace state) and optional features (AI Lab chat history, optional API keys).</p>
<h2>Storage keys we may set</h2>
<ul>
  <li><code>linacre_consent_v1</code> — records your storage-preference decision.</li>
  <li><code>linacre_theme</code> — dark / light theme choice.</li>
  <li><code>linacre_active_tab</code> — restores your last section on return.</li>
  <li><code>linacre_brand_*</code> — Identity Hub customisations.</li>
  <li><code>linacre_lab_sessions_v1</code> — AI Lab chat history (optional).</li>
</ul>
<h2>What we deliberately do not store</h2>
<p><strong>Provider API keys</strong> (OpenAI, Anthropic, LiteLLM). Pasted keys live in memory for the current tab only — never written to LocalStorage, SessionStorage, cookies or IndexedDB, and never sent to linacre.site servers.</p>
<p>Change your mind any time by clearing site data in your browser. Questions: <a href="mailto:david@linacre.site">david@linacre.site</a>.</p>`;

    case route === '/terms':
      return `
<h1>Terms of service</h1>
<p class="meta">Version 1.1 · Last updated 11 July 2026 · Governed by the laws of England &amp; Wales.</p>
<p>These terms cover use of linacre.site and any engagement with David Linacre (sole trader). Individual engagements are governed by a written Statement of Work covering scope, milestones, price, timeline, and acceptance criteria. Invoices are issued in GBP, payable within 14 days.</p>
<p>Ownership of deliverables transfers to the client on full payment. NDA-friendly by default. Aggregate liability is capped at fees paid in the six months prior to the incident. Governing law: England &amp; Wales.</p>
<p>Questions: <a href="mailto:david@linacre.site">david@linacre.site</a>.</p>`;

    case route === '/privacy':
      return `
<h1>Privacy policy</h1>
<p>linacre.site does not run third-party analytics or advertising trackers. Browser storage is used only for
your own preferences (theme, brand customisation). Contact submissions are validated server-side, rate limited,
and used solely to reply to you. AI chat requests are proxied without building profiles.</p>
<p>Questions: <a href="mailto:david@linacre.site">david@linacre.site</a>.</p>`;

    case route === '/accessibility':
      return `
<h1>Accessibility statement</h1>
<p>linacre.site targets WCAG 2.2 AA: semantic landmarks, a skip link, visible focus states, keyboard operability
and <code>prefers-reduced-motion</code> support across pages. Static content is served for assistive technologies
and no-JS browsing. Known limitations and the feedback route are documented on this page&#39;s interactive version;
report issues to <a href="mailto:david@linacre.site">david@linacre.site</a>.</p>`;

    case route === '/agents':
      return `
<h1>Agents Hub</h1>
<p>Playbooks and executors for autonomous agent workflows used across the linacre.site toolchain —
task graphs, guardrails, scheduled runs and audit logs. The interactive hub requires JavaScript.</p>
<p>Related: <a href="/lab">AI Lab</a> · <a href="/toolkit">Toolkit</a> · <a href="/blog">Engineering notes</a></p>`;

    case route === '/lab':
      return `
<h1>AI Lab</h1>
<p>An interactive sandbox for chatting with AI models, testing prompts, and inspecting live context windows.</p>
<h3>Active LLM Proxy Models</h3>
<ul>
  <li><strong>Gemini 2.5 / 2.0 Flash:</strong> For rapid text completions and analysis.</li>
  <li><strong>GPT-4o:</strong> For advanced reasoning and code generation.</li>
  <li><strong>Claude 3.5 Sonnet:</strong> Powers agent orchestrations and system audits.</li>
 </ul>
<h3>Prompt Architecture</h3>
<p>Proxy endpoints enforce strict privacy controls: conversation logs are discarded immediately, and any optional provider API key you paste stays in memory for the current tab only &mdash; never written to browser storage and never sent to linacre.site servers.</p>
<p class="meta">The interactive AI chat client requires JavaScript. Enable JS to connect to the secure model proxy.</p>
<p>Related: <a href="/agents">Agents Hub</a> · <a href="/playground">Playground</a></p>`;

    case route === '/identity':
      return `
<h1>Identity Hub</h1>
<p>A live brand-system builder: customise colours, frames, motion and typography, preview the monogram
and export production-ready SVG. Changes persist locally in your browser. Requires JavaScript.</p>`;

    case route === '/status':
      return `
<h1>Status console (demo &mdash; simulated data)</h1>
<p><strong>This is a UI demo, not a real status page.</strong> Values are generated client-side to showcase interface patterns and do not reflect real infrastructure.
For genuine linacre.site availability, email <a href="mailto:david@linacre.site">david@linacre.site</a>.</p>
<div style="background: #061520; border: 1px solid rgba(34,211,238,0.16); padding: 20px; border-radius: 12px; margin: 20px 0; max-width: 500px;">
  <h3 style="margin-top: 0; color: #22d3ee; font-size: 12px; font-family: monospace;">System Health (Build Snapshot)</h3>
  <ul style="list-style: none; padding-left: 0; margin-bottom: 0; font-family: monospace; font-size: 11px; color: #a1a1aa;">
    <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
      <strong>Frontend (Global Edge):</strong> Operational
    </li>
    <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
      <strong>Backend API:</strong> Operational
    </li>
    <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
      <strong>Central Registry Sync:</strong> Synchronized (15/15 credentials)
    </li>
  </ul>
</div>
<p class="meta">The live status dashboard (with active path audits and server statistics) requires JavaScript. For raw API checks, visit <a href="/api/health">/api/health</a>.</p>`;

    default:
      return `<h1>${esc(m.title.split(' | ')[0])}</h1><p>${esc(m.description)}</p>`;
  }
}

function snapshot(route, m) {
  const nav = NAV.map(([href, label]) =>
    route === href ? `<a href="${href}" aria-current="page">${label}</a>` : `<a href="${href}">${label}</a>`).join('\n    ');
  return `<style>${SHELL_CSS}</style>
<div id="prerender-shell">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <a class="brand" href="/">&gt; linacre.site</a>
  <nav aria-label="Primary">
    ${nav}
  </nav>
  <main id="main-content" tabindex="-1">${pageBody(route, m)}</main>
  <footer>
    <p>© ${new Date().getFullYear()} David Linacre · <a href="https://github.com/LIN4CRE" rel="noopener">GitHub</a> ·
    <a href="/contact">Contact</a> · <a href="/privacy">Privacy</a> · <a href="/accessibility">Accessibility</a> ·
    <a href="/status">Status</a></p>
    <p class="meta">Full interactive experience (toolkit search, AI lab, playground) requires JavaScript.</p>
  </footer>
</div>`;
}

// --------------------------------------------------------------- write pass
data.toolCategoriesCount = [...new Set(data.tools.map(t => t.category))].length;
const template = fs.readFileSync(templatePath, 'utf8');
const HEAD_RE = /<!--ROUTE_HEAD-->[\s\S]*?<!--\/ROUTE_HEAD-->/;
const CONTENT_RE = /<!--ROUTE_CONTENT-->/;
if (!HEAD_RE.test(template) || !CONTENT_RE.test(template)) {
  console.error('[prerender] template markers missing in dist/index.html');
  process.exit(1);
}

const written = [];
for (const [route, m] of Object.entries(meta.routes)) {
  let html = template
    .replace(HEAD_RE, headFor(route, m))
    .replace(CONTENT_RE, m.index ? snapshot(route, m) : '');
  const outPath = route === '/' ? templatePath : path.join(distDir, route.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  written.push(route);
  console.log(`[prerender] ${route} → ${path.relative(root, outPath)}`);
}

// --------------------------------------------------------------- sitemap.xml
// SEO-01 (audit 11 Jul 2026): derive lastmod from the actual mtime of the file
// that drives each page's content, not the build timestamp. Drop changefreq /
// priority — they carry little practical value and previously misled auditors.
const isoDate = (d) => (d && d.length === 10 ? `${d}T00:00:00+00:00` : d);
const indexable = Object.entries(meta.routes).filter(([, m]) => m.index);

// Reference files whose mtime drives each route's lastmod. Falls back to
// route-meta.json (a config-only edit still counts as "content changed" for
// robots that revisit).
const ROUTE_LASTMOD_SOURCES = {
  '/': ['route-meta.json', 'src/App.tsx', 'src/data/core.ts'],
  '/projects': ['src/components/Projects.tsx', 'src/data/core.ts'],
  '/games': ['src/components/Games.tsx', 'public/games/index.html'],
  '/about': ['src/components/About.tsx'],
  '/toolkit': ['src/components/Toolkit.tsx', 'src/data.ts'],
  '/learn': ['src/components/Learn.tsx'],
  '/blog': ['src/components/Blog.tsx'],
  '/playground': ['src/components/DevPlayground.tsx'],
  '/contact': ['src/components/Contact.tsx'],
  '/privacy': ['src/components/Privacy.tsx'],
  '/cookie-policy': ['src/components/CookiePolicy.tsx'],
  '/terms': ['src/components/Terms.tsx'],
  '/accessibility': ['src/components/AccessibilityStatement.tsx'],
  '/agents': ['src/components/AgentsHub.tsx'],
  '/lab': ['src/components/Lab.tsx'],
  '/identity': ['src/components/IdentityHub.tsx'],
  '/work': ['src/components/WorkWithMe.tsx'],
  '/low-stakes': ['src/components/LowStakesGuide.tsx'],
  '/mob-deals': ['src/components/MobDealsSwitcher.tsx'],
  '/pokeguru': ['src/components/PokeGuruExplorer.tsx'],
  '/dkma': ['src/components/DkmaGuide.tsx']
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

// Final fallback: route-meta.json mtime (a config-only change still counts).
let routeMetaMtimeMs;
try { routeMetaMtimeMs = fs.statSync(path.join(root, 'route-meta.json')).mtimeMs; }
catch { routeMetaMtimeMs = Date.now(); }

// Pass 1 — every route except '/': blog articles use their frontmatter date;
// static pages use the mtime of the source file(s) that drive their content.
const lastmodMsByRoute = new Map();
for (const [route, m] of indexable) {
  if (route === '/') continue;
  const ts = m.published
    ? Date.parse(isoDate(m.published))
    : sourceMtimeMs(ROUTE_LASTMOD_SOURCES[route]);
  lastmodMsByRoute.set(route, ts || routeMetaMtimeMs);
}

// Pass 2 — homepage: the freshest lastmod among all prerendered routes (it
// surfaces latest posts, featured projects and toolkit counts, so it is only
// as fresh as the newest content anywhere), floored by its own sources.
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
// AI discoverability (audit v5 — AI & Future-Proofing): emit a full-content
// Markdown export so LLMs / answer engines can retrieve substantive site
// content, not just the route list in public/llms.txt. Sourced from the same
// typed data module that drives the prerendered pages, so it never drifts.
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
  push('- GitHub: https://github.com/LIN4CRE');
  push('- LinkedIn: https://linkedin.com/in/david-linacre');
  push('- Expertise: React, TypeScript, Next.js, Node.js, Go, Python, PostgreSQL, Docker, AI engineering, DevOps, developer tooling');
  push(`- Availability: ${data.workNextAvailable ? `next available ${data.workNextAvailable}` : 'available for freelance and contract work'}`);
  push('');

  push('## Services & pricing');
  push('- Systems & Infrastructure Audit — deep technical review of architecture, security, performance, and developer experience. From £1,800.');
  push('- Custom Development Project — end-to-end build of production-grade tools, automation platforms, or AI integrations. From £6,500.');
  push('- Ongoing Engineering Retainer — dedicated fractional engineering time for ongoing improvements and rapid iteration. £2,400 / month.');
  push('- Reply within 12 hours from david@linacre.site. NDA-friendly. UK GDPR compliant.');
  push('');

  if (Array.isArray(data.workFaqs) && data.workFaqs.length) {
    push('## Frequently asked questions');
    for (const f of data.workFaqs) { push(`### ${f.question}`, f.answer, ''); }
  }

  const pubProjects = (data.projects || []).filter(p => p.url);
  if (pubProjects.length) {
    push('## Projects');
    for (const p of pubProjects) {
      push(`### ${p.name}${p.category ? ` [${p.category}]` : ''}`);
      if (p.description) push(p.description);
      if (p.role) push(`Role: ${p.role}`);
      if (p.challenges) push(`Problem: ${p.challenges}`);
      if (p.solution) push(`Approach: ${p.solution}`);
      if (p.tech && p.tech.length) push(`Stack: ${p.tech.join(', ')}`);
      if (p.url) push(`Link: ${p.url}`);
      push('');
    }
  }

  if (Array.isArray(data.posts) && data.posts.length) {
    push('## Engineering notes (full articles)');
    for (const post of data.posts) {
      push(`### ${post.title}`);
      const metaBits = [post.date, post.readTime, (post.tags || []).join(', ')].filter(Boolean).join(' · ');
      if (metaBits) push(`_${metaBits}_`);
      push(`URL: ${SITE}/blog/${post.slug}`, '');
      if (post.content) push(String(post.content).trim(), '');
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

  if (Array.isArray(data.roadmap) && data.roadmap.length) {
    push('## Learning roadmap');
    data.roadmap.forEach((s, i) => push(`### Step ${i + 1}: ${s.title}`, s.description, ''));
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

function buildRssFeed() {
  const posts = data.posts || [];
  const rfc822 = (dStr) => new Date(dStr).toUTCString();
  const buildDate = new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>David Linacre Blog</title>
    <link>${SITE}/blog</link>
    <description>Practical engineering notes on interface systems, frontend theming, delivery quality, and cloud caching.</description>
    <language>en-gb</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
`;

  posts.forEach(post => {
    xml += `    <item>
      <title>${esc(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <description>${esc(post.excerpt)}</description>
      <pubDate>${rfc822(post.date)}</pubDate>
      <author>david@linacre.site (David Linacre)</author>
      <category>${esc(post.category)}</category>
    </item>
`;
  });

  xml += `  </channel>
</rss>
`;

  return xml;
}

const rssContent = buildRssFeed();
fs.writeFileSync(path.join(distDir, 'feed.xml'), rssContent, 'utf8');
console.log('[prerender] feed.xml written');

const blogRssDir = path.join(distDir, 'blog');
if (!fs.existsSync(blogRssDir)) {
  fs.mkdirSync(blogRssDir, { recursive: true });
}
fs.writeFileSync(path.join(blogRssDir, 'rss.xml'), rssContent, 'utf8');
console.log('[prerender] blog/rss.xml written');

console.log(`[prerender] done — ${written.length} routes, sitemap has ${indexable.length} URLs.`);

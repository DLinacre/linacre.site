export { CHANGELOG, TERMINAL_LINES } from './data/core';
import { Tool, Project, MCPServer, SkillTemplate, BlogPost } from './types';

export const TOOLS: Tool[] = [
  // SINGLE-FILE APPS & TOOLS
  {
    id: 'slime_factory_tycoon',
    name: 'Slime Factory Tycoon 🟢',
    category: 'start',
    description: 'Production-ready open-source Roblox idle tycoon & interactive web demo with pets engine, offline earnings & balance simulator.',
    url: 'https://lin4cre.github.io/slime-factory-tycoon/',
    host: 'lin4cre.github.io/slime-factory-tycoon',
    searchKeywords: 'slime factory tycoon roblox luau game idle simulator pets rebirth linacre',
    tag: 'Game · Live'
  },
  {
    id: 'opagent',
    name: 'Personal OP Agent',
    category: 'start',
    description:
      'Zero-setup client-side AI workspace & prompt controller. Runs 100% in your browser.',
    url: '/tools/opagent.html',
    host: 'linacre.site/tools/opagent.html',
    searchKeywords: 'opagent personal ai agent prompt workspace single file html',
    tag: 'App · Live',
  },
  {
    id: 'arena_audit',
    name: 'Arena Audit Prompt Builder',
    category: 'start',
    description:
      'Universal browser audit prompt generator for engineering, UX, security, and performance reviews.',
    url: 'https://dlinacre.github.io/a-audit/',
    host: 'dlinacre.github.io/a-audit',
    searchKeywords: 'arena audit prompt builder security performance code quality',
    tag: 'App · Live',
  },
  {
    id: 'apk_hub',
    name: 'Android APK Launch Hub',
    category: 'start',
    description:
      "Quick launcher and download index for David's Android utilities and debloat tools.",
    url: '/tools/apk-hub.html',
    host: 'linacre.site/tools/apk-hub.html',
    searchKeywords: 'apk hub launcher android utilities uninstaller',
    tag: 'App · Live',
  },

  // START & IDE
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'start',
    description: 'Gold-standard code editor with essential TypeScript, Git, and React extensions.',
    url: 'https://code.visualstudio.com',
    host: 'code.visualstudio.com',
    searchKeywords: 'vs code editor microsoft extensions vscode',
    tag: 'Free',
  },
  {
    id: 'github',
    name: 'GitHub (LIN4CRE & DLinacre)',
    category: 'start',
    description:
      'Version control, open-source portfolio hosting, Actions CI/CD, and release management.',
    url: 'https://github.com/DLinacre',
    host: 'github.com/DLinacre',
    searchKeywords: 'github version control repos repositories git dlinacre lin4cre',
    tag: 'Free',
  },
  {
    id: 'git',
    name: 'Git',
    category: 'start',
    description:
      'Fundamental CLI version control tool for tracking commits, branches, and releases.',
    url: 'https://git-scm.com',
    host: 'git-scm.com',
    searchKeywords: 'git version control cli terminal commandline',
    tag: 'Free',
  },

  // BUILD
  {
    id: 'react',
    name: 'React',
    category: 'build',
    description: 'Modern component-based UI library powering interactive browser tools and SPAs.',
    url: 'https://react.dev',
    host: 'react.dev',
    searchKeywords: 'react ui library javascript components frontend framework SPA vdom',
    tag: 'Free',
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'build',
    description: 'Lightning-fast dev server and frontend build tool with hot module replacement.',
    url: 'https://vitejs.dev',
    host: 'vitejs.dev',
    searchKeywords: 'vite build tool dev server bundler HMR esbuild rollup',
    tag: 'Free',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'build',
    description: 'Utility-first CSS framework for rapid responsive layouts and consistent styling.',
    url: 'https://tailwindcss.com',
    host: 'tailwindcss.com',
    searchKeywords: 'tailwind css utility styling layout responsive',
    tag: 'Free',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'build',
    description:
      'Versatile language used for backend services, automation scripts, and CLI toolchains.',
    url: 'https://python.org',
    host: 'python.org',
    searchKeywords: 'python backend automation scripting CLI fast-api',
    tag: 'Free',
  },
  {
    id: 'kotlin',
    name: 'Kotlin & Android SDK',
    category: 'build',
    description:
      'Native Android development for utilities like Linacre Uninstaller and DKMA Monster.',
    url: 'https://developer.android.com',
    host: 'developer.android.com',
    searchKeywords: 'kotlin android mobile app development sdk',
    tag: 'Free',
  },
  {
    id: 'dexie',
    name: 'Dexie / IndexedDB',
    category: 'build',
    description:
      'Local-first browser database wrapper for fast offline storage without backend dependence.',
    url: 'https://dexie.org',
    host: 'dexie.org',
    searchKeywords: 'dexie indexeddb storage local-first database offline',
    tag: 'Free',
  },

  // DEPLOY
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'deploy',
    description: 'Global edge hosting platform with automated GitHub deployment previews and SSL.',
    url: 'https://vercel.com',
    host: 'vercel.com',
    searchKeywords: 'vercel deploy hosting edge serverless static analytics',
    tag: 'Free',
  },
  {
    id: 'github_pages',
    name: 'GitHub Pages',
    category: 'deploy',
    description: 'Free static hosting directly from GitHub repositories for web guides and games.',
    url: 'https://pages.github.com',
    host: 'pages.github.com',
    searchKeywords: 'github pages static hosting deploy web docs',
    tag: 'Free',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'deploy',
    description: 'DNS management, edge workers, and CDN caching for domain performance.',
    url: 'https://cloudflare.com',
    host: 'cloudflare.com',
    searchKeywords: 'cloudflare cdn dns workers security edge',
    tag: 'Free',
  },
];

export const MANUAL_PROJECTS: Project[] = [
  {
    name: 'Fleatment 🐱',
    category: 'build',
    description:
      'An open-source UK cat flea & tick treatment finder, live delivered price index, active ingredient strength analyzer, and safety guide.',
    url: 'https://dlinacre.github.io/Fleatment/',
    host: 'dlinacre.github.io/Fleatment',
    tag: 'Featured · Live v1.0.0',
    role: 'Creator and product engineer',
    challenges:
      'Cat owners struggle to compare real delivered prices (with VAT & shipping) and identify dangerous canine pyrethroid ingredients.',
    solution:
      'Built an offline-first single-page web app with live JSON price auto-fetching, per-dose unit cost calculations, active ingredient matrix, and cost calculator.',
    tech: ['HTML5', 'Vanilla JS', 'JSON Feed', 'GitHub Pages', 'PWA'],
    liveUrl: 'https://dlinacre.github.io/Fleatment/',
    repoUrl: 'https://github.com/DLinacre/Fleatment',
    live: true,
  },
  {
    name: 'Personal OP Agent',
    category: 'build',
    description:
      'A zero-setup, single-file HTML AI workspace and prompt controller running 100% locally in your browser with context history and model routing.',
    url: '/tools/opagent.html',
    host: 'linacre.site/tools/opagent.html',
    tag: 'Single-File App · Live',
    role: 'Creator and frontend architect',
    challenges:
      'Developers need an immediate, zero-build AI playground that runs offline and connects to models without multi-step server setup.',
    solution:
      'Engineered a standalone 170KB single-file HTML workspace with inline CSS, key storage, dynamic system prompts, and responsive streaming layout.',
    tech: ['HTML5', 'Vanilla JS', 'Tailwind CSS', 'Web Storage', 'AI Prompts'],
    liveUrl: '/tools/opagent.html',
    repoUrl: 'https://github.com/LIN4CRE/ev-backend',
  },
  {
    name: 'Arena Audit Prompt Builder',
    category: 'build',
    description:
      'A specialized browser audit tool for building systematic prompt checklists across UX, UI, SEO, Accessibility, and Security.',
    url: 'https://dlinacre.github.io/a-audit/',
    host: 'dlinacre.github.io/a-audit',
    tag: 'Single-File App · Live',
    role: 'Developer and prompt strategist',
    challenges:
      'Structured technical audits require exhaustive checklists that are easily customizable per product domain.',
    solution:
      'Built a modular single-page audit generator with instant search, category filtering, export formats, and zero third-party dependencies.',
    tech: ['HTML5', 'JavaScript', 'Tailwind CSS', 'GitHub Pages'],
    liveUrl: 'https://dlinacre.github.io/a-audit/',
    repoUrl: 'https://github.com/DLinacre/a-audit',
    live: true,
  },
  {
    name: 'APKHub',
    category: 'build',
    description:
      'An open-source Android App Store & release indexer that discovers and downloads official APK releases from GitHub & F-Droid with QR installation support.',
    url: 'https://lin4cre.github.io/APKHub/',
    host: 'lin4cre.github.io/APKHub',
    tag: 'Featured · App',
    role: 'Creator & Lead Engineer',
    challenges:
      'Sideloaded Android APK discovery requires transparent, verified source tracking without re-hosting binaries.',
    solution:
      'Engineered a React 19 single-file catalog interface with Python discovery indexers, QR instant-install flows, and direct release fetching.',
    tech: ['React 19', 'TypeScript', 'Vite 7', 'Python', 'Android APK', 'PWA'],
    liveUrl: 'https://lin4cre.github.io/APKHub/',
    repoUrl: 'https://github.com/LIN4CRE/APKHub',
  },
  {
    name: 'OmniRoute LLM Engine',
    category: 'deploy',
    description:
      'Enterprise multi-provider AI model gateway & orchestration suite with fallback routing, load balancing, cost tracking, and streaming SSE endpoints.',
    url: 'https://github.com/LIN4CRE/OmniRoute-LLM',
    host: 'github.com/LIN4CRE/OmniRoute-LLM',
    tag: 'Featured · AI Gateway',
    role: 'Systems & AI Architect',
    challenges:
      'High-availability AI applications need automated fallback routing across Gemini, OpenAI, Claude, and local Ollama model providers.',
    solution:
      'Built a Next.js / TypeScript proxy gateway with Docker Compose orchestrators, Knip complexity checks, rate limiting, and real-time streaming sockets.',
    tech: ['Next.js', 'TypeScript', 'Docker', 'Gemini AI', 'OpenAI', 'Claude', 'Ollama'],
    repoUrl: 'https://github.com/LIN4CRE/OmniRoute-LLM',
  },
  {
    name: 'PokeGuru',
    category: 'build',
    description:
      'A fast Pokémon TCG database with advanced search, UK prices in GBP, set history, chase-card discovery, and a local collection vault.',
    url: 'https://lin4cre.github.io/PokeGuru/',
    host: 'lin4cre.github.io/PokeGuru',
    tag: 'Featured · Live',
    role: 'Frontend and product engineer',
    challenges:
      'Large card catalogues need responsive search and useful market context without overwhelming collectors on mobile devices.',
    solution:
      'Built a typed React interface with route-based search, set browsing, GBP-first presentation, local collection tracking, and static GitHub Pages deployment.',
    tech: ['React', 'TypeScript', 'Vite', 'PWA', 'GitHub Pages'],
    liveUrl: 'https://lin4cre.github.io/PokeGuru/',
    repoUrl: 'https://github.com/LIN4CRE/PokeGuru',
    live: true,
  },
  {
    name: 'Apex POS',
    category: 'build',
    description:
      'An offline-first point-of-sale system for the browser with register, stock, customers, expenses, receipts, and business reporting.',
    url: 'https://dlinacre.github.io/Apex-POS/',
    host: 'dlinacre.github.io/Apex-POS',
    tag: 'Offline App · Live',
    role: 'Product developer and maintainer',
    challenges:
      'Small operators need a usable register and stock system even when connectivity is poor and without sending business data to a third-party backend.',
    solution:
      'Kept the product client-side with IndexedDB offline storage, responsive register flows, inventory warnings, expense tracking, and receipt output.',
    tech: ['Vue 3', 'Dexie', 'IndexedDB', 'PWA', 'Offline-first'],
    liveUrl: 'https://dlinacre.github.io/Apex-POS/',
    repoUrl: 'https://github.com/LIN4CRE/Apex-POS',
    live: true,
  },
  {
    name: 'Mob Deals',
    category: 'build',
    description:
      'A transparent UK SIM-only comparison and switching guide with 64 provider records, public source checks, and plain-English PAC/STAC help.',
    url: 'https://dlinacre.github.io/mob-deals/',
    host: 'dlinacre.github.io/mob-deals',
    tag: 'Featured · Live',
    role: 'Product designer and developer',
    challenges:
      'Mobile comparison sites often blur live prices, affiliate claims, and editorial data, making it hard for non-technical users to judge what is current.',
    solution:
      'Separated manually reviewed deal entries from automated reachability checks, linked every source, added clear disclaimers, and built an accessible number-switching flow.',
    tech: ['HTML', 'CSS', 'JavaScript', 'GitHub Actions', 'Accessibility'],
    liveUrl: 'https://dlinacre.github.io/mob-deals/',
    repoUrl: 'https://github.com/DLinacre/mob-deals',
    live: true,
  },
  {
    name: 'DKMA Monster',
    category: 'build',
    description:
      'A practical Android background-app survival toolkit: searchable guidance for 15 OEM families plus CLI, desktop GUI, ADB, root, and Magisk options.',
    url: 'https://lin4cre.github.io/dkma-monster/',
    host: 'lin4cre.github.io/dkma-monster',
    tag: 'Featured · Open Source',
    role: 'Systems designer and maintainer',
    challenges:
      'Android manufacturers hide battery and autostart controls in different places, causing alarms, sync, and background services to stop silently.',
    solution:
      'Centralised OEM-specific guidance in one data model and reused it across a web guide and GUI tool (`/tools/dkma-gui.html`), with a no-root path for ordinary users.',
    tech: ['Android', 'ADB', 'Python', 'Kotlin', 'Magisk', 'HTML'],
    liveUrl: 'https://lin4cre.github.io/dkma-monster/',
    repoUrl: 'https://github.com/LIN4CRE/dkma-monster',
    live: true,
  },
  {
    name: 'Linacre Uninstaller',
    category: 'build',
    description:
      'A downloadable Android cleanup app with searchable app labels, safety tiers, guided review, and a scoped batch-uninstall flow.',
    url: 'https://github.com/LIN4CRE/LinacreUninstaller/releases/latest',
    host: 'GitHub Releases',
    tag: 'Android · v1.3.1',
    role: 'Android developer and maintainer',
    challenges:
      'Debloat tools can encourage risky removals and often make sideloaded builds difficult to identify or trust.',
    solution:
      'Added explicit risk tiers, review-first interactions, clear launcher labels, a Material dark interface, and versioned APK releases with documented installation notes.',
    tech: ['Kotlin', 'Android', 'Material Design', 'GitHub Releases'],
    liveUrl: 'https://github.com/LIN4CRE/LinacreUninstaller/releases/latest',
    repoUrl: 'https://github.com/LIN4CRE/LinacreUninstaller',
  },
  {
    name: 'Linacre LLM Hub & Benchmarks',
    category: 'deploy',
    description:
      'Automated 24-hour LLM benchmark dashboard and model discovery super-app aggregating speed, pricing, and capability metrics.',
    url: 'https://lin4cre.github.io/Linacre-LLM-Benchmarks/',
    host: 'lin4cre.github.io/Linacre-LLM-Benchmarks',
    tag: 'Dashboard · Live',
    role: 'Platform developer',
    challenges: 'Model benchmarks move fast and are often spread across separate leaderboards.',
    solution:
      'Automated 24h scraping and aggregation scripts pushing JSON updates to a static GitHub Pages dashboard.',
    tech: ['JavaScript', 'Python', 'GitHub Actions', 'JSON'],
    liveUrl: 'https://lin4cre.github.io/Linacre-LLM-Benchmarks/',
    repoUrl: 'https://github.com/LIN4CRE/Linacre-LLM-Benchmarks',
  },
  {
    name: 'KushCloud',
    category: 'design',
    description:
      'A polished one-tap browser game with four worlds, combo scoring, power-ups, unlockable cosmetics, synthesised audio, and an optional leaderboard.',
    url: 'https://lin4cre.github.io/KushCloud/',
    host: 'lin4cre.github.io/KushCloud',
    tag: 'Browser Game · Live',
    role: 'Game designer and frontend engineer',
    challenges:
      'Deliver responsive arcade controls, progression, sound, and visual variety without relying on heavy external game assets.',
    solution:
      'Used Canvas 2D, Web Audio, deterministic game state, adaptive quality, keyboard/touch controls, and a PWA-ready React shell.',
    tech: ['React', 'TypeScript', 'Canvas 2D', 'Web Audio', 'PWA'],
    liveUrl: 'https://lin4cre.github.io/KushCloud/',
    repoUrl: 'https://github.com/LIN4CRE/KushCloud',
    live: true,
  },
  {
    name: 'MyHub Dev Pipeline',
    category: 'deploy',
    description:
      'A documented Python DevOps reference project covering CI/CD, security checks, DORA-style metrics, anomaly detection, tests, and automated remediation experiments.',
    url: 'https://github.com/LIN4CRE/myhub-pipeline',
    host: 'github.com/LIN4CRE/myhub-pipeline',
    tag: 'DevOps · Source',
    role: 'Automation and platform engineer',
    challenges:
      'Pipeline concepts are often presented as disconnected YAML snippets rather than one inspectable system with tests, reports, and operational history.',
    solution:
      'Organised the workflow as a versioned Python project with architecture notes, CI, tests, security reports, release tags, and a repository-hosted demo recording.',
    tech: ['Python', 'GitHub Actions', 'CI/CD', 'Security', 'DORA Metrics'],
    repoUrl: 'https://github.com/LIN4CRE/myhub-pipeline',
  },
  {
    name: 'Deasy Continuous Command Suite',
    category: 'deploy',
    description:
      'Continuous command suite and branch desktop manager for streamlined project deployment and local environment control.',
    url: 'https://github.com/DLinacre/Deasy',
    host: 'github.com/DLinacre/Deasy',
    tag: 'Desktop / CLI · Source',
    role: 'Creator and core engineer',
    challenges:
      'Managing multiple local development services and deployment branches requires an efficient desktop control interface.',
    solution:
      'Built a lightweight manager connecting CLI script orchestration, status monitoring, and electron deployment wrappers.',
    tech: ['TypeScript', 'Node.js', 'Electron', 'Vite'],
    repoUrl: 'https://github.com/DLinacre/Deasy',
  },
  {
    name: 'EV Bot & Voice Architecture',
    category: 'deploy',
    description:
      'Voice assistant integration linking Alexa commands to desktop PC macro controls and Gemini-powered conversational responses.',
    url: 'https://github.com/LIN4CRE/ev-backend',
    host: 'github.com/LIN4CRE/ev-backend',
    tag: 'Voice AI · Backend Source',
    role: 'Systems engineer',
    challenges:
      'Low-latency Alexa skill handling and macro dispatch require strict signature validation and request rate limiting.',
    solution:
      'Engineered a FastAPI Python backend service with SQLite memory persistence, SSE event channels, and Alexa interaction models.',
    tech: ['FastAPI', 'Python', 'Alexa Skill Kit', 'Gemini AI', 'SQLite'],
    repoUrl: 'https://github.com/LIN4CRE/ev-backend',
  },
];

export const PROJECTS: Project[] = MANUAL_PROJECTS;

export const ROADMAP_STEPS = [
  {
    n: 1,
    title: 'Set up your dev environment',
    text: 'Install VS Code + Git, make a dev folder, and run `git init` for the first time.',
  },
  {
    n: 2,
    title: 'Finish freeCodeCamp Responsive Web Design',
    text: '~300 hours covering HTML, CSS, Flexbox & Grid — with a certificate. The perfect start.',
  },
  {
    n: 3,
    title: 'Rebuild this landing page',
    text: "Copy the source, modify it, break it, fix it. That's how you learn. Then deploy to Vercel.",
  },
  {
    n: 4,
    title: 'Learn JavaScript (ES6+)',
    text: 'JavaScript.info + the freeCodeCamp JS cert. Build small projects — DOM, `fetch`, the works.',
  },
  {
    n: 5,
    title: 'Pick a framework & build something real',
    text: 'Next.js + Supabase + Vercel = a full-stack app. Build a blog, a tool, a portfolio. Ship it.',
  },
  {
    n: 6,
    title: 'Share everything on GitHub',
    text: 'Push code, write READMEs, build in public. Make your profile a showcase and get noticed.',
  },
];

export const LEARNING_RESOURCES = [
  {
    name: 'freeCodeCamp',
    url: 'https://freecodecamp.org',
    host: 'freecodecamp.org',
    description: 'Full curriculum + certs + huge community. The best place to start from zero.',
    tag: 'Free',
  },
  {
    name: 'The Odin Project',
    url: 'https://theodinproject.com',
    host: 'theodinproject.com',
    description: 'Full-stack JS path. Opinionated curriculum, real projects. Hardcore.',
    tag: 'Free',
  },
  {
    name: 'CS50 (Harvard)',
    url: 'https://cs50.harvard.edu',
    host: 'cs50.harvard.edu',
    description: 'The best intro to CS. C, Python, SQL, web — world-class lectures.',
    tag: 'Free',
  },
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    host: 'developer.mozilla.org',
    description: 'The bible of web dev. HTML, CSS & JS reference. Bookmark it forever.',
    tag: 'Free',
  },
  {
    name: 'JavaScript.info',
    url: 'https://javascript.info',
    host: 'javascript.info',
    description: 'The modern JavaScript tutorial. Deep, thorough and practical.',
    tag: 'Free',
  },
  {
    name: 'Frontend Mentor',
    url: 'https://frontendmentor.io',
    host: 'frontendmentor.io',
    description: 'Real HTML/CSS/JS challenges with pro designs. Learn by building.',
    tag: 'Free',
  },
  {
    name: 'Exercism',
    url: 'https://exercism.org',
    host: 'exercism.org',
    description: 'Practice coding in 66 languages. Mentored & self-paced tracks. 100% free.',
    tag: 'Free',
  },
  {
    name: 'Web Dev Simplified',
    url: 'https://youtube.com/@WebDevSimplified',
    host: 'youtube.com/@WebDevSimplified',
    description: 'Clear, concise video tutorials. Best for visual learners.',
    tag: 'Free',
  },
  {
    name: 'Fireship',
    url: 'https://youtube.com/@Fireship',
    host: 'youtube.com/@Fireship',
    description: '100-second overviews & deep dives. Learn concepts fast, stay entertained.',
    tag: 'Free',
  },
  {
    name: 'Python',
    url: 'https://python.org',
    host: 'python.org',
    description:
      'Versatile, beginner-friendly language. Great for automation, data science, and backend.',
    tag: 'Free',
  },
];

export const MCP_SERVERS: MCPServer[] = [
  {
    id: 'mcp-fs',
    category: 'Filesystem',
    title: 'Filesystem Access',
    description: 'Read, write, and manage files on your local machine.',
    package: 'npm i @modelcontextprotocol/server-filesystem',
    config: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/projects"]
    }
  }
}`,
    isReady: true,
  },
  {
    id: 'mcp-pg',
    category: 'PostgreSQL',
    title: 'PostgreSQL',
    description: 'Query, inspect, and manage PostgreSQL databases.',
    config: `{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres",
        "postgresql://user:pass@host:5432/db"]
    }
  }
}`,
    isReady: false,
  },
  {
    id: 'mcp-supa',
    category: 'Supabase',
    title: 'Supabase',
    description: 'Manage your Supabase projects, tables, and queries.',
    config: `{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "<your-url>",
        "SUPABASE_KEY": "<your-key>"
      }
    }
  }
}`,
    isReady: false,
  },
  {
    id: 'mcp-sentry',
    category: 'Sentry',
    title: 'Sentry',
    description: 'Error tracking, performance monitoring, and issue management.',
    config: `{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "<your-token>",
        "SENTRY_ORG": "<your-org>",
        "SENTRY_PROJECT": "<your-project>"
      }
    }
  }
}`,
    isReady: false,
  },
  {
    id: 'mcp-linear',
    category: 'Linear',
    title: 'Linear',
    description: 'Issue tracking, project management, and team workflows.',
    config: `{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-linear"],
      "env": {
        "LINEAR_API_KEY": "<your-key>"
      }
    }
  }
}`,
    isReady: false,
  },
];

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: 'skill-fullstack',
    title: 'Full-Stack Developer',
    description:
      'System prompt + tools for building full-stack web apps with Next.js, Supabase, and Tailwind.',
    prompt:
      'You are a senior full-stack developer. You build with Next.js, React, Tailwind CSS, and Supabase. Favour server components, edge functions, and free-tier hosting on Vercel. Write TypeScript by default. Include error handling and loading states.',
  },
  {
    id: 'skill-devops',
    title: 'DevOps / Infrastructure',
    description:
      'System prompt for managing Docker, CI/CD, cloud services, and infrastructure as code.',
    prompt:
      'You are a DevOps engineer. You manage servers, containers, CI/CD pipelines, and cloud infrastructure. Favour Docker Compose for local dev, GitHub Actions for CI, and cost-effective free tiers. Provide exact commands and config files.',
  },
  {
    id: 'skill-review',
    title: 'Code Reviewer',
    description: 'System prompt for thorough code review with security and performance focus.',
    prompt:
      'You are a senior code reviewer. Review for: correctness, security vulnerabilities, performance issues, edge cases, code style consistency, and test coverage. Be specific about issues and suggest fixes. Prioritise security and correctness over style.',
  },
  {
    id: 'skill-db',
    title: 'Database Designer',
    description: 'System prompt for schema design, query optimization, and migration planning.',
    prompt:
      'You are a database architect. Design schemas with normalized tables, proper indexing, and referential integrity. Write efficient SQL queries and migrations. Favour PostgreSQL and Supabase. Include Row Level Security policies where applicable.',
  },
  {
    id: 'skill-ui',
    title: 'UI/UX Developer',
    description: 'System prompt focused on accessible, responsive, and polished UI development.',
    prompt:
      'You are a UI developer. Build accessible (WCAG AA), responsive, and performant interfaces. Use semantic HTML, CSS Grid/Flexbox, and prefer Tailwind CSS. Ensure keyboard navigation and respect prefers-reduced-motion. Keep bundles small.',
  },
  {
    id: 'skill-api',
    title: 'API Designer',
    description: 'System prompt for designing RESTful and GraphQL APIs with good DX.',
    prompt:
      'You are an API designer. Design RESTful APIs with consistent resource naming, proper HTTP methods, and meaningful status codes. Include pagination, filtering, sorting, and error responses. Provide OpenAPI/Swagger specs. Favour serverless endpoints.',
  },
];

export const ENV_TEMPLATE = `# GitHub
GITHUB_TOKEN=ghp_...

# Brave Search
BRAVE_API_KEY=...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key

# Sentry
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Linear
LINEAR_API_KEY=...

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...`;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'dynamic-hsl-theme-variables',
    title: 'Dynamic HSL Theme Customization in React',
    excerpt:
      'How to build a theme customization panel using CSS custom properties, HSL color calculations, and local storage preservation.',
    content: `Styling terminal aesthetics requires absolute precision. In this guide, we break down how to implement the dynamic branding identity customizer found in this portfolio.

## 1. Why HSL Variables?
HSL (Hue, Saturation, Lightness) is the optimal color space for programmatically computing themes. By storing the base Hue value, we can compute borders, shadows, backgrounds, and text accents dynamically:

\`\`\`css
:root {
  --color-primary-hue: 215;
  --color-primary-sat: 20%;

  --color-primary: hsl(var(--color-primary-hue), var(--color-primary-sat), 10%);
  --color-accent: hsl(var(--color-accent-hue), 90%, 60%);
  --color-border: hsl(var(--color-primary-hue), var(--color-primary-sat), 25%);
}
\`\`\`

## 2. Updating Properties in React
When a user adjusts a dial in our Identity panel, we update the HTML element style directly:

\`\`\`typescript
const applyTheme = (hue: number) => {
  document.documentElement.style.setProperty('--color-accent-hue', String(hue));
  localStorage.setItem('theme_hue', String(hue));
};
\`\`\`

## Conclusion
This approach avoids bundling massive CSS selectors, keeps the bundle lightweight, and leverages native browser CSS variables for instantaneous runtime adjustments.`,
    date: '2026-07-02',
    readTime: '4 min read',
    tags: ['React', 'CSS', 'Tailwind', 'Motion'],
    category: 'styling',
  },
  {
    slug: 'optimizing-edge-cdn-caching',
    title: 'Optimizing Vercel Edge CDN Caching Headers',
    excerpt:
      'Enforcing cache invalidation rules, immutable assets, and s-maxage controls to build a blazing fast, globally cached SPA.',
    content: `Caching is the most cost-effective performance optimization available. By tuning cache-control parameters on your Vercel deployment, you can deliver sub-100ms load times globally.

## 1. Immutable Assets
Because Vite hashes output files (e.g., \`index-CUFdy6z6.js\`), we know these files will never change. We can safely cache them forever at the browser and edge level:

\`\`\`json
{
  "source": "/assets/(.*)",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
  ]
}
\`\`\`

## 2. Handling HTML Fallbacks
HTML routes must never use \`immutable\` cache settings, otherwise visitors will receive updates. However, we can cache them at the Edge using \`s-maxage\` and force revalidation:

\`\`\`json
{
  "source": "/index.html",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=0, s-maxage=31536000, must-revalidate" }
  ]
}
\`\`\`

## Conclusion
With these headers configured, static files serve directly from Vercel's edge cache nodes close to the user, bypassing server routing latency entirely.`,
    date: '2026-07-08',
    readTime: '5 min read',
    tags: ['Vercel', 'CDN', 'Caching', 'DevOps'],
    category: 'caching',
  },
];

export const WORK_NEXT_AVAILABLE = 'August 2026';

export interface WorkFaq {
  question: string;
  answer: string;
}

export const WORK_FAQS: WorkFaq[] = [
  {
    question: 'How quickly can we start?',
    answer:
      'Systems audits can usually start within 1–2 weeks. Custom development projects are booked in order of enquiry against the next available slot shown on this page.',
  },
  {
    question: 'What does the Systems & Infrastructure Audit include?',
    answer:
      'A deep technical review of your architecture, security, performance, and developer experience with a written report and implementation roadmap. Pricing starts at £1,800.',
  },
  {
    question: 'How do custom development projects work?',
    answer:
      'We agree scope, milestones and pricing (from £6,500) before writing code. You get a production-grade build deployed to Vercel or your cloud, with documentation and 30 days support.',
  },
  {
    question: 'Do you sign NDAs and comply with UK GDPR?',
    answer:
      'Yes. I am NDA-friendly and work under UK GDPR. Enquiries receive a response within 12 hours.',
  },
];

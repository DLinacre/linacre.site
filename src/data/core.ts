/**
 * Small, always-loaded data used by the app shell (App, TerminalIntro).
 * Kept separate from data.ts so the heavy TOOLS/BLOG catalogues stay in
 * lazy route chunks instead of the main bundle.
 */
import { ChangelogItem } from '../types';

export const CHANGELOG: ChangelogItem[] = [
  {
    version: 'v6.3',
    title: 'Self-Hosted Offline Fonts & Web Audio Arcade',
    description:
      "Self-hosted variable fonts locally under /fonts for 100% offline standalone rendering; added synthesized Web Audio blips and touch gesture control to the Games Hub; and expanded David's full 16-year career timeline.",
  },
  {
    version: 'v6.2',
    title: 'Games Hub & Focused Developer Loadout',
    description:
      'Upgraded the dedicated Games page with standalone glass layout, live KushCloud arcade flyer, and built-in interactive Snake; streamlined the Toolkit page into a curated daily loadout; and updated all CV and experience records with verified real data.',
  },
  {
    version: 'v6.1',
    title: 'Everyday Utility Pack',
    description:
      'Added four private, client-side tools to the start page: a UK VAT calculator, text cleaner and counter, SHA-256 generator, and URL parser with common tracking-parameter removal. No sign-up, adverts, analytics, or server processing.',
  },
  {
    version: 'v6.0',
    title: 'CyberBlue-Green System',
    description:
      'Rebuilt the visual identity around deep navy surfaces, electric cyan and signal green; replaced the Identity page with a focused export studio; regenerated the GitHub banner, social preview and app icons; and reduced the portfolio to verified projects with live products, downloadable releases or inspectable source.',
  },
  {
    version: 'v5.0',
    title: 'The Useful Start Page',
    description:
      'Replaced the sales-heavy homepage with a practical daily launchpad: smart web and URL search, private JSON and Base64 tools, timestamp conversion, cryptographically secure UUID/password generation, and direct access to useful Linacre products. The portfolio, toolkit, services, and labs remain available as dedicated routes.',
  },
  {
    version: 'v4.5',
    title: 'Premium Brand-Kit Alignment',
    description:
      'Complete visual overhaul aligned to the Linacre brand-kit: Ink Black backgrounds, Amber Core/Glow accent system, brand gradients and glow shadows, hex-grid hero with CTAs, glassmorphism header with breathing logo, amber pulse-line dividers, upgraded card surfaces across Toolkit/Learn/Terminal, LinkedIn footer link, and unified Python CLI (linacre.py) replacing 4 separate automation scripts.',
  },
  {
    version: 'v3.5',
    title: 'React & Full-Stack Evolution',
    description:
      'Rebuild of the architecture to fully compiled React + TypeScript + Express v4, styled using Tailwind CSS v4 and Motion. Engineered server-side Gemini API chat routes to keep keys secure, built a client-side command palette with full keyboard navigation and shortcut support, added dark/light mode toggles with localStorage system-sync, fixed service worker state bugs, and polished the typography with Space Grotesk.',
  },
  {
    version: 'v3.0',
    title: 'Hardening & audit release',
    description:
      'Full code audit: fixed roadmap section, service worker now picks up fresh deploys, patched a link-injection hole in the Lab, security headers, social preview card, PWA icons, robots + sitemap.',
  },
  {
    version: 'v2.0',
    title: 'Introducing the AI Lab',
    description:
      'Connected local LLMs directly to the browser. Multi-provider chat terminal supporting Ollama, Gemini, OpenAI, and LiteLLM. Implemented client-side storage for conversation context preservation.',
  },
  {
    version: 'v1.0',
    title: 'V0 to Vercel',
    description:
      'Initial release. Plain, clean HTML/CSS terminal-themed landing page, static searchable toolkit index, responsive grid and mobile navigation layouts.',
  },
];

export const TERMINAL_LINES = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'David Christopher Linacre', cls: '' },
  { type: 'gap' },
  { type: 'cmd', text: 'cat interests.txt' },
  { type: 'out', text: 'building things · open source · learning · creating', cls: 'dim' },
  { type: 'gap' },
  { type: 'cmd', text: 'echo $STATUS' },
  { type: 'out', text: '● Shipping v6.0 — CyberBlue, useful-first, verified.', cls: 'amb' },
  { type: 'gap' },
  { type: 'cmd', text: 'ls ./this-site/' },
  {
    type: 'out',
    text: 'React · TypeScript · Tailwind CSS v4 · Motion · Express · Brand Kit',
    cls: 'dim',
  },
  { type: 'gap' },
  { type: 'prompt' },
];

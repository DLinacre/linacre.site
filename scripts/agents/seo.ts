import fs from 'fs';
import path from 'path';

function log(msg: string) {
  console.log(`[🔎 SEO Agent] ${msg}`);
}

log('Starting SEO Sweep...');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Robots.txt
const robotsPath = path.join(publicDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  log('Generating missing robots.txt...');
  fs.writeFileSync(
    robotsPath,
    'User-agent: *\nAllow: /\nSitemap: https://www.linacre.site/sitemap.xml',
    'utf-8',
  );
} else {
  log('robots.txt is present.');
}

// 2. Sitemap stub
const sitemapPath = path.join(publicDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  log('Generating basic sitemap.xml stub...');
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.linacre.site/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
} else {
  log('sitemap.xml is present.');
}

log('SEO Sweep Complete.');

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';
import type { Connect } from 'vite';
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'studio-detail-routes',
        // Vite's clean-URL fallback otherwise prefers public/games/tiles.html
        // over the studio detail route. Explicit .html links still launch games.
        configureServer(server) {
          server.middlewares.use(studioRoutes(false));
        },
        configurePreviewServer(server) {
          server.middlewares.use(studioRoutes(true));
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Long-cached vendor chunks: app code changes without re-downloading React
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['motion'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      allowedHosts: ['dl', 'poco-f7-1', '.local', '.tailscale.net', '.e2b.app'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**'],
      },
    },
  };
});

function studioRoutes(built: boolean): Connect.NextHandleFunction {
  const routes = new Set(
    ['games', 'projects'].flatMap(section => {
      const records = JSON.parse(
        fs.readFileSync(path.resolve(`src/content/${section}/records.json`), 'utf8'),
      ) as { slug: string }[];
      return records.flatMap(record => [
        `/${section}/${record.slug}`,
        ...(section === 'games' ? [`/games/${record.slug}/play`] : []),
      ]);
    }),
  );
  return (req, _res, next) => {
    const pathname = (req.url || '/').split('?')[0].replace(/\/$/, '');
    if (['/helix', '/legacy-games'].includes(pathname)) req.url = `${pathname}/index.html`;
    if (routes.has(pathname)) req.url = built ? `${pathname}/index.html` : '/index.html';
    next();
  };
}

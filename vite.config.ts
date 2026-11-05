import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
      plugins: [
        {
          name: 'studio-spa-routes',
          configureServer(server) {
            server.middlewares.use((req, _res, next) => {
              const pathname = req.url?.split('?')[0];
              if (pathname === '/games' || pathname === '/games/') {
                req.url = '/index.html';
              } else if (pathname === '/helix') {
                req.url = '/helix/index.html';
              }
              next();
            });
          },
          configurePreviewServer(server) {
            server.middlewares.use((req, _res, next) => {
              const pathname = req.url?.split('?')[0];
              if (pathname === '/games' || pathname === '/games/') {
                req.url = '/index.html';
              } else if (pathname === '/helix') {
                req.url = '/helix/index.html';
              }
              next();
            });
          },
        },
        react(),
        tailwindcss(),
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
    preview: {
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

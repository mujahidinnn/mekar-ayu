import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt' leaves the new SW in the `waiting` state instead of activating it the
      // instant it's downloaded — the UpdateToast in App.tsx asks the user before any
      // in-flight IndexedDB write could be interrupted by a controller swap.
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        id: '/',
        name: 'Mekar Ayu - Period & Cycle Tracker',
        short_name: 'Mekar Ayu',
        description: 'Privacy-first, local-only period and reproductive health tracker. Zero backend, zero telemetry.',
        categories: ['health', 'lifestyle', 'medical'],
        theme_color: '#FB7185',
        background_color: '#FFF1F2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        // Lets Chrome's install prompt show an actual preview of the app instead of a bare
        // name + icon — the richer, more legitimate-looking dialog is the one lever this repo
        // has over "app info" during install; OS-level post-install scanners (e.g. MIUI's own
        // security app) key off the resulting package's signature/reputation, not this manifest.
        screenshots: [
          {
            src: 'screenshot-narrow.png',
            sizes: '1082x2402',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Kalender siklus Mekar Ayu',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // The PDF/Excel export libraries (jsPDF, SheetJS, and jsPDF's own html2canvas/dompurify
        // deps) are dynamically imported only when the user taps an export button — they're
        // rarely used, so they shouldn't bloat the up-front install cache. They're still fully
        // available offline once fetched once, via the runtime caching rule below.
        // og-image.png and screenshot-narrow.png are only ever fetched by social-link crawlers
        // and Chrome's install-prompt UI, never by the app itself, so neither belongs offline.
        globIgnores: ['**/pdf-*.js', '**/excel-*.js', '**/html2canvas*.js', '**/purify*.js', '**/og-image.png', '**/screenshot-narrow.png'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/(pdf|excel|html2canvas|purify)[^/]*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mekarayu-export-libs',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})

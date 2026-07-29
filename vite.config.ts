import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'M Project - Period & Cycle Tracker',
        short_name: 'M Project',
        description: 'Privacy-first, local-only period and reproductive health tracker. Zero backend, zero telemetry.',
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
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // The PDF/Excel export libraries (jsPDF, SheetJS, and jsPDF's own html2canvas/dompurify
        // deps) are dynamically imported only when the user taps an export button — they're
        // rarely used, so they shouldn't bloat the up-front install cache. They're still fully
        // available offline once fetched once, via the runtime caching rule below.
        globIgnores: ['**/pdf-*.js', '**/excel-*.js', '**/html2canvas*.js', '**/purify*.js'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/(pdf|excel|html2canvas|purify)[^/]*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'm-project-export-libs',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})

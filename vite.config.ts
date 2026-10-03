import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        id: '/',
        name: 'Mekar Ayu - Period & Cycle Tracker',
        short_name: 'Mekar Ayu',
        description: 'Teman setia yang memahami setiap fase siklusmu. Privat dan 100% tersimpan di perangkatmu: tanpa akun, tanpa server, tanpa pelacakan.',
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
        globIgnores: [
          '**/pdf-*.js',
          '**/excel-*.js',
          '**/html2canvas*.js',
          '**/purify*.js',
          '**/index.es-*.js',
          '**/og-image.png',
          '**/screenshot-narrow.png',
        ],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/(pdf|excel|html2canvas|purify|index\.es)[^/]*\.js$/,
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

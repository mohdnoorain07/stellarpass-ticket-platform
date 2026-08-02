import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

const isAnalyze = process.env.ANALYZE === 'true';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // SPA fallback: all navigation requests get index.html
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/__.*/],
        // Stale-while-revalidate for assets, network-first for navigation
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: 'StellarPass - Decentralized Event Ticketing',
        short_name: 'StellarPass',
        description:
          'Create events, mint verifiable tickets, transfer ownership, verify attendance with QR codes, and settle secondary market royalties on-chain with Soroban smart contracts.',
        theme_color: '#0f1115',
        background_color: '#0f1115',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    // Only run visualizer when ANALYZE=true
    ...(isAnalyze
      ? [
          visualizer({
            filename: 'dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    clearMocks: true,
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf('node_modules') !== -1) {
            // React & React-DOM (highest priority to avoid circular deps)
            if (id.indexOf('react-dom') !== -1 || id.indexOf('react/') !== -1 || id.indexOf('scheduler') !== -1) {
              return 'react-core';
            }
            // Heavy Stellar SDK (54KB gzipped — only needed on Event/CheckIn/Wallet pages)
            if (id.indexOf('@stellar/stellar-sdk') !== -1) {
              return 'stellar-wallet';
            }
            // Freighter wallet API (tiny — a few KB, but Navbar loads it dynamically)
            if (id.indexOf('@stellar/freighter-api') !== -1) {
              return 'freighter';
            }
            // Router
            if (id.indexOf('react-router-dom') !== -1 || id.indexOf('react-router') !== -1) {
              return 'react-router';
            }
            // QR scanner (only used on CheckInPage)
            if (id.indexOf('@zxing') !== -1) {
              return 'qr-scanner';
            }
            // QR code generation (only used on TicketCard)
            if (id.indexOf('qrcode.react') !== -1 || id.indexOf('qr.js') !== -1) {
              return 'qr-code';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});

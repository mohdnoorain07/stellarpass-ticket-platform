import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    clearMocks: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf('node_modules') !== -1) {
            if (id.indexOf('@stellar/stellar-sdk') !== -1 || id.indexOf('@stellar/freighter-api') !== -1) {
              return 'stellar-wallet';
            }
            if (id.indexOf('react-router-dom') !== -1) {
              return 'react-router';
            }
            if (id.indexOf('@tanstack/react-query') !== -1) {
              return 'react-query';
            }
            if (id.indexOf('@zxing') !== -1) {
              return 'qr-scanner';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});

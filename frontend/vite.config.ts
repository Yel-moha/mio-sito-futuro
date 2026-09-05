import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const root = import.meta.dirname;

// Repo GitHub Pages: https://yel-moha.github.io/mio-sito-futuro/
export default defineConfig({
  base: '/mio-sito-futuro/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        allarmeGsm: resolve(root, 'progetti/allarme-gsm.html'),
      },
    },
  },
});

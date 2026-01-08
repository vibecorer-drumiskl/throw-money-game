import { defineConfig } from 'vite';

export default defineConfig({
  base: '/throw-money-game/', // Add trailing slash
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 3000,
  },
});

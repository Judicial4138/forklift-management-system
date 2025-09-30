import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html')
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
    minify: 'terser',
    sourcemap: process.env.NODE_ENV !== 'production',
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    reportCompressedSize: false
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  preview: {
    port: 3000,
    open: true
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'public')
    }
  }
});

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
    reportCompressedSize: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    host: true,
    strictPort: true
  },
  preview: {
    port: 3000,
    open: true,
    host: true
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'public')
    }
  },
  optimizeDeps: {
    include: ['xlsx', 'file-saver'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  esbuild: {
    // Add this if you're using Node.js built-in modules
    define: {
      global: 'globalThis',
    },
  },
});

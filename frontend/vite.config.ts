import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: '../public',
    emptyOutDir: false,
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://learnflow.test',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://learnflow.test',
        changeOrigin: true,
      },
      '/docs': {
        target: 'http://learnflow.test',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/static/',
  build: {
    outDir: 'weather/static',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // If a module is inside node_modules, separate it into its own bundle
          if (id.includes('node_modules')) {
            // Split big graphing/rendering modules specifically if needed
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            // Group everything else into a general vendor chunk
            return 'vendor-core';
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})

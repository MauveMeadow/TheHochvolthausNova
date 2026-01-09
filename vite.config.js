import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    mimeTypes: {
      'wasm': 'application/wasm'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        bigint: true
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    // Enables fast refresh
    fastRefresh: true,
  })],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    }
  }
})
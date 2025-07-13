import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    // Enables fast refresh
    fastRefresh: true,
  })],
  server: {
    // Ensures HMR works reliably
    hmr: {
      overlay: false
    }
  }
})
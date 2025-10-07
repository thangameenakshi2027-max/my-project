import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react()],
  server: {
    proxy: {
      // This says "if you see a request starting with /api, 
      // forward it to http://localhost:3001"
      '/api': 'http://localhost:3001'
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Specify the port here
    strictPort: true, // This ensures that Vite will fail if port 5173 is unavailable
  },
  build: {
    sourcemap: true,  // Enable source maps for better debugging
  }
})
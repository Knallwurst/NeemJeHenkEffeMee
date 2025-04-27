import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173, // Specify the port here
      strictPort: true, // This ensures that Vite will fail if port 5173 is unavailable
    },
    build: {
      sourcemap: true,  // Enable source maps for better debugging
    },
    define: {
      'process.env.VITE_MAP_COMPONENT_API_KEY': JSON.stringify(env.VITE_MAP_COMPONENT_API_KEY),
      'process.env.VITE_MAP_ID_KEY': JSON.stringify(env.VITE_MAP_ID_KEY),
    },
  };
});
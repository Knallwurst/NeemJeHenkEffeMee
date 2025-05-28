import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173, // Port speciferen
      strictPort: true, // Dit zorgt ervoor dat Vite zal falen als poort 5173 niet beschikbaar is
    },
    build: {
      sourcemap: true,  // Source maps voor betere debugging
    },
    define: {
      'process.env.VITE_MAP_COMPONENT_API_KEY': JSON.stringify(env.VITE_MAP_COMPONENT_API_KEY),
      'process.env.VITE_MAP_ID_KEY': JSON.stringify(env.VITE_MAP_ID_KEY),
    },
  };
});
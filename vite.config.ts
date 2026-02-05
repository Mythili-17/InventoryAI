//Vite config; also maps GEMINI_API_KEY into process.env.API_KEY for the app.

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file from the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Map the key from your .env.local (GEMINI_API_KEY) to process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_API_KEY)
    },
    server: {
      port: 5173,
      strictPort: true,
    }
  };
});
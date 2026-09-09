import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables from the workspace root (including non-VITE_ variables)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Proxy API and config requests to our local Express backend during development
      proxy: {
        '/api': 'http://localhost:3001',
        '/config.js': 'http://localhost:3001'
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    define: {
      'import.meta.env.EINK_THEME': JSON.stringify(env.EINK_THEME || process.env.EINK_THEME || ''),
      'import.meta.env.EINK_SCENARIO': JSON.stringify(env.EINK_SCENARIO || process.env.EINK_SCENARIO || ''),
      'import.meta.env.EINK_SHOW_CONTROLS': JSON.stringify(env.EINK_SHOW_CONTROLS || process.env.EINK_SHOW_CONTROLS || ''),
      'import.meta.env.HA_ENTITY_SUN': JSON.stringify(env.HA_ENTITY_SUN || process.env.HA_ENTITY_SUN || 'sun.sun'),
    },
  };
});

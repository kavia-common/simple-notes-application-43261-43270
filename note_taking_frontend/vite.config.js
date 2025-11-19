import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Node 18-compatible Vite config; no Node 20+ APIs like crypto.hash are used.
// Vite server watcher debounce and ignore .env / config changes for dev stability
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignore .env and vite config changes to prevent flapping (restart loop)
      ignored: [
        /(^|\/)\.env(\..*)?$/, // All .env and .env.* files
        /vite\.config\.[cm]?[jt]s$/, // This config file itself
      ],
      usePolling: false,
      awaitWriteFinish: {
        stabilityThreshold: 800,
        pollInterval: 100,
      },
    },
  },
});

//
// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Vite config for Tizen note-taking frontend.
 * - Locks dev port to 3000, no auto-port-switch (server.strictPort = true)
 * - Ignores watcher reloads for dist/** and .env* files (server.watch.ignored)
 * - Debounces watcher events, disables polling (server.watch.awaitWriteFinish)
 * - Serves from root (index.html at project root)
 * - Ensures dev never writes to .env or dist
 * - publicDir is "public" only, never dist
 * - build.outDir is always dist (for builds), dev server does NOT read/write here.
 * - No plugins or scripts update .env* or dist during dev
 * - .gitignore/.viteignore should include dist/ and .env*
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // index.html at project root
  publicDir: 'public', // serve static from public (not dist!)
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // do not switch port, fail if 3000 in use
    watch: {
      // Ignore dist/ and .env* changes to avoid reload loops
      ignored: [
        /^dist(\/|\\|$)/,
        /\.env(\..*)?$/,
        /(^|\/|\\)dist(\/|\\|$)/,
      ],
      usePolling: false, // true if running on Docker or WSL2, otherwise false
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    },
    fs: {
      strict: true,
    }
  },
  optimizeDeps: {
    // Never scan dist (just in case)
    exclude: ['dist']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Never take input from dist
      input: 'index.html'
    }
  }
})

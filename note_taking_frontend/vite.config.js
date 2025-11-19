// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Vite config for Tizen note-taking frontend.
 * - Locks dev port to 3000, no auto-port-switch (server.strictPort = true)
 * - Ignores watcher reloads for dist/** and .env* files (server.watch.ignored)
 * - Debounces watcher events, disables polling (server.watch.awaitWriteFinish)
 * - Serves from root (index.html stays at project root)
 * - Ensures dev never writes to .env or dist
 * - publicDir is "public" only, never dist
 * - build.outDir is always dist (for builds), dev server does NOT read/write here.
 * - No plugins or scripts update .env* or dist during dev
 * - .gitignore/.viteignore should include dist/ and .env*
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// PUBLIC_INTERFACE
/**
 * Vite config for Tizen note-taking frontend.
 * - Locks dev port to 3000, no auto-port-switch (server.strictPort = true)
 * - Ignores watcher reloads for dist/** and .env* files
 * - Debounces watcher events, disables polling
 * - Serves from /src with /public as publicDir, never dist
 * - Ensures dev never writes to .env or dist
 */

export default defineConfig({
  root: '.', // index.html at project root
  plugins: [react()],
  publicDir: 'public', // serve static from public (not dist!)
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
      // root: path.join(__dirname, 'src'), // only needed if serving from src (not for index at root)
    }
  },
  optimizeDeps: {
    // Never scan dist (should not be necessary, just in case)
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

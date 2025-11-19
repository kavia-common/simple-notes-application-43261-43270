//
// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Vite config for Tizen note-taking frontend.
 * 
 * CRITICAL PROJECT INVARIANTS:
 * - index.html must ONLY exist at the project root; it MUST NOT exist inside dist/.
 * - dist/index.html, if ever generated, MUST be deleted and moved to project root instead.
 * - The dev server and scripts must NEVER write to or modify files inside dist/ or any .env* file while running
 *   (these are reserved for build only and must not be watched for reloads).
 * 
 * WATCHER & BUILD DETAILS:
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
    strictPort: true,
    // Ensure watcher ignores all hazardous files/dirs for dev restarts:
    hmr: {
      overlay: true,
      watch: {
        ignored: [
          /^dist(\/|\\|$)/,
          /\.env(\..*)?$/,
          /(^|\/|\\)dist(\/|\\|$)/,
          '**/.env',
          '**/.env.*',
          '**/vite.config.js',
          '**/vite.config.ts',
          '**/.swp',
          '**/.swx',
          '**/.tmp',
          '**/*.tmp',
          '**/*.swp',
          '**/.DS_Store',
          '**/~*',
          // Explicit: do not restart for config or lock files
          '**/post_process_status.lock'
        ],
      },
    },
    watch: {
      ignored: [
        /^dist(\/|\\|$)/,
        /\.env(\..*)?$/,
        /(^|\/|\\)dist(\/|\\|$)/,
        '**/.env',
        '**/.env.*',
        '**/vite.config.js',
        '**/vite.config.ts',
        '**/.swp',
        '**/.swx',
        '**/.tmp',
        '**/*.tmp',
        '**/*.swp',
        '**/.DS_Store',
        '**/~*',
        '**/post_process_status.lock'
      ],
      usePolling: false,
      awaitWriteFinish: {
        stabilityThreshold: 800,
        pollInterval: 110,
      }
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

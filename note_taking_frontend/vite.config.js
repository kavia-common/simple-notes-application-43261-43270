import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Node 18-compatible Vite config; no Node 20+ APIs like crypto.hash are used.
export default defineConfig({
  plugins: [react()],
});

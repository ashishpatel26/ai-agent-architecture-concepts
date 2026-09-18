import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ai-agent-architecture-concepts/',
  // The project lives on a Windows-mounted drive in WSL, where native file
  // notifications can miss edits. Polling keeps the development preview fresh.
  server: { watch: { usePolling: true } },
});

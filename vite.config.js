import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Phones on the LAN need to reach the dev server to test the QR join flow.
    host: true,
    proxy: {
      '/socket.io': { target: 'http://localhost:3000', ws: true },
      '/healthz': 'http://localhost:3000',
    },
  },
  build: { outDir: 'dist' },
});

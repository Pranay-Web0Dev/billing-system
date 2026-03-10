import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend server if needed
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/prod/trial': {
        target: 'https://api.upcitemdb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod\/trial/, '/prod/trial'),
      },
    },
  },
});

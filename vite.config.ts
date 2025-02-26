import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/moneybird-proxy/.*': {
        target: 'https://moneybird.com/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moneybird-proxy/, ''),
      },
    },
  },
});

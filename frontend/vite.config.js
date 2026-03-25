import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import {  ADMIN_BASE_URL } from "../config";

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/admin': {
        target: `${ADMIN_BASE_URL}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
      // ADD THIS so images show up in your React frontend
      '/uploads': {
        target: 'http://localhost/backend/admin/uploads',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, ''),
      },
    },
  },
})

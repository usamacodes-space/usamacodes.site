import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { groqApiPlugin } from './vite-plugin-api';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), groqApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});

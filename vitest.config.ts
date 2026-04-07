import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    // tsconfig uses jsx: "preserve" for Next; Vitest needs a JSX transform for .tsx deps (e.g. constants.tsx).
    jsx: 'automatic',
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

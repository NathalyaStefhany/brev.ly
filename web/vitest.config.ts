import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/tests/setup.ts',
    coverage: {
      reporter: ['html'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/app.tsx',
        'src/main.tsx',
        'src/routes/**',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

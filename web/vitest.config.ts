import { defineConfig, coverageConfigDefaults } from 'vitest/config';

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
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});

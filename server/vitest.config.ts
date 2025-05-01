import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: 'src/tests/setup.ts',
    coverage: {
      reporter: ['html'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'drizzle.config.ts',
        'src/infra/http/server.ts',
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

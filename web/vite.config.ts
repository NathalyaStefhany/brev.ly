import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

import { envSchema } from './src/envSchema';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = envSchema.parse(loadEnv(mode, process.cwd(), 'VITE_'));

  return {
    plugins: [
      react(),
      tailwindcss(),
      sentryVitePlugin({
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        org: env.VITE_SENTRY_ORG,
        project: env.VITE_SENTRY_PROJECT,
      }),
    ],
    server: {
      port: env.VITE_PORT,
      watch: {
        ignored: ['**/*.spec.ts', '**/*.spec.tsx'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      sourcemap: true,
    },
  };
});

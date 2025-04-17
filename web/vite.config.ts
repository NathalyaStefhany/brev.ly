import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { envSchema } from './src/envSchema';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = envSchema.parse(loadEnv(mode, process.cwd(), 'VITE_'));

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: env.VITE_PORT,
    },
  };
});

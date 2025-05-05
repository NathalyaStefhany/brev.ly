import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/infra/db/schemas/*',
  out: 'src/infra/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

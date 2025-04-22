import { z } from 'zod';

export const envSchema = z.object({
  VITE_PORT: z.coerce.number().default(4000),

  VITE_SENTRY_ORG: z.string(),
  VITE_SENTRY_PROJECT: z.string(),
  VITE_SENTRY_DSN: z.string().url(),
  VITE_SENTRY_AUTH_TOKEN: z.string(),
});

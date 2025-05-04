import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),

  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),

  DATABASE_URL: z.string().url().startsWith('postgresql://'),

  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string().url(),
  CLOUDFLARE_BUCKET: z.string(),
});

export const env = envSchema.parse(process.env);

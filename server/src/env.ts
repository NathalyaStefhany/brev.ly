import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
});

export const env = envSchema.parse(process.env);

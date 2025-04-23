import { z } from 'zod';

const envSchema = z.object({
  POSTGRES_PORT: z.coerce.number().default(3333),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

export const env = envSchema.parse(process.env);

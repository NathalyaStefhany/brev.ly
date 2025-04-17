import { z } from 'zod';

export const envSchema = z.object({
  VITE_PORT: z.coerce.number().default(4000),
});

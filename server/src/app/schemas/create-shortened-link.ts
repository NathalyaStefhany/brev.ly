import { z } from 'zod';

export const createShortenedLinkInputSchema = z.object({
  originalLink: z
    .string()
    .min(1, 'The original link is required')
    .refine((value) => {
      try {
        new URL(value);

        return true;
      } catch {
        return /^(www\.)[\w-]+\.[a-z]{2,}(\.[a-z]{2,})?(\/[^\s]*)?$/i.test(
          value,
        );
      }
    }, 'Invalid url'),
  shortenedLink: z
    .string()
    .min(1, 'The shortened link is required')
    .regex(
      /^[a-z0-9-]+$/,
      'The provided shortened link is invalid. It must be lowercase, and cannot contain spaces or special characters.',
    ),
});

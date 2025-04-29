import { createShortenedLink } from '@/app/functions/create-shortened-link';
import { unwrapEither } from '@/shared/either';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const createShortenedLinkRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.post(
    '/shortened-links',
    {
      schema: {
        summary: 'Create shortened link',
        tags: ['Shortened Links'],
        body: z.object({
          originalLink: z.string().url(),
          shortenedLink: z.string(),
        }),
        response: {
          201: z
            .object({ id: z.string() })
            .describe(
              "New shortened link created. Returns the link's unique ID.",
            ),
        },
      },
    },
    async (request, reply) => {
      const { originalLink, shortenedLink } = request.body;

      const result = await createShortenedLink({
        originalLink,
        shortenedLink,
      });

      const { id } = unwrapEither(result);

      return reply
        .header('location', `/shortened-links/${id}`)
        .status(201)
        .send({ id });
    },
  );
};

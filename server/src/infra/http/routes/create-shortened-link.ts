import { createShortenedLink } from '@/app/functions/create-shortened-link';
import { createShortenedLinkInputSchema } from '@/app/schemas/create-shortened-link';
import { isRight, unwrapEither } from '@/shared/either';
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
        body: createShortenedLinkInputSchema,
        response: {
          201: z
            .object({ id: z.string() })
            .describe(
              "New shortened link created. Returns the link's unique ID.",
            ),
          400: z
            .object({ message: z.string() })
            .catchall(z.any())
            .describe('The request was invalid or missing required data.'),
          500: z
            .object({ message: z.string() })
            .describe(
              'An unexpected internal server error occurred while processing the request.',
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

      if (isRight(result)) {
        const { id } = unwrapEither(result);

        return reply
          .header('location', `/shortened-links/${id}`)
          .status(201)
          .send({ id });
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'DuplicateShortenedLink':
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};

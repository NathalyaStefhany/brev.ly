import { updateAccessQuantity } from '@/app/functions/update-access-quantity';
import { isRight, unwrapEither } from '@/shared/either';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const updateAccessQuantityRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.patch(
    '/shortened-links/:shortenedLink/access',
    {
      schema: {
        summary: 'Update access quantity',
        tags: ['Shortened Links'],
        params: z.object({
          shortenedLink: z.string(),
        }),
        response: {
          200: z
            .object({
              originalLink: z.string(),
              shortenedLink: z.string(),
              quantityAccesses: z.number(),
            })
            .describe(
              'Successfully incremented the access count for the shortened link.',
            ),
          404: z
            .object({ message: z.string() })
            .describe(
              'No original link was found for the shortened link provided in the URL path.',
            ),
        },
      },
    },
    async (request, reply) => {
      const { shortenedLink } = request.params;

      const result = await updateAccessQuantity(shortenedLink);

      if (isRight(result)) {
        const { originalLink, shortenedLink, quantityAccesses } =
          unwrapEither(result);

        return reply
          .status(200)
          .send({ originalLink, shortenedLink, quantityAccesses });
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'ShortenedLinkNotAvailable':
          return reply.status(404).send({ message: error.message });
      }
    },
  );
};

import { getOriginalLink } from '@/app/functions/get-original-link';
import { isRight, unwrapEither } from '@/shared/either';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const getOriginalLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/shortened-links/:shortenedLink/original-link',
    {
      schema: {
        summary: 'Get original link from shortened link',
        tags: ['Shortened Links'],
        params: z.object({
          shortenedLink: z.string(),
        }),
        response: {
          200: z
            .object({
              originalLink: z.string(),
            })
            .describe(
              'Returns the original link corresponding to the shortened link.',
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

      const result = await getOriginalLink(shortenedLink);

      if (isRight(result)) {
        const { originalLink } = unwrapEither(result);

        return reply.status(200).send({ originalLink });
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'ShortenedLinkNotAvailable':
          return reply.status(404).send({ message: error.message });
      }
    },
  );
};

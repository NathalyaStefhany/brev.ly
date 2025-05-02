import { deleteShortenedLink } from '@/app/functions/delete-shortened-link';
import { isRight, unwrapEither } from '@/shared/either';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const deleteShortenedLinkRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.delete(
    '/shortened-links/:id',
    {
      schema: {
        summary: 'Delete shortened link',
        tags: ['Shortened Links'],
        params: z.object({
          id: z.string().describe('Shortened link ID'),
        }),
        response: {
          204: z
            .undefined()
            .describe('Shortened link has been successfully deleted.'),
          404: z
            .object({ message: z.string() })
            .describe(
              'No shortened link was found for the ID provided in the URL path.',
            ),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const result = await deleteShortenedLink(id);

      if (isRight(result)) {
        return reply.status(204).send();
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'ShortenedLinkNotAvailable':
          return reply.status(404).send({ message: error.message });
      }
    },
  );
};

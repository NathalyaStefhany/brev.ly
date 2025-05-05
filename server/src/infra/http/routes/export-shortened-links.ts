import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { exportShortenedLinks } from '@/app/functions/export-shortened-links';
import { unwrapEither } from '@/shared/either';
import { z } from 'zod';

export const exportShortenedLinksRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.get(
    '/shortened-links/export',
    {
      schema: {
        summary: 'Export shortened links',
        tags: ['Shortened Links'],
        response: {
          200: z
            .object({ reportUrl: z.string() })
            .describe('Shortened links exported successfully.'),
        },
      },
    },
    async (_, reply) => {
      const result = await exportShortenedLinks();

      const { reportUrl } = unwrapEither(result);

      return reply.status(200).send({ reportUrl });
    },
  );
};

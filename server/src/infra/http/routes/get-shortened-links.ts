import { getShortenedLinks } from '@/app/functions/get-shortened-links';
import { unwrapEither } from '@/shared/either';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const getShortenedLinksRoutes: FastifyPluginAsyncZod = async (
  server,
) => {
  server.get(
    '/shortened-links',
    {
      schema: {
        summary: 'Get shortened links',
        tags: ['Shortened Links'],
        querystring: z.object({
          page: z.coerce.number().min(1).optional().default(1),
          pageSize: z.coerce.number().min(1).optional().default(20),
        }),
        response: {
          200: z.object({
            total: z.number(),
            page: z.number(),
            pageSize: z.number(),
            data: z.array(
              z.object({
                id: z.string(),
                originalLink: z.string(),
                shortenedLink: z.string(),
                quantityAccesses: z.number(),
                createdAt: z.date(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize } = request.query;

      const result = await getShortenedLinks({ page, pageSize });

      const { total, data } = unwrapEither(result);

      return reply.code(200).send({ total, page, pageSize, data });
    },
  );
};

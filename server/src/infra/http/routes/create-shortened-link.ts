import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
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

      const shortenedLinksSchema = schema.shortenedLinks;

      const [newShortenedLink] = await db
        .insert(shortenedLinksSchema)
        .values({ originalLink, shortenedLink })
        .returning({ id: shortenedLinksSchema.id });

      const newShortenedLinkId = newShortenedLink.id;

      return reply
        .header('location', `/shortened-links/${newShortenedLinkId}`)
        .status(201)
        .send({ id: newShortenedLinkId });
    },
  );
};

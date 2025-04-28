import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { checkDbConnection } from '@/app/functions/check-db-connection';
import { isRight, unwrapEither } from '@/shared/either';

export const healthCheckRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/',
    {
      schema: {
        summary: 'Health Check',
        response: {
          200: z
            .object({
              status: z.enum(['ok']),
              uptime: z.number(),
              timestamp: z.string().datetime(),
              database: z.object({
                status: z.enum(['ok']),
                responseTimeMs: z.number(),
              }),
            })
            .describe(
              'Successful health check response. The API and the database are operating normally.',
            ),
          500: z
            .object({
              status: z.enum(['error']),
              timestamp: z.string().datetime(),
              database: z.object({
                status: z.enum(['unreachable']),
                error: z.string(),
              }),
            })
            .describe(
              'Failed to perform health check. The database is unreachable or an unexpected error occurred.',
            ),
        },
      },
    },
    async (_, reply) => {
      const result = await checkDbConnection();

      if (isRight(result)) {
        const { responseTimeMs } = unwrapEither(result);

        return reply.status(200).send({
          status: 'ok',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          database: {
            status: 'ok',
            responseTimeMs,
          },
        });
      }

      const { error } = unwrapEither(result);

      return reply.status(500).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          status: 'unreachable',
          error,
        },
      });
    },
  );
};

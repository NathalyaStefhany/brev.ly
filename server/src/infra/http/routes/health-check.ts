import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { checkDbConnection } from '@/app/functions/check-db-connection';
import { isRight, unwrapEither } from '@/shared/either';

export const healthCheckRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/', async (_, reply) => {
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
  });
};

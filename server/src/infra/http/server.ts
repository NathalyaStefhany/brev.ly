import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import scalarUI from '@scalar/fastify-api-reference';
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env } from '@/env';
import { healthCheckRoute } from '@/infra/http/routes/health-check';
import { createShortenedLinkRoute } from '@/infra/http/routes/create-shortened-link';
import { deleteShortenedLinkRoute } from '@/infra/http/routes/delete-shortened-link';
import { getShortenedLinksRoute } from '@/infra/http/routes/get-shortened-links';
import { getOriginalLinkRoute } from '@/infra/http/routes/get-original-link';
import { updateAccessQuantityRoute } from '@/infra/http/routes/update-access-quantity';

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.validation });
  }

  console.log(error);

  return reply.status(500).send({ message: 'Internal server error' });
});

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly',
      description:
        'API for creating and managing shortened links. It allows you to shorten long URLs and retrieve information about the generated links.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

server.register(scalarUI, {
  routePrefix: '/docs',
  configuration: {
    layout: 'modern',
  },
});

server.register(healthCheckRoute);

server.register(createShortenedLinkRoute);
server.register(deleteShortenedLinkRoute);
server.register(getShortenedLinksRoute);
server.register(getOriginalLinkRoute);
server.register(updateAccessQuantityRoute);

if (process.env.NODE_ENV !== 'test') {
  server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
    console.log('HTTP server running!');
  });
}

export { server };

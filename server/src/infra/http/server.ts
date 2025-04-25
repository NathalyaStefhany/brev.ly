import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import { env } from '../../env';

const server = fastify();

server.register(fastifyCors, { origin: '*' });

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!');
});

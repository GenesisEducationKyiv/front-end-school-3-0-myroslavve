import { FastifyInstance } from 'fastify';

export default async function routes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      return reply.code(200).send({ status: 'ok' });
    }
  });
}
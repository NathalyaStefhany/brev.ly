import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { server } from '@/infra/http/server';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';

describe('Delete shortened link route tests', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 204 when delete a shortened link', async () => {
    const { shortenedLink } = await makeShortenedLink();

    const response = await server.inject({
      method: 'DELETE',
      url: `/shortened-links/${shortenedLink}`,
    });

    expect(response.statusCode).toBe(204);
  });

  it('should return 404 when trying to delete a shortened link that does not exist', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/shortened-links/1',
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(404);
    expect(jsonResponse.message).toBe('Shortened link does not exist');
  });
});

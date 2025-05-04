import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { server } from '@/infra/http/server';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';

describe('Update access quantity route tests', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 200 when get update access quantity', async () => {
    const { shortenedLink, originalLink } = await makeShortenedLink();

    const response = await server.inject({
      method: 'PATCH',
      url: `/shortened-links/${shortenedLink}/access`,
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(200);
    expect(jsonResponse.originalLink).toBe(originalLink);
    expect(jsonResponse.shortenedLink).toBe(shortenedLink);
    expect(jsonResponse.quantityAccesses).toBe(1);
  });

  it('should return 404 when trying to update access quantity of shortened link that does not exist', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/shortened-links/1/access',
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(404);
    expect(jsonResponse.message).toBe('Shortened link does not exist');
  });
});

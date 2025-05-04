import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { server } from '@/infra/http/server';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';

describe('Get original link route tests', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 200 with original link when get the original link', async () => {
    const { shortenedLink, originalLink } = await makeShortenedLink();

    const response = await server.inject({
      method: 'GET',
      url: `/shortened-links/${shortenedLink}/original-link`,
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(200);
    expect(jsonResponse.originalLink).toBe(originalLink);
  });

  it('should return 404 when trying to get the original link that does not exist', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/shortened-links/1/original-link',
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(404);
    expect(jsonResponse.message).toBe('Shortened link does not exist');
  });
});

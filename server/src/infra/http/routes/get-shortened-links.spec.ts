import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { server } from '@/infra/http/server';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';

describe('Get shortened links route tests', () => {
  beforeAll(async () => {
    await server.ready();

    await makeShortenedLink();
    await makeShortenedLink();
    await makeShortenedLink();
    await makeShortenedLink();
    await makeShortenedLink();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should get all shortened links', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/shortened-links',
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(200);
    expect(jsonResponse.total).toBeGreaterThan(5);
    expect(jsonResponse.data.length).toBeGreaterThanOrEqual(5);
    expect(jsonResponse.page).toBe(1);
    expect(jsonResponse.pageSize).toBe(20);

    expect(jsonResponse.data[0]).toHaveProperty('id');
    expect(jsonResponse.data[0]).toHaveProperty('originalLink');
    expect(jsonResponse.data[0]).toHaveProperty('shortenedLink');
    expect(jsonResponse.data[0]).toHaveProperty('quantityAccesses');
    expect(jsonResponse.data[0]).toHaveProperty('createdAt');

    for (let i = 0; i < jsonResponse.data.length - 1; i++) {
      expect(
        new Date(jsonResponse.data[i].createdAt) >=
          new Date(jsonResponse.data[i + 1].createdAt),
      ).toBeTruthy();
    }
  });

  it('should get all shortened links with pagination', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/shortened-links?page=2&pageSize=2',
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(200);
    expect(jsonResponse.total).toBeGreaterThan(5);
    expect(jsonResponse.data.length).toBe(2);
    expect(jsonResponse.page).toBe(2);
    expect(jsonResponse.pageSize).toBe(2);

    expect(
      new Date(jsonResponse.data[0].createdAt) >=
        new Date(jsonResponse.data[1].createdAt),
    ).toBeTruthy();
  });
});

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { server } from '@/infra/http/server';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

describe('Delete shortened link route', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 204 when delete a shortened link', async () => {
    const shortenedLink = randomUUID().replaceAll('-', '');

    await db
      .insert(schema.shortenedLinks)
      .values({ originalLink: 'https://test.com', shortenedLink })
      .returning();

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

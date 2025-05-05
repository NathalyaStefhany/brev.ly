import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { server } from '@/infra/http/server';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

describe('Create shortened link route tests', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should successfully create a shortened link and return the ID', async () => {
    const shortenedLink = randomUUID().replaceAll('-', '');

    const response = await server.inject({
      method: 'POST',
      url: '/shortened-links',
      body: {
        originalLink: 'www.test.com',
        shortenedLink,
      },
    });

    const id = response.json().id;

    expect(response.statusCode).toBe(201);
    expect(typeof id).toBe('string');
    expect(response.headers.location).toBe(`/shortened-links/${id}`);
  });

  it('should return 400 if the original link is invalid', async () => {
    const shortenedLink = randomUUID().replaceAll('-', '');

    const response = await server.inject({
      method: 'POST',
      url: '/shortened-links',
      body: {
        originalLink: 'test',
        shortenedLink,
      },
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(400);
    expect(jsonResponse).toHaveProperty('issues');
    expect(jsonResponse.issues[0].message).toBe('Invalid url');
  });

  it('should return 400 if the shortened link is invalid', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/shortened-links',
      body: {
        originalLink: 'www.test.com',
        shortenedLink: 'test/123',
      },
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(400);
    expect(jsonResponse).toHaveProperty('issues');
    expect(jsonResponse.issues[0].message).toBe(
      'The provided shortened link is invalid. It must be lowercase, and cannot contain spaces or special characters.',
    );
  });

  it('should return 400 if the shortened link already exists', async () => {
    const [{ shortenedLink }] = await db
      .select()
      .from(schema.shortenedLinks)
      .limit(1);

    const response = await server.inject({
      method: 'POST',
      url: '/shortened-links',
      payload: {
        originalLink: 'https://test.com',
        shortenedLink,
      },
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(400);
    expect(jsonResponse).toHaveProperty('message');
    expect(jsonResponse.message).toBe('Shortened link already exists');
  });
});

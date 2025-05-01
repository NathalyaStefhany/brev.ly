import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { server } from '@/infra/http/server';
import { db } from '@/infra/db';

describe('Health check route tests', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should successfully check the connection', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(200);
    expect(jsonResponse.status).toBe('ok');
    expect(jsonResponse).toHaveProperty('uptime');
    expect(jsonResponse).toHaveProperty('timestamp');
    expect(jsonResponse.database.status).toBe('ok');
    expect(jsonResponse.database).toHaveProperty('responseTimeMs');
  });

  it('should fail to check the connection', async () => {
    const originalExecute = db.execute;

    db.execute = vi.fn().mockRejectedValue(new Error('Connection failed'));

    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(500);
    expect(jsonResponse.status).toBe('error');
    expect(jsonResponse).toHaveProperty('timestamp');
    expect(jsonResponse.database.status).toBe('unreachable');
    expect(jsonResponse.database.error).toBe('Connection failed');

    db.execute = originalExecute;
  });
});

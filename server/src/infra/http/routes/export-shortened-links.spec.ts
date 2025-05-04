import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import * as upload from '@/infra/storage/upload-file-to-storage';
import { server } from '@/infra/http/server';

describe('Export shortened links route tests', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 200 with report URL', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => ({
        key: `${randomUUID()}.csv`,
        url: 'https://storage.com/file.csv',
      }));

    const response = await server.inject({
      method: 'GET',
      url: `/shortened-links/export`,
    });

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;

    await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'));
      });

      generatedCSVStream.on('error', (err) => {
        reject(err);
      });
    });

    const jsonResponse = response.json();

    expect(response.statusCode).toBe(200);
    expect(jsonResponse.reportUrl).toBe('https://storage.com/file.csv');
  });
});

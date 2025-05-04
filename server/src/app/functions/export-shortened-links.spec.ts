import { randomUUID } from 'node:crypto';
import * as upload from '@/infra/storage/upload-file-to-storage';
import { isRight, unwrapEither } from '@/shared/either';
import { describe, expect, it, vi } from 'vitest';
import { makeShortenedLink } from '@/tests/factories/make-shortened-link';
import { exportShortenedLinks } from '@/app/functions/export-shortened-links';

describe('Export shortened links tests', () => {
  it('should be able to export shortened links', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => ({
        key: `${randomUUID()}.csv`,
        url: 'https://storage.com/file.csv',
      }));

    await makeShortenedLink();
    await makeShortenedLink();
    await makeShortenedLink();

    const sut = await exportShortenedLinks();

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;

    const csvAsString = await new Promise<string>((resolve, reject) => {
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

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map((row) => row.split(','));

    expect(isRight(sut)).toBeTruthy();
    expect(unwrapEither(sut)).toEqual({
      reportUrl: 'https://storage.com/file.csv',
    });

    expect(csvAsArray[0]).toEqual([
      'ID',
      'Link Original',
      'Link Encurtado',
      'Quantidade de Acessos',
      'Criado em',
    ]);
  });
});

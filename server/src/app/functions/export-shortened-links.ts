import { stringify } from 'csv-stringify';
import { PassThrough, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { db, pg } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Either, makeRight } from '@/shared/either';
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';
import { desc } from 'drizzle-orm';

type ExportShortenedLinksOutput = {
  reportUrl: string;
};

export async function exportShortenedLinks(): Promise<
  Either<never, ExportShortenedLinksOutput>
> {
  const shortenedLinksSchema = schema.shortenedLinks;

  const { sql, params } = db
    .select({
      id: shortenedLinksSchema.id,
      originalLink: shortenedLinksSchema.originalLink,
      shortenedLink: shortenedLinksSchema.shortenedLink,
      quantityAccesses: shortenedLinksSchema.quantityAccesses,
      createdAt: shortenedLinksSchema.createdAt,
    })
    .from(shortenedLinksSchema)
    .orderBy(desc(shortenedLinksSchema.createdAt))
    .toSQL();

  const cursor = pg.unsafe(sql, params as string[]).cursor(50);

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_link', header: 'Link Original' },
      { key: 'shortened_link', header: 'Link Encurtado' },
      { key: 'quantity_accesses', header: 'Quantidade de Acessos' },
      { key: 'created_at', header: 'Criado em' },
    ],
  });

  const uploadToStorageStream = new PassThrough();

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], _, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }

        callback();
      },
    }),
    csv,
    uploadToStorageStream,
  );

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: 'links.csv',
    contentStream: uploadToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

  return makeRight({ reportUrl: url });
}

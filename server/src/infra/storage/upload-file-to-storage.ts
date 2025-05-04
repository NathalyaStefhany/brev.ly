import { Upload } from '@aws-sdk/lib-storage';
import { z } from 'zod';
import { Readable } from 'node:stream';
import { basename, extname } from 'node:path';
import { r2 } from '@/infra/storage/client';
import { env } from '@/env';
import { randomUUID } from 'node:crypto';

const uploadFileToStorageInput = z.object({
  folder: z.enum(['downloads']),
  fileName: z.string(),
  contentType: z.enum([
    'text/csv',
    'image/png',
    'image/jpeg',
    'application/pdf',
    'application/json',
    'text/html',
    'text/plain',
    'application/zip',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
  contentStream: z.instanceof(Readable),
});

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>;

type UploadFileToStorageOutput = {
  key: string;
  url: string;
};

export async function uploadFileToStorage(
  input: UploadFileToStorageInput,
): Promise<UploadFileToStorageOutput> {
  const { folder, fileName, contentType, contentStream } =
    uploadFileToStorageInput.parse(input);

  const fileExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName, fileExtension);

  const sanitizedFileName = fileNameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    '',
  );
  const sanitizedFileNameWithExtension =
    sanitizedFileName.concat(fileExtension);

  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`;

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  });

  await upload.done();

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
  };
}

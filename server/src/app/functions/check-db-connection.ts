import { sql } from 'drizzle-orm';
import { db } from '../../infra/db';
import { Either, makeLeft, makeRight } from '../../shared/either';

type ConnectionError = {
  error: string;
};

type SuccessfulConection = {
  responseTimeMs: number;
};

export async function checkDbConnection(): Promise<
  Either<ConnectionError, SuccessfulConection>
> {
  try {
    const startTime = Date.now();

    await db.execute(sql`SELECT NOW()`);

    return makeRight({ responseTimeMs: Date.now() - startTime });
  } catch (error) {
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return makeLeft({ error: errorMessage });
  }
}

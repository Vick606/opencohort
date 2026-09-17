import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

/**
 * Neon over HTTP. One connection object per process; Neon's HTTP driver does
 * not hold a socket open, so this is safe in serverless and in dev.
 *
 * This is the ONLY place a database client is constructed. Everything else
 * imports `db` from `@/db`. If the driver ever changes, this file changes and
 * nothing else does.
 *
 * The connection is created lazily on first use rather than at import time.
 * That matters: a top-level `throw` here would crash `next build` on any page
 * that transitively imports this module, even when nothing touches the
 * database. Missing config should fail the query, not the build.
 */
function createDb() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.',
    );
  }

  return drizzle(neon(url), { schema });
}

let cached: ReturnType<typeof createDb> | undefined;

export function getDb() {
  cached ??= createDb();
  return cached;
}

export type DB = ReturnType<typeof createDb>;

/**
 * Connection smoke test.
 *
 * Run with: npm run db:check
 *
 * This exists so that "does my Neon setup work?" is a one-command question
 * with a clear answer, instead of something you discover mid-migration. It
 * reports which env file the value came from and whether the query succeeds.
 *
 * Nothing here is required by the app. It is a developer tool.
 */
import { config } from 'dotenv';

config({ path: ['.env', '.env.local'], quiet: true });

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error('FAIL  DATABASE_URL is not set.');
    console.error('      Copy .env.example to .env.local and paste your Neon string in.');
    process.exit(1);
  }

  // Never print the whole string — it contains a password.
  const redacted = url.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
  console.log('URL   ' + redacted);

  if (!url.includes('-pooler')) {
    console.warn('WARN  No "-pooler" in the host. For Vercel use the POOLED string;');
    console.warn('      the direct host is fine for local development.');
  }

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(url);

    const rows = await sql`select version() as version, current_database() as db`;
    const row = rows[0] as { version: string; db: string } | undefined;

    if (!row) {
      console.error('FAIL  Query returned no rows.');
      process.exit(1);
    }

    console.log('DB    ' + row.db);
    console.log('PG    ' + String(row.version).split(',')[0]);
    console.log('PASS  Connection works.');
  } catch (error) {
    console.error('FAIL  Could not connect.');
    console.error('      ' + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();

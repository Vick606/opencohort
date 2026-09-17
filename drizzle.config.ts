import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

/**
 * Load environment files explicitly, in Next.js precedence order.
 *
 * Why not just `import 'dotenv/config'`: that reads `.env` ONLY and silently
 * ignores `.env.local`. Next.js itself loads `.env.local` automatically, so
 * without this the app would work while `drizzle-kit` failed with
 * "DATABASE_URL is not set" — with the value sitting right there on disk.
 *
 * Verified against dotenv 17.4.2: `.env.local` is NOT loaded by dotenv/config.
 *
 * `.env.local` is listed last so it wins — it is gitignored and holds the real
 * credentials, matching Next.js's own precedence.
 */
config({ path: ['.env', '.env.local'], quiet: true });

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    'DATABASE_URL is not set. Create .env.local (copy .env.example) and paste your Neon connection string into it.',
  );
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },

  // Without this, a column rename is generated as DROP + ADD and the data is
  // silently lost. See AGENTS.md rule 4. Never turn this off.
  strict: true,

  verbose: true,
});

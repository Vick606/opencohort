import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  // Without this, a column rename is generated as DROP + ADD and the data is
  // silently lost. See AGENTS.md rule 4. Never turn this off.
  strict: true,

  verbose: true,
});

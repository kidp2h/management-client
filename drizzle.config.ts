import { defineConfig } from 'drizzle-kit';

import { env } from './env.mjs';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/lib/supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});

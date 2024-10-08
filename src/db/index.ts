import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/../env.mjs';

import * as schema from './schema';

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing env var: DATABASE_URL');
}
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema, logger: true });

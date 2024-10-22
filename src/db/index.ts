import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/../env.mjs';

import * as schema from './schema';

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing env var: DATABASE_URL');
}
declare global {
  var client: ReturnType<typeof postgres> | null;
}

let client;
if (process.env.NODE_ENV === 'production') {
  client = postgres(connectionString, {
    max: 10,
  });
} else {
  if (!global.client) {
    global.client = postgres(connectionString, {
      max: 10,
    });
  }
  client = global.client;
}

export const db = drizzle(client, { schema, logger: true });
if (!db) throw new Error('Failed initialize db');
export type Response<T> = {
  data: T;
  error: string;
};

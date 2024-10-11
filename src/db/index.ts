import { exit } from 'node:process';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/../env.mjs';

import * as schema from './schema';

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing env var: DATABASE_URL');
}
let clientInstance: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

const getClient = () => {
  if (!clientInstance) {
    try {
      clientInstance = postgres(connectionString);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return clientInstance;
};

const getDb = () => {
  try {
    if (!dbInstance) {
      const client = getClient();
      if (client) dbInstance = drizzle(client, { schema, logger: true });
    }
    return dbInstance;
  } catch (error) {
    console.error(error);
    return dbInstance;
  }
};

export const client = getClient();
export const db = getDb() || exit(0);
if (!db) throw new Error('Failed initialize db');
export type Response<T> = {
  data: T;
  error: string;
};

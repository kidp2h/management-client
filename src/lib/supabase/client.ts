import { createBrowserClient } from '@supabase/ssr';

import { env } from '@/../env.mjs';

import type { Database } from './database.types';

export function createClient() {
  try {
    if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return createBrowserClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL!,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
    } else {
      throw new Error(
        'Missing env vars: NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL ',
      );
    }
  } catch {
    throw new Error('[CLIENT] Failed to create Supabase client');
  }
}

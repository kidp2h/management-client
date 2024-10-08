import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { env } from '@/../env.mjs';

import type { Database } from './database.types';

export function createClient() {
  const cookieStore = cookies();
  try {
    if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return createServerClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL!,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options),
                );
              } catch {
                throw new Error('[SERVER] Failed to set cookies');
              }
            },
          },
        },
      );
    } else {
      throw new Error(
        'Missing env vars: NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL',
      );
    }
  } catch {
    throw new Error('[SERVER] Failed to create Supabase client');
  }
}

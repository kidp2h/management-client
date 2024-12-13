'use server';
import { languages, records, recordsLanguages } from '@/db/schema';

import { db } from '@/db';
import { unstable_noStore as noStore } from 'next/cache';
import { eq, getTableColumns } from 'drizzle-orm';

export async function getRecordLanguagesById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsLanguages),
        language: {
          name: languages.name,
        },
        record: records,
      })
      .from(recordsLanguages)
      .leftJoin(languages, eq(recordsLanguages.language, languages.id))

      .leftJoin(records, eq(records.id, recordsLanguages.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}

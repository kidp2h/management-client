import 'server-only';

import { eq, getTableColumns } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { departments, duties, records, recordsDual } from '@/db/schema';

export async function getAllDuals() {
  try {
    const data = await db.select().from(recordsDual);
    return { data };
  } catch (error) {
    console.error('Error getting recordsDual:', error);
    return { data: null };
  }
}
export async function getRecordDualsById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsDual),
        record: records,
        department: {
          id: departments.id,
          name: departments.name,
        },
        duty: {
          id: duties.id,
          name: duties.name,
        },
      })
      .from(recordsDual)
      .leftJoin(departments, eq(recordsDual.department, departments.id))
      .leftJoin(duties, eq(recordsDual.duty, duties.id))
      .leftJoin(records, eq(records.id, recordsDual.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: 'Error getting record',
    };
  }
}

export async function getAllRecordDuals() {
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsDual),
        record: records,
        department: {
          id: departments.id,
          name: departments.name,
        },
        duty: {
          id: duties.id,
          name: duties.name,
        },
      })
      .from(recordsDual)
      .leftJoin(departments, eq(recordsDual.department, departments.id))
      .leftJoin(duties, eq(recordsDual.duty, duties.id))
      .leftJoin(records, eq(records.id, recordsDual.recordId));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: 'Error getting record',
    };
  }
}

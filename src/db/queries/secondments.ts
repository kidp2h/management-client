import 'server-only';

import { eq, getTableColumns } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { departments, duties, records, recordsSecondment } from '@/db/schema';

export async function getAllSecondments() {
  try {
    const data = await db.select().from(recordsSecondment);
    return { data };
  } catch (error) {
    console.error('Error getting recordsSecondment:', error);
    return { data: null };
  }
}

export async function getRecordSecondmentsById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsSecondment),
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
      .from(recordsSecondment)
      .leftJoin(departments, eq(recordsSecondment.department, departments.id))
      .leftJoin(duties, eq(recordsSecondment.duty, duties.id))
      .leftJoin(records, eq(records.id, recordsSecondment.recordId))
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

export async function getAllRecordSecondments() {
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsSecondment),
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
      .from(recordsSecondment)
      .leftJoin(departments, eq(recordsSecondment.department, departments.id))
      .leftJoin(duties, eq(recordsSecondment.duty, duties.id))
      .leftJoin(records, eq(records.id, recordsSecondment.recordId));

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

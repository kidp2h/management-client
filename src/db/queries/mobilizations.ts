import { db } from '@/db';
import { departments, records, recordsMobilization } from '@/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const getAllMobilizations = async () => {
  const d1: any = alias(departments, 'department');
  const d2: any = alias(departments, 'fromDepartment');
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsMobilization),
        id: recordsMobilization.id,
        record: records,
        department: d1,
        fromDepartment: d2,
      })
      .from(recordsMobilization)
      .leftJoin(d1, eq(recordsMobilization.department, d1.id))
      .leftJoin(d2, eq(recordsMobilization.fromDepartment, d2.id))
      .leftJoin(records, eq(recordsMobilization.recordId, records.id));
    return { data };
  } catch (error) {
    console.error('Error getting mobilizations:', error);
    return { data: null };
  }
};

import { db } from '@/db';
import { records, recordsApprove } from '@/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';

export async function getAllApproves() {
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsApprove),
        record: {
          code: records.code,
          fullName: records.fullName,
        },
      })
      .from(recordsApprove)
      .leftJoin(records, eq(recordsApprove.recordId, records.id));
    return { data };
  } catch (error) {
    console.error('Error getting approves:', error);
    return { data: null };
  }
}

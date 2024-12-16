import { db } from '@/db';
import { qualifications, records, recordsSend } from '@/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';

export const getAllSends = async () => {
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsSend),
        id: recordsSend.id,
        record: {
          id: records.id,
          code: records.code,
          fullName: records.fullName,
        },
        qualification: {
          id: qualifications.id,
          name: qualifications.name,
        },
      })
      .from(recordsSend)
      .leftJoin(
        qualifications,
        eq(recordsSend.qualification, qualifications.id),
      )
      .leftJoin(records, eq(recordsSend.recordId, records.id));
    return { data };
  } catch (error) {
    console.error('Error getting Sends:', error);
    return { data: null };
  }
};

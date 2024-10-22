import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  lte,
  or,
  type SQL,
} from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { records, type RecordsRemark, recordsRemark } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetRemarkRecordSchema } from '@/lib/zod/schemas/record-schema';
import type { DrizzleWhere } from '@/types';

export async function getRecordsRemark(input: Partial<GetRemarkRecordSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof RecordsRemark | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const createdAtFromDate = input.from ? new Date(input.from) : undefined;
    const createdAtToDate = input.to ? new Date(input.to) : undefined;
    const fromDate = input._from ? new Date(input._from) : undefined;
    const toDate = input._to ? new Date(input._to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.decisionNumber
        ? filterColumn({
            column: recordsRemark.decisionNumber,
            value: input.decisionNumber,
          })
        : undefined,

      !!input.decisionDate
        ? and(
            gte(
              recordsRemark.decisionDate,
              new Date(input.decisionDate.split(',')[0]),
            ),
            lte(
              recordsRemark.decisionDate,
              new Date(input.decisionDate.split(',')[1]),
            ),
          )
        : undefined,
      !!input.decisionDepartment
        ? filterColumn({
            column: recordsRemark.decisionDepartment,
            value: input.decisionDepartment,
          })
        : undefined,
      fromDate ? gte(recordsRemark.from, fromDate) : undefined,
      toDate ? lte(recordsRemark.to, toDate) : undefined,
      createdAtFromDate
        ? gte(recordsRemark.from, createdAtFromDate)
        : undefined,
      createdAtToDate ? lte(recordsRemark.to, createdAtToDate) : undefined,
    ];
    const where: DrizzleWhere<RecordsRemark> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select({
          ...getTableColumns(recordsRemark),
          record: records,
        })
        .from(recordsRemark)
        .leftJoin(records, eq(recordsRemark.recordId, records.id))
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in recordsRemark
            ? order === 'asc'
              ? asc(recordsRemark[column])
              : desc(recordsRemark[column])
            : desc(recordsRemark.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(recordsRemark)
        .where(where)
        .execute()
        .then(res => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / input.per_page!);
    return { data, pageCount };
  } catch (error) {
    console.error('Error getting records:', error);
    return { data: [], pageCount: 0 };
  }
}

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
import {
  departments,
  formDisciplines,
  records,
  type RecordsDiscipline,
  recordsDiscipline,
} from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetDisciplineRecordSchema } from '@/lib/zod/schemas/record-schema';
import type { DrizzleWhere } from '@/types';

export async function getRecordsDiscipline(
  input: Partial<GetDisciplineRecordSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof RecordsDiscipline | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const createdAtFromDate = input.from ? new Date(input.from) : undefined;
    const createdAtToDate = input.to ? new Date(input.to) : undefined;
    const fromDate = input._from ? new Date(input._from) : undefined;
    const toDate = input._to ? new Date(input._to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.decisionNumber
        ? filterColumn({
            column: recordsDiscipline.decisionNumber,
            value: input.decisionNumber,
          })
        : undefined,

      !!input.decisionDate
        ? and(
            gte(
              recordsDiscipline.decisionDate,
              new Date(input.decisionDate.split(',')[0]),
            ),
            lte(
              recordsDiscipline.decisionDate,
              new Date(input.decisionDate.split(',')[1]),
            ),
          )
        : undefined,
      !!input.decisionDepartment
        ? filterColumn({
            column: recordsDiscipline.decisionDepartment,
            value: input.decisionDepartment,
          })
        : undefined,
      fromDate ? gte(recordsDiscipline.from, fromDate) : undefined,
      toDate ? lte(recordsDiscipline.to, toDate) : undefined,
      createdAtFromDate
        ? gte(recordsDiscipline.from, createdAtFromDate)
        : undefined,
      createdAtToDate ? lte(recordsDiscipline.to, createdAtToDate) : undefined,
    ];
    const where: DrizzleWhere<RecordsDiscipline> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select({
          ...getTableColumns(recordsDiscipline),
          record: records,
          decisionDepartment: {
            id: departments.id,
            name: departments.name,
          },
        })
        .from(recordsDiscipline)
        .leftJoin(records, eq(recordsDiscipline.recordId, records.id))
        .leftJoin(
          departments,
          eq(recordsDiscipline.decisionDepartment, departments.id),
        )
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in recordsDiscipline
            ? order === 'asc'
              ? asc(recordsDiscipline[column])
              : desc(recordsDiscipline[column])
            : desc(recordsDiscipline.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(recordsDiscipline)
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

export async function getRecordDisciplinesById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsDiscipline),
        record: records,
        decisionDepartment: {
          id: departments.id,
          name: departments.name,
        },
        formDiscipline: {
          id: formDisciplines.id,
          name: formDisciplines.name,
        },
      })
      .from(recordsDiscipline)
      .leftJoin(
        departments,
        eq(recordsDiscipline.decisionDepartment, departments.id),
      )
      .leftJoin(
        formDisciplines,
        eq(recordsDiscipline.formDiscipline, formDisciplines.id),
      )
      .leftJoin(records, eq(records.id, recordsDiscipline.recordId))
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

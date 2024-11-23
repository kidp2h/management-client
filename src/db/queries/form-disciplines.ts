import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FormDisciplines } from '@/db/schema';
import { formDisciplines } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFormDisciplinesSchema } from '@/lib/zod/schemas/form-discipline-schema';
import type { DrizzleWhere } from '@/types';

export async function getFormDisciplines(
  input: Partial<GetFormDisciplinesSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FormDisciplines | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: formDisciplines.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: formDisciplines.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(formDisciplines.createdAt, fromDate) : undefined,
      toDate ? lte(formDisciplines.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FormDisciplines> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(formDisciplines)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in formDisciplines
            ? order === 'asc'
              ? asc(formDisciplines[column])
              : desc(formDisciplines[column])
            : desc(formDisciplines.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(formDisciplines)
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
    console.error('Error getting formDisciplines:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFormDisciplines() {
  try {
    const data = await db.select().from(formDisciplines);
    return { data };
  } catch (error) {
    console.error('Error getting formDisciplines:', error);
    return { data: null };
  }
}

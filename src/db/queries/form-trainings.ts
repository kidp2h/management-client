import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FormTrainings } from '@/db/schema';
import { formTrainings } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFormTrainingsSchema } from '@/lib/zod/schemas/form-training-schema';
import type { DrizzleWhere } from '@/types';

export async function getFormTrainings(input: Partial<GetFormTrainingsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FormTrainings | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: formTrainings.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: formTrainings.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(formTrainings.createdAt, fromDate) : undefined,
      toDate ? lte(formTrainings.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FormTrainings> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(formTrainings)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in formTrainings
            ? order === 'asc'
              ? asc(formTrainings[column])
              : desc(formTrainings[column])
            : desc(formTrainings.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(formTrainings)
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
    console.error('Error getting formTrainings:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFormTrainings() {
  try {
    const data = await db.select().from(formTrainings);
    return { data };
  } catch (error) {
    console.error('Error getting formTrainings:', error);
    return { data: null };
  }
}

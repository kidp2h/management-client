import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FormCommendations } from '@/db/schema';
import { formCommendations } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFormCommendationsSchema } from '@/lib/zod/schemas/form-commendation-schema';
import type { DrizzleWhere } from '@/types';

export async function getFormCommendations(
  input: Partial<GetFormCommendationsSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FormCommendations | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: formCommendations.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: formCommendations.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(formCommendations.createdAt, fromDate) : undefined,
      toDate ? lte(formCommendations.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FormCommendations> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(formCommendations)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in formCommendations
            ? order === 'asc'
              ? asc(formCommendations[column])
              : desc(formCommendations[column])
            : desc(formCommendations.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(formCommendations)
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
    console.error('Error getting formCommendations:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFormCommendations() {
  try {
    const data = await db.select().from(formCommendations);
    return { data };
  } catch (error) {
    console.error('Error getting formCommendations:', error);
    return { data: null };
  }
}

import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Salaries } from '@/db/schema';
import { salaries } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetSalariesSchema } from '@/lib/zod/schemas/salary-schema';
import type { DrizzleWhere } from '@/types';

export async function getSalaries(input: Partial<GetSalariesSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Salaries | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: salaries.code,
            value: input.code,
          })
        : undefined,
      !!input.type
        ? filterColumn({
            column: salaries.type,
            value: input.type,
            isSelectable: true,
          })
        : undefined,
      !!input.rank
        ? filterColumn({
            column: salaries.rank,
            value: input.rank,
            isSelectable: true,
          })
        : undefined,
      !!input.factor
        ? filterColumn({
            column: salaries.factor,
            value: input.factor,
          })
        : undefined,
      !!input.salary
        ? filterColumn({
            column: salaries.salary,
            value: input.salary,
          })
        : undefined,

      fromDate ? gte(salaries.createdAt, fromDate) : undefined,
      toDate ? lte(salaries.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Salaries> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(salaries)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in salaries
            ? order === 'asc'
              ? asc(salaries[column])
              : desc(salaries[column])
            : desc(salaries.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(salaries)
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
    console.error('Error getting salaries:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllSalaries() {
  try {
    const data = await db.select().from(salaries);
    return { data };
  } catch (error) {
    console.error('Error getting salaries:', error);
    return { data: null };
  }
}

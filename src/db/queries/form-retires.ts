import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FormRetires } from '@/db/schema';
import { formRetires } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFormRetiresSchema } from '@/lib/zod/schemas/form-retire-schema';
import type { DrizzleWhere } from '@/types';

export async function getFormRetires(input: Partial<GetFormRetiresSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FormRetires | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: formRetires.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: formRetires.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(formRetires.createdAt, fromDate) : undefined,
      toDate ? lte(formRetires.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FormRetires> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(formRetires)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in formRetires
            ? order === 'asc'
              ? asc(formRetires[column])
              : desc(formRetires[column])
            : desc(formRetires.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(formRetires)
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
    console.error('Error getting formRetires:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFormRetires() {
  try {
    const data = await db.select().from(formRetires);
    return { data };
  } catch (error) {
    console.error('Error getting formRetires:', error);
    return { data: null };
  }
}

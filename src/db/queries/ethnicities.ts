import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Ethnicities } from '@/db/schema';
import { ethnicities } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetEthnicitiesSchema } from '@/lib/zod/schemas/ethnicity-schema';
import type { DrizzleWhere } from '@/types';

export async function getEthnicities(input: Partial<GetEthnicitiesSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Ethnicities | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: ethnicities.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: ethnicities.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(ethnicities.createdAt, fromDate) : undefined,
      toDate ? lte(ethnicities.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Ethnicities> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(ethnicities)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in ethnicities
            ? order === 'asc'
              ? asc(ethnicities[column])
              : desc(ethnicities[column])
            : desc(ethnicities.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(ethnicities)
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
    console.error('Error getting ethnicities:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllEthnicities() {
  try {
    const data = await db.select().from(ethnicities);
    return { data };
  } catch (error) {
    console.error('Error getting ethnicities:', error);
    return { data: null };
  }
}

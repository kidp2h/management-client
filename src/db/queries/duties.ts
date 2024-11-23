import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Duties } from '@/db/schema';
import { duties } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetDutiesSchema } from '@/lib/zod/schemas/duty-schema';
import type { DrizzleWhere } from '@/types';

export async function getDuties(input: Partial<GetDutiesSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Duties | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: duties.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: duties.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(duties.createdAt, fromDate) : undefined,
      toDate ? lte(duties.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Duties> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(duties)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in duties
            ? order === 'asc'
              ? asc(duties[column])
              : desc(duties[column])
            : desc(duties.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(duties)
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
    console.error('Error getting duties:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllDuties() {
  try {
    const data = await db.select().from(duties);
    return { data };
  } catch (error) {
    console.error('Error getting duties:', error);
    return { data: null };
  }
}

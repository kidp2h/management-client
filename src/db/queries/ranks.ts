import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Ranks } from '@/db/schema';
import { ranks } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetRanksSchema } from '@/lib/zod/schemas/rank-schema';
import type { DrizzleWhere } from '@/types';

export async function getRanks(input: Partial<GetRanksSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Ranks | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: ranks.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: ranks.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(ranks.createdAt, fromDate) : undefined,
      toDate ? lte(ranks.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Ranks> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(ranks)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in ranks
            ? order === 'asc'
              ? asc(ranks[column])
              : desc(ranks[column])
            : desc(ranks.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(ranks)
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
    console.error('Error getting ranks:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllRanks() {
  try {
    const data = await db.select().from(ranks);
    return { data };
  } catch (error) {
    console.error('Error getting ranks:', error);
    return { data: null };
  }
}

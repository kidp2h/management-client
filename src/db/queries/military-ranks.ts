import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { MilitaryRanks } from '@/db/schema';
import { militaryRanks } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetMilitaryRanksSchema } from '@/lib/zod/schemas/military-rank-schema';
import type { DrizzleWhere } from '@/types';

export async function getMilitaryRanks(input: Partial<GetMilitaryRanksSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof MilitaryRanks | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: militaryRanks.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: militaryRanks.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(militaryRanks.createdAt, fromDate) : undefined,
      toDate ? lte(militaryRanks.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<MilitaryRanks> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(militaryRanks)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in militaryRanks
            ? order === 'asc'
              ? asc(militaryRanks[column])
              : desc(militaryRanks[column])
            : desc(militaryRanks.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(militaryRanks)
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
    console.error('Error getting militaryRanks:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllMilitaryRanks() {
  try {
    const data = await db.select().from(militaryRanks);
    return { data };
  } catch (error) {
    console.error('Error getting militaryRanks:', error);
    return { data: null };
  }
}

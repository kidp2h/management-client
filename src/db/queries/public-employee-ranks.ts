import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { PublicEmployeeRanks } from '@/db/schema';
import { publicEmployeeRanks } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetPublicEmployeeRanksSchema } from '@/lib/zod/schemas/public-employee-rank-schema';
import type { DrizzleWhere } from '@/types';

export async function getPublicEmployeeRanks(
  input: Partial<GetPublicEmployeeRanksSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof PublicEmployeeRanks | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: publicEmployeeRanks.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: publicEmployeeRanks.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(publicEmployeeRanks.createdAt, fromDate) : undefined,
      toDate ? lte(publicEmployeeRanks.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<PublicEmployeeRanks> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(publicEmployeeRanks)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in publicEmployeeRanks
            ? order === 'asc'
              ? asc(publicEmployeeRanks[column])
              : desc(publicEmployeeRanks[column])
            : desc(publicEmployeeRanks.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(publicEmployeeRanks)
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
    console.error('Error getting publicEmployeeRanks:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllPublicEmployeeRanks() {
  try {
    const data = await db.select().from(publicEmployeeRanks);
    return { data };
  } catch (error) {
    console.error('Error getting publicEmployeeRanks:', error);
    return { data: null };
  }
}

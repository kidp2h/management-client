import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Positions } from '@/db/schema';
import { positions } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetPositionsSchema } from '@/lib/zod/schemas/position-schema';
import type { DrizzleWhere } from '@/types';

export async function getPositions(input: Partial<GetPositionsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Positions | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: positions.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: positions.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(positions.createdAt, fromDate) : undefined,
      toDate ? lte(positions.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Positions> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(positions)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in positions
            ? order === 'asc'
              ? asc(positions[column])
              : desc(positions[column])
            : desc(positions.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(positions)
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
    console.error('Error getting positions:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllPositions() {
  try {
    const data = await db.select().from(positions);
    return { data };
  } catch (error) {
    console.error('Error getting positions:', error);
    return { data: null };
  }
}
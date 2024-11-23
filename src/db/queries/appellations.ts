import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Appellations } from '@/db/schema';
import { appellations } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetAppellationsSchema } from '@/lib/zod/schemas/appellation-schema';
import type { DrizzleWhere } from '@/types';

export async function getAppellations(input: Partial<GetAppellationsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Appellations | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: appellations.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: appellations.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(appellations.createdAt, fromDate) : undefined,
      toDate ? lte(appellations.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Appellations> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(appellations)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in appellations
            ? order === 'asc'
              ? asc(appellations[column])
              : desc(appellations[column])
            : desc(appellations.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(appellations)
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
    console.error('Error getting appellations:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllAppellations() {
  try {
    const data = await db.select().from(appellations);
    return { data };
  } catch (error) {
    console.error('Error getting appellations:', error);
    return { data: null };
  }
}

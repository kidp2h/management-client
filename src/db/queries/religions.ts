import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Religions } from '@/db/schema';
import { religions } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetReligionsSchema } from '@/lib/zod/schemas/religions-schema';
import type { DrizzleWhere } from '@/types';

export async function getReligions(input: Partial<GetReligionsSchema>) {
  noStore();

  try {
    console.log(input);
    const offset = (input.page! - 1) * input.per_page!;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Religions | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: religions.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: religions.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(religions.createdAt, fromDate) : undefined,
      toDate ? lte(religions.createdAt, toDate) : undefined,
    ];
    console.log(expressions);
    const where: DrizzleWhere<Religions> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(religions)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in religions
            ? order === 'asc'
              ? asc(religions[column])
              : desc(religions[column])
            : desc(religions.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(religions)
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
    console.error('Error getting religions:', error);
    return { data: [], pageCount: 0 };
  }
}

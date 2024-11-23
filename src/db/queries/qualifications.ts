import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Qualifications } from '@/db/schema';
import { qualifications } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetQualificationsSchema } from '@/lib/zod/schemas/qualification-schema';
import type { DrizzleWhere } from '@/types';

export async function getQualifications(
  input: Partial<GetQualificationsSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Qualifications | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: qualifications.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: qualifications.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(qualifications.createdAt, fromDate) : undefined,
      toDate ? lte(qualifications.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Qualifications> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(qualifications)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in qualifications
            ? order === 'asc'
              ? asc(qualifications[column])
              : desc(qualifications[column])
            : desc(qualifications.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(qualifications)
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
    console.error('Error getting qualifications:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllQualifications() {
  try {
    const data = await db.select().from(qualifications);
    return { data };
  } catch (error) {
    console.error('Error getting qualifications:', error);
    return { data: null };
  }
}

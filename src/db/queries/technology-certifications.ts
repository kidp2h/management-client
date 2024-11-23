import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { TechnologyCertifications } from '@/db/schema';
import { technologyCertifications } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetTechnologyCertificationsSchema } from '@/lib/zod/schemas/technology-certification-schema';
import type { DrizzleWhere } from '@/types';

export async function getTechnologyCertifications(
  input: Partial<GetTechnologyCertificationsSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [
      keyof TechnologyCertifications | undefined,
      'asc' | 'desc' | undefined,
    ];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: technologyCertifications.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: technologyCertifications.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(technologyCertifications.createdAt, fromDate) : undefined,
      toDate ? lte(technologyCertifications.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<TechnologyCertifications> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(technologyCertifications)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in technologyCertifications
            ? order === 'asc'
              ? asc(technologyCertifications[column])
              : desc(technologyCertifications[column])
            : desc(technologyCertifications.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(technologyCertifications)
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
    console.error('Error getting technologyCertifications:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllTechnologyCertifications() {
  try {
    const data = await db.select().from(technologyCertifications);
    return { data };
  } catch (error) {
    console.error('Error getting technologyCertifications:', error);
    return { data: null };
  }
}

import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { LanguageCertifications } from '@/db/schema';
import { languageCertifications } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetLanguageCertificationsSchema } from '@/lib/zod/schemas/language-certification-schema';
import type { DrizzleWhere } from '@/types';

export async function getLanguageCertifications(
  input: Partial<GetLanguageCertificationsSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [
      keyof LanguageCertifications | undefined,
      'asc' | 'desc' | undefined,
    ];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: languageCertifications.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: languageCertifications.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(languageCertifications.createdAt, fromDate) : undefined,
      toDate ? lte(languageCertifications.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<LanguageCertifications> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(languageCertifications)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in languageCertifications
            ? order === 'asc'
              ? asc(languageCertifications[column])
              : desc(languageCertifications[column])
            : desc(languageCertifications.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(languageCertifications)
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
    console.error('Error getting languageCertifications:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllLanguageCertifications() {
  try {
    const data = await db.select().from(languageCertifications);
    return { data };
  } catch (error) {
    console.error('Error getting languageCertifications:', error);
    return { data: null };
  }
}

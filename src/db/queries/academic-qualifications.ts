import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { AcademicQualifications } from '@/db/schema';
import { academicQualifications } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetAcademicQualificationsSchema } from '@/lib/zod/schemas/academic-qualification-schema';
import type { DrizzleWhere } from '@/types';

export async function getAcademicQualifications(
  input: Partial<GetAcademicQualificationsSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [
      keyof AcademicQualifications | undefined,
      'asc' | 'desc' | undefined,
    ];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: academicQualifications.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: academicQualifications.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(academicQualifications.createdAt, fromDate) : undefined,
      toDate ? lte(academicQualifications.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<AcademicQualifications> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(academicQualifications)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in academicQualifications
            ? order === 'asc'
              ? asc(academicQualifications[column])
              : desc(academicQualifications[column])
            : desc(academicQualifications.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(academicQualifications)
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
    console.error('Error getting academicQualifications:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllAcademicQualifications() {
  try {
    const data = await db.select().from(academicQualifications);
    return { data };
  } catch (error) {
    console.error('Error getting academicQualifications:', error);
    return { data: null };
  }
}

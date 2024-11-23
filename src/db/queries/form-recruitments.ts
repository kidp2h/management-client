import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FormRecruitments } from '@/db/schema';
import { formRecruitments } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFormRecruitmentsSchema } from '@/lib/zod/schemas/form-recruitment-schema';
import type { DrizzleWhere } from '@/types';

export async function getFormRecruitments(
  input: Partial<GetFormRecruitmentsSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FormRecruitments | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: formRecruitments.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: formRecruitments.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(formRecruitments.createdAt, fromDate) : undefined,
      toDate ? lte(formRecruitments.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FormRecruitments> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(formRecruitments)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in formRecruitments
            ? order === 'asc'
              ? asc(formRecruitments[column])
              : desc(formRecruitments[column])
            : desc(formRecruitments.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(formRecruitments)
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
    console.error('Error getting formRecruitments:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFormRecruitments() {
  try {
    const data = await db.select().from(formRecruitments);
    return { data };
  } catch (error) {
    console.error('Error getting formRecruitments:', error);
    return { data: null };
  }
}

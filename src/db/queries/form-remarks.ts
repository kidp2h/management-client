import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FormRemarks } from '@/db/schema';
import { formRemarks } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFormRemarksSchema } from '@/lib/zod/schemas/form-remark-schema';
import type { DrizzleWhere } from '@/types';

export async function getFormRemarks(input: Partial<GetFormRemarksSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FormRemarks | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: formRemarks.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: formRemarks.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(formRemarks.createdAt, fromDate) : undefined,
      toDate ? lte(formRemarks.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FormRemarks> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(formRemarks)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in formRemarks
            ? order === 'asc'
              ? asc(formRemarks[column])
              : desc(formRemarks[column])
            : desc(formRemarks.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(formRemarks)
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
    console.error('Error getting formRemarks:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFormRemarks() {
  try {
    const data = await db.select().from(formRemarks);
    return { data };
  } catch (error) {
    console.error('Error getting formRemarks:', error);
    return { data: null };
  }
}

import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FormSalary } from '@/db/schema';
import { formSalary } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFormSalarySchema } from '@/lib/zod/schemas/form-salary-schema';
import type { DrizzleWhere } from '@/types';

export async function getFormSalary(input: Partial<GetFormSalarySchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FormSalary | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: formSalary.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: formSalary.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(formSalary.createdAt, fromDate) : undefined,
      toDate ? lte(formSalary.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FormSalary> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(formSalary)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in formSalary
            ? order === 'asc'
              ? asc(formSalary[column])
              : desc(formSalary[column])
            : desc(formSalary.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(formSalary)
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
    console.error('Error getting formSalary:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFormSalary() {
  try {
    const data = await db.select().from(formSalary);
    return { data };
  } catch (error) {
    console.error('Error getting formSalary:', error);
    return { data: null };
  }
}

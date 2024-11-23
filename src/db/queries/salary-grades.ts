import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { SalaryGrades } from '@/db/schema';
import { salaryGrades } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetSalaryGradesSchema } from '@/lib/zod/schemas/salary-grade-schema';
import type { DrizzleWhere } from '@/types';

export async function getSalaryGrades(input: Partial<GetSalaryGradesSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof SalaryGrades | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: salaryGrades.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: salaryGrades.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(salaryGrades.createdAt, fromDate) : undefined,
      toDate ? lte(salaryGrades.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<SalaryGrades> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(salaryGrades)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in salaryGrades
            ? order === 'asc'
              ? asc(salaryGrades[column])
              : desc(salaryGrades[column])
            : desc(salaryGrades.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(salaryGrades)
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
    console.error('Error getting salaryGrades:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllSalaryGrades() {
  try {
    const data = await db.select().from(salaryGrades);
    return { data };
  } catch (error) {
    console.error('Error getting salaryGrades:', error);
    return { data: null };
  }
}

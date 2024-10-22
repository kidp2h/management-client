import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Departments } from '@/db/schema';
import { departments } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetDepartmentsSchema } from '@/lib/zod/schemas/department-schema';
import type { DrizzleWhere } from '@/types';

export async function getDepartments(input: Partial<GetDepartmentsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Departments | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: departments.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: departments.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(departments.createdAt, fromDate) : undefined,
      toDate ? lte(departments.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Departments> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(departments)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in departments
            ? order === 'asc'
              ? asc(departments[column])
              : desc(departments[column])
            : desc(departments.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(departments)
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
    console.error('Error getting departments:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllDepartments() {
  try {
    const data = await db.select().from(departments);
    return { data };
  } catch (error) {
    console.error('Error getting departments:', error);
    return { data: null };
  }
}

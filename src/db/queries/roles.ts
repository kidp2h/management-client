import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Roles } from '@/db/schema';
import { roles } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetRolesSchema } from '@/lib/zod/schemas/role-schema';
import type { DrizzleWhere } from '@/types';

export async function getRoles(input: Partial<GetRolesSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Roles | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: roles.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: roles.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(roles.createdAt, fromDate) : undefined,
      toDate ? lte(roles.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Roles> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(roles)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in roles
            ? order === 'asc'
              ? asc(roles[column])
              : desc(roles[column])
            : desc(roles.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(roles)
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
    console.error('Error getting roles:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllRoles() {
  try {
    const data = await db.select().from(roles);
    return { data };
  } catch (error) {
    console.error('Error getting roles:', error);
    return { data: null };
  }
}

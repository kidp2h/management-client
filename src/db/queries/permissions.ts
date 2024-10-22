import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Permissions } from '@/db/schema';
import { permissions } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetPermissionsSchema } from '@/lib/zod/schemas/permission-schema';
import type { DrizzleWhere } from '@/types';

export async function getPermissions(input: Partial<GetPermissionsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Permissions | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: permissions.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: permissions.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(permissions.createdAt, fromDate) : undefined,
      toDate ? lte(permissions.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Permissions> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(permissions)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in permissions
            ? order === 'asc'
              ? asc(permissions[column])
              : desc(permissions[column])
            : desc(permissions.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(permissions)
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
    console.error('Error getting permissions:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllPermissions() {
  try {
    const data = await db.select().from(permissions);
    return { data };
  } catch (error) {
    console.error('Error getting permissions:', error);
    return { data: null };
  }
}

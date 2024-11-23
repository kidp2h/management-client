import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { PolicyObjects } from '@/db/schema';
import { policyObjects } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetPolicyObjectsSchema } from '@/lib/zod/schemas/policy-object-schema';
import type { DrizzleWhere } from '@/types';

export async function getPolicyObjects(input: Partial<GetPolicyObjectsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof PolicyObjects | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: policyObjects.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: policyObjects.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(policyObjects.createdAt, fromDate) : undefined,
      toDate ? lte(policyObjects.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<PolicyObjects> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(policyObjects)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in policyObjects
            ? order === 'asc'
              ? asc(policyObjects[column])
              : desc(policyObjects[column])
            : desc(policyObjects.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(policyObjects)
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
    console.error('Error getting policyObjects:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllPolicyObjects() {
  try {
    const data = await db.select().from(policyObjects);
    return { data };
  } catch (error) {
    console.error('Error getting policyObjects:', error);
    return { data: null };
  }
}

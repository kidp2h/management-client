import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { TypeContracts } from '@/db/schema';
import { typeContracts } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetTypeContractsSchema } from '@/lib/zod/schemas/type-contract-schema';
import type { DrizzleWhere } from '@/types';

export async function getTypeContracts(input: Partial<GetTypeContractsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof TypeContracts | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: typeContracts.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: typeContracts.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(typeContracts.createdAt, fromDate) : undefined,
      toDate ? lte(typeContracts.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<TypeContracts> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(typeContracts)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in typeContracts
            ? order === 'asc'
              ? asc(typeContracts[column])
              : desc(typeContracts[column])
            : desc(typeContracts.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(typeContracts)
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
    console.error('Error getting typeContracts:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllTypeContracts() {
  try {
    const data = await db.select().from(typeContracts);
    return { data };
  } catch (error) {
    console.error('Error getting typeContracts:', error);
    return { data: null };
  }
}

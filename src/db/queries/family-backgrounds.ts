import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { FamilyBackgrounds } from '@/db/schema';
import { familyBackgrounds } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetFamilyBackgroundsSchema } from '@/lib/zod/schemas/family-background-schema';
import type { DrizzleWhere } from '@/types';

export async function getFamilyBackgrounds(
  input: Partial<GetFamilyBackgroundsSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof FamilyBackgrounds | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: familyBackgrounds.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: familyBackgrounds.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(familyBackgrounds.createdAt, fromDate) : undefined,
      toDate ? lte(familyBackgrounds.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<FamilyBackgrounds> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(familyBackgrounds)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in familyBackgrounds
            ? order === 'asc'
              ? asc(familyBackgrounds[column])
              : desc(familyBackgrounds[column])
            : desc(familyBackgrounds.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(familyBackgrounds)
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
    console.error('Error getting familyBackgrounds:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllFamilyBackgrounds() {
  try {
    const data = await db.select().from(familyBackgrounds);
    return { data };
  } catch (error) {
    console.error('Error getting familyBackgrounds:', error);
    return { data: null };
  }
}

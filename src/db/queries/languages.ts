import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Languages } from '@/db/schema';
import { languages } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetLanguagesSchema } from '@/lib/zod/schemas/language-schema';
import type { DrizzleWhere } from '@/types';

export async function getLanguages(input: Partial<GetLanguagesSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Languages | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: languages.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: languages.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(languages.createdAt, fromDate) : undefined,
      toDate ? lte(languages.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Languages> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(languages)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in languages
            ? order === 'asc'
              ? asc(languages[column])
              : desc(languages[column])
            : desc(languages.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(languages)
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
    console.error('Error getting languages:', error);
    return { data: [], pageCount: 0 };
  }
}

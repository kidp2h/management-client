import 'server-only';

import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  lte,
  or,
  type SQL,
} from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Records } from '@/db/schema';
import { ranks, records, religions } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetRecordsSchema } from '@/lib/zod/schemas/record-schema';
import type { DrizzleWhere } from '@/types';

export async function getRecords(input: Partial<GetRecordsSchema>) {
  noStore();
  console.log('input', input);
  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Records | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: records.code,
            value: input.code,
          })
        : undefined,
      !!input.fullName
        ? filterColumn({
            column: records.fullName,
            value: input.fullName,
          })
        : undefined,
      !!input.religion
        ? filterColumn({
            column: records.religionId,
            value: input.religion,
            isSelectable: true,
          })
        : undefined,
      !!input.rank
        ? filterColumn({
            column: records.rankId,
            value: input.rank,
            isSelectable: true,
          })
        : undefined,
      !!input.birthday
        ? and(
            gte(records.birthday, input.birthday),
            lte(records.birthday, input.birthday),
          )
        : undefined,
      !!input.religionId
        ? filterColumn({
            column: records.religionId,
            value: input.religionId,
          })
        : undefined,

      !!input.rankId
        ? filterColumn({
            column: records.rankId,
            value: input.rankId,
          })
        : undefined,

      !!input.isPartyMember
        ? filterColumn({
            column: records.isPartyMember,
            value: input.isPartyMember.toString(),
          })
        : undefined,
      !!input.degree
        ? filterColumn({
            column: records.degree,
            value: input.degree,
            isSelectable: true,
          })
        : undefined,
      !!input.bloodType
        ? filterColumn({
            column: records.bloodType,
            value: input.bloodType,
            isSelectable: true,
          })
        : undefined,
      !!input.englishCertification
        ? filterColumn({
            column: records.englishCertification,
            value: input.englishCertification,
            isSelectable: true,
          })
        : undefined,
      !!input.technologyCertification
        ? filterColumn({
            column: records.technologyCertification,
            value: input.technologyCertification,
            isSelectable: true,
          })
        : undefined,

      fromDate ? gte(records.createdAt, fromDate) : undefined,
      toDate ? lte(records.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Records> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select({
          ...getTableColumns(records),
          religion: religions.name,
          rank: ranks.name,
        })
        .from(records)
        .leftJoin(religions, eq(records.religionId, religions.id))
        .leftJoin(ranks, eq(records.rankId, ranks.id))
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in records
            ? order === 'asc'
              ? asc(records[column])
              : desc(records[column])
            : desc(records.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(records)
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
    console.error('Error getting records:', error);
    return { data: [], pageCount: 0 };
  }
}

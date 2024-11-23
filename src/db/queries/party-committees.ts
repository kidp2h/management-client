import 'server-only';

import { and, asc, count, desc, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { PartyCommittees } from '@/db/schema';
import { partyCommittees } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetPartyCommitteesSchema } from '@/lib/zod/schemas/party-committee-schema';
import type { DrizzleWhere } from '@/types';

export async function getPartyCommittees(
  input: Partial<GetPartyCommitteesSchema>,
) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof PartyCommittees | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: partyCommittees.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: partyCommittees.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(partyCommittees.createdAt, fromDate) : undefined,
      toDate ? lte(partyCommittees.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<PartyCommittees> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(partyCommittees)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in partyCommittees
            ? order === 'asc'
              ? asc(partyCommittees[column])
              : desc(partyCommittees[column])
            : desc(partyCommittees.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(partyCommittees)
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
    console.error('Error getting partyCommittees:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllPartyCommittees() {
  try {
    const data = await db.select().from(partyCommittees);
    return { data };
  } catch (error) {
    console.error('Error getting partyCommittees:', error);
    return { data: null };
  }
}

import 'server-only';

import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  lte,
  or,
  type SQL,
  sql,
} from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Records, RecordsRetirement } from '@/db/schema';
import {
  ranks,
  records,
  recordsAllowance,
  recordsContract,
  recordsDiscipline,
  recordsHouse,
  recordsLand,
  recordsProfession,
  recordsRelationship,
  recordsRetirement,
  recordsSalary,
  recordsTraining,
  recordsWorkExperience,
} from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { filterColumn } from '@/lib/filter-column';
import type {
  GetListRecordsRetireSchema,
  GetRecordsSchema,
} from '@/lib/zod/schemas/record-schema';
import type { DrizzleWhere } from '@/types';
import { subDays, subMonths } from 'date-fns';

export async function getRecords(input: Partial<GetRecordsSchema>) {
  noStore();
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
      input.fullName
        ? filterColumn({
            column: records.fullName,
            value: input.fullName,
          })
        : undefined,
      !!input.religion
        ? filterColumn({
            column: records.religion,
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
            gte(records.birthday, new Date(input.birthday.split(',')[0])),
            lte(records.birthday, new Date(input.birthday.split(',')[1])),
          )
        : undefined,
      input.religion
        ? filterColumn({
            column: records.religion,
            value: input.religion,
            isSelectable: true,
          })
        : undefined,

      input.rankId
        ? filterColumn({
            column: records.rankId,
            value: input.rankId,
          })
        : undefined,

      input.isPartyMember !== undefined
        ? filterColumn({
            column: records.isPartyMember,
            value: input.isPartyMember,
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
          rank: ranks.name,
        })
        .from(records)
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

export async function getRecordsRetired(input: GetListRecordsRetireSchema) {
  noStore();
  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof RecordsRetirement | undefined, 'asc' | 'desc' | undefined];
    const expressions: (SQL<unknown> | undefined)[] = [
      input.fullName
        ? filterColumn({
            column: records.fullName,
            value: input.fullName,
          })
        : undefined,
      !!input.retireDate
        ? and(
            gte(
              recordsRetirement.retireDate,
              new Date(input.retireDate.split(',')[0]),
            ),
            lte(
              recordsRetirement.retireDate,
              new Date(input.retireDate.split(',')[1]),
            ),
          )
        : undefined,
      !!input.retirementType
        ? filterColumn({
            column: recordsRetirement.retirementType,
            value: input.retirementType,
            isSelectable: true,
          })
        : undefined,
    ];
    const where: DrizzleWhere<Records> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select({
          ...getTableColumns(recordsRetirement),
          record: {
            fullName: records.fullName,
            code: records.code,
          },
        })
        .from(recordsRetirement)
        .leftJoin(records, eq(recordsRetirement.recordId, records.id))
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in recordsRetirement
            ? order === 'asc'
              ? asc(recordsRetirement[column])
              : desc(recordsRetirement[column])
            : desc(recordsRetirement.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(recordsRetirement)
        .leftJoin(records, eq(recordsRetirement.recordId, records.id))
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

export async function getRecordsRetirement() {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(records),
      })
      .from(records)
      .where(sql`id NOT IN (SELECT record_id FROM records_retirement)`);

    return {
      data,
    };
  } catch (error) {
    console.error('Error getting records:', error);
    return { data: [] };
  }
}

export async function _getRecords() {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(records),
      })
      .from(records);

    return {
      data,
    };
  } catch (error) {
    console.error('Error getting records:', error);
    return { data: [] };
  }
}

export async function getRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(records),
        rank: ranks,
      })
      .from(records)
      .leftJoin(ranks, eq(records.rankId, ranks.id))
      .where(eq(records.id, id))
      .then(takeFirstOrThrow);

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function getContractsRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsContract),
        record: records,
      })
      .from(recordsContract)
      .leftJoin(records, eq(records.id, recordsContract.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}

export async function getTrainingsRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsTraining),
        record: records,
      })
      .from(recordsTraining)
      .leftJoin(records, eq(records.id, recordsTraining.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}
export async function getWorkExperiencesRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsWorkExperience),
        record: records,
      })
      .from(recordsWorkExperience)
      .leftJoin(records, eq(records.id, recordsWorkExperience.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}
export async function getProfessionsRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsProfession),
        record: records,
      })
      .from(recordsProfession)
      .leftJoin(records, eq(records.id, recordsProfession.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}
export async function getRelationshipRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsRelationship),
        record: records,
      })
      .from(recordsRelationship)
      .leftJoin(records, eq(records.id, recordsRelationship.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}
export async function getSalariesRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsSalary),
        record: records,
      })
      .from(recordsSalary)
      .leftJoin(records, eq(records.id, recordsSalary.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}

export async function getAllowancesRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsAllowance),
        record: records,
      })
      .from(recordsAllowance)
      .leftJoin(records, eq(records.id, recordsAllowance.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}

export async function getHousesRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsHouse),
        record: records,
      })
      .from(recordsHouse)
      .leftJoin(records, eq(records.id, recordsHouse.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}
export async function getLandsRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsLand),
        record: records,
      })
      .from(recordsLand)
      .leftJoin(records, eq(records.id, recordsLand.recordId))
      .where(eq(records.id, id));

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting record:', err);
    return {
      data: [],
      error: err,
    };
  }
}

export async function getCountRecords() {
  noStore();
  try {
    const data = await db
      .select({
        count: count(),
      })
      .from(records)
      .execute()
      .then(res => res[0]?.count ?? 0);

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting count records:', err);
    return {
      data: 0,
      error: err,
    };
  }
}

export async function getCountRecordsDisciplined() {
  noStore();
  try {
    const data = await db
      .select({
        count: count(),
      })
      .from(recordsDiscipline)
      .execute()
      .then(res => res[0]?.count ?? 0);

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting count records:', err);
    return {
      data: 0,
      error: err,
    };
  }
}

export async function getCountRecordsRetired() {
  noStore();
  try {
    const data = await db
      .select({
        count: count(),
      })
      .from(recordsRetirement)
      .execute()
      .then(res => res[0]?.count ?? 0);

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error('Error getting count records:', err);
    return {
      data: 0,
      error: err,
    };
  }
}

export async function getRecordsDisciplinedRecent3Months() {
  try {
    const data = await db
      .select({
        date: sql<Date>`date_trunc('day', ${recordsDiscipline.createdAt})`,
        count: count(),
      })
      .from(recordsDiscipline)
      .groupBy(sql<Date>`date_trunc('day', ${recordsDiscipline.createdAt})`)
      .where(gt(recordsDiscipline.createdAt, subMonths(new Date(), 3)));

    return data;
  } catch (error) {
    console.error('Error getting records:', error);
    return [];
  }
}

export async function getRecordsRetiredRecent3Months() {
  try {
    const data = await db
      .select({
        date: sql<Date>`date_trunc('day', ${recordsRetirement.createdAt})`,
        count: count(),
      })
      .from(recordsRetirement)
      .groupBy(sql<Date>`date_trunc('day', ${recordsRetirement.createdAt})`)
      .where(gt(recordsRetirement.createdAt, subMonths(new Date(), 3)));

    return data;
  } catch (error) {
    console.error('Error getting records:', error);
    return [];
  }
}

export async function getRecordsRecent7Days() {
  try {
    const data = await db
      .select({
        fullName: records.fullName,
        gender: records.gender,
      })

      .from(records)
      .where(gt(records.createdAt, subDays(new Date(), 7)))
      .orderBy(desc(records.createdAt));

    return data;
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
}

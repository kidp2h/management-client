import { eq, getTableColumns } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { records, recordsParty } from '@/db/schema';
// import type { GetPartyRecordSchema } from '@/lib/zod/schemas/record-schema';

// export async function getRecordsParty(input: Partial<GetPartyRecordSchema>) {
//   noStore();

//   try {
//     const offset = (input.page! - 1) * input.per_page!;
//     const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
//       'createdAt',
//       'desc',
//     ]) as [keyof RecordsParty | undefined, 'asc' | 'desc' | undefined];

//     // Convert the date strings to date objects
//     const createdAtFromDate = input.from ? new Date(input.from) : undefined;
//     const createdAtToDate = input.to ? new Date(input.to) : undefined;
//     const fromDate = input._from ? new Date(input._from) : undefined;
//     const toDate = input._to ? new Date(input._to) : undefined;

//     const expressions: (SQL<unknown> | undefined)[] = [
//       input.decisionNumber
//         ? filterColumn({
//             column: recordsParty.,
//             value: input.decisionNumber,
//           })
//         : undefined,

//       !!input.decisionDate
//         ? and(
//             gte(
//               recordsParty.decisionDate,
//               new Date(input.decisionDate.split(',')[0]),
//             ),
//             lte(
//               recordsParty.decisionDate,
//               new Date(input.decisionDate.split(',')[1]),
//             ),
//           )
//         : undefined,
//       !!input.decisionDepartment
//         ? filterColumn({
//             column: recordsParty.decisionDepartment,
//             value: input.decisionDepartment,
//           })
//         : undefined,
//       fromDate ? gte(recordsParty.from, fromDate) : undefined,
//       toDate ? lte(recordsParty.to, toDate) : undefined,
//       createdAtFromDate ? gte(recordsParty.from, createdAtFromDate) : undefined,
//       createdAtToDate ? lte(recordsParty.to, createdAtToDate) : undefined,
//     ];
//     const where: DrizzleWhere<RecordsParty> =
//       !input.operator || input.operator === 'and'
//         ? and(...expressions)
//         : or(...expressions);
//     const { data, total } = await db.transaction(async tx => {
//       const data = await tx
//         .select({
//           ...getTableColumns(recordsParty),
//           record: records,
//           decisionDepartment: {
//             id: departments.id,
//             name: departments.name,
//           },
//         })
//         .from(recordsParty)
//         .leftJoin(records, eq(recordsParty.recordId, records.id))

//         .limit(input.per_page!)
//         .offset(offset)
//         .where(where)
//         .orderBy(
//           column && column in recordsParty
//             ? order === 'asc'
//               ? asc(recordsParty[column])
//               : desc(recordsParty[column])
//             : desc(recordsParty.id),
//         );
//       const total = await tx
//         .select({
//           count: count(),
//         })
//         .from(recordsParty)
//         .where(where)
//         .execute()
//         .then(res => res[0]?.count ?? 0);

//       return {
//         data,
//         total,
//       };
//     });

//     const pageCount = Math.ceil(total / input.per_page!);
//     return { data, pageCount };
//   } catch (error) {
//     console.error('Error getting records:', error);
//     return { data: [], pageCount: 0 };
//   }
// }

export async function getRecordPartiesById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsParty),
        record: records,
      })
      .from(recordsParty)

      .leftJoin(records, eq(records.id, recordsParty.recordId))

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

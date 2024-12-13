import { eq, getTableColumns } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { appellations, records, recordsCommendation } from '@/db/schema';

// export async function getRecordsCommendation(
//   input: Partial<GetCommendationRecordSchema>,
// ) {
//   noStore();

//   try {
//     const offset = (input.page! - 1) * input.per_page!;
//     const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
//       'createdAt',
//       'desc',
//     ]) as [keyof RecordsCommendation | undefined, 'asc' | 'desc' | undefined];

//     // Convert the date strings to date objects
//     const createdAtFromDate = input.from ? new Date(input.from) : undefined;
//     const createdAtToDate = input.to ? new Date(input.to) : undefined;
//     const fromDate = input._from ? new Date(input._from) : undefined;
//     const toDate = input._to ? new Date(input._to) : undefined;

//     const expressions: (SQL<unknown> | undefined)[] = [
//       input.decisionNumber
//         ? filterColumn({
//             column: recordsCommendation.decisionNumber,
//             value: input.decisionNumber,
//           })
//         : undefined,

//       !!input.decisionDate
//         ? and(
//             gte(
//               recordsCommendation.decisionDate,
//               new Date(input.decisionDate.split(',')[0]),
//             ),
//             lte(
//               recordsCommendation.decisionDate,
//               new Date(input.decisionDate.split(',')[1]),
//             ),
//           )
//         : undefined,
//       !!input.decisionDepartment
//         ? filterColumn({
//             column: recordsCommendation.decisionDepartment,
//             value: input.decisionDepartment,
//           })
//         : undefined,
//       fromDate ? gte(recordsCommendation.from, fromDate) : undefined,
//       toDate ? lte(recordsCommendation.to, toDate) : undefined,
//       createdAtFromDate
//         ? gte(recordsCommendation.from, createdAtFromDate)
//         : undefined,
//       createdAtToDate
//         ? lte(recordsCommendation.to, createdAtToDate)
//         : undefined,
//     ];
//     const where: DrizzleWhere<RecordsCommendation> =
//       !input.operator || input.operator === 'and'
//         ? and(...expressions)
//         : or(...expressions);
//     const { data, total } = await db.transaction(async tx => {
//       const data = await tx
//         .select({
//           ...getTableColumns(recordsCommendation),
//           record: records,
//         })
//         .from(recordsCommendation)
//         .leftJoin(records, eq(recordsCommendation.recordId, records.id))
//         .limit(input.per_page!)
//         .offset(offset)
//         .where(where)
//         .orderBy(
//           column && column in recordsCommendation
//             ? order === 'asc'
//               ? asc(recordsCommendation[column])
//               : desc(recordsCommendation[column])
//             : desc(recordsCommendation.id),
//         );
//       const total = await tx
//         .select({
//           count: count(),
//         })
//         .from(recordsCommendation)
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

export async function getRecordCommendationsById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsCommendation),
        record: records,
        award: {
          id: appellations.id,
          name: appellations.name,
        },
      })
      .from(recordsCommendation)
      .leftJoin(appellations, eq(recordsCommendation.award, appellations.id))
      .leftJoin(records, eq(records.id, recordsCommendation.recordId))
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

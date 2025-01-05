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
import type { Records } from '@/db/schema';
import {
  civilServantRanks,
  departments,
  duties,
  ethnicities,
  formRecruitments,
  formTrainings,
  languages,
  publicEmployeeRanks,
  qualifications,
  records,
  recordsAllowance,
  recordsContract,
  recordsDepartments,
  recordsDiscipline,
  recordsHouse,
  recordsImprisioned,
  recordsIncreaseSalaryEarly,
  recordsIncreaseSalaryRegular,
  recordsLand,
  recordsLanguages,
  recordsOldRegime,
  recordsOrganization,
  recordsProfession,
  recordsRelationship,
  recordsRelative,
  recordsRetirement,
  recordsSalary,
  recordsTraining,
  recordsWorkExperience,
  religions,
  salaryGrades,
  typeContracts,
} from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { filterColumn } from '@/lib/filter-column';
import type {
  GetListRecordsRetireSchema,
  GetRecordsSchema,
} from '@/lib/zod/schemas/record-schema';
import type { DrizzleWhere } from '@/types';
import { subDays, subMonths } from 'date-fns';
import { alias } from 'drizzle-orm/pg-core';

export async function getRecords(
  input: Partial<GetRecordsSchema>,
  department?: boolean,
) {
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
      !!input.ethnicity
        ? filterColumn({
            column: records.ethnicity,
            value: input.ethnicity,
            isSelectable: true,
          })
        : undefined,

      !!input.gender
        ? filterColumn({
            column: records.gender,
            value: input.gender,
            isSelectable: true,
          })
        : undefined,
      !!input.birthPlace
        ? filterColumn({
            column: records.birthPlace,
            value: input.birthPlace,
            isSelectable: true,
          })
        : undefined,

      !!input.birthday
        ? and(
            gte(records.birthday, new Date(input.birthday.split(',')[0])),
            lte(records.birthday, new Date(input.birthday.split(',')[1])),
          )
        : undefined,

      input.isPartyMember !== undefined
        ? filterColumn({
            column: records.isPartyMember,
            value: input.isPartyMember,
          })
        : undefined,
      !!input.qualification
        ? filterColumn({
            column: records.qualification,
            value: input.qualification,
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
      department
        ? !!input.departments
          ? eq(recordsDepartments.departmentId, input.departments)
          : undefined
        : undefined,
      // !!input.englishCertification
      //   ? filterColumn({
      //       column: records.englishCertification,
      //       value: input.englishCertification,
      //       isSelectable: true,
      //     })
      //   : undefined,
      // !!input.technologyCertification
      //   ? filterColumn({
      //       column: records.technologyCertification,
      //       value: input.technologyCertification,
      //       isSelectable: true,
      //     })
      //   : undefined,

      fromDate ? gte(records.createdAt, fromDate) : undefined,
      toDate ? lte(records.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Records> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const departmentIds = await tx
        .select({ id: departments.id })
        .from(departments)
        .execute()
        .then(res => res?.map(department => department.id));
      // console.log(departmentIds);
      const data = await tx
        .select({
          ...getTableColumns(records),
          id: recordsDepartments.id,
          // record: records,
          department: departments,
          record: {
            id: records.id,
            fullName: records.fullName,
            code: records.code,
          },
          religion: {
            name: religions.name,
            id: religions.id,
          },
          ethnicity: {
            name: ethnicities.name,
            id: ethnicities.id,
          },
          civilServantRank: {
            code: civilServantRanks.code,
            name: civilServantRanks.name,
            id: civilServantRanks.id,
          },
          salaryGrade: {
            name: salaryGrades.name,
            id: salaryGrades.id,
          },
          salaryFactor: records.salaryFactor,
        })
        .from(recordsDepartments)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .leftJoin(records, eq(recordsDepartments.recordId, records.id))
        .leftJoin(
          departments,
          eq(recordsDepartments.departmentId, departments.id),
        )

        .leftJoin(ethnicities, eq(records.ethnicity, ethnicities.id))
        .leftJoin(religions, eq(records.religion, religions.id))
        .leftJoin(
          civilServantRanks,
          eq(records.civilServantRankId, civilServantRanks.id),
        )
        .leftJoin(salaryGrades, eq(records.salaryGradeId, salaryGrades.id))

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
        .from(recordsDepartments)
        .leftJoin(records, eq(recordsDepartments.recordId, records.id))
        .leftJoin(
          departments,
          eq(recordsDepartments.departmentId, departments.id),
        )

        .leftJoin(ethnicities, eq(records.ethnicity, ethnicities.id))
        .leftJoin(religions, eq(records.religion, religions.id))
        .leftJoin(
          civilServantRanks,
          eq(records.civilServantRankId, civilServantRanks.id),
        )
        .leftJoin(salaryGrades, eq(records.salaryGradeId, salaryGrades.id))
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
export async function getAllRecordsRetired() {
  noStore();
  try {
    const data = await db.select().from(recordsRetirement);
    return { data };
  } catch (error) {
    console.error('Error getting records:', error);
    return { data: [], pageCount: 0 };
  }
}
export async function getRecordsRetired(input?: GetListRecordsRetireSchema) {
  noStore();
  try {
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select({
          ...getTableColumns(recordsRetirement),
          record: {
            fullName: records.fullName,
            code: records.code,
          },
          department: {
            name: departments.name,
            id: departments.id,
          },
        })
        .from(recordsRetirement)

        .leftJoin(records, eq(recordsRetirement.recordId, records.id))
        .leftJoin(
          recordsDepartments,
          eq(recordsDepartments.recordId, records.id),
        )
        .leftJoin(
          departments,
          eq(recordsDepartments.departmentId, departments.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(recordsRetirement)
        .leftJoin(records, eq(recordsRetirement.recordId, records.id))
        .execute()
        .then(res => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = 1;
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
        department: {
          name: departments.name,
          id: departments.id,
        },
      })
      .from(recordsDepartments)
      .leftJoin(
        departments,
        eq(recordsDepartments.departmentId, departments.id),
      )
      .leftJoin(records, eq(recordsDepartments.recordId, records.id))
      .where(
        sql`records.id NOT IN (SELECT record_id  FROM records_retirement)`,
      );

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

export async function getAllIncreasedSalaryRegular() {
  noStore();
  try {
    const g1 = alias(salaryGrades, 'g1');
    const g2 = alias(salaryGrades, 'g2');
    const data = await db
      .select({
        ...getTableColumns(recordsIncreaseSalaryRegular),
        salaryGrade: {
          name: g1.name,
          id: g1.id,
        },
        previousSalaryGrade: {
          name: g2.name,
          id: g2.id,
        },
        record: {
          id: records.id,
          fullName: records.fullName,
          code: records.code,
        },
        department: {
          id: departments.id,
          name: departments.name,
        },
      })

      .from(recordsIncreaseSalaryRegular)
      .leftJoin(
        departments,
        eq(recordsIncreaseSalaryRegular.department, departments.id),
      )
      .leftJoin(g1, eq(recordsIncreaseSalaryRegular.salaryGrade, g1.id))
      .leftJoin(g2, eq(recordsIncreaseSalaryRegular.previousSalaryGrade, g2.id))
      .leftJoin(records, eq(recordsIncreaseSalaryRegular.recordId, records.id));

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
export async function getAllIncreasedSalaryEarly() {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsIncreaseSalaryEarly),
        record: {
          id: records.id,
          fullName: records.fullName,
          code: records.code,
        },
        department: {
          id: departments.id,
          name: departments.name,
        },
      })

      .from(recordsIncreaseSalaryEarly)
      .leftJoin(
        departments,
        eq(recordsIncreaseSalaryEarly.department, departments.id),
      )

      .leftJoin(records, eq(recordsIncreaseSalaryEarly.recordId, records.id));

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
export async function getRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(records),
      })
      .from(records)
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
        formRecruitment: {
          name: formRecruitments.name,
          id: formRecruitments.id,
        },
        typeContract: typeContracts.name,
      })
      .from(recordsContract)
      .leftJoin(records, eq(records.id, recordsContract.recordId))
      .leftJoin(
        typeContracts,
        eq(recordsContract.typeContract, typeContracts.id),
      )
      .leftJoin(
        formRecruitments,
        eq(recordsContract.recruimentType, formRecruitments.id),
      )
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
        qualification: {
          name: qualifications.name,
          id: qualifications.id,
        },
        formTraining: {
          name: formTrainings.name,
          id: formTrainings.id,
        },
      })
      .from(recordsTraining)
      .leftJoin(
        qualifications,
        eq(recordsTraining.qualification, qualifications.id),
      )
      .leftJoin(
        formTrainings,
        eq(recordsTraining.formTraining, formTrainings.id),
      )
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
        department: {
          name: departments.name,
          id: departments.id,
        },
        duty: {
          name: duties.name,
          id: duties.id,
        },
      })
      .from(recordsWorkExperience)
      .leftJoin(
        departments,
        eq(recordsWorkExperience.department, departments.id),
      )
      .leftJoin(duties, eq(recordsWorkExperience.duty, duties.id))
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
        salaryGrade: {
          name: salaryGrades.name,
          id: salaryGrades.id,
        },
        classification: {
          name: civilServantRanks.name,
          id: civilServantRanks.id,
        },
        namePublicRank: publicEmployeeRanks.name,
        record: records,
      })
      .from(recordsSalary)
      .leftJoin(
        civilServantRanks,
        eq(recordsSalary.classification, civilServantRanks.id),
      )
      .leftJoin(
        publicEmployeeRanks,
        eq(recordsSalary.classification, publicEmployeeRanks.id),
      )
      .leftJoin(salaryGrades, eq(recordsSalary.salaryGrade, salaryGrades.id))
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
export async function getImprisionedsRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsImprisioned),
        record: records,
      })
      .from(recordsImprisioned)
      .leftJoin(records, eq(records.id, recordsImprisioned.recordId))
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
export async function getOldRegimesRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsOldRegime),
        record: records,
      })
      .from(recordsOldRegime)
      .leftJoin(records, eq(records.id, recordsOldRegime.recordId))
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
export async function getOrganizationsRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsOrganization),
        record: records,
      })
      .from(recordsOrganization)
      .leftJoin(records, eq(records.id, recordsOrganization.recordId))
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

export async function getRelativesRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsRelative),
        record: records,
      })
      .from(recordsRelative)
      .leftJoin(records, eq(records.id, recordsRelative.recordId))
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
export async function getLanguagesRecordById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        ...getTableColumns(recordsLanguages),
      })
      .from(recordsLanguages)
      .leftJoin(languages, eq(recordsLanguages.language, languages.id))
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

// export async function getRecordsCanIncreaseSalary() {
//   noStore();
//   try {
//     // date
//     const now = new Date();
//     const data = await db
//       .select({
//         ...getTableColumns(records),
//       })
//       .from(records)
//       .where(eq(records.dateOfAppointment));

//     return {
//       data,
//       error: null,
//     };
//   } catch (err) {
//     console.error('Error getting records:', err);
//     return {
//       data: [],
//       error: err,
//     };
//   }
// }

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

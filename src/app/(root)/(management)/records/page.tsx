'use memo';
import React from 'react';

import { RecordsManagementSection } from '@/components/features/records';
import {
  _getRecords,
  getAllIncreasedSalaryEarly,
  getAllIncreasedSalaryRegular,
  getRecords,
  getRecordsRetired,
  getRecordsRetirement,
} from '@/db/queries/records';
import { getRecordsSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';
import { getAllReligions } from '@/db/queries/religions';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllMobilizations } from '@/db/queries/mobilizations';
import { getAllFormSalary } from '@/db/queries/form-salary';
import { getAllDuties } from '@/db/queries/duties';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllSends } from '@/db/queries/sends';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllAppellations } from '@/db/queries/appellations';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';
import { getAllRecordDuals } from '@/db/queries/duals';
import { getAllRecordSecondments } from '@/db/queries/secondments';

type RecordsManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsManagementPage({
  searchParams,
}: RecordsManagementPageProps) {
  const search = getRecordsSchema.parse(searchParams);
  const religions = getAllReligions();
  const ethnicities = getAllEthnicities();
  const allRecords = _getRecords();
  const allDepartments = getAllDepartments();
  const mobilizations = getAllMobilizations();
  const formSalary = getAllFormSalary();
  const duties = getAllDuties();
  const civilServantRanks = getAllCivilServantRanks();
  const salaryGrades = getAllSalaryGrades();
  const listIncreasedSalaryRegular = getAllIncreasedSalaryRegular();
  const listIncreasedSalaryEarly = getAllIncreasedSalaryEarly();
  const sends = getAllSends();
  const qualifcations = getAllQualifications();
  const appellations = getAllAppellations();
  const formDisciplines = getAllFormDisciplines();
  const recordDuals = getAllRecordDuals();
  const recordSecondments = getAllRecordSecondments();
  return (
    <RecordsManagementSection
      recordsExceptDepartment={getRecords(search, false)}
      listIncreasedSalaryRegular={listIncreasedSalaryRegular}
      formSalary={formSalary}
      duties={duties}
      civilServantRanks={civilServantRanks}
      salaryGrades={salaryGrades}
      allDepartments={allDepartments}
      records={getRecords(search, true)}
      religions={religions}
      ethnicities={ethnicities}
      mobilizations={mobilizations}
      allRecords={allRecords}
      sends={sends}
      qualifications={qualifcations}
      listIncreasedSalaryEarly={listIncreasedSalaryEarly}
      recordsRetirement={getRecordsRetirement()}
      recordsRetired={getRecordsRetired()}
      appellations={appellations}
      formDisciplines={formDisciplines}
      recordDuals={recordDuals}
      recordSecondments={recordSecondments}
    />
  );
}

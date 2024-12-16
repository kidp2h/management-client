import React from 'react';

import DepartmentsManagementSection from '@/components/features/departments/departments-management-section';
import {
  getAllDepartments,
  getAllRecordsDepartments,
  getDepartments,
} from '@/db/queries/departments';
import { getDepartmentsSchema } from '@/lib/zod/schemas/department-schema';
import type { SearchParams } from '@/types';
import { _getRecords } from '@/db/queries/records';

export interface DepartmentsManagementPageProps {
  searchParams: SearchParams;
}
export default async function DepartmentsManagementPage({
  searchParams,
}: DepartmentsManagementPageProps) {
  const search = getDepartmentsSchema.parse(searchParams);

  const allDepartments = getAllDepartments();
  const departments = getDepartments(search);
  const allRecordsDepartments = getAllRecordsDepartments();
  const records = _getRecords();
  console.log(await allRecordsDepartments);
  return (
    <DepartmentsManagementSection
      allRecordsDepartments={allRecordsDepartments}
      records={records}
      allDepartments={allDepartments}
      departments={departments}
    />
  );
}

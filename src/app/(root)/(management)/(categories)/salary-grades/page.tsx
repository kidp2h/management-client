import React from 'react';

import SalaryGradesManagementSection from '@/components/features/salary-grades/salary-grades-management-section';
import { getSalaryGrades } from '@/db/queries/salary-grades';
import { getSalaryGradesSchema } from '@/lib/zod/schemas/salary-grade-schema';
import type { SearchParams } from '@/types';

export interface SalaryGradesManagementPageProps {
  searchParams: SearchParams;
}
export default async function SalaryGradesManagementPage({
  searchParams,
}: SalaryGradesManagementPageProps) {
  const search = getSalaryGradesSchema.parse(searchParams);

  const salaryGrades = getSalaryGrades(search);

  return <SalaryGradesManagementSection salaryGrades={salaryGrades} />;
}

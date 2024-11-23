import React from 'react';

import SalariesManagementSection from '@/components/features/salaries/salaries-management-section';
import { getSalaries } from '@/db/queries/salaries';
import { getSalariesSchema } from '@/lib/zod/schemas/salary-schema';
import type { SearchParams } from '@/types';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';

export interface SalariesManagementPageProps {
  searchParams: SearchParams;
}
export default async function SalariesManagementPage({
  searchParams,
}: SalariesManagementPageProps) {
  const search = getSalariesSchema.parse(searchParams);

  const salaries = getSalaries(search);
  const grades = getAllSalaryGrades();

  return <SalariesManagementSection salaries={salaries} grades={grades} />;
}

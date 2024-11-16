'use memo';
import React from 'react';

import { RecordsRegularSalaryManagementSection } from '@/components/features/records/regular-salaries/records-regular-salary-management-section';
import { getRecords } from '@/db/queries/records';
import { getRecordsSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';

type RecordsRegularSalaryManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsRemarkManagementPage({
  searchParams,
}: RecordsRegularSalaryManagementPageProps) {
  const search = getRecordsSchema.parse(searchParams);
  return <RecordsRegularSalaryManagementSection records={getRecords(search)} />;
}

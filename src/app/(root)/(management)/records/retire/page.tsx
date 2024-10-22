'use memo';
import React from 'react';

import { RecordsRetireManagementSection } from '@/components/features/records/retirements/records-retirement-management-section';
import { getRecords } from '@/db/queries/records';
import { getRecordsSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';

type RecordsRetireManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsRetireManagementPage({
  searchParams,
}: RecordsRetireManagementPageProps) {
  const search = getRecordsSchema.parse(searchParams);
  return <RecordsRetireManagementSection records={getRecords(search)} />;
}

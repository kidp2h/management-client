'use memo';
import React from 'react';

import { RecordsRetireManagementSection } from '@/components/features/records/retirements/records-retirement-management-section';
import { getRecordsRetired, getRecordsRetirement } from '@/db/queries/records';
import { getListRecordsRetireSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';

type RecordsRetireManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsRetireManagementPage({
  searchParams,
}: RecordsRetireManagementPageProps) {
  const search = getListRecordsRetireSchema.parse(searchParams);
  return (
    <RecordsRetireManagementSection
      records={getRecordsRetirement()}
      recordsRetired={getRecordsRetired(search)}
    />
  );
}

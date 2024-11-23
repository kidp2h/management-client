'use memo';
import React from 'react';

import { RecordsManagementSection } from '@/components/features/records';
import { getRecords } from '@/db/queries/records';
import { getRecordsSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';
import { getAllReligions } from '@/db/queries/religions';

type RecordsManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsManagementPage({
  searchParams,
}: RecordsManagementPageProps) {
  const search = getRecordsSchema.parse(searchParams);
  const religions = getAllReligions();

  return (
    <RecordsManagementSection
      records={getRecords(search)}
      religions={religions}
    />
  );
}

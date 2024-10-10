'use memo';
import React from 'react';

import { RecordsManagementSection } from '@/components/features/records';
import { getAllRanks } from '@/db/queries/ranks';
import { getRecords } from '@/db/queries/records';
import { getAllReligions } from '@/db/queries/religions';
import { getRecordsSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';

type RecordsManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsManagementPage({
  searchParams,
}: RecordsManagementPageProps) {
  const search = getRecordsSchema.parse(searchParams);

  const [religions, ranks] = await Promise.all([
    getAllReligions(),
    getAllRanks(),
  ]);
  return (
    <RecordsManagementSection
      records={getRecords(search)}
      religions={religions.data || []}
      ranks={ranks.data || []}
    />
  );
}

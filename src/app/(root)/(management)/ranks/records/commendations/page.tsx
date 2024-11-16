'use memo';
import React from 'react';

import { RecordsCommendationManagementSection } from '@/components/features/records/commendations/records-commendation-management-section';
import { getRecordsCommendation } from '@/db/queries/commendation';
import { _getRecords } from '@/db/queries/records';
import { getCommendationRecordSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';

type RecordsCommendationManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsCommendationManagementPage({
  searchParams,
}: RecordsCommendationManagementPageProps) {
  const search = getCommendationRecordSchema.partial().parse(searchParams);
  return (
    <RecordsCommendationManagementSection
      records={_getRecords()}
      recordsCommendation={getRecordsCommendation(search)}
    />
  );
}

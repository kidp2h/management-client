'use memo';
import React from 'react';

import { RecordsRemarkManagementSection } from '@/components/features/records/remarks/records-remark-management-section';
import { _getRecords } from '@/db/queries/records';
import { getRecordsRemark } from '@/db/queries/remarks';
import { getRemarkRecordSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';

type RecordsRemarkManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsRemarkManagementPage({
  searchParams,
}: RecordsRemarkManagementPageProps) {
  const search = getRemarkRecordSchema.partial().parse(searchParams);
  return (
    <RecordsRemarkManagementSection
      records={_getRecords()}
      recordsRemark={getRecordsRemark(search)}
    />
  );
}

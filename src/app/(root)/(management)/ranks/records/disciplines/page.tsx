'use memo';
import React from 'react';

import { RecordsDisciplineManagementSection } from '@/components/features/records/disciplines/records-discipline-management-section';
import { getRecordsDiscipline } from '@/db/queries/disciplines';
import { _getRecords } from '@/db/queries/records';
import { getDisciplineRecordSchema } from '@/lib/zod/schemas/record-schema';
import type { SearchParams } from '@/types';

type RecordsDisciplineManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsDisciplineManagementPage({
  searchParams,
}: RecordsDisciplineManagementPageProps) {
  const search = getDisciplineRecordSchema.partial().parse(searchParams);

  return (
    <RecordsDisciplineManagementSection
      records={_getRecords()}
      recordsDiscipline={getRecordsDiscipline(search)}
    />
  );
}

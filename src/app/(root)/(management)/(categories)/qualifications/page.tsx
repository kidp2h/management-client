import React from 'react';

import QualificationsManagementSection from '@/components/features/qualifications/qualifications-management-section';
import { getQualifications } from '@/db/queries/qualifications';
import { getQualificationsSchema } from '@/lib/zod/schemas/qualification-schema';
import type { SearchParams } from '@/types';

export interface QualificationsManagementPageProps {
  searchParams: SearchParams;
}
export default async function QualificationsManagementPage({
  searchParams,
}: QualificationsManagementPageProps) {
  const search = getQualificationsSchema.parse(searchParams);

  const qualifications = getQualifications(search);

  return <QualificationsManagementSection qualifications={qualifications} />;
}
